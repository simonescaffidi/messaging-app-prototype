// Prototipo webapp di messaggistica privata.
// Dimostra il meccanismo chiave del progetto: CODICE = PROFILO, chat nascoste,
// contatti, messaggistica realtime. NON contiene crittografia E2E reale
// (vedi README per cosa manca prima della produzione).

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const store = require("./db");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// sessioni in memoria: token -> profileId
const sessions = new Map();
// socket per profilo: profileId -> Set<ws>
const sockets = new Map();

function randomCode(len, chars) {
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function randomAccessCode() {
  return randomCode(6, "0123456789");
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
  return { id: p.id, username: p.username, publicId: p.publicId, isCover: p.isCover, settings: p.settings };
}

function broadcastToProfile(profileId, payload) {
  const set = sockets.get(profileId);
  if (!set) return;
  for (const ws of set) {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
  }
}

// ---------- REGISTRAZIONE / LOGIN ----------

app.post("/api/register", (req, res) => {
  const { email, username, isCover } = req.body;
  if (!email || !username) return res.status(400).json({ error: "email e username obbligatori" });

  const db = store.load();
  const profile = {
    id: uuidv4(),
    email,
    username,
    publicId: randomPublicId(),
    accessCode: randomAccessCode(),
    secretCombo: randomSecretCombo(),
    isCover: !!isCover,
    settings: { notifications: "normal" },
    createdAt: Date.now()
  };
  db.profiles.push(profile);
  store.save(db);

  // Il codice e la combinazione segreta vengono mostrati UNA VOLTA sola:
  // e' responsabilita' dell'utente salvarli (come una seed phrase).
  res.json({
    profileId: profile.id,
    accessCode: profile.accessCode,
    publicId: profile.publicId,
    secretCombo: profile.secretCombo
  });
});

app.post("/api/login", (req, res) => {
  const { accessCode } = req.body;
  const db = store.load();
  const profile = db.profiles.find((p) => p.accessCode === accessCode);
  if (!profile) return res.status(401).json({ error: "codice non valido" });

  const token = uuidv4();
  sessions.set(token, profile.id);
  res.json({ token, profile: publicProfile(profile) });
});

app.get("/api/me", requireAuth, (req, res) => {
  const db = store.load();
  const profile = db.profiles.find((p) => p.id === req.profileId);
  res.json(publicProfile(profile));
});

// ---------- CONTATTI ----------

app.get("/api/contacts", requireAuth, (req, res) => {
  const db = store.load();
  const mine = db.contacts.filter((c) => c.profileId === req.profileId);
  const result = mine.map((c) => {
    const p = db.profiles.find((pr) => pr.id === c.contactProfileId);
    return { profileId: p.id, username: p.username, publicId: p.publicId, blocked: c.blocked, muted: c.muted };
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
  res.json({ contact: { profileId: target.id, username: target.username, publicId: target.publicId }, chatId: chat.id });
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
      with: { profileId: other.id, username: other.username, publicId: other.publicId },
      hidden: !!c.hiddenFor[req.profileId],
      lastMessage: last ? { text: last.text, createdAt: last.createdAt } : null
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

// ---------- MESSAGGI ----------

app.post("/api/messages", requireAuth, (req, res) => {
  const { chatId, text, replyTo, selfDestructSeconds } = req.body;
  const db = store.load();
  const chat = db.chats.find((c) => c.id === chatId && c.memberIds.includes(req.profileId));
  if (!chat) return res.status(404).json({ error: "chat non trovata" });
  if (!text || !text.trim()) return res.status(400).json({ error: "messaggio vuoto" });

  const msg = {
    id: uuidv4(),
    chatId,
    senderProfileId: req.profileId,
    text,
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
