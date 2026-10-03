// Stato client. Il token/profilo NON viene salvato in localStorage: ogni
// refresh richiede di reinserire il codice (o il biometrico), come da
// specifica "livello 1".
const state = {
  token: null,
  me: null,
  chats: [],
  activeChatId: null,
  comboUnlocked: false,
  replyTo: null,
  ws: null,
  myKeyPair: null,       // { privateKey, publicKey, publicJwk } - E2E.getOrCreateKeyPair()
  chatKeys: {}           // chatId -> CryptoKey AES-GCM derivata (cache in memoria, mai persistita)
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) headers["Authorization"] = "Bearer " + state.token;
  return fetch(path, { ...opts, headers }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "errore");
    return data;
  });
}

// ---------- LINGUA ----------
function initLangSwitcher() {
  const select = $("#lang-select");
  select.innerHTML = "";
  I18N.LANGS.forEach((code) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = I18N.LANG_NAMES[code] || code;
    if (code === I18N.current) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    I18N.setLang(select.value);
    // Ri-renderizza le parti costruite dinamicamente (non coperte da data-i18n)
    if (state.me) renderChatList();
  });
  I18N.apply();
}
initLangSwitcher();

// ---------- TABS AUTH ----------
$$(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => b.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---------- REGISTRAZIONE ----------
$("#btn-register").addEventListener("click", async () => {
  const email = $("#reg-email").value.trim();
  const username = $("#reg-username").value.trim();
  const isCover = $("#reg-cover").checked;
  $("#register-error").textContent = "";
  if (!email || !username) {
    $("#register-error").textContent = I18N.t("regEmailLabel") + " / " + I18N.t("regUsernameLabel");
    return;
  }
  try {
    const data = await api("/api/register", { method: "POST", body: JSON.stringify({ email, username, isCover }) });
    $("#cred-code").textContent = data.accessCode;
    $("#cred-publicid").textContent = data.publicId;
    $("#cred-combo").textContent = data.secretCombo;
    $("#credentials-modal").classList.remove("hidden");
  } catch (e) {
    $("#register-error").textContent = e.message;
  }
});

$("#btn-cred-ok").addEventListener("click", () => {
  $("#credentials-modal").classList.add("hidden");
  $$(".tab-btn")[0].click();
});

// ---------- LOGIN (codice) ----------
$("#btn-login").addEventListener("click", doLogin);
$("#login-code").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });

async function doLogin() {
  const accessCode = $("#login-code").value.trim();
  $("#login-error").textContent = "";
  try {
    const data = await api("/api/login", { method: "POST", body: JSON.stringify({ accessCode }) });
    state.token = data.token;
    state.me = data.profile;
    await enterApp();
  } catch (e) {
    $("#login-error").textContent = "Codice non valido";
  }
}

// ---------- LOGIN (biometrico) ----------
async function refreshBiometricLoginButton() {
  const btn = $("#btn-biometric-login");
  const supported = WebAuthnUnlock.isSupported() && (await WebAuthnUnlock.platformAvailable());
  const hasEnrolled = localStorage.getItem("webauthn_enrolled") === "true";
  btn.classList.toggle("hidden", !(supported && hasEnrolled));
}
refreshBiometricLoginButton();

$("#btn-biometric-login").addEventListener("click", async () => {
  $("#login-error").textContent = "";
  try {
    const data = await WebAuthnUnlock.login(api);
    state.token = data.token;
    state.me = data.profile;
    await enterApp();
  } catch (e) {
    $("#login-error").textContent = e.message || "Sblocco biometrico non riuscito";
  }
});

// ---------- CHIAVI E2E ----------
async function ensureMyKeys() {
  state.myKeyPair = await E2E.getOrCreateKeyPair(state.me.publicId);
  try {
    await api("/api/me/publickey", { method: "POST", body: JSON.stringify({ publicKeyJwk: state.myKeyPair.publicJwk }) });
  } catch {
    // non bloccante: se il server non e' raggiungibile ora, si riprovera' al prossimo login
  }
}

