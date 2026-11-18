// Crittografia end-to-end (E2E v2) basata sulla Web Crypto API nativa del
// browser: nessuna libreria esterna, il server non vede mai testo in chiaro
// ne' chiavi private.
//
// SCHEMA
// - Identita': coppia ECDH P-256 di lungo periodo (la parte pubblica e' sul server).
// - Forward secrecy: ogni messaggio usa una chiave NUOVA, derivata in stile X3DH
//   da tre scambi ECDH tra identita', chiave effimera del mittente e una
//   "prekey" monouso del destinatario (il server la consegna una sola volta).
//   Appena il destinatario ha decifrato, cancella la prekey privata: da quel
//   momento il messaggio non e' piu' decifrabile nemmeno con le chiavi di
//   lungo periodo. Il testo gia' letto resta solo nella cache locale cifrata.
// - Cassaforte (vault): identita' privata, prekey private e cache dei messaggi
//   sono cifrate nel dispositivo con AES-GCM; la chiave deriva dalla PASSWORD
//   (PBKDF2-SHA256). Senza password il contenuto di localStorage e' illeggibile.
// - Double Ratchet (v3, dal 2026-11): dopo il primo messaggio (che usa X3DH + prekey
//   monouso come sopra) ogni conversazione prosegue con un ratchet: una chiave nuova
//   per OGNI messaggio (catena simmetrica, forward secrecy) e un nuovo scambio DH ad
//   ogni cambio di direzione (post-compromise security: se uno stato viene rubato, la
//   conversazione "guarisce" appena i due si scambiano un nuovo messaggio). Le sessioni
//   sono nella cassaforte cifrata; i messaggi v1/v2 restano leggibili. Il protocollo
//   usato con un contatto si negozia: il server conosce solo il numero di versione.
// - Verifica: "numero di sicurezza" confrontabile a voce + avviso se la chiave
//   di un contatto cambia (TOFU), contro attacchi man-in-the-middle.
//
// LIMITI RESIDUI (dichiarati nel manuale e sul sito):
// - Se un contatto non ha prekey disponibili si usa l'identita' al posto della
//   prekey: resta una chiave nuova per messaggio, ma senza cancellazione monouso.
//   Mitigazioni: scorta ampia (fino a 200, ricarica sotto 40), avviso immediato al
//   destinatario online quando scende sotto 30 (evento WS "prekeys-low"), tetto di
//   prelievi per coppia di contatti e avviso al mittente quando il messaggio parte
//   senza chiave monouso.
// - La cassaforte e' protetta dalla forza della password scelta.
// - Dopo un reset password (link via email) la cassaforte precedente non e'
//   recuperabile: nasce una nuova identita' e lo storico locale va perso.
// - I messaggi non sono leggibili da un secondo dispositivo (per progetto).

