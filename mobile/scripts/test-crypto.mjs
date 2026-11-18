import fs from "fs"; import nodeCrypto from "crypto";
import os from "os"; import path from "path"; import { fileURLToPath, pathToFileURL } from "url";
const here = path.dirname(fileURLToPath(import.meta.url));
// copia temporanea di subtle.js come .mjs (dentro mobile/ cosi\' risolve i moduli noble)
const tmp = path.join(here, "..", "src", ".subtle.test.mjs");
fs.writeFileSync(tmp, fs.readFileSync(path.join(here, "..", "src", "subtle.js"), "utf8"));
const { subtle } = await import(pathToFileURL(tmp).href); fs.unlinkSync(tmp);
const src = fs.readFileSync(path.join(here, "..", "..", "public", "crypto.js"), "utf8");
const mkLS = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), key: (i) => [...m.keys()][i] ?? null, get length() { return m.size; } }; };
const make = (cryptoObj) => new Function("crypto", "localStorage", "TextEncoder", "TextDecoder", "btoa", "atob", src + "\nreturn E2E;")(cryptoObj, mkLS(), TextEncoder, TextDecoder, btoa, atob);
const shimCrypto = { subtle, getRandomValues: (a) => nodeCrypto.webcrypto.getRandomValues(a) };
globalThis.crypto ??= nodeCrypto.webcrypto;
const A = make(shimCrypto), B = make(nodeCrypto.webcrypto);
const prekeys = { A: [], B: [] };
const apiFor = (who) => async (path, o) => { if (path === "/api/prekeys/count") return { count: prekeys[who].length }; if (path === "/api/prekeys") { prekeys[who].push(...JSON.parse(o.body).keys); return {}; } };
let t0 = Date.now();
const ra = await A.unlock("pidA", "password-lunga-1"); console.log("shim unlock ms", Date.now() - t0);
t0 = Date.now(); const rb = await B.unlock("pidB", "password-lunga-2"); console.log("native unlock ms", Date.now() - t0);
await A.ensurePrekeys(apiFor("A")); await B.ensurePrekeys(apiFor("B"));
console.log("prekeys", prekeys.A.length, prekeys.B.length);
// A -> B (con prekey), B -> A
const m1 = await A.encryptMessage({ peerIdentity: rb.publicJwk, myId: "pidA", peerId: "pidB", plaintext: "ciao da shim", claim: async () => prekeys.B.shift() });
const d1 = await B.decryptMessage({ m: { id: "m1", ...m1 }, mine: false, peerIdentity: ra.publicJwk, myId: "pidB", peerId: "pidA", exp: 0 });
console.log("A->B", d1.state, d1.text);
const m2 = await B.encryptMessage({ peerIdentity: ra.publicJwk, myId: "pidB", peerId: "pidA", plaintext: "ciao da nativo", claim: async () => prekeys.A.shift() });
const d2 = await A.decryptMessage({ m: { id: "m2", ...m2 }, mine: false, peerIdentity: rb.publicJwk, myId: "pidA", peerId: "pidB", exp: 0 });
console.log("B->A", d2.state, d2.text);
// senza prekey
const m3 = await A.encryptMessage({ peerIdentity: rb.publicJwk, myId: "pidA", peerId: "pidB", plaintext: "no prekey", claim: async () => { throw 1; } });
console.log("no-prekey", (await B.decryptMessage({ m: { id: "m3", ...m3 }, mine: false, peerIdentity: ra.publicJwk, myId: "pidB", peerId: "pidA", exp: 0 })).text);
// cassaforte e sync: sigillo con shim, apertura con nativo (stessa dk)
const wrapA = await A.wrapDataKey("passphrase-sync-lunga");
await B.adoptDataKey("passphrase-sync-lunga", wrapA);
const sealed = await A.vaultSeal({ note: "segreto" }); console.log("vault interop", JSON.stringify(await B.vaultOpen(sealed)));
const bytes = nodeCrypto.randomBytes(100000); const sb = await A.sealBytes(bytes); console.log("bytes interop", Buffer.compare(Buffer.from(await B.openBytes(sb)), bytes) === 0);
console.log("safety", (await A.safetyNumber(ra.publicJwk, rb.publicJwk)) === (await B.safetyNumber(ra.publicJwk, rb.publicJwk)));
// riapertura cassaforte con shim (persistenza)
A.lock(); const r2 = await A.unlock("pidA", "password-lunga-1"); console.log("reopen same key", r2.publicJwk.x === ra.publicJwk.x);
try { A.lock(); await A.unlock("pidA", "sbagliata"); } catch (e) { console.log("wrong pw:", e.message); }


// Double Ratchet (v3) tra l'implementazione JS pura (app nativa) e il WebCrypto reale (browser)
{
  const ck = async (cond, msg) => { if (!cond) { console.error("FALLITO:", msg); process.exit(1); } };
  const enc3 = (E, me, peer, ident, text) => E.encryptMessage({ peerIdentity: ident, peerProto: 3, myId: me, peerId: peer, plaintext: text, claim: async () => prekeys[peer === "pidB" ? "B" : "A"].shift() });
  const dec3 = (E, me, peer, ident, e, id) => E.decryptMessage({ m: { id, iv: e.iv, ciphertext: e.ciphertext, hdr: e.hdr }, mine: false, peerIdentity: ident, myId: me, peerId: peer, exp: 0 });
  const A2 = make(shimCrypto), B2 = make(nodeCrypto.webcrypto);
  const ra2 = await A2.unlock("pidA", "password-lunga-1"), rb2 = await B2.unlock("pidB", "password-lunga-2");
  prekeys.A = []; prekeys.B = [];
  await A2.ensurePrekeys(apiFor("A")); await B2.ensurePrekeys(apiFor("B"));
  for (let i = 0; i < 4; i++) {
    const e1 = await enc3(A2, "pidA", "pidB", rb2.publicJwk, "shim->web " + i);
    const d1 = await dec3(B2, "pidB", "pidA", ra2.publicJwk, e1, "r" + i + "a");
    await ck(JSON.parse(e1.hdr).v === 3 && d1.text === "shim->web " + i, "v3 shim->web " + i);
    const e2 = await enc3(B2, "pidB", "pidA", ra2.publicJwk, "web->shim " + i);
    const d2 = await dec3(A2, "pidA", "pidB", rb2.publicJwk, e2, "r" + i + "b");
    await ck(d2.text === "web->shim " + i, "v3 web->shim " + i);
  }
  console.log("double ratchet interop true");
}
console.log("TUTTI I TEST COMPLETATI");
