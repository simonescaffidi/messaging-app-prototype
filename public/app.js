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
  peerStatus: {}         // chatId -> { status: new|same|changed, verified }
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
  const password = $("#reg-password").value;
  const isCover = $("#reg-cover").checked;
  $("#register-error").textContent = "";
  if (!email || !username || password.length < 8) {
    $("#register-error").textContent = I18N.t("regEmailLabel") + " / " + I18N.t("regUsernameLabel") + " / " + I18N.t("regPasswordLabel") + " (min. 8)";
    return;
  }
  try {
    const data = await api("/api/register", { method: "POST", body: JSON.stringify({ email, username, password, isCover }) });
    $("#reg-password").value = "";
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
["#login-username", "#login-password"].forEach((id) => $(id).addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); }));

async function doLogin() {
  const username = $("#login-username").value.trim();
  const password = $("#login-password").value;
  $("#login-error").textContent = "";
  try {
    const data = await api("/api/login", { method: "POST", body: JSON.stringify({ username, password }) });
    state.token = data.token;
    state.me = data.profile;
    state.loginUsername = username;
    await enterApp(password);
  } catch (e) {
    $("#login-error").textContent = e.message && /tentativi/.test(e.message) ? e.message : I18N.t("loginError");
  }
}

// ---------- RECUPERO PASSWORD / VERIFICA EMAIL ----------
function showAuthPanel(id) {
  $$("#auth-screen .tab-panel").forEach((p) => p.classList.remove("active"));
  $("#" + id).classList.add("active");
}
$("#link-forgot").addEventListener("click", (e) => { e.preventDefault(); $("#auth-notice").textContent = ""; showAuthPanel("tab-forgot"); });
$("#btn-forgot-back").addEventListener("click", () => { $("#auth-notice").textContent = ""; showAuthPanel("tab-login"); });
$("#btn-forgot-send").addEventListener("click", async () => {
  const email = $("#forgot-email").value.trim();
  const username = $("#forgot-username").value.trim();
  if (!email || !username) return;
  try { await api("/api/password/forgot", { method: "POST", body: JSON.stringify({ email, username }) }); } catch (e) {}
  $("#auth-notice").textContent = I18N.t("forgotSent");
});
let resetToken = null;
$("#btn-reset-set").addEventListener("click", async () => {
  const password = $("#reset-password").value;
  try {
    await api("/api/password/reset", { method: "POST", body: JSON.stringify({ token: resetToken, password }) });
    $("#reset-password").value = "";
    $("#auth-notice").textContent = I18N.t("resetDone");
    showAuthPanel("tab-login");
  } catch (e) { $("#auth-notice").textContent = e.message; }
});
(async function handleEmailLinks() {
  const q = new URLSearchParams(location.search);
  if (q.get("reset")) {
    resetToken = q.get("reset");
    showAuthPanel("tab-reset");
  } else if (q.get("verify")) {
    try {
      await api("/api/email/verify", { method: "POST", body: JSON.stringify({ token: q.get("verify") }) });
      $("#auth-notice").textContent = I18N.t("verifyOk");
    } catch (e) { $("#auth-notice").textContent = I18N.t("verifyFail"); }
  }
  if (q.get("reset") || q.get("verify")) history.replaceState(null, "", location.pathname);
})();

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
    await enterApp(null);
  } catch (e) {
    $("#login-error").textContent = e.message || "Sblocco biometrico non riuscito";
  }
});

// ---------- CHIAVI E2E (cassaforte + forward secrecy) ----------
async function openVault(password) {
  let r;
  try {
    r = await E2E.unlock(state.me.publicId, password);
  } catch (e) {
    if (e.message !== "bad-password") throw e;
    // password valida sul server ma cassaforte non apribile (es. dopo il recupero password): nuova identita'
    r = await E2E.resetVault(state.me.publicId, password);
  }
  try { await api("/api/me/publickey", { method: "POST", body: JSON.stringify({ publicKeyJwk: r.publicJwk }) }); } catch {}
  await E2E.ensurePrekeys(api);
}