async function getChatKey(chat) {
  if (state.chatKeys[chat.id]) return state.chatKeys[chat.id];
  if (!chat.with.publicKey) return null; // il contatto non ha ancora generato/caricato una chiave
  const peerKey = await E2E.importPeerPublicKey(chat.with.publicKey);
  const key = await E2E.deriveChatKey(state.myKeyPair.privateKey, peerKey, state.me.publicId, chat.with.publicId);
  state.chatKeys[chat.id] = key;
  return key;
}

async function decryptMessage(chat, m) {
  if (m._plain !== undefined) return m._plain;
  if (!m.iv || !m.ciphertext) { m._plain = m.text || ""; return m._plain; } // messaggi legacy pre-E2E
  const key = await getChatKey(chat);
  m._plain = key ? await E2E.decrypt(key, m.iv, m.ciphertext) : "🔒 (chiave non ancora disponibile)";
  return m._plain;
}

async function enterApp() {
  $("#auth-screen").classList.add("hidden");
  $("#app-screen").classList.remove("hidden");
  $("#me-username").textContent = state.me.username + (state.me.isCover ? " (copertura)" : "");
  $("#me-publicid").textContent = state.me.publicId;
  await ensureMyKeys();
  connectWs();
  await loadChats();
}

// ---------- LOGOUT / BLOCCO ----------
$("#btn-logout").addEventListener("click", () => {
  state.token = null;
  state.me = null;
  state.chats = [];
  state.activeChatId = null;
  state.chatKeys = {};
  if (state.ws) state.ws.close();
  $("#app-screen").classList.add("hidden");
  $("#auth-screen").classList.remove("hidden");
  $("#login-code").value = "";
  $("#search-box").value = "";
  refreshBiometricLoginButton();
});

// ---------- WEBSOCKET ----------
function connectWs() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  state.ws = new WebSocket(`${proto}://${location.host}`);
  state.ws.addEventListener("open", () => {
    state.ws.send(JSON.stringify({ type: "auth", token: state.token }));
  });
  state.ws.addEventListener("message", (evt) => {
    const data = JSON.parse(evt.data);
    if (data.type === "message") {
      if (data.chatId === state.activeChatId) appendMessage(data.message);
      loadChats(false);
    } else if (data.type === "reaction") {
      updateReactionsUI(data.messageId, data.reactions);
    }
  });
}

// ---------- CHAT LIST ----------
$("#search-box").addEventListener("input", (e) => {
  loadChats(true, e.target.value.trim());
});

async function loadChats(rerenderList = true, combo = "") {
  const q = combo ? `?combo=${encodeURIComponent(combo)}` : "";
  const data = await api("/api/chats" + q);
  state.chats = data.chats;
  state.comboUnlocked = data.comboUnlocked;
  $("#combo-status").classList.toggle("hidden", !data.comboUnlocked);
  if (rerenderList) await renderChatList();
}

async function renderChatList() {
  const list = $("#chat-list");
  list.innerHTML = "";
  const filterText = $("#search-box").value.trim().toLowerCase();
  const isComboAttempt = state.comboUnlocked && filterText.length > 0;

  const visible = state.chats.filter((c) =>
    isComboAttempt ? true : c.with.username.toLowerCase().includes(filterText)
  );

  for (const c of visible) {
    let previewText = I18N.t("chatEmpty");
    if (c.lastMessage) {
      previewText = await decryptMessage(c, c.lastMessage);
    }
    const el = document.createElement("div");
    el.className = "chat-item" + (c.id === state.activeChatId ? " active" : "");
    el.innerHTML = `
      <div class="chat-item-name">${escapeHtml(c.with.username)} ${c.hidden ? '<span class="hidden-badge">nascosta</span>' : ""}</div>
      <div class="chat-item-preview">${c.lastMessage ? escapeHtml(previewText) : "—"}</div>
    `;
    el.addEventListener("click", () => openChat(c.id));
    list.appendChild(el);
  }
}

