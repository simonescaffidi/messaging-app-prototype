// Test del Double Ratchet (E2E v3) con due client simulati e un server finto.
// Carica public/crypto.js cosi' com'e' (lo stesso file della webapp e dell'app nativa).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const src = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "crypto.js"), "utf8");
const mkStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), key: (i) => [...m.keys()][i] ?? null, get length() { return m.size; }, _m: m }; };

let msgSeq = 0;
async function client(id, serverPre) {
  const ls = mkStorage();
  const E = new Function("localStorage", src + "\nreturn E2E;")(ls);
  const r = await E.unlock("pid-" + id, "pw-" + id);
  const pre = serverPre[id] = serverPre[id] || [];
  const api = async (url, o) => {
    if (url === "/api/prekeys/count") return { count: pre.length };
    if (url === "/api/prekeys") { pre.push(...JSON.parse(o.body).keys); return { count: pre.length }; }
  };
  await E.ensurePrekeys(api);
  return { id, E, ls, ident: r.publicJwk, pre, reopen: async () => { E.lock(); await E.unlock("pid-" + id, "pw-" + id); } };
}
const claimFrom = (peer) => async () => peer.pre.shift() || null;
async function send(from, to, text, opts = {}) {
  const e = await from.E.encryptMessage({ peerIdentity: to.ident, myId: from.id, peerId: to.id, plaintext: text, claim: opts.noClaim ? async () => null : claimFrom(to), peerProto: opts.proto ?? 3 });
  const m = { id: "m" + ++msgSeq, iv: e.iv, ciphertext: e.ciphertext, hdr: e.hdr };
  await from.E.rememberSent(m.id, text, 0);
  return { m, e };
}
const recv = (to, from, m) => to.E.decryptMessage({ m, mine: false, peerIdentity: from.ident, myId: to.id, peerId: from.id, exp: 0 });

test("conversazione avanti e indietro: ogni messaggio ha chiave diversa e si legge in chiaro", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const seen = new Set();
  for (let round = 0; round < 6; round++) {
    for (const [x, y] of [[a, b], [b, a], [a, b]]) {
      const t = `r${round} ${x.id}->${y.id}`;
      const { m, e } = await send(x, y, t);
      assert.equal(JSON.parse(m.hdr).v, 3);
      assert.ok(!seen.has(m.ciphertext)); seen.add(m.ciphertext);
      const out = await recv(y, x, m);
      assert.deepEqual([out.state, out.text], ["ok", t]);
    }
  }
});

test("la prekey si consuma solo all'avvio della sessione", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const before = b.pre.length;
  for (let i = 0; i < 10; i++) { const { m } = await send(a, b, "x" + i); assert.equal((await recv(b, a, m)).text, "x" + i); }
  assert.equal(before - b.pre.length, 1);
});

test("messaggi fuori ordine e persi (anche con cambio di catena)", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const a1 = await send(a, b, "a1"), a2 = await send(a, b, "a2"), a3 = await send(a, b, "a3");
  assert.equal((await recv(b, a, a3.m)).text, "a3"); // il 3 arriva per primo
  assert.equal((await recv(b, a, a1.m)).text, "a1");
  // a2 resta in giro; B risponde, A risponde ancora (nuovo ratchet DH)
  const b1 = await send(b, a, "b1"), b2 = await send(b, a, "b2");
  assert.equal((await recv(a, b, b2.m)).text, "b2");
  assert.equal((await recv(a, b, b1.m)).text, "b1");
  const a4 = await send(a, b, "a4");
  assert.equal((await recv(b, a, a4.m)).text, "a4");
  assert.equal((await recv(b, a, a2.m)).text, "a2"); // arriva tardi, dopo il cambio di catena
  // lo stesso messaggio non si decifra due volte dalla catena (la cache locale lo serve)
  const again = await recv(b, a, a2.m); assert.equal(again.text, "a2");
});

test("avvio simultaneo: entrambi scrivono per primi", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const x1 = await send(a, b, "da A 1"), y1 = await send(b, a, "da B 1");
  const x2 = await send(a, b, "da A 2"), y2 = await send(b, a, "da B 2");
  for (const [to, from, mm, t] of [[b, a, x1.m, "da A 1"], [a, b, y1.m, "da B 1"], [b, a, x2.m, "da A 2"], [a, b, y2.m, "da B 2"]]) {
    assert.deepEqual([(await recv(to, from, mm)).state, (await recv(to, from, mm)).text], ["ok", t]);
  }
  const z = await send(a, b, "dopo"); assert.equal((await recv(b, a, z.m)).text, "dopo");
  const w = await send(b, a, "e ancora"); assert.equal((await recv(a, b, w.m)).text, "e ancora");
});

test("senza prekey disponibile: parte comunque, forwardSecret=false solo al primo messaggio", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  b.pre.length = 0;
  const first = await send(a, b, "primo", { noClaim: true });
  assert.equal(first.e.forwardSecret, false);
  assert.equal((await recv(b, a, first.m)).text, "primo");
  const r = await send(b, a, "risposta"); assert.equal(r.e.forwardSecret, true);
  assert.equal((await recv(a, b, r.m)).text, "risposta");
  const second = await send(a, b, "secondo", { noClaim: true });
  assert.equal(second.e.forwardSecret, true);
  assert.equal((await recv(b, a, second.m)).text, "secondo");
});

