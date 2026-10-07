// Storage: PostgreSQL (produzione, variabile DATABASE_URL) oppure file JSON (sviluppo locale).
//
// Architettura: tutti i dati vivono in memoria (oggetto `db`, API sincrona load()/save())
// e vengono persistiti su Postgres riga per riga: save() confronta lo stato con quello
// gia' scritto e invia solo gli upsert/delete necessari (write-behind, ~150 ms).
// All'avvio, init() carica tutto da Postgres; se le tabelle sono vuote e esiste un
// data.json locale, lo importa (migrazione una tantum).
//
// NOTE DI SICUREZZA:
// - La password NON e' salvata in chiaro: il profilo contiene solo un hash scrypt (passHash + passSalt).
// - L'email e' cifrata a riposo (AES-256-GCM, vedi server.js: emailEnc); lo username resta in chiaro
//   perche' serve al login e alla ricerca (si trova per ID pubblico).
// - I MESSAGGI sono cifrati end-to-end: il server salva solo { iv, ciphertext } prodotti dal client
//   con AES-GCM e non e' MAI in grado di leggerne il contenuto.
// - Le credenziali WebAuthn salvano solo la chiave pubblica e il counter della passkey.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.json");
const DATABASE_URL = process.env.DATABASE_URL || "";
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;

const COLLECTIONS = {
  profiles: (x) => x.id,
  contacts: (x) => x.profileId + "|" + x.contactProfileId,
  chats: (x) => x.id,
  messages: (x) => x.id,
  reports: (x) => x.id
};

let db = null;
let profileCodec = null; // { encode, decode, isEncoded }: cifratura a riposo di alcuni campi del profilo
let pool = null;
const persisted = {}; // collection -> Map(key -> json string)
let persistedChallenges = "";
let timer = null;
let flushing = Promise.resolve();

function emptyDb() {
  return { profiles: [], contacts: [], chats: [], messages: [], reports: [], webauthnChallenges: {} };
}

function normalize(d) {
  for (const k of Object.keys(COLLECTIONS)) if (!Array.isArray(d[k])) d[k] = [];
  if (!d.webauthnChallenges) d.webauthnChallenges = {};
  for (const p of d.profiles) {
    if (p.publicKey === undefined) p.publicKey = null;
    if (!p.webauthnCredentials) p.webauthnCredentials = [];
  }
  return d;
}

function setProfileCodec(c) { profileCodec = c; }

// ---------- sessioni (persistenti) ----------
const sessionMap = new Map(); // token -> { profileId, exp }
const sessions = {
  get(token) {
    const s = sessionMap.get(token);
    if (!s) return undefined;
    if (s.exp < Date.now()) { sessions.delete(token); return undefined; }
    return s.profileId;
  },
  set(token, profileId) {
    const exp = Date.now() + SESSION_TTL_MS;
    sessionMap.set(token, { profileId, exp });
    if (pool) pool.query(
      "INSERT INTO sessions(token, profile_id, exp) VALUES($1,$2,$3) ON CONFLICT (token) DO UPDATE SET profile_id=$2, exp=$3",
      [token, profileId, exp]
    ).catch((e) => console.error("sessions.set", e.message));
  },
  deleteByProfile(profileId, exceptToken) {
    for (const [t, s] of sessionMap) if (s.profileId === profileId && t !== exceptToken) sessionMap.delete(t);
    if (pool) pool.query("DELETE FROM sessions WHERE profile_id=$1 AND token <> $2", [profileId, exceptToken || ""]).catch((e) => console.error("sessions.deleteByProfile", e.message));
  },
  delete(token) {
    sessionMap.delete(token);
    if (pool) pool.query("DELETE FROM sessions WHERE token=$1", [token]).catch((e) => console.error("sessions.delete", e.message));
  }
};

