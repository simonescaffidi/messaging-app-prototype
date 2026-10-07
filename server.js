// Prototipo webapp di messaggistica privata.
// Dimostra il meccanismo chiave del progetto: CODICE = PROFILO, chat nascoste,
// contatti, messaggistica realtime, crittografia E2E reale (ECDH + AES-GCM)
// e sblocco biometrico via WebAuthn (passkey di piattaforma).
// Vedi README.md e site/*.html per cosa manca ancora prima della produzione.

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const crypto = require("crypto");
const store = require("./db");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require("@simplewebauthn/server");

const syncMod = require("./sync");
const app = express();
app.set("trust proxy", 1); // dietro il proxy di Railway: req.ip e' l'IP reale del client
app.use(express.json({ limit: "256kb", verify: (req, _res, buf) => { if (req.url.startsWith("/api/stripe/")) req.rawBody = buf; } }));

// Sito di presentazione (landing IT/EN) servito sulla root.
app.use(express.static(path.join(__dirname, "site")));

// App funzionante (prototipo chat) servita sotto /app.
app.use("/app", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// sessioni persistenti (Postgres): token -> profileId, scadenza 30 giorni
const sessions = store.sessions;
// socket per profilo: profileId -> Set<ws>
const sockets = new Map();

function randomCode(len, chars) {
  let out = "";
  for (let i = 0; i < len; i++) out += chars[crypto.randomInt(chars.length)];
  return out;
}

// ---------- CODICE DI ACCESSO: lungo, casuale, hashato, anti-indovinamento ----------
// 12 caratteri da un alfabeto di 32 simboli = 60 bit di entropia (circa 10^18
// combinazioni), generati con un CSPRNG. Il server non conserva il codice in
// chiaro: salva solo un HMAC-SHA256 con un "pepper" segreto.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LEN = 12;
const PEPPER = process.env.CODE_PEPPER || crypto.createHash("sha256")
  .update("pepper:" + (process.env.RAILWAY_SERVICE_ID || "") + ":" + (process.env.RAILWAY_PROJECT_ID || "local") + ":" + (process.env.SESSION_SECRET || ""))
  .digest("hex");
function normalizeCode(raw) {
  return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function hashCode(raw) {
  return crypto.createHmac("sha256", PEPPER).update(normalizeCode(raw)).digest("hex");
}
function formatCode(code) {
  return code.match(/.{1,4}/g).join("-");
}
function randomAccessCode() {
  return randomCode(CODE_LEN, CODE_ALPHABET);
}

// Limitazione dei tentativi falliti per IP (finestra scorrevole di 15 minuti).
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILS = 8;
const failedLogins = new Map(); // ip -> [timestamp, ...]
function recentFails(ip) {
  const now = Date.now();
  const list = (failedLogins.get(ip) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  failedLogins.set(ip, list);
  return list;
}
setInterval(() => { for (const ip of failedLogins.keys()) recentFails(ip); }, 5 * 60 * 1000).unref();
function loginThrottle(req, res, next) {
  const fails = recentFails(req.ip);
  if (fails.length >= LOGIN_MAX_FAILS) {
    const retry = Math.ceil((LOGIN_WINDOW_MS - (Date.now() - fails[0])) / 1000);
    res.set("Retry-After", String(retry));
    return res.status(429).json({ error: "troppi tentativi, riprova tra " + Math.ceil(retry / 60) + " minuti" });
  }
  next();
}
function registerFail(ip) { recentFails(ip).push(Date.now()); }

// Limite semplice sulle registrazioni (anti-spam): 20 per ora per IP.
const registrations = new Map();
function registerThrottle(req, res, next) {
  const now = Date.now();
  const list = (registrations.get(req.ip) || []).filter((t) => now - t < 3600 * 1000);
  if (list.length >= 20) return res.status(429).json({ error: "troppe registrazioni da questo indirizzo, riprova piu' tardi" });
  list.push(now);
  registrations.set(req.ip, list);
  next();
}


// ---------- EMAIL: cifratura a riposo, invio (Resend), token ----------
// L'email e' cifrata con AES-256-GCM (chiave DATA_KEY, variabile d'ambiente segreta) e
// indicizzata con un HMAC (emailHash) per poterla cercare senza conservarla in chiaro.
const DATA_KEY_RAW = process.env.DATA_KEY || "";
if (!DATA_KEY_RAW) console.warn("ATTENZIONE: DATA_KEY non impostata, uso una chiave derivata (impostala su Railway).");
const DATA_KEY = crypto.createHash("sha256").update("datakey:" + (DATA_KEY_RAW || PEPPER)).digest();
const HASH_KEY = crypto.createHash("sha256").update("emailhash:" + (DATA_KEY_RAW || PEPPER)).digest();
function normEmail(e) { return String(e || "").trim().toLowerCase(); }
function validEmail(e) { return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(e) && e.length <= 254; }
function emailHash(e) { return crypto.createHmac("sha256", HASH_KEY).update(normEmail(e)).digest("hex"); }
function encryptEmail(e) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", DATA_KEY, iv);
  const ct = Buffer.concat([c.update(normEmail(e), "utf8"), c.final()]);
  return { iv: iv.toString("base64"), ct: ct.toString("base64"), tag: c.getAuthTag().toString("base64") };
}
function decryptEmail(enc) {
  const d = crypto.createDecipheriv("aes-256-gcm", DATA_KEY, Buffer.from(enc.iv, "base64"));
  d.setAuthTag(Buffer.from(enc.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(enc.ct, "base64")), d.final()]).toString("utf8");
}
function setProfileEmail(p, email) {
  p.emailEnc = encryptEmail(email);
  p.emailHash = emailHash(email);
  delete p.email;
}
function profileEmail(p) {
  try { return p.emailEnc ? decryptEmail(p.emailEnc) : (p.email || null); } catch (e) { return null; }
}
function sha256hex(x) { return crypto.createHash("sha256").update(x).digest("hex"); }
function newToken() { return crypto.randomBytes(32).toString("hex"); }

function baseUrl() {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/$/, "");
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return "https://" + process.env.RAILWAY_PUBLIC_DOMAIN;
  return "http://localhost:" + (process.env.PORT || 3000);
}
const MAIL_TEXT = {
  verify: { subject: "Conferma la tua email — Securmy", body: (u) => "Apri questo link per confermare la tua email (valido 24 ore):\n\n" + u + "\n\nSe non sei stato tu, ignora questo messaggio." },
  reset:  { subject: "Reimposta la password — Securmy", body: (u, id) => "Hai chiesto di reimpostare la password del profilo " + id + ". Apri questo link (valido 1 ora):\n\n" + u + "\n\nSe non sei stato tu, ignora questo messaggio: la password resta invariata." }
};
async function sendMail(to, kind, link, label) {
  const t = MAIL_TEXT[kind];
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("Email non inviata (RESEND_API_KEY mancante): tipo " + kind);
    if (!process.env.RAILWAY_ENVIRONMENT) console.log("[dev] link " + kind + ": " + link);
    return false;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Securmy <onboarding@resend.dev>",
        to: [to], subject: t.subject, text: t.body(link, label)
      })
    });
    if (!r.ok) console.error("Resend errore " + r.status + ": " + (await r.text()).slice(0, 200));
    return r.ok;
  } catch (e) { console.error("Resend:", e.message); return false; }
}
async function sendVerification(profile) {
  const token = newToken();
  profile.verifyTokenHash = sha256hex(token);
  profile.verifyExp = Date.now() + 24 * 3600 * 1000;
  store.save(store.load());
  return sendMail(profileEmail(profile), "verify", baseUrl() + "/app/?verify=" + token, profile.publicId);
}

