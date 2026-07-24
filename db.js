// Storage minimale su file JSON. Prototipo: NIENTE crittografia reale,
// i codici di accesso sono salvati in chiaro solo per semplicita' di demo.
// In produzione andrebbero hashati (es. argon2) e i messaggi cifrati E2E.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.json");

function emptyDb() {
  return {
    profiles: [],   // { id, email, username, publicId, accessCode, secretCombo, isCover, settings, createdAt }
    contacts: [],   // { profileId, contactProfileId, blocked, muted }
    chats: [],      // { id, memberIds: [profileIdA, profileIdB], hiddenFor: { profileId: bool } }
    messages: []    // { id, chatId, senderProfileId, text, replyTo, reactions: {emoji: [profileId]}, createdAt, selfDestructAt }
  };
}

function load() {
  if (!fs.existsSync(DB_PATH)) {
    save(emptyDb());
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = { load, save };