// ---------- init ----------
async function init() {
  if (!DATABASE_URL) {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify(emptyDb(), null, 2));
    db = normalize(JSON.parse(fs.readFileSync(DB_PATH, "utf-8")));
    console.log("Storage: file JSON locale (nessun DATABASE_URL)");
    return;
  }
  const { Pool } = require("pg");
  pool = new Pool({ connectionString: DATABASE_URL, max: 5 });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS docs (
      collection TEXT NOT NULL,
      key TEXT NOT NULL,
      data JSONB NOT NULL,
      PRIMARY KEY (collection, key)
    );
    CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, data JSONB NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, profile_id TEXT NOT NULL, exp BIGINT NOT NULL
    );
  `);
  const rows = (await pool.query("SELECT collection, key, data FROM docs")).rows;
  db = emptyDb();
  for (const k of Object.keys(COLLECTIONS)) persisted[k] = new Map();
  for (const r of rows) {
    if (!COLLECTIONS[r.collection]) continue;
    let item = r.data;
    let stored = JSON.stringify(item); // confronto sul testo in chiaro
    if (r.collection === "profiles" && profileCodec) {
      const encoded = profileCodec.isEncoded(item);
      item = profileCodec.decode(item);
      stored = encoded ? JSON.stringify(item) : ""; // "" => riscrive cifrato al prossimo flush
    }
    db[r.collection].push(item);
    persisted[r.collection].set(r.key, stored);
  }
  const ch = (await pool.query("SELECT data FROM kv WHERE key='webauthnChallenges'")).rows[0];
  if (ch) { db.webauthnChallenges = ch.data; persistedChallenges = JSON.stringify(ch.data); }
  normalize(db);

  // migrazione una tantum da data.json locale
  if (!rows.length && fs.existsSync(DB_PATH)) {
    try {
      const old = normalize(JSON.parse(fs.readFileSync(DB_PATH, "utf-8")));
      if (old.profiles.length) {
        for (const k of Object.keys(COLLECTIONS)) db[k] = old[k];
        db.webauthnChallenges = old.webauthnChallenges;
        console.log("Migrati " + old.profiles.length + " profili da data.json a Postgres");
        await flush();
      }
    } catch (e) { console.error("migrazione data.json:", e.message); }
  }
  const now = Date.now();
  await pool.query("DELETE FROM sessions WHERE exp < $1", [now]);
  for (const r of (await pool.query("SELECT token, profile_id, exp FROM sessions")).rows) {
    sessionMap.set(r.token, { profileId: r.profile_id, exp: Number(r.exp) });
  }
  console.log("Storage: PostgreSQL (" + db.profiles.length + " profili, " + sessionMap.size + " sessioni)");
}

// ---------- persistenza ----------
async function flushOnce() {
  if (!pool) return;
  const upserts = []; // [collection, key, json]
  const deletes = []; // [collection, key]
  for (const [coll, keyFn] of Object.entries(COLLECTIONS)) {
    const seen = new Set();
    const prev = persisted[coll];
    for (const item of db[coll]) {
      const key = keyFn(item);
      seen.add(key);
      const json = JSON.stringify(item);
      if (prev.get(key) !== json) {
        const out = (coll === "profiles" && profileCodec) ? JSON.stringify(profileCodec.encode(item)) : json;
        upserts.push([coll, key, out, json]);
      }
    }
    for (const key of prev.keys()) if (!seen.has(key)) deletes.push([coll, key]);
  }
  const chJson = JSON.stringify(db.webauthnChallenges);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [c, k, j] of upserts) {
      await client.query(
        "INSERT INTO docs(collection,key,data) VALUES($1,$2,$3::jsonb) ON CONFLICT (collection,key) DO UPDATE SET data=EXCLUDED.data",
        [c, k, j]
      );
    }
    for (const [c, k] of deletes) await client.query("DELETE FROM docs WHERE collection=$1 AND key=$2", [c, k]);
    if (chJson !== persistedChallenges) {
      await client.query(
        "INSERT INTO kv(key,data) VALUES('webauthnChallenges',$1::jsonb) ON CONFLICT (key) DO UPDATE SET data=EXCLUDED.data",
        [chJson]
      );
    }
    await client.query("COMMIT");
    for (const [c, k, , plain] of upserts) persisted[c].set(k, plain);
    for (const [c, k] of deletes) persisted[c].delete(k);
    persistedChallenges = chJson;
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("flush Postgres:", e.message);
  } finally {
    client.release();
  }
}
function flush() {
  flushing = flushing.then(flushOnce);
  return flushing;
}

function load() {
  if (!db) throw new Error("db non inizializzato: chiamare init() prima");
  return db;
}

function save(d) {
  if (!pool) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return;
  }
  if (timer) return;
  timer = setTimeout(() => { timer = null; flush(); }, 150);
}

async function close() {
  if (timer) { clearTimeout(timer); timer = null; }
  if (pool) { await flush(); await pool.end(); }
}

const query = (...a) => pool.query(...a);
module.exports = { init, load, save, flush, close, sessions, setProfileCodec, query, hasPg: () => !!pool };