async function ensureMyKeys(password) {
  if (password) return openVault(password);
  // accesso biometrico: la password serve per aprire la cassaforte cifrata
  await new Promise((resolve) => {
    $("#unlock-error").textContent = "";
    $("#unlock-password").value = "";
    $("#unlock-modal").classList.remove("hidden");
    $("#unlock-password").focus();
    const submit = async () => {
      const pw = $("#unlock-password").value;
      if (!pw) return;
      try {
        if (!E2E.hasVault(state.me.publicId)) {
          // nessuna cassaforte su questo dispositivo: verifico la password sul server prima di crearla
          const chk = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: state.me.username, password: pw }) });
          if (!chk.ok) throw new Error("bad");
          await openVault(pw);
        } else {
          await E2E.unlock(state.me.publicId, pw);
          try { await api("/api/me/publickey", { method: "POST", body: JSON.stringify({ publicKeyJwk: E2E.myPublicJwk() }) }); } catch {}
          await E2E.ensurePrekeys(api);
        }
        $("#unlock-modal").classList.add("hidden");
        cleanup(); resolve();
      } catch (e) { $("#unlock-error").textContent = I18N.t("unlockError"); }
    };
    const onKey = (e) => { if (e.key === "Enter") submit(); };
    const onSkip = () => { $("#unlock-modal").classList.add("hidden"); cleanup(); resolve(); };
    function cleanup() { $("#btn-unlock").removeEventListener("click", submit); $("#unlock-password").removeEventListener("keydown", onKey); $("#btn-unlock-skip").removeEventListener("click", onSkip); }
    $("#btn-unlock").addEventListener("click", submit);
    $("#unlock-password").addEventListener("keydown", onKey);
    $("#btn-unlock-skip").addEventListener("click", onSkip);
  });
}

async function refreshPeerStatus(chat) {
  if (!chat.with.publicKey) { state.peerStatus[chat.id] = { status: "none", verified: false }; return; }
  state.peerStatus[chat.id] = await E2E.checkPeer(state.me.publicId, chat.with.publicId, chat.with.publicKey);
}

async function decryptMessage(chat, m) {
  if (m._plain !== undefined) return m._plain;
  if (!m.iv || !m.ciphertext) { m._plain = m.text || ""; return m._plain; } // messaggi legacy pre-E2E
  const r = await E2E.decryptMessage({
    m, mine: m.senderProfileId === state.me.id, peerIdentity: chat.with.publicKey,
    myId: state.me.publicId, peerId: chat.with.publicId,
    exp: m.selfDestructAt ? new Date(m.selfDestructAt).getTime() : 0
  });
  if (r.state === "ok") { m._plain = r.text; return r.text; }
  if (r.state === "locked") return "🔒 " + I18N.t("msgLocked");
  if (r.state === "nokey") return "🔒 …";
  return "🔒 " + I18N.t("msgGone"); // non salvo: potrebbe diventare leggibile dopo lo sblocco
}

async function enterApp(password) {
  $("#auth-screen").classList.add("hidden");
  $("#app-screen").classList.remove("hidden");
  $("#me-username").textContent = state.me.username + (state.me.isCover ? " (copertura)" : "");
  $("#me-publicid").textContent = state.me.publicId;
  await ensureMyKeys(password);
  connectWs();
  await loadChats();
}