// Throttle generico per le email (anti-spam): max N richieste/ora per chiave.
const mailHits = new Map();
function mailAllowed(key, max) {
  const now = Date.now();
  const list = (mailHits.get(key) || []).filter((t) => now - t < 3600 * 1000);
  if (list.length >= max) { mailHits.set(key, list); return false; }
  list.push(now); mailHits.set(key, list); return true;
}
setInterval(() => { for (const k of mailHits.keys()) mailAllowed(k, Infinity); }, 10 * 60 * 1000).unref();


// Username cifrato a riposo nel database (in memoria resta in chiaro per il login e la ricerca).
function encryptField(str) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", DATA_KEY, iv);
  const ct = Buffer.concat([c.update(String(str), "utf8"), c.final()]);
  return { iv: iv.toString("base64"), ct: ct.toString("base64"), tag: c.getAuthTag().toString("base64") };
}
function decryptField(enc) { return decryptEmail(enc); }
store.setProfileCodec({
  encode(p) {
    const o = Object.assign({}, p);
    if (o.username !== undefined) { o.usernameEnc = encryptField(o.username); delete o.username; }
    return o;
  },
  decode(o) {
    const p = Object.assign({}, o);
    if (p.usernameEnc) { try { p.username = decryptField(p.usernameEnc); } catch (e) { p.username = "?"; } delete p.usernameEnc; }
    return p;
  },
  isEncoded(o) { return !!o.usernameEnc; }
});

