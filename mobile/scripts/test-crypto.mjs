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

console.log("TUTTI I TEST COMPLETATI");
