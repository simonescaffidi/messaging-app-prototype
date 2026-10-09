// Logica dell'app (equivalente di public/app.js): accesso, cassaforte E2E, WebSocket, chat.
import { AppState } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import E2E from "./shared/e2e";
import { api, auth } from "./api";
import { WS_URL } from "./config";
import { createStore, createBus } from "./store";
import { hydrate, storage } from "./storage";
import { initLang, t } from "./i18n";

export const ONCE = "\u0001ONCE\u0001"; // marcatore dei messaggi a visualizzazione singola (come sul web)
export const bus = createBus();
export const S = createStore({
  ready: false, token: null, me: null, chats: [], comboUnlocked: false, peerStatus: {},
  appLocked: false, vaultOpen: false, savedLogin: false
});

const CRED_KEY = "securmy_cred";
const PREF_APPLOCK = "sm_pref_applock";
let ws = null, wsTimer = null, wsTries = 0;
const plain = new Map(); // id messaggio -> testo decifrato (solo in memoria)

// ---------------------------------------------------------------- avvio
export async function boot() {
  await hydrate();
  initLang();
  const locked = storage.getItem(PREF_APPLOCK) === "1";
  let saved = false;
  try { saved = !!(await SecureStore.getItemAsync(CRED_KEY + "_flag")); } catch {}
  S.set({ ready: true, appLocked: locked && saved, savedLogin: saved });
}

export async function biometricAvailable() {
  try { return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync()); } catch { return false; }
}
export async function biometricPrompt(msg) {
  try { return (await LocalAuthentication.authenticateAsync({ promptMessage: msg || "Securmy", cancelLabel: t("btnCancel") })).success; } catch { return false; }
}
export const appLockEnabled = () => storage.getItem(PREF_APPLOCK) === "1";
export function setAppLock(on) { storage.setItem(PREF_APPLOCK, on ? "1" : "0"); }

// ---------------------------------------------------------------- accesso
export async function login(username, password, totp, remember) {
  const data = await api("/api/login", { method: "POST", body: JSON.stringify({ username, password, totp: totp || undefined }) });
  if (data.need2fa) return "need2fa";
  auth.token = data.token;
  S.set({ token: data.token, me: data.profile });
  await enterApp(password);
  if (remember) await saveCredentials({ username, password, token: data.token });
  return "ok";
}

async function saveCredentials(c) {
  try {
    await SecureStore.setItemAsync(CRED_KEY, JSON.stringify(c), { requireAuthentication: true, authenticationPrompt: "Securmy" });
    await SecureStore.setItemAsync(CRED_KEY + "_flag", "1");
    S.set({ savedLogin: true });
  } catch {}
}
export async function forgetCredentials() {
  try { await SecureStore.deleteItemAsync(CRED_KEY); await SecureStore.deleteItemAsync(CRED_KEY + "_flag"); } catch {}
  S.set({ savedLogin: false });
}

// Accesso con biometria: riusa la sessione salvata (o rifa' il login con le credenziali salvate).
export async function loginWithBiometrics() {
  let raw;
  try { raw = await SecureStore.getItemAsync(CRED_KEY, { requireAuthentication: true, authenticationPrompt: "Securmy" }); } catch { return "fail"; }
  if (!raw) return "fail";
  const c = JSON.parse(raw);
  auth.token = c.token;
  try {
    const me = await api("/api/me");
    S.set({ token: c.token, me });
    await enterApp(c.password);
    S.set({ appLocked: false });
    return "ok";
  } catch {
    auth.token = null;
    try { return await login(c.username, c.password, null, true); } catch (e) { return e.message || "fail"; }
  }
}

async function openVault(password) {
  const me = S.get().me;
  let r;
  try { r = await E2E.unlock(me.publicId, password); }
  catch (e) {
    if (e.message !== "bad-password") throw e;
    r = await E2E.resetVault(me.publicId, password); // cassaforte non apribile (es. dopo recupero password): nuova identita'
  }
  try { await api("/api/me/publickey", { method: "POST", body: JSON.stringify({ publicKeyJwk: r.publicJwk }) }); } catch {}
  await E2E.ensurePrekeys(api);
  S.set({ vaultOpen: true });
}

async function enterApp(password) {
  await openVault(password);
  connectWs();
  await loadChats();
  try { require("./push").registerPush(); } catch {}
  try { require("./calls"); } catch {}
  bus.emit("entered");
}

export async function logout() {
  try { const { unregisterPush } = require("./push"); await unregisterPush(); } catch {}
  auth.token = null;
  if (ws) { try { ws.close(); } catch {} ws = null; }
  clearTimeout(wsTimer);
  E2E.lock();
  plain.clear();
  S.set({ token: null, me: null, chats: [], comboUnlocked: false, peerStatus: {}, vaultOpen: false });
  bus.emit("loggedout");
}

// ---------------------------------------------------------------- WebSocket
function connectWs() {
  clearTimeout(wsTimer);
  const token = auth.token;
  if (!token) return;
  try { if (ws) ws.close(); } catch {}
  ws = new WebSocket(WS_URL);
  ws.onopen = () => { wsTries = 0; ws.send(JSON.stringify({ type: "auth", token })); };
  ws.onmessage = (evt) => {
    let d; try { d = JSON.parse(evt.data); } catch { return; }
    if (d.type === "message" || d.type === "reaction" || d.type === "burn") bus.emit(d.type, d);
    if (d.type === "message") loadChats().catch(() => {});
    if (typeof d.type === "string" && d.type.startsWith("call-")) bus.emit("call", d);
  };
  ws.onclose = () => {
    if (auth.token !== token) return;
    wsTimer = setTimeout(connectWs, Math.min(15000, 1000 * 2 ** Math.min(wsTries++, 4)));
  };
  ws.onerror = () => {};
}
export function wsSend(msg) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(msg)); return true; } return false; }
AppState.addEventListener("change", (st) => {
  if (st === "active" && auth.token && (!ws || ws.readyState > 1)) connectWs();
  if (st === "active" && auth.token) loadChats().catch(() => {});
});