// Migrazione: i profili creati con la vecchia versione avevano il codice in chiaro.
// Li convertiamo in hash e rimuoviamo il testo in chiaro. I codici a 6 cifre
// restano validi (e protetti dal limite di tentativi) ma vengono marcati "deboli".
function migrateLegacyCodes() {
  const db = store.load();
  let changed = false;
  for (const p of db.profiles) {
    if (p.accessCode) {
      p.accessCodeHash = hashCode(p.accessCode);
      p.legacyWeakCode = normalizeCode(p.accessCode).length < CODE_LEN;
      delete p.accessCode;
      changed = true;
    }
  }
  for (const p of db.profiles) {
    if (p.email) { setProfileEmail(p, p.email); p.emailVerified = false; changed = true; }
  }
  if (changed) store.save(db);
}
function randomPublicId() {
  return randomCode(8, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789");
}
function randomSecretCombo() {
  return randomCode(5, "abcdefghjkmnpqrstuvwxyz23456789");
}

function requireAuth(req, res, next) {
  const token = req.headers["authorization"]?.replace("Bearer ", "") || req.body.token || req.query.token;
  const profileId = sessions.get(token);
  if (!profileId) return res.status(401).json({ error: "non autenticato" });
  req.profileId = profileId;
  req.token = token;
  next();
}

function publicProfile(p) {
  return {
    id: p.id,
    username: p.username,
    publicId: p.publicId,
    isCover: p.isCover,
    settings: p.settings,
    publicKey: p.publicKey || null,
    hasBiometric: !!(p.webauthnCredentials && p.webauthnCredentials.length),
    emailVerified: !!p.emailVerified,
    weakPassword: !!p.legacyWeakCode,
    has2fa: !!p.totpEnc
  };
}

function broadcastToProfile(profileId, payload) {
  const set = sockets.get(profileId);
  if (!set) return;
  for (const ws of set) {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
  }
}

// Origin/RP ID dinamici: funzionano sia su localhost (dev) sia su Railway (prod).
function rpInfo(req) {
  const host = req.hostname; // es. "localhost" o "messaging-app-prototype-production-ecb3.up.railway.app"
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  return {
    rpID: host,
    origin: `${proto}://${req.headers.host}`,
    rpName: "Securmy"
  };
}

// ---------- REGISTRAZIONE / LOGIN ----------

// Modello di accesso: USERNAME + PASSWORD. Lo stesso username puo' avere piu'
// profili (es. reale + copertura): la password decide quale profilo si apre.
// Password hashate con scrypt (salt per profilo). Tentativi limitati per IP
// e per username (anti brute-force anche distribuito).
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
function userKey(u) { return String(u || "").trim().toLowerCase(); }
function scryptAsync(pw, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(String(pw), salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) => err ? reject(err) : resolve(key));
  });
}
async function verifyPassword(p, password) {
  if (p.passHash && p.passSalt) {
    const key = await scryptAsync(password, Buffer.from(p.passSalt, "hex"));
    const h = Buffer.from(p.passHash, "hex");
    return h.length === key.length && crypto.timingSafeEqual(h, key);
  }
  if (p.accessCodeHash) { // profili legacy creati con il solo codice
    const cand = Buffer.from(hashCode(password), "hex");
    const h = Buffer.from(p.accessCodeHash, "hex");
    return h.length === cand.length && crypto.timingSafeEqual(h, cand);
  }
  return false;
}
const DUMMY_SALT = crypto.randomBytes(16);
const failedByUser = new Map(); // userKey -> [timestamp, ...]
const USER_MAX_FAILS = 10;
function userFails(k) {
  const now = Date.now();
  const list = (failedByUser.get(k) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
  failedByUser.set(k, list);
  return list;
}
setInterval(() => { for (const k of failedByUser.keys()) userFails(k); }, 5 * 60 * 1000).unref();

app.post("/api/register", registerThrottle, loginThrottle, async (req, res) => {
  const { email, username, password, isCover, acceptTerms } = req.body;
  if (acceptTerms !== true) return res.status(400).json({ error: "devi accettare i Termini di servizio e la Privacy Policy" });
  if (!email || !username || !password) return res.status(400).json({ error: "email, username e password obbligatori" });
  if (!validEmail(normEmail(email))) return res.status(400).json({ error: "email non valida" });
  const pw = String(password);
  if (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX) {
    return res.status(400).json({ error: "la password deve avere almeno " + PASSWORD_MIN + " caratteri" });
  }
  const key = userKey(username);
  if (key.length < 2 || key.length > 40) return res.status(400).json({ error: "username non valido" });

  const db = store.load();
  // Stesso username ammesso, ma NON con la stessa password di un profilo esistente
  // (altrimenti il login non saprebbe quale aprire). Il tentativo conta come
  // "fallito" per evitare che la registrazione diventi un oracolo di password.
  const same = db.profiles.filter((p) => userKey(p.username) === key);
  for (const p of same) {
    if (await verifyPassword(p, pw)) {
      registerFail(req.ip);
      userFails(key).push(Date.now());
      return res.status(409).json({ error: "scegli una password diversa" });
    }
  }
  const passSalt = crypto.randomBytes(16);
  const passHash = (await scryptAsync(pw, passSalt)).toString("hex");
  const profile = {
    id: uuidv4(),
    emailVerified: false,
    username: String(username).trim(),
    publicId: randomPublicId(),
    passSalt: passSalt.toString("hex"),
    passHash,
    secretCombo: randomSecretCombo(),
    isCover: !!isCover,
    settings: { notifications: "normal" },
    createdAt: Date.now(),
    termsAcceptedAt: Date.now(),
    publicKey: null,
    webauthnCredentials: []
  };
  setProfileEmail(profile, email);
  db.profiles.push(profile);
  store.save(db);
  if (mailAllowed("verify:" + req.ip, 10)) sendVerification(profile); // asincrono: non blocca la risposta

  // La combinazione segreta viene mostrata UNA VOLTA sola.
  res.json({
    profileId: profile.id,
    publicId: profile.publicId,
    secretCombo: profile.secretCombo
  });
});

app.post("/api/login", loginThrottle, async (req, res) => {
  const { username, password } = req.body;
  const key = userKey(username);
  if (!key || !password) return res.status(400).json({ error: "username e password obbligatori" });
  const pw = String(password).slice(0, PASSWORD_MAX);

  if (userFails(key).length >= USER_MAX_FAILS) {
    return res.status(429).json({ error: "troppi tentativi per questo username, riprova piu' tardi" });
  }

  const db = store.load();
  const candidates = db.profiles.filter((p) => userKey(p.username) === key);
  let profile = null;
  if (!candidates.length) {
    await scryptAsync(pw, DUMMY_SALT); // stesso costo temporale anche per username inesistenti
  } else {
    for (const p of candidates) {
      if (await verifyPassword(p, pw)) { profile = p; break; }
    }
  }
  if (!profile) {
    registerFail(req.ip);
    userFails(key).push(Date.now());
    await new Promise((r) => setTimeout(r, 400)); // rallenta il brute force
    return res.status(401).json({ error: "credenziali non valide" });
  }

  // Profilo legacy (codice HMAC): conosciamo ora la password in chiaro, quindi la
  // convertiamo subito in hash scrypt e rimuoviamo l'hash HMAC.
  if (!profile.passHash && profile.accessCodeHash) {
    const salt = crypto.randomBytes(16);
    profile.passSalt = salt.toString("hex");
    profile.passHash = (await scryptAsync(pw, salt)).toString("hex");
    delete profile.accessCodeHash;
    if (pw.length >= PASSWORD_MIN) delete profile.legacyWeakCode; else profile.legacyWeakCode = true;
    store.save(store.load());
  }
  if (profile.totpEnc) {
    const code = String(req.body.totp || "").trim();
    if (!code) return res.json({ need2fa: true });
    let secret = null; try { secret = decryptField(profile.totpEnc); } catch (e) {}
    const step = secret ? totpCheck(secret, code) : null;
    if (step === null || step <= (profile.totpLast || 0)) {
      registerFail(req.ip); userFails(key).push(Date.now());
      await new Promise((r) => setTimeout(r, 400));
      return res.status(401).json({ error: "codice di verifica non valido" });
    }
    profile.totpLast = step; store.save(store.load());
  }
  const token = uuidv4();
  sessions.set(token, profile.id);
  res.json({ token, profile: publicProfile(profile) });
});

// ---------- EMAIL: verifica, recupero e cambio password ----------

app.post("/api/email/verify", loginThrottle, (req, res) => {
  const token = String(req.body.token || "");
  const h = sha256hex(token);
  const db = store.load();
  const p = db.profiles.find((x) => x.verifyTokenHash && x.verifyTokenHash === h);
  if (!p || (p.verifyExp || 0) < Date.now()) { registerFail(req.ip); return res.status(400).json({ error: "link non valido o scaduto" }); }
  p.emailVerified = true;
  delete p.verifyTokenHash; delete p.verifyExp;
  store.save(db);
  res.json({ ok: true });
});

app.post("/api/email/resend", requireAuth, async (req, res) => {
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  if (p.emailVerified) return res.json({ ok: true });
  if (!mailAllowed("resend:" + p.id, 3)) return res.status(429).json({ error: "troppe richieste, riprova piu' tardi" });
  await sendVerification(p);
  res.json({ ok: true });
});

// Recupero: risposta SEMPRE identica (non rivela se email/username esistono).
// Solo i profili con email verificata possono essere recuperati.
app.post("/api/password/forgot", async (req, res) => {
  const email = normEmail(req.body.email);
  const key = userKey(req.body.username);
  res.json({ ok: true });
  if (!validEmail(email) || !key) return;
  if (!mailAllowed("forgot-ip:" + req.ip, 5) || !mailAllowed("forgot-mail:" + emailHash(email), 3)) return;
  const db = store.load();
  const eh = emailHash(email);
  const matches = db.profiles.filter((p) => p.emailHash === eh && p.emailVerified && userKey(p.username) === key).slice(0, 5);
  for (const p of matches) {
    const token = newToken();
    p.resetTokenHash = sha256hex(token);
    p.resetExp = Date.now() + 3600 * 1000;
    store.save(db);
    await sendMail(email, "reset", baseUrl() + "/app/?reset=" + token, p.publicId);
  }
});

app.post("/api/password/reset", loginThrottle, async (req, res) => {
  const token = String(req.body.token || "");
  const pw = String(req.body.password || "");
  if (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX) {
    return res.status(400).json({ error: "la password deve avere almeno " + PASSWORD_MIN + " caratteri" });
  }
  const h = sha256hex(token);
  const db = store.load();
  const p = db.profiles.find((x) => x.resetTokenHash && x.resetTokenHash === h);
  if (!p || (p.resetExp || 0) < Date.now()) { registerFail(req.ip); return res.status(400).json({ error: "link non valido o scaduto" }); }
  for (const o of db.profiles) {
    if (o.id !== p.id && userKey(o.username) === userKey(p.username) && await verifyPassword(o, pw)) {
      return res.status(409).json({ error: "scegli una password diversa" });
    }
  }
  const salt = crypto.randomBytes(16);
  p.passSalt = salt.toString("hex");
  p.passHash = (await scryptAsync(pw, salt)).toString("hex");
  delete p.accessCodeHash; delete p.legacyWeakCode; delete p.resetTokenHash; delete p.resetExp;
  store.save(db);
  sessions.deleteByProfile(p.id); // chiude tutte le sessioni aperte
  res.json({ ok: true });
});

app.post("/api/password/change", requireAuth, async (req, res) => {
  const oldPw = String(req.body.oldPassword || "");
  const pw = String(req.body.newPassword || "");
  if (pw.length < PASSWORD_MIN || pw.length > PASSWORD_MAX) {
    return res.status(400).json({ error: "la password deve avere almeno " + PASSWORD_MIN + " caratteri" });
  }
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  if (!(await verifyPassword(p, oldPw))) {
    registerFail(req.ip);
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({ error: "password attuale errata" });
  }
  for (const o of db.profiles) {
    if (o.id !== p.id && userKey(o.username) === userKey(p.username) && await verifyPassword(o, pw)) {
      return res.status(409).json({ error: "scegli una password diversa" });
    }
  }
  const salt = crypto.randomBytes(16);
  p.passSalt = salt.toString("hex");
  p.passHash = (await scryptAsync(pw, salt)).toString("hex");
  delete p.accessCodeHash; delete p.legacyWeakCode;
  store.save(db);
  sessions.deleteByProfile(p.id, req.token); // chiude le altre sessioni, mantiene questa
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  res.json(publicProfile(profile));
});

// ---------- CHIAVE PUBBLICA E2E ----------
// Il client genera una coppia di chiavi ECDH (P-256) con la Web Crypto API
// e carica QUI solo la chiave pubblica. La chiave privata non lascia mai
// il browser (vedi public/crypto.js).

app.post("/api/me/publickey", requireAuth, (req, res) => {
  const { publicKeyJwk } = req.body;
  if (!publicKeyJwk || publicKeyJwk.kty !== "EC") {
    return res.status(400).json({ error: "chiave pubblica JWK (EC) non valida" });
  }
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  profile.publicKey = publicKeyJwk;
  store.save(db);
  res.json({ ok: true });
});

app.get("/api/profile/:profileId/publickey", requireAuth, (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.params.profileId);
  if (!profile) return res.status(404).json({ error: "profilo non trovato" });
  res.json({ publicKey: profile.publicKey || null });
});


