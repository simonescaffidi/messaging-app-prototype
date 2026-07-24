// Stato client. Il token/profilo NON viene salvato in localStorage: ogni
// refresh richiede di reinserire il codice, come da specifica "livello 1".
const state = {
  token: null,
  me: null,
  chats: [],
  activeChatId: null,
  comboUnlocked: false,
  replyTo: null,
  ws: null
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
    $("#register-error").textContent = "Compila email e username";
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

// ---------- LOGIN ----------
$("#btn-login").addEventListener("click", doLogin);
$("#login-code").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });

async function doLogin() {
  const accessCode = $("#login-code").value.trim();
  $("#login-error").textContent = "";
  try {
    const data = await api("/api/login", { method: "POST", body: JSON.stringify({ accessCode }) });
    state.token = data.token;
    state.me = data.profile;
    enterApp();
  } catch (e) {
    $("#login-error").textContent = "Codice non valido";
  }
}

async function enterApp() {
  $("#auth-screen").classList.add("hidden");
  $("#app-screen").classList.remove("hidden");
  $("#me-username").textContent = state.me.username + (state.me.isCover ? " (copertura)" : "");
  $("#me-publicid").textContent = state.me.publicId;
  connectWs();
  await loadChats();
}

// ---------- LOGOUT / BLOCCO ----------
$("#btn-logout").addEventListener("click", () => {
  state.token = null;
  state.me = null;
  state.chats = [];
  state.activeChatId = null;
  if (state.ws) state.ws.close();
  $("#app-screen").classList.add("hidden");
  $("#auth-screen").classList.remove("hidden");
  $("#login-code").value = "";
  $("#search-box").value = "";
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
  if (rerenderList) renderChatList();
}

function renderChatList() {
  const list = $("#chat-list");
  list.innerHTML = "";
  const filterText = $("#search-box").value.trim().toLowerCase();
  const isComboAttempt = state.comboUnlocked && filterText.length > 0;

  state.chats
    .filter((c) => isComboAttempt ? true : c.with.username.toLowerCase().includes(filterText))
    .forEach((c) => {
      const el = document.createElement("div");
      el.className = "chat-item" + (c.id === state.activeChatId ? " active" : "");
      el.innerHTML = `
        <div class="chat-item-name">${escapeHtml(c.with.username)} ${c.hidden ? '<span class="hidden-badge">nascosta</span>' : ""}</div>
        <div class="chat-item-preview">${c.lastMessage ? escapeHtml(c.lastMessage.text) : "Nessun messaggio"}</div>
      `;
      el.addEventListener("click", () => openChat(c.id));
      list.appendChild(el);
    });
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
  $("#settings-modal").classList.remove("hidden");
});
$("#btn-settings-cancel").addEventListener("click", () => $("#settings-modal").classList.add("hidden"));
$("#btn-settings-save").addEventListener("click", async () => {
  const mode = $("#settings-notifications").value;
  await api("/api/settings/notifications", { method: "POST", body: JSON.stringify({ mode }) });
  $("#settings-modal").classList.add("hidden");
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
  data.messages.forEach((m) => appendMessage(m, false));
  container.scrollTop = container.scrollHeight;
}

$("#btn-toggle-hide").addEventListener("click", async () => {
  const chat = state.chats.find((c) => c.id === state.activeChatId);
  if (!chat) return;
  await api(`/api/chats/${chat.id}/hide`, { method: "POST", body: JSON.stringify({ hidden: !chat.hidden }) });
  await loadChats();
  $("#btn-toggle-hide").textContent = !chat.hidden ? "👁️" : "🙈";
});

function appendMessage(m, scroll = true) {
  if (m.chatId && m.chatId !== state.activeChatId) return;
  const container = $("#messages");
  const mine = m.senderProfileId === state.me.id;
  const row = document.createElement("div");
  row.className = "msg-row " + (mine ? "me" : "other");
  row.dataset.id = m.id;

  let replyHtml = "";
  if (m.replyTo) {
    const original = [...container.querySelectorAll(".msg-row")].find((r) => r.dataset.id === m.replyTo);
    const text = original ? original.querySelector(".bubble").textContent : "messaggio";
    replyHtml = `<div class="msg-reply-ref">↩ ${escapeHtml(text.slice(0, 60))}</div>`;
  }

  row.innerHTML = `
    ${replyHtml}
    <div class="bubble">${escapeHtml(m.text)}</div>
    <div class="msg-meta">${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${m.selfDestructAt ? " · 💣" : ""}</div>
    <div class="msg-reactions" data-msgid="${m.id}"></div>
    <div class="msg-actions">
      <button class="btn-reply" data-id="${m.id}">Rispondi</button>
      <button class="btn-react" data-id="${m.id}" data-emoji="👍">👍</button>
      <button class="btn-react" data-id="${m.id}" data-emoji="❤️">❤️</button>
    </div>
  `;
  container.appendChild(row);
  renderReactions(m.id, m.reactions || {});

  row.querySelector(".btn-reply").addEventListener("click", () => setReply(m));
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

function setReply(m) {
  state.replyTo = m.id;
  $("#reply-preview").classList.remove("hidden");
  $("#reply-preview-text").textContent = "Rispondi a: " + m.text.slice(0, 60);
}
$("#btn-cancel-reply").addEventListener("click", () => {
  state.replyTo = null;
  $("#reply-preview").classList.add("hidden");
});

// ---------- INVIO MESSAGGIO ----------
$("#message-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("#message-input");
  const text = input.value.trim();
  if (!text || !state.activeChatId) return;
  const selfDestructSeconds = $("#destruct-select").value ? Number($("#destruct-select").value) : null;

  const data = await api("/api/messages", {
    method: "POST",
    body: JSON.stringify({ chatId: state.activeChatId, text, replyTo: state.replyTo, selfDestructSeconds })
  });
  appendMessage(data.message);
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