test("riavvio dell'app (blocco/sblocco cassaforte) a meta' conversazione", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const m1 = await send(a, b, "uno"); assert.equal((await recv(b, a, m1.m)).text, "uno");
  await a.reopen(); await b.reopen();
  const m2 = await send(b, a, "due"); assert.equal((await recv(a, b, m2.m)).text, "due");
  await a.reopen();
  const m3 = await send(a, b, "tre"); assert.equal((await recv(b, a, m3.m)).text, "tre");
});

test("manomissione: intestazione o testo alterati non si decifrano e non rovinano lo stato", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const first = await send(a, b, "ok1"); assert.equal((await recv(b, a, first.m)).text, "ok1");
  const x = await send(a, b, "segreto");
  const h = JSON.parse(x.m.hdr); h.n += 1;
  const bad1 = { ...x.m, id: "bad1", hdr: JSON.stringify(h) };
  assert.equal((await recv(b, a, bad1)).state, "gone");
  const bad2 = { ...x.m, id: "bad2", ciphertext: x.m.ciphertext.slice(0, -4) + "AAAA" };
  assert.equal((await recv(b, a, bad2)).state, "gone");
  assert.equal((await recv(b, a, x.m)).text, "segreto"); // quello vero funziona ancora
  const y = await send(a, b, "dopo"); assert.equal((await recv(b, a, y.m)).text, "dopo");
});

test("post-compromise: chi copia lo stato non legge i messaggi dopo un nuovo giro di ratchet", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const m1 = await send(a, b, "1"); await recv(b, a, m1.m);
  const m2 = await send(b, a, "2"); await recv(a, b, m2.m);
  // l'attaccante copia la cassaforte di B (stato + chiavi) in questo momento
  const stolen = mkStorage(); for (const [k, v] of b.ls._m) stolen.setItem(k, v);
  const Eatk = new Function("localStorage", src + "\nreturn E2E;")(stolen);
  await Eatk.unlock("pid-B", "pw-B");
  // la conversazione prosegue: A scrive, B risponde, A scrive (due cambi di direzione)
  const m3 = await send(a, b, "3"); await recv(b, a, m3.m);
  const m4 = await send(b, a, "4"); await recv(a, b, m4.m);
  const m5 = await send(a, b, "5"); assert.equal((await recv(b, a, m5.m)).text, "5");
  // con lo stato rubato si poteva leggere il 3 (stessa catena ancora nota), ma non il 5
  const atk3 = await Eatk.decryptMessage({ m: { ...m3.m, id: "atk3" }, mine: false, peerIdentity: a.ident, myId: "B", peerId: "A", exp: 0 });
  assert.equal(atk3.text, "3");
  const atk5 = await Eatk.decryptMessage({ m: { ...m5.m, id: "atk5" }, mine: false, peerIdentity: a.ident, myId: "B", peerId: "A", exp: 0 });
  assert.notEqual(atk5.text, "5");
  assert.equal(atk5.state, "gone");
});

test("compatibilita': un contatto senza v3 riceve v2; i messaggi v2 restano leggibili; si puo' passare a v3", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const old = await send(a, b, "vecchio", { proto: 2 });
  assert.equal(JSON.parse(old.m.hdr).v, 2);
  assert.equal((await recv(b, a, old.m)).text, "vecchio");
  const nuovo = await send(a, b, "nuovo", { proto: 3 });
  assert.equal(JSON.parse(nuovo.m.hdr).v, 3);
  assert.equal((await recv(b, a, nuovo.m)).text, "nuovo");
  const r = await send(b, a, "ciao", { proto: 3 }); assert.equal((await recv(a, b, r.m)).text, "ciao");
});

test("cambio identita' del contatto: si apre una sessione nuova", async () => {
  const srv = {}; const a = await client("A", srv); let b = await client("B", srv);
  const m1 = await send(a, b, "prima"); assert.equal((await recv(b, a, m1.m)).text, "prima");
  srv.B = []; // il server azzera le prekey quando cambia l'identita' (vedi /api/me/publickey)
  const b2 = await client("B", srv); // B si reinstalla: nuova identita', stesso id
  const m2 = await send(a, b2, "dopo reinstallazione");
  assert.equal((await recv(b2, a, m2.m)).text, "dopo reinstallazione");
});

test("due schede sullo stesso profilo non si sovrascrivono (stato condiviso nello storage)", async () => {
  const srv = {}; const a = await client("A", srv), b = await client("B", srv);
  const E2 = new Function("localStorage", src + "\nreturn E2E;")(b.ls); // seconda scheda di B, stesso storage
  await E2.unlock("pid-B", "pw-B");
  const m1 = await send(a, b, "alla scheda 1"); assert.equal((await recv(b, a, m1.m)).text, "alla scheda 1");
  const m2 = await send(a, b, "alla scheda 2");
  const o = await E2.decryptMessage({ m: m2.m, mine: false, peerIdentity: a.ident, myId: "B", peerId: "A", exp: 0 });
  assert.equal(o.text, "alla scheda 2"); // la scheda 2 vede il ratchet aggiornato dalla scheda 1
  const m3 = await send(a, b, "ancora scheda 1"); assert.equal((await recv(b, a, m3.m)).text, "ancora scheda 1");
});
