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

const app = express();
app.set("trust proxy", 1); // dietro il proxy di Railway: req.ip e' l'IP reale del client
app.use(express.json({ limit: "256kb" }));

// Sito di presentazione (landing IT/EN) servito sulla root.
app.use(express.static(path.join(__dirname, "site")));

// App funzionante (prototipo chat) servita sotto /app.
app.use("/app", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// sessioni in memoria: token -> profileId
const sessions = new Map();
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

// Migrazione: i profili creati con la vecchia versione avevano il codice in chiaro.
// Li convertiamo in hash e rimuoviamo il testo in chiaro. I codici a 6 cifre
// restano validi (e protetti dal limite di tentativi) ma vengono marcati "deboli".
(function migrateLegacyCodes() {
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
  if (changed) store.save(db);
})();
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
    hasBiometric: !!(p.webauthnCredentials && p.webauthnCredentials.length)
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
    rpName: "Messaggistica Privata"
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
  const { email, username, password, isCover } = req.body;
  if (!email || !username || !password) return res.status(400).json({ error: "email, username e password obbligatori" });
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
    email,
    username: String(username).trim(),
    publicId: randomPublicId(),
    passSalt: passSalt.toString("hex"),
    passHash,
    secretCombo: randomSecretCombo(),
    isCover: !!isCover,
    settings: { notifications: "normal" },
    createdAt: Date.now(),
    publicKey: null,
    webauthnCredentials: []
  };
  db.profiles.push(profile);
  store.save(db);

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

  const token = uuidv4();
  sessions.set(token, profile.id);
  res.json({ token, profile: publicProfile(profile) });
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
      lastMessage: last ? { iv: last.iv, ciphertext: last.ciphertext, createdAt: last.createdAt } : null
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
  const db = store.load();
  const chat = db.chats.find((c) => c.id === chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(404).json({ error: "chat non trovata" });
  if (!iv || !ciphertext) return res.status(400).json({ error: "messaggio cifrato mancante (iv/ciphertext)" });

  const msg = {
    id: uuidv4(),
    chatId,
    senderProfileId: req.profileId,
    iv,
    ciphertext,
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

app.post("/api/webauthn/login-options", async (req, res) => {
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

app.post("/api/webauthn/login-verify", async (req, res) => {
  const db = store.load();
  const pending = db.webauthnChallenges["__anonymous__"];
  const { rpID, origin } = rpInfo(req);
  if (!pending || pending.type !== "authentication") {
    return res.status(400).json({ error: "nessun login biometrico in corso" });
  }

  const credentialId = req.body.id;
  const profile = db.profiles.find((p) => (p.webauthnCredentials || []).some((c) => c.id === credentialId));
  if (!profile) return res.status(404).json({ error: "passkey non riconosciuta su questo server" });
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
    if (!verification.verified) return res.status(400).json({ error: "verifica biometrica fallita" });

    savedCred.counter = verification.authenticationInfo.newCounter;
    delete db.webauthnChallenges["__anonymous__"];
    store.save(db);

    const token = uuidv4();
    sessions.set(token, profile.id);
    res.json({ token, profile: publicProfile(profile) });
  } catch (err) {
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
    }
  });

  ws.on("close", () => {
    if (boundProfileId && sockets.has(boundProfileId)) {
      sockets.get(boundProfileId).delete(ws);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
