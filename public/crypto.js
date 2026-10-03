// Crittografia end-to-end reale, basata sulla Web Crypto API nativa del
// browser (nessuna libreria esterna, nessun dato cifrato passa dal server
// in chiaro).
//
// Schema usato: ECDH su curva P-256 per lo scambio di chiave tra due
// profili, poi HKDF-SHA256 per derivare una chiave simmetrica AES-GCM a
// 256 bit specifica per quella coppia di profili. Ogni messaggio e'
// cifrato con un IV casuale a 96 bit.
//
// LIMITI DICHIARATI (vedi anche manuale e sito):
// - Non c'e' ancora un ratchet (niente forward secrecy "a la Signal"): la
//   chiave di chat e' statica finche' entrambi i profili non rigenerano le
//   proprie chiavi.
// - Non c'e' verifica dell'identita' della chiave pubblica (nessun
//   "numero di sicurezza" da confrontare a voce): un server malevolo
//   potrebbe in teoria sostituire una chiave pubblica con la propria
//   (attacco man-in-the-middle). Su una rete fidata e per un prototipo va
//   bene; prima della produzione andrebbe aggiunta la verifica fuori banda.
// - La chiave privata e' salvata (esportata, JWK) nel localStorage del
//   browser: non e' protetta da un secure enclave hardware. Chi ha accesso
//   fisico/software al dispositivo sbloccato puo' leggerla.

const E2E = (() => {
  const CURVE = "P-256";
  const HKDF_SALT = new TextEncoder().encode("messaging-app-e2e-v1-salt");

  function keyStorageKey(publicId) {
    return `e2e_keypair_${publicId}`;
  }

  async function getOrCreateKeyPair(publicId) {
    const stored = localStorage.getItem(keyStorageKey(publicId));
    if (stored) {
      const jwkPair = JSON.parse(stored);
      const privateKey = await crypto.subtle.importKey(
        "jwk", jwkPair.privateJwk, { name: "ECDH", namedCurve: CURVE }, true, ["deriveKey", "deriveBits"]
      );
      const publicKey = await crypto.subtle.importKey(
        "jwk", jwkPair.publicJwk, { name: "ECDH", namedCurve: CURVE }, true, []
      );
      return { privateKey, publicKey, publicJwk: jwkPair.publicJwk };
    }
    const pair = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: CURVE }, true, ["deriveKey", "deriveBits"]
    );
    const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
    const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
    localStorage.setItem(keyStorageKey(publicId), JSON.stringify({ privateJwk, publicJwk }));
    return { privateKey: pair.privateKey, publicKey: pair.publicKey, publicJwk };
  }

  async function importPeerPublicKey(jwk) {
    return crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: CURVE }, true, []);
  }

  // Deriva una AES-GCM key condivisa tra due profili, deterministica
  // indipendentemente da chi la calcola (ECDH e' commutativo).
  async function deriveChatKey(myPrivateKey, peerPublicKey, myPublicId, peerPublicId) {
    const sharedBits = await crypto.subtle.deriveBits(
      { name: "ECDH", public: peerPublicKey }, myPrivateKey, 256
    );
    const hkdfKey = await crypto.subtle.importKey("raw", sharedBits, "HKDF", false, ["deriveKey"]);
    const info = new TextEncoder().encode([myPublicId, peerPublicId].sort().join(":"));
    return crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: HKDF_SALT, info },
      hkdfKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  function bufToB64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }
  function b64ToBuf(b64) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  async function encrypt(chatKey, plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(plaintext);
    const ciphertextBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, chatKey, data);
    return { iv: bufToB64(iv), ciphertext: bufToB64(ciphertextBuf) };
  }

  async function decrypt(chatKey, ivB64, ciphertextB64) {
    try {
      const iv = b64ToBuf(ivB64);
      const ciphertext = b64ToBuf(ciphertextB64);
      const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, chatKey, ciphertext);
      return new TextDecoder().decode(plainBuf);
    } catch (e) {
      return "⚠️ Impossibile decifrare (chiave mancante o messaggio corrotto)";
    }
  }

  return { getOrCreateKeyPair, importPeerPublicKey, deriveChatKey, encrypt, decrypt };
})();
