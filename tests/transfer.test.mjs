// Test: backup completo (identita' + cronologia) e trasferimento live a un nuovo dispositivo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const src = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "crypto.js"), "utf8");
const mkStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), key: (i) => [...m.keys()][i] ?? null, get length() { return m.size; }, _m: m }; };
let seq = 0;
async function device(id, srv) { // un dispositivo (storage proprio) per l'account `id`
  const ls = mkStorage();
  const E = new Function("localStorage", src + "\nreturn E2E;")(ls);
  const r = await E.unlock("pid-" + id, "pw-" + id);
  const pre = srv[id] = srv[id] || [];
  const api = async (url, o) => { if (url === "/api/prekeys/count") return { count: pre.length }; if (url === "/api/prekeys") { pre.push(...JSON.parse(o.body).keys); return {}; } };
  await E.ensurePrekeys(api);
  const d = { id, E, ls, pre, api, get ident() { return E.myPublicJwk(); } };
  return d;
}
const claimFrom = (peer) => async () => peer.pre.shift() || null;
async function send(from, to, text) {
  const e = await from.E.encryptMessage({ peerIdentity: to.ident, peerProto: 3, myId: from.id, peerId: to.id, plaintext: text, claim: claimFrom(to) });
  const m = { id: "m" + ++seq, iv: e.iv, ciphertext: e.ciphertext, hdr: e.hdr };
  await from.E.rememberSent(m.id, text, 0);
  return m;
}
const recv = (to, from, m) => to.E.decryptMessage({ m, mine: false, peerIdentity: from.ident, myId: to.id, peerId: from.id, exp: 0 });
const textOf = async (to, from, m) => (await recv(to, from, m)).text;

test("backup completo: nuovo telefono, stessa identita', cronologia leggibile, sessioni rifatte", async () => {
  const srv = {}; const a = await device("A", srv), b = await device("B", srv);
  const m1 = await send(b, a, "ciao dal passato"); assert.equal(await textOf(a, b, m1), "ciao dal passato");
  const m2 = await send(a, b, "risposta di A"); assert.equal(await textOf(b, a, m2), "risposta di A");
  const identBefore = a.ident;
  const file = await a.E.exportFullBackup("passphrase-molto-lunga");
  const raw = JSON.stringify(file);
  assert.ok(!raw.includes("ciao dal passato") && !raw.includes("risposta di A"), "il file non contiene testo in chiaro");

  // nuovo telefono: stesso account, cassaforte nuova (identita' provvisoria diversa)
  const a2 = await device("A", srv);
  assert.notEqual(a2.ident.x, identBefore.x);
  await assert.rejects(() => a2.E.importFullBackup("passphrase-sbagliata!!", file), /bad-password/);
  const other = await device("B", srv);
  const fileB = await other.E.exportFullBackup("passphrase-molto-lunga");
  await assert.rejects(() => a2.E.importFullBackup("passphrase-molto-lunga", fileB), /wrong-account/);
  await assert.rejects(() => a2.E.importFullBackup("passphrase-molto-lunga", { app: "x" }), /bad-file/);
  const r = await a2.E.importFullBackup("passphrase-molto-lunga", file);
  assert.equal(r.publicJwk.x, identBefore.x, "stessa identita'");
  assert.equal(a2.E.needsRekey(), true);
  // la cronologia gia' letta si legge anche sul nuovo telefono (dalla cache ripristinata)
  assert.equal(await textOf(a2, b, m1), "ciao dal passato");
  // il server vede la chiave tornata quella vera: B ha la stessa identita' di A; si riparte con sessioni nuove
  const m3 = await send(a2, b, "sono sul nuovo telefono");
  assert.equal(await textOf(b, a2, m3), "sono sul nuovo telefono");
  const m4 = await send(b, a2, "benvenuto"); assert.equal(await textOf(a2, b, m4), "benvenuto");
  await a2.E.clearRekey(); assert.equal(a2.E.needsRekey(), false);
});

test("backup: passphrase corta rifiutata", async () => {
  const srv = {}; const a = await device("A", srv);
  await assert.rejects(() => a.E.exportFullBackup("corta"), /short-passphrase/);
});

test("trasferimento live: le conversazioni proseguono senza interruzioni, il vecchio dispositivo si blocca e si cancella", async () => {
  const srv = {}; const a = await device("A", srv), b = await device("B", srv);
  const m1 = await send(a, b, "uno"); assert.equal(await textOf(b, a, m1), "uno");
  const m2 = await send(b, a, "due"); assert.equal(await textOf(a, b, m2), "due");
  const { key, blob } = await a.E.transferExport();
  assert.equal(a.E.isFrozen(), true);
  await assert.rejects(() => send(a, b, "non deve partire"), /frozen/);
  // B scrive mentre il trasferimento e' in corso: il vecchio dispositivo non puo' consumare la chiave
  const m3 = await send(b, a, "tre, durante il trasferimento");
  assert.equal((await recv(a, b, m3)).state, "locked");
  const a2 = await device("A", srv);
  await assert.rejects(() => a2.E.transferImport("AAAA" + key.slice(4), blob), /bad-code/);
  await assert.rejects(() => a2.E.transferImport(key, new Uint8Array(blob).slice(0, 40)), /bad-code/);
  const r = await a2.E.transferImport(key, blob);
  assert.equal(r.publicJwk.x, a.ident.x);
  assert.equal(a2.E.needsRekey(), false);
  a.E.transferFinish();
  assert.equal([...a.ls._m.keys()].filter((k) => k.includes("pid-A")).length, 0, "il vecchio dispositivo non conserva nulla");
  // il messaggio arrivato durante il trasferimento si legge sul nuovo, e la conversazione prosegue (stesso ratchet)
  assert.equal(await textOf(a2, b, m3), "tre, durante il trasferimento");
  const m4 = await send(a2, b, "quattro dal nuovo"); assert.equal(await textOf(b, a2, m4), "quattro dal nuovo");
  assert.equal(JSON.parse(m4.hdr).sid, JSON.parse(m1.hdr).sid, "nessuna sessione nuova: stesso ratchet");
  assert.equal(JSON.parse(m4.hdr).init, undefined);
  const m5 = await send(b, a2, "cinque"); assert.equal(await textOf(a2, b, m5), "cinque");
  // la cronologia c'e' gia'
  assert.equal(await textOf(a2, b, m2), "due");
});

test("trasferimento annullato: il vecchio dispositivo riprende a funzionare, anche dopo un riavvio", async () => {
  const srv = {}; const a = await device("A", srv), b = await device("B", srv);
  const m1 = await send(a, b, "uno"); await textOf(b, a, m1);
  await a.E.transferExport();
  a.E.lock(); await a.E.unlock("pid-A", "pw-A"); // riavvio: il blocco resta
  assert.equal(a.E.isFrozen(), true);
  await a.E.transferAbort();
  assert.equal(a.E.isFrozen(), false);
  const m2 = await send(a, b, "due"); assert.equal(await textOf(b, a, m2), "due");
});