// ---------- PREKEY (forward secrecy) ----------
// Ogni client carica un lotto di chiavi pubbliche monouso ("prekey"). Per ogni
// messaggio il mittente ne preleva UNA (il server la elimina subito) e deriva una
// chiave nuova con X3DH (3 scambi ECDH). Il destinatario, dopo aver decifrato,
// cancella la corrispondente chiave privata: il messaggio non e' piu' decifrabile
// nemmeno con le chiavi di lungo periodo.
const PREKEY_MAX = 100;
app.post("/api/prekeys", requireAuth, (req, res) => {
  const keys = Array.isArray(req.body.keys) ? req.body.keys : [];
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  p.prekeys = p.prekeys || [];
  for (const k of keys) {
    if (p.prekeys.length >= PREKEY_MAX) break;
    if (!k || typeof k.id !== "string" || k.id.length > 64 || !k.pub || k.pub.kty !== "EC") continue;
    if (p.prekeys.some((x) => x.id === k.id)) continue;
    p.prekeys.push({ id: k.id, pub: { kty: k.pub.kty, crv: k.pub.crv, x: k.pub.x, y: k.pub.y } });
  }
  store.save(db);
  res.json({ count: p.prekeys.length });
});

app.get("/api/prekeys/count", requireAuth, (req, res) => {
  const p = store.load().profiles.find((x) => x.id === req.profileId);
  res.json({ count: (p.prekeys || []).length });
});

app.post("/api/prekeys/claim/:profileId", requireAuth, (req, res) => {
  if (!mailAllowed("claim:" + req.profileId, 600)) return res.status(429).json({ error: "troppe richieste" });
  const db = store.load();
  const shares = db.chats.some((c) => c.memberIds.includes(req.profileId) && c.memberIds.includes(req.params.profileId));
  if (!shares) return res.status(403).json({ error: "non autorizzato" });
  const target = db.profiles.find((x) => x.id === req.params.profileId);
  if (!target) return res.status(404).json({ error: "profilo non trovato" });
  const k = (target.prekeys || []).shift() || null; // monouso: rimossa alla consegna
  if (k) store.save(db);
  res.json({ prekey: k });
});

// ---------- CONTATTI ----------


