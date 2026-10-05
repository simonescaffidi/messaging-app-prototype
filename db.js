// Storage minimale su file JSON (prototipo: niente vero database).
// NOTE DI SICUREZZA:
// - La password NON e' salvata in chiaro: il profilo contiene solo un hash scrypt (passHash + passSalt).
//   Limite di tentativi falliti per IP e per username (vedi server.js).
//   I profili legacy con "accessCodeHash" restano validi come password.
// - I MESSAGGI pero' ora sono cifrati end-to-end: il server salva solo
//   { iv, ciphertext } prodotti dal client con AES-GCM, e non e' MAI in
//   grado di leggerne il contenuto in chiaro. Vedi public/crypto.js.
// - Le credenziali WebAuthn (sblocco biometrico) salvano solo la chiave
//   pubblica e il conteggio "counter" della passkey, mai dati biometrici:
//   l'impronta/Face ID restano sempre sul dispositivo dell'utente.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.json");

function emptyDb() {
  return {
    profiles: [
      // { id, email, username, publicId, passHash, passSalt, secretCombo, isCover,
      //   settings, createdAt, publicKey: <JWK ECDH P-256 | null>,
      //   webauthnCredentials: [{ id, publicKeyPem, counter, deviceLabel, createdAt }] }
    ],
    contacts: [],   // { profileId, contactProfileId, blocked, muted }
    chats: [],      // { id, memberIds: [profileIdA, profileIdB], hiddenFor: { profileId: bool } }
    messages: [
      // { id, chatId, senderProfileId, iv, ciphertext, replyTo, reactions: {emoji:[profileId]}, createdAt, selfDestructAt }
    ],
    webauthnChallenges: {} // temp store: profileId -> { challenge, createdAt, type }
  };
}

function load() {
  if (!fs.existsSync(DB_PATH)) {
    save(emptyDb());
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  // retro-compatibilita' con data.json pre-esistenti
  if (!db.webauthnChallenges) db.webauthnChallenges = {};
  for (const p of db.profiles) {
    if (p.publicKey === undefined) p.publicKey = null;
    if (!p.webauthnCredentials) p.webauthnCredentials = [];
  }
  return db;
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = { load, save };