// ---------- CONTATTI ----------
$("#btn-add-contact").addEventListener("click", () => {
  $("#add-contact-publicid").value = "";
  $("#add-contact-error").textContent = "";
  $("#add-contact-modal").classList.remove("hidden");
});
$("#btn-add-contact-cancel").addEventListener("click", () => $("#add-contact-modal").classList.add("hidden"));
$("#btn-add-contact-confirm").addEventListener("click", async () => {
  const publicId = $("#add-contact-publicid").value.trim();
  try {
    const data = await api("/api/contacts/add", { method: "POST", body: JSON.stringify({ publicId }) });
    $("#add-contact-modal").classList.add("hidden");
    await loadChats();
    openChat(data.chatId);
  } catch (e) {
    $("#add-contact-error").textContent = e.message;
  }
});

// ---------- IMPOSTAZIONI ----------
$("#btn-settings").addEventListener("click", () => {
  $("#settings-notifications").value = state.me.settings?.notifications || "normal";
  updateBiometricSettingsUI();
  $("#settings-modal").classList.remove("hidden");
});
$("#btn-settings-cancel").addEventListener("click", () => $("#settings-modal").classList.add("hidden"));
$("#btn-settings-save").addEventListener("click", async () => {
  const mode = $("#settings-notifications").value;
  await api("/api/settings/notifications", { method: "POST", body: JSON.stringify({ mode }) });
  $("#settings-modal").classList.add("hidden");
});

async function updateBiometricSettingsUI() {
  const supported = WebAuthnUnlock.isSupported() && (await WebAuthnUnlock.platformAvailable());
  const enabled = !!state.me.hasBiometric;
  $("#btn-enable-biometric").classList.toggle("hidden", !supported || enabled);
  $("#btn-disable-biometric").classList.toggle("hidden", !enabled);
  $("#biometric-status-hint").textContent = !supported
    ? I18N.t("biometricNotSupported")
    : (enabled ? I18N.t("biometricEnabledHint") : "");
}

$("#btn-enable-biometric").addEventListener("click", async () => {
  try {
    await WebAuthnUnlock.register(api);
    localStorage.setItem("webauthn_enrolled", "true");
    state.me.hasBiometric = true;
    await updateBiometricSettingsUI();
    refreshBiometricLoginButton();
  } catch (e) {
    $("#biometric-status-hint").textContent = e.message || "Registrazione biometrica non riuscita";
  }
});

$("#btn-disable-biometric").addEventListener("click", async () => {
  try {
    await api("/api/webauthn/disable", { method: "POST", body: JSON.stringify({}) });
    localStorage.removeItem("webauthn_enrolled");
    state.me.hasBiometric = false;
    await updateBiometricSettingsUI();
    refreshBiometricLoginButton();
  } catch (e) {
    $("#biometric-status-hint").textContent = e.message || "Operazione non riuscita";
  }
});

// ---------- CHAT VIEW ----------
async function openChat(chatId) {
  state.activeChatId = chatId;
  renderChatList();
  const chat = state.chats.find((c) => c.id === chatId);
  $("#chat-empty").classList.add("hidden");
  $("#chat-view").classList.remove("hidden");
  $("#chat-with-name").textContent = chat.with.username;
  $("#btn-toggle-hide").textContent = chat.hidden ? "👁️" : "🙈";

  const data = await api(`/api/chats/${chatId}/messages`);
  const container = $("#messages");
  container.innerHTML = "";
  for (const m of data.messages) {
    await appendMessage(m, false, chat);
  }
  container.scrollTop = container.scrollHeight;
}

$("#btn-toggle-hide").addEventListener("click", async () => {
  const chat = state.chats.find((c) => c.id === state.activeChatId);
  if (!chat) return;
  await api(`/api/chats/${chat.id}/hide`, { method: "POST", body: JSON.stringify({ hidden: !chat.hidden }) });
  await loadChats();
  $("#btn-toggle-hide").textContent = !chat.hidden ? "👁️" : "🙈";
});