app.get("/api/contacts", requireAuth, (req, res) => {
  const db = store.load();
  const mine = db.contacts.filter((c) => c.profileId === req.profileId);
  const result = mine.map((c) => {
    const p = db.profiles.find((pr) => pr.id === c.contactProfileId);
    return { profileId: p.id, username: p.username, publicId: p.publicId, publicKey: p.publicKey || null, blocked: c.blocked, muted: c.muted };
  });
  res.json(result);
});

app.post("/api/contacts/add", requireAuth, (req, res) => {
  const { publicId } = req.body;
  const db = store.load();
  const target = db.profiles.find((p) => p.publicId === publicId.toUpperCase());
  if (!target) return res.status(404).json({ error: "ID pubblico non trovato" });
  if (target.id === req.profileId) return res.status(400).json({ error: "non puoi aggiungere te stesso" });

  const exists = db.contacts.find((c) => c.profileId === req.profileId && c.contactProfileId === target.id);
  if (!exists) {
    db.contacts.push({ profileId: req.profileId, contactProfileId: target.id, blocked: false, muted: false });
  }
  // reciprocita' automatica per semplicita' del prototipo
  const reciprocal = db.contacts.find((c) => c.profileId === target.id && c.contactProfileId === req.profileId);
  if (!reciprocal) {
    db.contacts.push({ profileId: target.id, contactProfileId: req.profileId, blocked: false, muted: false });
  }

  let chat = db.chats.find(
    (c) => c.memberIds.includes(req.profileId) && c.memberIds.includes(target.id)
  );
  if (!chat) {
    chat = { id: uuidv4(), memberIds: [req.profileId, target.id], hiddenFor: {} };
    db.chats.push(chat);
  }
  store.save(db);
  res.json({
    contact: { profileId: target.id, username: target.username, publicId: target.publicId, publicKey: target.publicKey || null },
    chatId: chat.id
  });
});

app.post("/api/contacts/:contactProfileId/block", requireAuth, (req, res) => {
  const db = store.load();
  const c = db.contacts.find((c) => c.profileId === req.profileId && c.contactProfileId === req.params.contactProfileId);
  if (!c) return res.status(404).json({ error: "contatto non trovato" });
  c.blocked = !!req.body.blocked;
  store.save(db);
  res.json({ ok: true });
});

app.post("/api/contacts/:contactProfileId/mute", requireAuth, (req, res) => {
  const db = store.load();
  const c = db.contacts.find((c) => c.profileId === req.profileId && c.contactProfileId === req.params.contactProfileId);
  if (!c) return res.status(404).json({ error: "contatto non trovato" });
  c.muted = !!req.body.muted;
  store.save(db);
  res.json({ ok: true });
});

// ---------- CHAT ----------

app.get("/api/chats", requireAuth, (req, res) => {
  const db = store.load();
  const combo = req.query.combo;
  const me = db.profiles.find((p) => p.id === req.profileId);
  const comboUnlocked = combo && combo === me.secretCombo;

  const mine = db.chats.filter((c) => c.memberIds.includes(req.profileId));
  const visible = mine.filter((c) => {
    const isHidden = !!c.hiddenFor[req.profileId];
    return !isHidden || comboUnlocked;
  });

  const result = visible.map((c) => {
    const otherId = c.memberIds.find((id) => id !== req.profileId);
    const other = db.profiles.find((p) => p.id === otherId);
    const msgs = db.messages.filter((m) => m.chatId === c.id).sort((a, b) => a.createdAt - b.createdAt);
    const last = msgs[msgs.length - 1];
    return {
      id: c.id,
      with: { profileId: other.id, username: other.username, publicId: other.publicId, publicKey: other.publicKey || null },
      hidden: !!c.hiddenFor[req.profileId],
      blockedByMe: db.contacts.some((x) => x.profileId === req.profileId && x.contactProfileId === other.id && x.blocked),
      lastMessage: last ? { id: last.id, senderProfileId: last.senderProfileId, iv: last.iv, ciphertext: last.ciphertext, hdr: last.hdr || null, createdAt: last.createdAt } : null
    };
  });
  res.json({ chats: result, comboUnlocked: !!comboUnlocked });
});