// ---------- LOGOUT / BLOCCO ----------
$("#btn-logout").addEventListener("click", () => {
  state.token = null;
  state.me = null;
  state.chats = [];
  state.activeChatId = null;
  state.peerStatus = {};
  E2E.lock();
  if (state.ws) state.ws.close();
  $("#app-screen").classList.add("hidden");
  $("#auth-screen").classList.remove("hidden");
  $("#login-password").value = "";
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
  refreshSettingsAccount();
  $("#settings-modal").classList.remove("hidden");
});
function refreshSettingsAccount() {
  const me = state.me || {};
  $("#email-status").textContent = me.emailVerified ? I18N.t("emailVerifiedLabel") : I18N.t("emailNotVerified");
  $("#btn-resend-verify").classList.toggle("hidden", !!me.emailVerified);
  $("#weak-pw-notice").classList.toggle("hidden", !me.weakPassword);
  $("#change-pw-status").textContent = "";
}
$("#btn-resend-verify").addEventListener("click", async () => {
  try { await api("/api/email/resend", { method: "POST", body: "{}" }); $("#email-status").textContent = I18N.t("verifySent"); }
  catch (e) { $("#email-status").textContent = e.message; }
});
$("#btn-change-password").addEventListener("click", async () => {
  try {
    await api("/api/password/change", { method: "POST", body: JSON.stringify({ oldPassword: $("#old-password").value, newPassword: $("#new-password").value }) });
    try { await E2E.rewrap($("#new-password").value); } catch {}
    $("#old-password").value = ""; $("#new-password").value = "";
    if (state.me) state.me.weakPassword = false;
    $("#weak-pw-notice").classList.add("hidden");
    $("#change-pw-status").textContent = I18N.t("pwChanged");
  } catch (e) { $("#change-pw-status").textContent = e.message; }
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
  await refreshPeerStatus(chat);
  renderKeyBanner(chat);

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

  if (!E2E.isUnlocked()) { alert(I18N.t("msgLocked")); return; }
  if (!chat || !chat.with.publicKey) { alert(I18N.t("noPeerKey")); return; }
  await refreshPeerStatus(chat);
  if (state.peerStatus[chat.id].status === "changed") { renderKeyBanner(chat); return; }
  const { iv, ciphertext, hdr } = await E2E.encryptMessage({
    peerIdentity: chat.with.publicKey, myId: state.me.publicId, peerId: chat.with.publicId, plaintext: text,
    claim: async () => (await api("/api/prekeys/claim/" + chat.with.profileId, { method: "POST", body: "{}" })).prekey
  });

  const data = await api("/api/messages", {
    method: "POST",
    body: JSON.stringify({ chatId: state.activeChatId, iv, ciphertext, hdr, replyTo: state.replyTo, selfDestructSeconds })
  });
  await E2E.rememberSent(data.message.id, text, selfDestructSeconds ? Date.now() + selfDestructSeconds * 1000 : 0);
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

// ---------- VERIFICA CHIAVI (numero di sicurezza + avviso cambio chiave) ----------
function renderKeyBanner(chat) {
  const st = state.peerStatus[chat.id] || {};
  const b = $("#key-banner");
  if (st.status === "changed") {
    b.classList.remove("hidden");
    b.innerHTML = "";
    const t = document.createElement("span");
    t.textContent = "⚠️ " + I18N.t("keyChangedBanner");
    const btn = document.createElement("button");
    btn.textContent = I18N.t("btnAcceptKey");
    btn.addEventListener("click", async () => {
      await E2E.acceptPeer(state.me.publicId, chat.with.publicId, chat.with.publicKey);
      await refreshPeerStatus(chat); renderKeyBanner(chat);
    });
    b.appendChild(t); b.appendChild(btn);
  } else { b.classList.add("hidden"); b.innerHTML = ""; }
  $("#btn-verify").textContent = st.verified ? "✅" : "🔑";
}

$("#btn-verify").addEventListener("click", async () => {
  const chat = state.chats.find((c) => c.id === state.activeChatId);
  if (!chat) return;
  const mine = E2E.myPublicJwk();
  if (!mine || !chat.with.publicKey) { alert(I18N.t("noPeerKey")); return; }
  $("#verify-name").textContent = chat.with.username;
  $("#verify-number").textContent = await E2E.safetyNumber(mine, chat.with.publicKey);
  const st = state.peerStatus[chat.id] || {};
  $("#verify-state").textContent = st.verified ? "✅ " + I18N.t("verifiedBadge") : I18N.t("notVerifiedBadge");
  $("#verify-modal").classList.remove("hidden");
});
$("#btn-verify-close").addEventListener("click", () => $("#verify-modal").classList.add("hidden"));
$("#btn-verify-mark").addEventListener("click", async () => {
  const chat = state.chats.find((c) => c.id === state.activeChatId);
  if (!chat) return;
  await E2E.markVerified(state.me.publicId, chat.with.publicId, chat.with.publicKey);
  await refreshPeerStatus(chat); renderKeyBanner(chat);
  $("#verify-modal").classList.add("hidden");
});