async function appendMessage(m, scroll = true, chatOverride = null) {
  if (m.chatId && m.chatId !== state.activeChatId) return;
  const chat = chatOverride || state.chats.find((c) => c.id === state.activeChatId);
  const container = $("#messages");
  const mine = m.senderProfileId === state.me.id;
  const row = document.createElement("div");
  row.className = "msg-row " + (mine ? "me" : "other");
  row.dataset.id = m.id;

  const plainText = chat ? await decryptMessage(chat, m) : (m.text || "");

  let replyHtml = "";
  if (m.replyTo) {
    const original = [...container.querySelectorAll(".msg-row")].find((r) => r.dataset.id === m.replyTo);
    const text = original ? original.querySelector(".bubble").textContent : "messaggio";
    replyHtml = `<div class="msg-reply-ref">↩ ${escapeHtml(text.slice(0, 60))}</div>`;
  }

  row.innerHTML = `
    ${replyHtml}
    <div class="bubble">${escapeHtml(plainText)}</div>
    <div class="msg-meta">${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${m.selfDestructAt ? " · 💣" : ""}</div>
    <div class="msg-reactions" data-msgid="${m.id}"></div>
    <div class="msg-actions">
      <button class="btn-reply" data-id="${m.id}">↩</button>
      <button class="btn-react" data-id="${m.id}" data-emoji="👍">👍</button>
      <button class="btn-react" data-id="${m.id}" data-emoji="❤️">❤️</button>
    </div>
  `;
  container.appendChild(row);
  renderReactions(m.id, m.reactions || {});

  row.querySelector(".btn-reply").addEventListener("click", () => setReply(m, plainText));
  row.querySelectorAll(".btn-react").forEach((b) =>
    b.addEventListener("click", () => react(m.id, b.dataset.emoji))
  );

  if (scroll) container.scrollTop = container.scrollHeight;
}

function renderReactions(msgId, reactions) {
  const el = document.querySelector(`.msg-reactions[data-msgid="${msgId}"]`);
  if (!el) return;
  el.innerHTML = "";
  Object.entries(reactions).forEach(([emoji, ids]) => {
    if (!ids.length) return;
    const chip = document.createElement("span");
    chip.className = "reaction-chip" + (ids.includes(state.me.id) ? " active" : "");
    chip.textContent = `${emoji} ${ids.length}`;
    chip.addEventListener("click", () => react(msgId, emoji));
    el.appendChild(chip);
  });
}

function updateReactionsUI(msgId, reactions) {
  renderReactions(msgId, reactions);
}

async function react(msgId, emoji) {
  const data = await api(`/api/messages/${msgId}/react`, { method: "POST", body: JSON.stringify({ emoji }) });
  renderReactions(msgId, data.reactions);
}

function setReply(m, plainText) {
  state.replyTo = m.id;
  $("#reply-preview").classList.remove("hidden");
  $("#reply-preview-text").textContent = plainText.slice(0, 60);
}
$("#btn-cancel-reply").addEventListener("click", () => {
  state.replyTo = null;
  $("#reply-preview").classList.add("hidden");
});

// ---------- INVIO MESSAGGIO (cifrato end-to-end) ----------
$("#message-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("#message-input");
  const text = input.value.trim();
  if (!text || !state.activeChatId) return;
  const chat = state.chats.find((c) => c.id === state.activeChatId);
  const selfDestructSeconds = $("#destruct-select").value ? Number($("#destruct-select").value) : null;

  const key = chat ? await getChatKey(chat) : null;
  if (!key) {
    alert("Impossibile cifrare: il contatto non ha ancora generato una chiave pubblica (deve accedere almeno una volta dopo l'aggiornamento).");
    return;
  }
  const { iv, ciphertext } = await E2E.encrypt(key, text);

  const data = await api("/api/messages", {
    method: "POST",
    body: JSON.stringify({ chatId: state.activeChatId, iv, ciphertext, replyTo: state.replyTo, selfDestructSeconds })
  });
  data.message._plain = text; // evita di dover decifrare il proprio messaggio appena inviato
  await appendMessage(data.message, true, chat);
  input.value = "";
  state.replyTo = null;
  $("#reply-preview").classList.add("hidden");
  await loadChats(false);
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