app.post("/api/chats/:chatId/hide", requireAuth, (req, res) => {
  const db = store.load();
  const chat = db.chats.find((c) => c.id === req.params.chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(404).json({ error: "chat non trovata" });
  chat.hiddenFor[req.profileId] = !!req.body.hidden;
  store.save(db);
  res.json({ ok: true });
});

app.get("/api/chats/:chatId/messages", requireAuth, (req, res) => {
  const db = store.load();
  const chat = db.chats.find((c) => c.id === req.params.chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(404).json({ error: "chat non trovata" });
  const msgs = db.messages
    .filter((m) => m.chatId === chat.id)
    .filter((m) => !m.selfDestructAt || m.selfDestructAt > Date.now())
    .sort((a, b) => a.createdAt - b.createdAt);
  res.json({ messages: msgs });
});

// ---------- MESSAGGI (cifrati E2E) ----------
// Il server riceve e salva solo { iv, ciphertext }: non vede mai il testo
// in chiaro dei messaggi. iv e ciphertext sono stringhe base64 prodotte da
// AES-GCM lato client con la chiave derivata via ECDH (vedi crypto.js).

app.post("/api/messages", requireAuth, (req, res) => {
  const { chatId, iv, ciphertext, replyTo, selfDestructSeconds } = req.body;
  const hdr = typeof req.body.hdr === "string" && req.body.hdr.length <= 2000 ? req.body.hdr : null;
  const db = store.load();
  const chat = db.chats.find((c) => c.id === chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(404).json({ error: "chat non trovata" });
  if (!iv || !ciphertext) return res.status(400).json({ error: "messaggio cifrato mancante (iv/ciphertext)" });
  const otherId = chat.memberIds.find((id) => id !== req.profileId);
  const blocked = db.contacts.some((c) => c.blocked && ((c.profileId === req.profileId && c.contactProfileId === otherId) || (c.profileId === otherId && c.contactProfileId === req.profileId)));
  if (blocked) return res.status(403).json({ error: "conversazione bloccata" });

  const msg = {
    id: uuidv4(),
    chatId,
    senderProfileId: req.profileId,
    iv,
    ciphertext,
    hdr, // intestazione E2E v2 (chiave effimera + id prekey), in chiaro: non contiene segreti
    replyTo: replyTo || null,
    reactions: {},
    createdAt: Date.now(),
    selfDestructAt: selfDestructSeconds ? Date.now() + selfDestructSeconds * 1000 : null
  };
  db.messages.push(msg);
  store.save(db);

  for (const memberId of chat.memberIds) {
    broadcastToProfile(memberId, { type: "message", chatId, message: msg });
  }
  res.json({ message: msg });
});

app.post("/api/messages/:id/react", requireAuth, (req, res) => {
  const { emoji } = req.body;
  const db = store.load();
  const msg = db.messages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "messaggio non trovato" });
  const chat = db.chats.find((c) => c.id === msg.chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(403).json({ error: "non autorizzato" });

  msg.reactions[emoji] = msg.reactions[emoji] || [];
  const idx = msg.reactions[emoji].indexOf(req.profileId);
  if (idx >= 0) msg.reactions[emoji].splice(idx, 1);
  else msg.reactions[emoji].push(req.profileId);
  store.save(db);

  for (const memberId of chat.memberIds) {
    broadcastToProfile(memberId, { type: "reaction", chatId: chat.id, messageId: msg.id, reactions: msg.reactions });
  }
  res.json({ reactions: msg.reactions });
});


// ---------- SEGNALAZIONI E ELIMINAZIONE ACCOUNT ----------
// Le segnalazioni NON contengono il testo dei messaggi (sono cifrati end-to-end):
// solo categoria, nota facoltativa scritta dall'utente e identificativi.
const REPORT_REASONS = ["spam", "abuse", "illegal", "other"];
app.post("/api/report", requireAuth, (req, res) => {
  const { profileId, reason, note } = req.body;
  if (!REPORT_REASONS.includes(reason)) return res.status(400).json({ error: "motivo non valido" });
  if (!mailAllowed("report:" + req.profileId, 20)) return res.status(429).json({ error: "troppe segnalazioni" });
  const db = store.load();
  const shares = db.chats.some((c) => c.memberIds.includes(req.profileId) && c.memberIds.includes(profileId));
  if (!shares) return res.status(403).json({ error: "non autorizzato" });
  db.reports.push({
    id: uuidv4(), reporterId: req.profileId, reportedId: profileId, reason,
    note: typeof note === "string" ? note.slice(0, 500) : "", createdAt: Date.now()
  });
  const c = db.contacts.find((x) => x.profileId === req.profileId && x.contactProfileId === profileId);
  if (c) c.blocked = true; // chi segnala blocca automaticamente
  store.save(db);
  res.json({ ok: true });
});

app.post("/api/account/delete", requireAuth, async (req, res) => {
  const db = store.load();
  const me = db.profiles.find((p) => p.id === req.profileId);
  if (!me || !(await verifyPassword(me, String(req.body.password || "")))) {
    return res.status(403).json({ error: "password errata" });
  }
  const id = req.profileId;
  const chatIds = new Set(db.chats.filter((c) => c.memberIds.includes(id)).map((c) => c.id));
  db.messages = db.messages.filter((m) => !chatIds.has(m.chatId));
  db.chats = db.chats.filter((c) => !chatIds.has(c.id));
  db.contacts = db.contacts.filter((c) => c.profileId !== id && c.contactProfileId !== id);
  db.reports = db.reports.filter((r) => r.reporterId !== id);
  db.profiles = db.profiles.filter((p) => p.id !== id);
  store.sessions.deleteByProfile(id, "");
  store.save(db);
  syncApi.onAccountDelete(id).catch(() => {});
  res.json({ ok: true });
});


app.post("/api/settings/notifications", requireAuth, (req, res) => {
  const { mode } = req.body; // normal | no-content | alert-only | off
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  profile.settings.notifications = mode;
  store.save(db);
  res.json({ ok: true });
});

// ---------- SBLOCCO BIOMETRICO (WebAuthn / passkey di piattaforma) ----------
// Flusso reale FIDO2/WebAuthn tramite @simplewebauthn/server:
// 1) il profilo, gia' autenticato col codice, registra una passkey legata
//    a Face ID / Touch ID / impronta del dispositivo;
// 2) alle aperture successive, l'app prova prima la passkey (navigator
//    .credentials.get) ed effettua il login senza digitare il codice.
// Il server non riceve MAI dati biometrici: solo chiave pubblica e firme.

app.post("/api/webauthn/register-options", requireAuth, async (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  const { rpID, rpName } = rpInfo(req);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: Buffer.from(profile.id),
    userName: profile.username,
    userDisplayName: profile.username,
    attestationType: "none",
    excludeCredentials: (profile.webauthnCredentials || []).map((c) => ({ id: c.id })),
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "preferred"
    }
  });

  db.webauthnChallenges[profile.id] = { challenge: options.challenge, type: "registration", createdAt: Date.now() };
  store.save(db);
  res.json(options);
});

app.post("/api/webauthn/register-verify", requireAuth, async (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  const pending = db.webauthnChallenges[profile.id];
  const { rpID, origin } = rpInfo(req);
  if (!pending || pending.type !== "registration") {
    return res.status(400).json({ error: "nessuna registrazione biometrica in corso" });
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: pending.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });
    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: "verifica passkey fallita" });
    }
    const { credential } = verification.registrationInfo;
    profile.webauthnCredentials.push({
      id: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString("base64"),
      counter: credential.counter,
      transports: credential.transports || [],
      deviceLabel: req.body.deviceLabel || "Questo dispositivo",
      createdAt: Date.now()
    });
    delete db.webauthnChallenges[profile.id];
    store.save(db);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "registrazione passkey non valida: " + err.message });
  }
});

app.post("/api/webauthn/login-options", loginThrottle, async (req, res) => {
  const { rpID } = rpInfo(req);
  const db = store.load();

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "required"
  });

  // Challenge temporanea non legata ancora a un profilo: verra' risolta
  // dal credential id restituito dal dispositivo in fase di verifica.
  db.webauthnChallenges["__anonymous__"] = { challenge: options.challenge, type: "authentication", createdAt: Date.now() };
  store.save(db);
  res.json(options);
});