const E2E = (() => {
  const CURVE = "P-256";
  const PBKDF2_ITER = 310000;
  const SALT_V2 = new TextEncoder().encode("messaging-app-e2e-v2-salt");
  const HKDF_SALT_V1 = new TextEncoder().encode("messaging-app-e2e-v1-salt");
  const ECDH = { name: "ECDH", namedCurve: CURVE };
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64 = (buf) => { const u = new Uint8Array(buf); let s = ""; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
    del: (k) => { try { localStorage.removeItem(k); } catch {} }
  };
  const pubOnly = (j) => ({ kty: j.kty, crv: j.crv, x: j.x, y: j.y });

  // ---------------- stato in memoria (mai persistito in chiaro) ----------------
  let S = null; // { pid, key (AES), data:{ identity:{priv,pub}, prekeys:{id:privJwk} }, identity:{privateKey, publicJwk} }

  const vaultKeyName = (pid) => "vault_" + pid;
  const cacheName = (pid, mid) => "pc_" + pid + "_" + mid;

  async function deriveVaultKey(password, salt, iter) {
    const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: iter },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }
  async function sealWith(key, obj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
    return b64(iv) + "." + b64(ct);
  }
  async function openWith(key, str) {
    const [iv, ct] = str.split(".");
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(iv) }, key, unb64(ct));
    return JSON.parse(dec.decode(pt));
  }

  async function persistVault() {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, S.key, enc.encode(JSON.stringify(S.data)));
    const meta = JSON.parse(ls.get(vaultKeyName(S.pid)));
    meta.iv = b64(iv); meta.ct = b64(ct);
    ls.set(vaultKeyName(S.pid), JSON.stringify(meta));
  }

  async function loadIdentity() {
    const id = S.data.identity;
    const privateKey = await crypto.subtle.importKey("jwk", id.priv, ECDH, false, ["deriveBits"]);
    S.identity = { privateKey, publicJwk: pubOnly(id.pub) };
  }

  async function newIdentity() {
    const pair = await crypto.subtle.generateKey(ECDH, true, ["deriveBits"]);
    return {
      priv: await crypto.subtle.exportKey("jwk", pair.privateKey),
      pub: pubOnly(await crypto.subtle.exportKey("jwk", pair.publicKey))
    };
  }

  // Apre (o crea) la cassaforte. Restituisce { publicJwk, created, migrated } oppure lancia "bad-password".
  async function unlock(pid, password) {
    const raw = ls.get(vaultKeyName(pid));
    if (raw) {
      const meta = JSON.parse(raw);
      const key = await deriveVaultKey(password, unb64(meta.salt), meta.iter);
      let data;
      try {
        const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(meta.iv) }, key, unb64(meta.ct));
        data = JSON.parse(dec.decode(pt));
      } catch { throw new Error("bad-password"); }
      S = { pid, key, data };
      await loadIdentity();
      await ensureDataKey();
      purgeExpiredCache(pid);
      return { publicJwk: S.identity.publicJwk, created: false, migrated: false };
    }
    // nuova cassaforte: migra l'eventuale vecchia coppia salvata in chiaro (versione precedente)
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveVaultKey(password, salt, PBKDF2_ITER);
    let identity = null, migrated = false;
    const legacy = ls.get("e2e_keypair_" + pid);
    if (legacy) {
      try { const j = JSON.parse(legacy); identity = { priv: j.privateJwk, pub: pubOnly(j.publicJwk) }; migrated = true; } catch {}
    }
    if (!identity) identity = await newIdentity();
    S = { pid, key, data: { identity, prekeys: {} } };
    ls.set(vaultKeyName(pid), JSON.stringify({ v: 2, salt: b64(salt), iter: PBKDF2_ITER, iv: "", ct: "" }));
    await persistVault();
    if (legacy) ls.del("e2e_keypair_" + pid); // la chiave in chiaro non deve restare nel dispositivo
    await loadIdentity();
    await ensureDataKey();
    return { publicJwk: S.identity.publicJwk, created: !migrated, migrated };
  }

  // Dopo un reset password la vecchia cassaforte non e' apribile: se ne crea una nuova.
  async function resetVault(pid, password) {
    ls.del(vaultKeyName(pid));
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("pc_" + pid + "_")) ls.del(k);
    }
    S = null;
    return unlock(pid, password);
  }

  // Cambio password: la cassaforte viene ri-sigillata con la nuova (serve gia' sbloccata).
  async function rewrap(newPassword) {
    if (!S) return false;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const newKey = await deriveVaultKey(newPassword, salt, PBKDF2_ITER);
    // ricifra anche la cache dei messaggi
    const prefix = "pc_" + S.pid + "_";
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(prefix)) entries.push(k); }
    for (const k of entries) {
      try { const o = await openWith(S.key, ls.get(k)); ls.set(k, await sealWith(newKey, o)); } catch { ls.del(k); }
    }
    S.key = newKey;
    ls.set(vaultKeyName(S.pid), JSON.stringify({ v: 2, salt: b64(salt), iter: PBKDF2_ITER, iv: "", ct: "" }));
    await persistVault();
    return true;
  }


  // ---------------- chiave dati (cassaforte file, note, password, backup) ----------------
  // Una chiave AES-256 casuale, custodita DENTRO la cassaforte cifrata: cosi' un cambio
  // password non obbliga a ricifrare tutti i file.
  async function ensureDataKey() {
    if (!S.data.dk) {
      S.data.dk = b64(crypto.getRandomValues(new Uint8Array(32)));
      await persistVault();
    }
    S.dk = await crypto.subtle.importKey("raw", unb64(S.data.dk), "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const needDk = () => { if (!S || !S.dk) throw new Error("locked"); return S.dk; };
  const vaultSeal = (obj) => sealWith(needDk(), obj);
  const vaultOpen = (str) => openWith(needDk(), str);
  async function sealBytes(bytes) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, needDk(), bytes));
    const out = new Uint8Array(12 + ct.length); out.set(iv, 0); out.set(ct, 12);
    return out;
  }
  async function openBytes(buf) {
    const u = new Uint8Array(buf);
    return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, needDk(), u.slice(12)));
  }
  // Backup: la chiave dati viene avvolta con una passphrase scelta dall'utente.
  async function wrapDataKey(passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const k = await deriveVaultKey(passphrase, salt, PBKDF2_ITER);
    return { salt: b64(salt), iter: PBKDF2_ITER, w: await sealWith(k, { dk: S.data.dk }) };
  }
  async function unwrapDataKey(passphrase, wrap) {
    const k = await deriveVaultKey(passphrase, unb64(wrap.salt), wrap.iter || PBKDF2_ITER);
    const o = await openWith(k, wrap.w); // lancia se la passphrase e' errata
    return crypto.subtle.importKey("raw", unb64(o.dk), "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  // Collega un nuovo dispositivo: adotta la chiave dati avvolta con la passphrase di sync.
  async function adoptDataKey(passphrase, wrap) {
    const k = await deriveVaultKey(passphrase, unb64(wrap.salt), wrap.iter || PBKDF2_ITER);
    const o = await openWith(k, wrap.w);
    S.data.dk = o.dk;
    await persistVault();
    S.dk = await crypto.subtle.importKey("raw", unb64(o.dk), "AES-GCM", false, ["encrypt", "decrypt"]);
  }
  const sealWithKey = (k, obj) => sealWith(k, obj);
  const openWithKey = (k, str) => openWith(k, str);
  async function openBytesWith(k, buf) {
    const u = new Uint8Array(buf);
    return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, k, u.slice(12)));
  }
  function cacheDelete(mid) { if (S) ls.del(cacheName(S.pid, mid)); }
  // Cancellazione di emergenza: toglie dal dispositivo chiavi, cache e cassaforte file.
  function wipeLocal(pid) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k === "vault_" + pid || k.startsWith("pc_" + pid + "_") || k.startsWith("peerfp_" + pid + "_") || k.startsWith("sm_" + pid))) ls.del(k);
    }
    S = null;
  }

  const hasVault = (pid) => !!ls.get(vaultKeyName(pid));
  const isUnlocked = () => !!S;
  function lock() { S = null; }
  const myPublicJwk = () => (S ? S.identity.publicJwk : null);

  // ---------------- cache locale dei messaggi (cifrata) ----------------
  async function cacheGet(mid) {
    if (!S) return undefined;
    const v = ls.get(cacheName(S.pid, mid));
    if (!v) return undefined;
    try { return (await openWith(S.key, v)).t; } catch { return undefined; }
  }
  async function cachePut(mid, text, exp) {
    if (!S) return;
    ls.set(cacheName(S.pid, mid), await sealWith(S.key, { t: text, e: exp || 0 }));
  }
  function purgeExpiredCache(pid) {
    const prefix = "pc_" + pid + "_";
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      openWith(S.key, ls.get(k)).then((o) => { if (o.e && o.e < Date.now()) ls.del(k); }).catch(() => {});
    }
  }

  // ---------------- accesso esclusivo alla cassaforte (stessa scheda + altre schede) ----------------
  // Le operazioni che modificano ratchet e prekey leggono lo stato piu' recente dal
  // dispositivo, lo aggiornano e lo risalvano in un'unica sezione esclusiva: due schede
  // aperte sullo stesso profilo non si sovrascrivono a vicenda.
  let lockQueue = Promise.resolve();
  function locked(fn) {
    const pid = S && S.pid;
    const run = lockQueue.then(() => (typeof navigator !== "undefined" && navigator.locks && pid
      ? navigator.locks.request("securmy-vault-" + pid, fn) : fn()));
    lockQueue = run.catch(() => {});
    return run;
  }
  async function reloadData() {
    const raw = S && ls.get(vaultKeyName(S.pid));
    if (!raw) return;
    try {
      const meta = JSON.parse(raw);
      if (!meta.iv || !meta.ct) return;
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(meta.iv) }, S.key, unb64(meta.ct));
      S.data = JSON.parse(dec.decode(pt));
    } catch { /* password cambiata da un'altra scheda: si tiene lo stato in memoria */ }
  }

  // ---------------- prekey ----------------
  async function ensurePrekeys(api) {
    if (!S) return;
    let count = 0;
    try { count = (await api("/api/prekeys/count")).count; } catch { return; }
    if (count >= 40) return;
    const batch = await locked(async () => {
      await reloadData();
      const out = [];
      for (let i = 0; i < 100 - count; i++) {
        const pair = await crypto.subtle.generateKey(ECDH, true, ["deriveBits"]);
        const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, "0")).join("");
        S.data.prekeys[id] = await crypto.subtle.exportKey("jwk", pair.privateKey);
        out.push({ id, pub: pubOnly(await crypto.subtle.exportKey("jwk", pair.publicKey)) });
      }
      await persistVault(); // prima salva le private, poi pubblica le pubbliche
      return out;
    });
    try { await api("/api/prekeys", { method: "POST", body: JSON.stringify({ keys: batch }) }); } catch {}
  }

  // ---------------- derivazione chiavi di messaggio ----------------
  const imp = (jwk, usages) => crypto.subtle.importKey("jwk", jwk, ECDH, true, usages || []);
  async function dh(priv, pubJwk) { return new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: await imp(pubJwk) }, priv, 256)); }
  async function msgKey(parts, info) {
    const total = parts.reduce((n, p) => n + p.length, 0);
    const buf = new Uint8Array(total); let o = 0;
    for (const p of parts) { buf.set(p, o); o += p.length; }
    const base = await crypto.subtle.importKey("raw", buf, "HKDF", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: SALT_V2, info: enc.encode(info) },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }

  // Cifra un messaggio per il contatto. claim(): preleva una prekey monouso dal server.
  // peerProto: versione del protocollo dichiarata dal contatto (3 = Double Ratchet, altrimenti v2).
  async function encryptMessage(args) {
    if (!S) throw new Error("locked");
    if ((args.peerProto || 2) >= 3) return encryptV3(args);
    return encryptV2(args);
  }
  async function encryptV2({ peerIdentity, myId, peerId, plaintext, claim }) {
    if (!S) throw new Error("locked");
    let opk = null;
    try { opk = await claim(); } catch {}
    const eph = await crypto.subtle.generateKey(ECDH, true, ["deriveBits"]);
    const ephPub = pubOnly(await crypto.subtle.exportKey("jwk", eph.publicKey));
    const parts = [await dh(eph.privateKey, peerIdentity)];            // DH(EK, IK_B)
    if (opk) {
      parts.unshift(await dh(S.identity.privateKey, opk.pub));          // DH(IK_A, OPK_B)
      parts.push(await dh(eph.privateKey, opk.pub));                    // DH(EK, OPK_B)
    } else {
      parts.unshift(await dh(S.identity.privateKey, peerIdentity));     // DH(IK_A, IK_B)
    }
    const hdr = JSON.stringify({ v: 2, ek: ephPub, opk: opk ? opk.id : null });
    const key = await msgKey(parts, "msg-v2:" + [myId, peerId].sort().join(":"));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(hdr) }, key, enc.encode(plaintext));
    return { iv: b64(iv), ciphertext: b64(ct), hdr, forwardSecret: !!opk };
  }

  const inflight = new Map();
  // Decifra un messaggio ricevuto; usa/riempie la cache; cancella la prekey usata.
  function decryptMessage({ m, mine, peerIdentity, myId, peerId, exp }) {
    if (inflight.has(m.id)) return inflight.get(m.id);
    const p = decryptInner({ m, mine, peerIdentity, myId, peerId, exp }).finally(() => inflight.delete(m.id));
    inflight.set(m.id, p);
    return p;
  }
  async function decryptInner({ m, mine, peerIdentity, myId, peerId, exp }) {
    if (!S) return { text: null, state: "locked" };
    const cached = await cacheGet(m.id);
    if (cached !== undefined) return { text: cached, state: "ok" };
    if (!m.hdr) { // messaggio v1 (chiave statica di chat)
      if (!peerIdentity) return { text: null, state: "nokey" };
      try {
        const base = await crypto.subtle.deriveBits({ name: "ECDH", public: await imp(peerIdentity) }, S.identity.privateKey, 256);
        const hk = await crypto.subtle.importKey("raw", base, "HKDF", false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey(
          { name: "HKDF", hash: "SHA-256", salt: HKDF_SALT_V1, info: enc.encode([myId, peerId].sort().join(":")) },
          hk, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(m.iv) }, key, unb64(m.ciphertext));
        const text = dec.decode(pt);
        await cachePut(m.id, text, exp);
        return { text, state: "ok" };
      } catch { return { text: null, state: "gone" }; }
    }
    if (mine) return { text: null, state: "gone" }; // i miei messaggi v2/v3 si leggono solo dalla cache
    if (!peerIdentity) return { text: null, state: "nokey" };
    let h0 = null;
    try { h0 = JSON.parse(m.hdr); } catch { return { text: null, state: "gone" }; }
    if (h0 && h0.v === 3) return decryptV3({ m, peerIdentity, myId, peerId, exp });
    try {
      const h = h0;
      const parts = [];
      let usedId = null;
      if (h.opk) {
        const opkPriv = S.data.prekeys[h.opk];
        if (!opkPriv) return { text: null, state: "gone" }; // prekey gia' eliminata: forward secrecy
        const opk = await crypto.subtle.importKey("jwk", opkPriv, ECDH, false, ["deriveBits"]);
        parts.push(await dh(opk, peerIdentity));                      // DH(OPK_B, IK_A)
        parts.push(await dh(S.identity.privateKey, h.ek));            // DH(IK_B, EK)
        parts.push(await dh(opk, h.ek));                              // DH(OPK_B, EK)
        usedId = h.opk;
      } else {
        parts.push(await dh(S.identity.privateKey, peerIdentity));    // DH(IK_B, IK_A)
        parts.push(await dh(S.identity.privateKey, h.ek));            // DH(IK_B, EK)
      }
      const key = await msgKey(parts, "msg-v2:" + [myId, peerId].sort().join(":"));
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(m.iv), additionalData: enc.encode(m.hdr) }, key, unb64(m.ciphertext));
      const text = dec.decode(pt);
      await cachePut(m.id, text, exp);          // prima la cache, poi si distrugge la chiave
      if (usedId) { delete S.data.prekeys[usedId]; await persistVault(); }
      return { text, state: "ok" };
    } catch { return { text: null, state: "gone" }; }
  }

  async function rememberSent(mid, text, exp) { await cachePut(mid, text, exp); }

  // ---------------- Double Ratchet (v3) ----------------
  const PROTO = 3;
  const SALT_V3 = new TextEncoder().encode("securmy-e2e-v3-salt");
  const ZERO32 = new Uint8Array(32);
  const DR_MAX_SKIP = 500;             // messaggi saltati accettati in un colpo
  const DR_MAX_SKIPPED = 2000;         // chiavi saltate conservate (totale per sessione)
  const DR_SKIPPED_TTL = 14 * 24 * 3600 * 1000;
  const DR_MAX_SESSIONS = 4;           // sessioni conservate per contatto

  const cat = (parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };
  async function hkdfBits(ikm, salt, info, bytes) {
    const base = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: enc.encode(info) }, base, bytes * 8));
  }
  async function kdfRK(rk, dhOut) { const o = await hkdfBits(dhOut, rk, "rk-v3", 64); return [o.slice(0, 32), o.slice(32)]; }
  async function kdfCK(ck) { return { ck: await hkdfBits(ck, ZERO32, "ck-v3", 32), mk: await hkdfBits(ck, ZERO32, "mk-v3", 32) }; }
  const aesKey = (mk) => crypto.subtle.importKey("raw", mk, "AES-GCM", false, ["encrypt", "decrypt"]);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  async function newDhPair() {
    const pair = await crypto.subtle.generateKey(ECDH, true, ["deriveBits"]);
    return {
      priv: await crypto.subtle.exportKey("jwk", pair.privateKey),
      pub: pubOnly(await crypto.subtle.exportKey("jwk", pair.publicKey))
    };
  }
  const dhPriv = (jwk) => crypto.subtle.importKey("jwk", jwk, ECDH, false, ["deriveBits"]);
  const dhIdSort = (a, b) => [a, b].sort().join(":");
  const sidOf = async (ek) => b64(await sha256(canon(ek))).slice(0, 16);
  const aadOf = (hdr, myId, peerId) => enc.encode(hdr + "|" + dhIdSort(myId, peerId));

  function pruneSkipped(st) {
    const now = Date.now();
    let keys = Object.keys(st.skipped);
    for (const k of keys) if (now - st.skipped[k].t > DR_SKIPPED_TTL) delete st.skipped[k];
    keys = Object.keys(st.skipped);
    if (keys.length > DR_MAX_SKIPPED) {
      keys.sort((a, b) => st.skipped[a].t - st.skipped[b].t);
      for (const k of keys.slice(0, keys.length - DR_MAX_SKIPPED)) delete st.skipped[k];
    }
  }
  async function skipTo(st, until) {
    if (!st.ckr) return;
    if (until - st.nr > DR_MAX_SKIP) throw new Error("too-many-skipped");
    while (st.nr < until) {
      const { ck, mk } = await kdfCK(unb64(st.ckr));
      st.skipped[canon(st.dhr) + ":" + st.nr] = { k: b64(mk), t: Date.now() };
      st.ckr = b64(ck); st.nr++;
    }
  }
  async function dhRatchet(st, theirDh) {
    st.pn = st.ns; st.ns = 0; st.nr = 0;
    st.dhr = pubOnly(theirDh);
    const [rk1, ckr] = await kdfRK(unb64(st.rk), await dh(await dhPriv(st.dhs.priv), st.dhr));
    st.dhs = await newDhPair();
    const [rk2, cks] = await kdfRK(rk1, await dh(await dhPriv(st.dhs.priv), st.dhr));
    st.rk = b64(rk2); st.ckr = b64(ckr); st.cks = b64(cks);
  }
  // Segreto iniziale X3DH condiviso (stesse parti di v2, ma l'output alimenta la radice del ratchet).
  async function initialSecret(parts, myId, peerId) { return hkdfBits(cat(parts), SALT_V3, "sk-v3:" + dhIdSort(myId, peerId), 32); }

  const sessionsOf = (peerId) => ((S.data.ratchets = S.data.ratchets || {})[peerId] = S.data.ratchets[peerId] || []);
  function storeSession(peerId, st) {
    const list = sessionsOf(peerId).filter((x) => x.sid !== st.sid);
    list.unshift(st); // la piu' recente e' quella attiva per l'invio
    S.data.ratchets[peerId] = list.slice(0, DR_MAX_SESSIONS);
  }

  async function encryptV3({ peerIdentity, myId, peerId, plaintext, claim }) {
    return locked(async () => {
      await reloadData();
      const fp = canon(peerIdentity);
      let st = sessionsOf(peerId).find((x) => x.ik === fp);
      st = st ? clone(st) : null;
      if (!st) {
        // nuova sessione: X3DH con una prekey monouso del contatto (se disponibile)
        let opk = null;
        try { opk = await claim(); } catch {}
        const eph = await newDhPair();
        const ephPriv = await dhPriv(eph.priv);
        const parts = [await dh(ephPriv, peerIdentity)];
        if (opk) {
          parts.unshift(await dh(S.identity.privateKey, opk.pub));
          parts.push(await dh(ephPriv, opk.pub));
        } else {
          parts.unshift(await dh(S.identity.privateKey, peerIdentity));
        }
        const sk = await initialSecret(parts, myId, peerId);
        const [rk, cks] = await kdfRK(sk, await dh(ephPriv, peerIdentity));
        st = { sid: await sidOf(eph.pub), ik: fp, rk: b64(rk), dhs: eph, dhr: pubOnly(peerIdentity), cks: b64(cks), ckr: null,
               ns: 0, nr: 0, pn: 0, skipped: {}, init: { ek: eph.pub, opk: opk ? opk.id : null }, fs: !!opk, t: Date.now() };
      }
      const { ck, mk } = await kdfCK(unb64(st.cks));
      const hdrObj = { v: 3, sid: st.sid, dh: st.dhs.pub, pn: st.pn, n: st.ns };
      if (st.init) hdrObj.init = st.init;      // finche' il contatto non ha risposto, il primo scambio resta ricostruibile
      const hdr = JSON.stringify(hdrObj);
      st.cks = b64(ck); st.ns++; st.t = Date.now();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aadOf(hdr, myId, peerId) }, await aesKey(mk), enc.encode(plaintext));
      storeSession(peerId, st);
      await persistVault();
      return { iv: b64(iv), ciphertext: b64(ct), hdr, forwardSecret: st.init ? !!st.fs : true };
    });
  }

  async function decryptV3({ m, peerIdentity, myId, peerId, exp }) {
    try {
      return await locked(async () => {
        await reloadData();
        const again = await cacheGet(m.id); // un'altra scheda potrebbe averlo gia' decifrato
        if (again !== undefined) return { text: again, state: "ok" };
        const h = JSON.parse(m.hdr);
        if (!h.sid || !h.dh || typeof h.n !== "number" || typeof h.pn !== "number") return { text: null, state: "gone" };
        const fp = canon(peerIdentity);
        let st = sessionsOf(peerId).find((x) => x.sid === h.sid && x.ik === fp);
        let usedOpk = null;
        if (st) st = clone(st);
        else {
          // sessione nuova avviata dal contatto: serve l'intestazione di avvio
          if (!h.init || !h.init.ek || (await sidOf(h.init.ek)) !== h.sid) return { text: null, state: "gone" };
          const ek = pubOnly(h.init.ek);
          const parts = [];
          if (h.init.opk) {
            const opkPriv = S.data.prekeys[h.init.opk];
            if (!opkPriv) return { text: null, state: "gone" }; // prekey gia' eliminata
            const opk = await dhPriv(opkPriv);
            parts.push(await dh(opk, peerIdentity), await dh(S.identity.privateKey, ek), await dh(opk, ek));
            usedOpk = h.init.opk;
          } else {
            parts.push(await dh(S.identity.privateKey, peerIdentity), await dh(S.identity.privateKey, ek));
          }
          const sk = await initialSecret(parts, myId, peerId);
          const [rk1, ckr] = await kdfRK(sk, await dh(S.identity.privateKey, ek));
          const mine = await newDhPair();
          const [rk2, cks] = await kdfRK(rk1, await dh(await dhPriv(mine.priv), ek));
          st = { sid: h.sid, ik: fp, rk: b64(rk2), dhs: mine, dhr: ek, cks: b64(cks), ckr: b64(ckr), ns: 0, nr: 0, pn: 0, skipped: {}, init: null, fs: true, t: Date.now() };
        }
        // chiave del messaggio: gia' saltata, oppure avanzando la catena
        let mk = null;
        const sk0 = canon(h.dh) + ":" + h.n;
        if (st.skipped[sk0]) { mk = unb64(st.skipped[sk0].k); delete st.skipped[sk0]; }
        else {
          if (canon(h.dh) !== canon(st.dhr || { x: "", y: "" })) { await skipTo(st, h.pn); await dhRatchet(st, h.dh); }
          if (h.n < st.nr) return { text: null, state: "gone" }; // gia' consumato (ripetizione)
          await skipTo(st, h.n);
          const next = await kdfCK(unb64(st.ckr));
          st.ckr = b64(next.ck); st.nr++; mk = next.mk;
        }
        const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(m.iv), additionalData: aadOf(m.hdr, myId, peerId) }, await aesKey(mk), unb64(m.ciphertext));
        const text = dec.decode(pt);
        // da qui il messaggio e' autentico: si conferma la sessione e si salva lo stato
        st.init = null; st.t = Date.now();
        pruneSkipped(st);
        await cachePut(m.id, text, exp);          // prima la cache, poi si consuma la chiave
        storeSession(peerId, st);
        if (usedOpk) delete S.data.prekeys[usedOpk];
        await persistVault();
        return { text, state: "ok" };
      });
    } catch { return { text: null, state: "gone" }; }
  }

  // ---------------- verifica identita' (numero di sicurezza + TOFU) ----------------
  async function sha256(str) { return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(str))); }
  const canon = (j) => j.x + "." + j.y;
  async function fingerprint(jwk) { return b64(await sha256(canon(jwk))); }
  async function safetyNumber(jwkA, jwkB) {
    const a = canon(jwkA), b = canon(jwkB);
    const h = await sha256([a, b].sort().join("|"));
    const groups = [];
    for (let i = 0; i < 12; i++) {
      const n = (h[(i * 2) % 32] * 256 + h[(i * 2 + 1) % 32] + h[(i + 7) % 32] * 7) % 100000;
      groups.push(String(n).padStart(5, "0"));
    }
    return groups.join(" ");
  }
  // TOFU: "new" (prima volta, memorizzata), "same", "changed".
  async function checkPeer(myPid, peerPid, jwk) {
    const k = "peerfp_" + myPid + "_" + peerPid;
    const fp = await fingerprint(jwk);
    const raw = ls.get(k);
    if (!raw) { ls.set(k, JSON.stringify({ fp, verified: false })); return { status: "new", verified: false }; }
    const o = JSON.parse(raw);
    if (o.fp === fp) return { status: "same", verified: !!o.verified };
    return { status: "changed", verified: false };
  }
  async function acceptPeer(myPid, peerPid, jwk) { ls.set("peerfp_" + myPid + "_" + peerPid, JSON.stringify({ fp: await fingerprint(jwk), verified: false })); }
  async function markVerified(myPid, peerPid, jwk) { ls.set("peerfp_" + myPid + "_" + peerPid, JSON.stringify({ fp: await fingerprint(jwk), verified: true })); }

  return {
    PROTO, unlock, resetVault, rewrap, hasVault, isUnlocked, lock, myPublicJwk,
    ensurePrekeys, encryptMessage, decryptMessage, rememberSent,
    safetyNumber, checkPeer, acceptPeer, markVerified,
    vaultSeal, vaultOpen, sealBytes, openBytes, wrapDataKey, unwrapDataKey,
    sealWithKey, openWithKey, openBytesWith, adoptDataKey, cacheDelete, wipeLocal,
    pid: () => (S ? S.pid : null)
  };
})();