// ---------------------------------------------------------------- chat
export async function loadChats(combo = "") {
  const q = combo ? "?combo=" + encodeURIComponent(combo) : "";
  const data = await api("/api/chats" + q);
  S.set({ chats: data.chats, comboUnlocked: data.comboUnlocked });
  return data;
}

export async function refreshPeerStatus(chat) {
  const me = S.get().me;
  const ps = { ...S.get().peerStatus };
  ps[chat.id] = chat.with.publicKey ? await E2E.checkPeer(me.publicId, chat.with.publicId, chat.with.publicKey) : { status: "none", verified: false };
  S.set({ peerStatus: ps });
  return ps[chat.id];
}
export async function acceptKey(chat) { await E2E.acceptPeer(S.get().me.publicId, chat.with.publicId, chat.with.publicKey); return refreshPeerStatus(chat); }
export async function markVerified(chat) { await E2E.markVerified(S.get().me.publicId, chat.with.publicId, chat.with.publicKey); return refreshPeerStatus(chat); }
export const safetyNumber = (chat) => E2E.safetyNumber(E2E.myPublicJwk(), chat.with.publicKey);

export async function decryptMessage(chat, m) {
  if (plain.has(m.id)) return plain.get(m.id);
  const me = S.get().me;
  if (!m.iv || !m.ciphertext) return m.text || "";
  const r = await E2E.decryptMessage({
    m, mine: m.senderProfileId === me.id, peerIdentity: chat.with.publicKey,
    myId: me.publicId, peerId: chat.with.publicId,
    exp: m.selfDestructAt ? new Date(m.selfDestructAt).getTime() : 0
  });
  if (r.state === "ok") { plain.set(m.id, r.text); return r.text; }
  if (r.state === "locked") return "🔒 " + t("msgLocked");
  if (r.state === "nokey") return "🔒 …";
  return "🔒 " + t("msgGone");
}
export const forgetPlain = (id) => { plain.delete(id); E2E.cacheDelete(id); };

export async function openChat(chatId) {
  const chat = S.get().chats.find((c) => c.id === chatId);
  if (chat) await refreshPeerStatus(chat);
  const data = await api(`/api/chats/${chatId}/messages`);
  return data.messages;
}

export async function sendText(chat, text, mode, replyTo) {
  if (!text) return null;
  const me = S.get().me;
  const once = mode === "once";
  const selfDestructSeconds = once ? 7 * 24 * 3600 : mode ? Number(mode) : null;
  if (!E2E.isUnlocked()) throw new Error(t("msgLocked"));
  if (!chat.with.publicKey) throw new Error(t("noPeerKey"));
  const st = await refreshPeerStatus(chat);
  if (st.status === "changed") throw new Error(t("keyChangedBanner"));
  const plaintext = once ? ONCE + text : text;
  const { iv, ciphertext, hdr } = await E2E.encryptMessage({
    peerIdentity: chat.with.publicKey, myId: me.publicId, peerId: chat.with.publicId, plaintext,
    claim: async () => (await api("/api/prekeys/claim/" + chat.with.profileId, { method: "POST", body: "{}" })).prekey
  });
  const data = await api("/api/messages", { method: "POST", body: JSON.stringify({ chatId: chat.id, iv, ciphertext, hdr, replyTo: replyTo || null, selfDestructSeconds }) });
  await E2E.rememberSent(data.message.id, plaintext, selfDestructSeconds ? Date.now() + selfDestructSeconds * 1000 : 0);
  plain.set(data.message.id, plaintext);
  loadChats().catch(() => {});
  return data.message;
}
export const react = (id, emoji) => api(`/api/messages/${id}/react`, { method: "POST", body: JSON.stringify({ emoji }) });
export const burn = (id) => api(`/api/messages/${id}/burn`, { method: "POST", body: JSON.stringify({ seconds: 10 }) });
export const hideChat = (id, hidden) => api(`/api/chats/${id}/hide`, { method: "POST", body: JSON.stringify({ hidden }) });
export const addContact = (publicId) => api("/api/contacts/add", { method: "POST", body: JSON.stringify({ publicId }) });
export const setBlocked = (profileId, blocked) => api(`/api/contacts/${profileId}/block`, { method: "POST", body: JSON.stringify({ blocked }) });
export const reportContact = (profileId, reason) => api("/api/report", { method: "POST", body: JSON.stringify({ profileId, reason }) });

// ---------------------------------------------------------------- account
export async function changePassword(oldPassword, newPassword) {
  await api("/api/password/change", { method: "POST", body: JSON.stringify({ oldPassword, newPassword }) });
  try { await E2E.rewrap(newPassword); } catch {}
  await forgetCredentials(); // la password salvata non e' piu' valida
}
export async function deleteAccount(password) {
  const me = S.get().me;
  await api("/api/account/delete", { method: "POST", body: JSON.stringify({ password }) });
  E2E.wipeLocal(me.publicId);
  const { wipeVaultFiles } = require("./vault");
  await wipeVaultFiles(me.publicId);
  await forgetCredentials();
  await logout();
}
export async function reloadMe() { const me = await api("/api/me"); S.set({ me }); return me; }