app.post("/api/webauthn/login-verify", loginThrottle, async (req, res) => {
  const db = store.load();
  const pending = db.webauthnChallenges["__anonymous__"];
  const { rpID, origin } = rpInfo(req);
  if (!pending || pending.type !== "authentication") {
    return res.status(400).json({ error: "nessun login biometrico in corso" });
  }

  const credentialId = req.body.id;
  const profile = db.profiles.find((p) => (p.webauthnCredentials || []).some((c) => c.id === credentialId));
  if (!profile) { registerFail(req.ip); return res.status(404).json({ error: "passkey non riconosciuta su questo server" }); }
  const savedCred = profile.webauthnCredentials.find((c) => c.id === credentialId);

  try {
    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: pending.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: savedCred.id,
        publicKey: Buffer.from(savedCred.publicKey, "base64"),
        counter: savedCred.counter,
        transports: savedCred.transports || []
      }
    });
    if (!verification.verified) { registerFail(req.ip); return res.status(400).json({ error: "verifica biometrica fallita" }); }

    savedCred.counter = verification.authenticationInfo.newCounter;
    delete db.webauthnChallenges["__anonymous__"];
    store.save(db);

    const token = uuidv4();
    sessions.set(token, profile.id);
    res.json({ token, profile: publicProfile(profile) });
  } catch (err) {
    registerFail(req.ip);
    res.status(400).json({ error: "login biometrico non valido: " + err.message });
  }
});

app.post("/api/webauthn/disable", requireAuth, (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  profile.webauthnCredentials = [];
  store.save(db);
  res.json({ ok: true });
});

// ---------- MESSAGGI A VISUALIZZAZIONE SINGOLA ----------
// Il destinatario, dopo aver aperto il messaggio, ne avvia la distruzione: il server lo
// elimina dopo pochi secondi (il testo e' comunque cifrato end-to-end).
app.post("/api/messages/:id/burn", requireAuth, (req, res) => {
  const db = store.load();
  const msg = db.messages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: "messaggio non trovato" });
  const chat = db.chats.find((c) => c.id === msg.chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(403).json({ error: "non autorizzato" });
  if (msg.senderProfileId === req.profileId) return res.status(403).json({ error: "solo il destinatario" });
  const sec = Math.min(60, Math.max(5, Number(req.body.seconds) || 10));
  const at = Date.now() + sec * 1000;
  if (!msg.selfDestructAt || msg.selfDestructAt > at) msg.selfDestructAt = at;
  store.save(db);
  for (const memberId of chat.memberIds) {
    broadcastToProfile(memberId, { type: "burn", chatId: chat.id, messageId: msg.id, at: msg.selfDestructAt });
  }
  res.json({ ok: true, at: msg.selfDestructAt });
});

