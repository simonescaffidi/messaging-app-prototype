// Test di integrazione: tetto di prelievi prekey per coppia + evento WS "prekeys-low".
// Avvia il server in locale (senza DATABASE_URL: usa un data.json temporaneo) e lo interroga via HTTP/WS.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import WebSocket from "ws";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 3900 + Math.floor(Math.random() * 90);
const base = `http://127.0.0.1:${PORT}`;
let proc;

const post = async (url, body, token) => {
  const r = await fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) }, body: JSON.stringify(body || {}) });
  return { status: r.status, json: await r.json().catch(() => ({})) };
};
const jwk = (i) => ({ id: "k" + i, pub: { kty: "EC", crv: "P-256", x: "x" + i, y: "y" + i } });

async function user(name) {
  const reg = await post("/api/register", { email: name + "@example.com", username: name, password: "password-" + name + "-12345", acceptTerms: true });
  assert.equal(reg.status, 200, JSON.stringify(reg.json));
  const login = await post("/api/login", { username: name, password: "password-" + name + "-12345" });
  assert.equal(login.status, 200, JSON.stringify(login.json));
  return { token: login.json.token, publicId: reg.json.publicId, profileId: reg.json.profileId };
}

before(async () => {
  if (existsSync(path.join(root, "data.json"))) rmSync(path.join(root, "data.json"));
  proc = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: String(PORT), DATABASE_URL: "", DATA_KEY: "a".repeat(64), CODE_PEPPER: "test" }, stdio: "ignore" });
  for (let i = 0; i < 50; i++) { try { if ((await fetch(base + "/health")).ok) return; } catch {} await sleep(200); }
  throw new Error("server non avviato");
});
after(() => { proc && proc.kill(); try { rmSync(path.join(root, "data.json")); } catch {} });

test("un contatto non puo' svuotare la scorta prekey; il destinatario online riceve prekeys-low", async () => {
  const a = await user("alice"), b = await user("bobby");
  assert.equal((await post("/api/contacts/add", { publicId: b.publicId }, a.token)).status, 200);

  const up = await post("/api/prekeys", { keys: Array.from({ length: 80 }, (_, i) => jwk(i)) }, b.token);
  assert.equal(up.json.count, 80);

  let low = 0;
  const ws = new WebSocket(`ws://127.0.0.1:${PORT}`);
  await new Promise((r) => ws.on("open", r));
  ws.send(JSON.stringify({ type: "auth", token: b.token }));
  ws.on("message", (m) => { if (JSON.parse(m).type === "prekeys-low") low++; });
  await sleep(300);

  let ok = 0, limited = 0;
  for (let i = 0; i < 70; i++) {
    const r = await post("/api/prekeys/claim/" + b.profileId, {}, a.token);
    if (r.status === 200 && r.json.prekey) ok++; else if (r.status === 429) limited++;
  }
  await sleep(300);
  ws.close();
  assert.equal(ok, 60, "tetto di 60 prelievi/ora per coppia");
  assert.equal(limited, 10);
  assert.ok(low >= 1, "avviso prekeys-low ricevuto");
  assert.equal(low, 1, "avviso al massimo ogni 5 minuti");
  const cnt = await fetch(base + "/api/prekeys/count", { headers: { Authorization: "Bearer " + b.token } }).then((r) => r.json());
  assert.equal(cnt.count, 20, "ne restano 20: la scorta non e' stata svuotata");

  // il tetto vale per coppia: un altro contatto puo' ancora prelevare
  const c = await user("carol");
  await post("/api/contacts/add", { publicId: b.publicId }, c.token);
  const r = await post("/api/prekeys/claim/" + b.profileId, {}, c.token);
  assert.equal(r.status, 200);
  assert.ok(r.json.prekey);
});

test("cambio di identita': le prekey vecchie vengono azzerate; la versione protocollo e' esposta ai contatti", async () => {
  const a = await user("dave"), b = await user("erin");
  await post("/api/contacts/add", { publicId: b.publicId }, a.token);
  const k1 = { kty: "EC", crv: "P-256", x: "AAA", y: "BBB" }, k2 = { kty: "EC", crv: "P-256", x: "CCC", y: "DDD" };
  await post("/api/me/publickey", { publicKeyJwk: k1, proto: 3 }, b.token);
  await post("/api/prekeys", { keys: Array.from({ length: 10 }, (_, i) => jwk(i)) }, b.token);
  const chats1 = await fetch(base + "/api/chats", { headers: { Authorization: "Bearer " + a.token } }).then((r) => r.json());
  assert.equal(chats1.chats[0].with.proto, 3);
  // stessa identita' ripubblicata (ogni login): le prekey restano
  await post("/api/me/publickey", { publicKeyJwk: k1, proto: 3 }, b.token);
  assert.equal((await fetch(base + "/api/prekeys/count", { headers: { Authorization: "Bearer " + b.token } }).then((r) => r.json())).count, 10);
  // nuova identita': prekey azzerate; un client vecchio (senza proto) torna a v2
  await post("/api/me/publickey", { publicKeyJwk: k2 }, b.token);
  assert.equal((await fetch(base + "/api/prekeys/count", { headers: { Authorization: "Bearer " + b.token } }).then((r) => r.json())).count, 0);
  const chats2 = await fetch(base + "/api/chats", { headers: { Authorization: "Bearer " + a.token } }).then((r) => r.json());
  assert.equal(chats2.chats[0].with.proto, 2);
});

test("trasferimento: monouso, solo stesso account, il server tiene solo testo cifrato e lo cancella dopo il download", async () => {
  const a = await user("frank"), other = await user("gina");
  const put = (token, bytes) => fetch(base + "/api/transfer", { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/octet-stream" }, body: bytes });
  const blob = new Uint8Array(200).fill(7);
  assert.equal((await put(a.token, new Uint8Array(10))).status, 400, "troppo corto");
  const up = await (await put(a.token, blob)).json();
  assert.ok(up.id && up.id.length >= 22);
  const get = (token, id) => fetch(base + "/api/transfer/" + id, { headers: { Authorization: "Bearer " + token } });
  const st = (token, id) => fetch(base + "/api/transfer/" + id + "/status", { headers: { Authorization: "Bearer " + token } }).then((r) => r.json());
  assert.equal((await get(other.token, up.id)).status, 404, "un altro account non lo vede");
  assert.equal((await st(a.token, up.id)).state, "waiting");
  const dl = await get(a.token, up.id);
  assert.equal(dl.status, 200);
  assert.deepEqual(new Uint8Array(await dl.arrayBuffer()), blob);
  assert.equal((await get(a.token, up.id)).status, 410, "monouso");
  assert.equal((await st(a.token, up.id)).state, "downloaded");
  // un nuovo pacchetto sostituisce il precedente (uno solo per profilo)
  const up2 = await (await put(a.token, blob)).json();
  assert.equal((await st(a.token, up.id).catch(() => ({}))).state, undefined);
  assert.equal((await fetch(base + "/api/transfer/" + up2.id, { method: "DELETE", headers: { Authorization: "Bearer " + a.token } })).status, 200);
  assert.equal((await get(a.token, up2.id)).status, 404);
});