// ---------- VERIFICA IN DUE PASSAGGI (TOTP, RFC 6238) ----------
// Il segreto e' cifrato a riposo (AES-256-GCM). Compatibile con qualsiasi app di
// autenticazione (Google Authenticator, Aegis, 1Password...).
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function b32encode(buf) {
  let bits = 0, val = 0, out = "";
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
function b32decode(str) {
  let bits = 0, val = 0; const out = [];
  for (const ch of String(str).toUpperCase().replace(/=+$/, "")) {
    const i = B32.indexOf(ch); if (i < 0) continue;
    val = (val << 5) | i; bits += 5;
    if (bits >= 8) { out.push((val >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(out);
}
function totpAt(secretB32, step) {
  const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(step));
  const h = crypto.createHmac("sha1", b32decode(secretB32)).update(buf).digest();
  const o = h[h.length - 1] & 15;
  const n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 1000000).padStart(6, "0");
}
// ritorna lo step valido (finestra +-1) oppure null
function totpCheck(secretB32, code) {
  const c = String(code || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(c)) return null;
  const now = Math.floor(Date.now() / 30000);
  for (const d of [0, -1, 1]) {
    const exp = Buffer.from(totpAt(secretB32, now + d)), got = Buffer.from(c);
    if (crypto.timingSafeEqual(exp, got)) return now + d;
  }
  return null;
}
app.post("/api/2fa/setup", requireAuth, (req, res) => {
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  if (p.totpEnc) return res.status(409).json({ error: "gia' attiva" });
  const secret = b32encode(crypto.randomBytes(20));
  p.totpPendingEnc = encryptField(secret);
  store.save(db);
  const uri = "otpauth://totp/Securmy:" + encodeURIComponent(p.username) + "?secret=" + secret + "&issuer=Securmy&algorithm=SHA1&digits=6&period=30";
  res.json({ secret, uri });
});
app.post("/api/2fa/enable", requireAuth, (req, res) => {
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  if (!p.totpPendingEnc) return res.status(400).json({ error: "avvia prima la configurazione" });
  let secret; try { secret = decryptField(p.totpPendingEnc); } catch { return res.status(400).json({ error: "configurazione non valida" }); }
  const step = totpCheck(secret, req.body.code);
  if (step === null) { registerFail(req.ip); return res.status(400).json({ error: "codice non valido" }); }
  p.totpEnc = p.totpPendingEnc; p.totpLast = step; delete p.totpPendingEnc;
  store.save(db);
  res.json({ ok: true });
});
app.post("/api/2fa/disable", requireAuth, async (req, res) => {
  const db = store.load();
  const p = db.profiles.find((x) => x.id === req.profileId);
  if (!p.totpEnc) return res.json({ ok: true });
  if (!(await verifyPassword(p, String(req.body.password || "")))) { registerFail(req.ip); return res.status(403).json({ error: "password errata" }); }
  let secret; try { secret = decryptField(p.totpEnc); } catch { secret = null; }
  if (!secret || totpCheck(secret, req.body.code) === null) { registerFail(req.ip); return res.status(403).json({ error: "codice non valido" }); }
  delete p.totpEnc; delete p.totpLast;
  store.save(db);
  res.json({ ok: true });
});

// ---------- INVIO FILE PEER-TO-PEER VIA LINK (solo segnalazione) ----------
// Il file NON passa dal server: viaggia direttamente tra i due dispositivi (WebRTC) ed
// e' cifrato con una chiave che sta solo nel frammento (#) del link, mai inviato al server.
// Qui transitano soltanto le informazioni di connessione (SDP), per al massimo 1 ora.
const p2pSessions = new Map(); // id -> { owner, offer, answer, joined, expires }
function rate(key, max, ms) {
  const now = Date.now();
  const list = (rateHits.get(key) || []).filter((t) => now - t < ms);
  if (list.length >= max) { rateHits.set(key, list); return false; }
  list.push(now); rateHits.set(key, list); return true;
}
const rateHits = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of p2pSessions) if (s.expires < now) p2pSessions.delete(id);
  for (const k of rateHits.keys()) rate(k, Infinity, 3600 * 1000);
}, 60 * 1000).unref();
const P2P_ID = /^[A-Za-z0-9_-]{22}$/;
app.post("/api/p2p", requireAuth, (req, res) => {
  const mine = [...p2pSessions.values()].filter((s) => s.owner === req.profileId && s.expires > Date.now()).length;
  if (mine >= 5 || p2pSessions.size >= 2000) return res.status(429).json({ error: "troppi link attivi" });
  const minutes = [10, 60].includes(Number(req.body.minutes)) ? Number(req.body.minutes) : 10;
  const id = crypto.randomBytes(16).toString("base64url");
  p2pSessions.set(id, { owner: req.profileId, offer: null, answer: null, joined: false, expires: Date.now() + minutes * 60 * 1000 });
  res.json({ id, expires: p2pSessions.get(id).expires });
});
app.post("/api/p2p/:id/offer", requireAuth, (req, res) => {
  const s = p2pSessions.get(req.params.id);
  if (!s || s.owner !== req.profileId || s.expires < Date.now()) return res.status(404).json({ error: "link scaduto" });
  if (typeof req.body.sdp !== "string" || req.body.sdp.length > 60000) return res.status(400).json({ error: "dati non validi" });
  s.offer = req.body.sdp;
  res.json({ ok: true });
});
app.get("/api/p2p/:id/state", requireAuth, (req, res) => {
  const s = p2pSessions.get(req.params.id);
  if (!s || s.owner !== req.profileId || s.expires < Date.now()) return res.status(404).json({ error: "link scaduto" });
  res.set("Cache-Control", "no-store");
  res.json({ joined: s.joined, answer: s.answer });
});
app.delete("/api/p2p/:id", requireAuth, (req, res) => {
  const s = p2pSessions.get(req.params.id);
  if (s && s.owner === req.profileId) p2pSessions.delete(req.params.id);
  res.json({ ok: true });
});
// parte pubblica (il destinatario non ha bisogno di un account)
app.get("/api/p2p/:id/offer", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!P2P_ID.test(req.params.id) || !rate("p2pget:" + req.ip, 120, 10 * 60 * 1000)) return res.status(404).json({ error: "link non valido" });
  const s = p2pSessions.get(req.params.id);
  if (!s || s.expires < Date.now() || s.answer) return res.status(404).json({ error: "link scaduto o gia' usato" });
  if (!s.offer) return res.status(425).json({ error: "il mittente non e' ancora pronto" });
  s.joined = true;
  res.json({ sdp: s.offer, expires: s.expires });
});
app.post("/api/p2p/:id/answer", (req, res) => {
  if (!P2P_ID.test(req.params.id) || !rate("p2ppost:" + req.ip, 30, 10 * 60 * 1000)) return res.status(404).json({ error: "link non valido" });
  const s = p2pSessions.get(req.params.id);
  if (!s || s.expires < Date.now() || s.answer || !s.offer) return res.status(404).json({ error: "link scaduto o gia' usato" });
  if (typeof req.body.sdp !== "string" || req.body.sdp.length > 60000) return res.status(400).json({ error: "dati non validi" });
  s.answer = req.body.sdp; // un solo destinatario: da qui in poi il link non e' piu' utilizzabile
  res.json({ ok: true });
});

// Server ICE per P2P e chiamate. STUN pubblico di default; un TURN proprio (TURN_URL,
// TURN_USER, TURN_PASS) nasconde l'IP dei partecipanti e funziona anche dietro NAT rigidi.
app.get("/api/ice", async (req, res) => {
  const { servers, turn } = await syncMod.iceServers();
  res.set("Cache-Control", "no-store");
  const relay = turn && (process.env.TURN_RELAY_ONLY === "1" || req.query.relay === "1");
  res.json({ iceServers: servers, turn, relayOnly: !!relay });
});
const syncApi = syncMod.mount(app, { requireAuth, store, rate, baseUrl, express });

// ---------- WEBSOCKET ----------

wss.on("connection", (ws) => {
  let boundProfileId = null;

  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (data.type === "auth") {
      const profileId = sessions.get(data.token);
      if (!profileId) return;
      boundProfileId = profileId;
      if (!sockets.has(profileId)) sockets.set(profileId, new Set());
      sockets.get(profileId).add(ws);
      return;
    }
    // segnalazione chiamate cifrate (WebRTC DTLS-SRTP): inoltro solo tra contatti con chat attiva e non bloccati
    if (boundProfileId && ["call-offer", "call-answer", "call-ice", "call-end", "call-reject"].includes(data.type) && typeof data.to === "string") {
      if (!rate("ws:" + boundProfileId, 240, 60 * 1000)) return;
      const db = store.load();
      const shares = db.chats.some((c) => c.memberIds.includes(boundProfileId) && c.memberIds.includes(data.to));
      const blocked = db.contacts.some((c) => c.blocked && ((c.profileId === boundProfileId && c.contactProfileId === data.to) || (c.profileId === data.to && c.contactProfileId === boundProfileId)));
      if (!shares || blocked) return;
      const me = db.profiles.find((p) => p.id === boundProfileId);
      const payload = JSON.stringify(data.payload || null);
      if (payload.length > 60000) return;
      broadcastToProfile(data.to, { type: data.type, from: boundProfileId, fromName: me ? me.username : "", payload: data.payload || null, video: !!data.video });
    }
  });

  ws.on("close", () => {
    if (boundProfileId && sockets.has(boundProfileId)) {
      sockets.get(boundProfileId).delete(ws);
    }
  });
});

const PORT = process.env.PORT || 3000;
store.init().then(() => {
  migrateLegacyCodes();
  server.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
}).catch((e) => { console.error("Avvio fallito:", e); process.exit(1); });

async function shutdown() {
  try { await store.close(); } finally { process.exit(0); }
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
