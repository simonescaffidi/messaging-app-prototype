// Chiamate audio/video cifrate (WebRTC, DTLS-SRTP) tra due contatti, come nella webapp:
// audio e video viaggiano direttamente tra i dispositivi; il server inoltra solo la segnalazione.
// Codice di verifica a 4 cifre calcolato dalle impronte DTLS, da confrontare a voce.
import { api } from "./api";
import { bus, wsSend } from "./session";
import { createStore } from "./store";
import { storage } from "./storage";
import { t } from "./i18n";

export const C = createStore({ call: null }); // { peerId, peerName, video, phase, status, code, muted, camOff, localUrl, remoteUrl }
let rtc = null;
const R = () => rtc || (rtc = require("react-native-webrtc"));
let cur = null; // { pc, stream, pendingIce, offer, timeout, ringTimer }

const fp = (sdp) => { const m = /a=fingerprint:\S+\s+([0-9A-Fa-f:]+)/.exec(sdp || ""); return m ? m[1].toUpperCase() : ""; };
async function codeFrom(a, b) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode([a, b].sort().join("|"))));
  return String(((h[0] << 8) | h[1]) % 10000).padStart(4, "0");
}
const upd = (patch) => { if (C.get().call) C.set({ call: { ...C.get().call, ...patch } }); };

async function iceConfig() {
  try {
    const relay = storage.getItem("sm_relay") === "1";
    const j = await api("/api/ice" + (relay ? "?relay=1" : ""));
    return { iceServers: j.iceServers, iceTransportPolicy: j.relayOnly ? "relay" : "all" };
  } catch { return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }; }
}
async function media(video) {
  return R().mediaDevices.getUserMedia({ audio: true, video: video ? { width: 1280, height: 720, frameRate: 30, facingMode: "user" } : false });
}
async function makePc() {
  const { RTCPeerConnection } = R();
  const pc = new RTCPeerConnection(await iceConfig());
  cur.pc = pc;
  cur.stream.getTracks().forEach((tr) => pc.addTrack(tr, cur.stream));
  pc.addEventListener("icecandidate", (e) => { if (e.candidate && cur) wsSend({ type: "call-ice", to: C.get().call.peerId, payload: e.candidate }); });
  pc.addEventListener("track", (e) => { if (e.streams && e.streams[0]) upd({ remoteUrl: e.streams[0].toURL() }); });
  pc.addEventListener("connectionstatechange", async () => {
    if (!cur) return;
    if (pc.connectionState === "connected") {
      upd({ phase: "live", status: "🔒 " + t("callConnected") });
      const l = fp(pc.localDescription && pc.localDescription.sdp), r = fp(pc.remoteDescription && pc.remoteDescription.sdp);
      if (l && r) upd({ code: await codeFrom(l, r) });
    } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
      upd({ status: t("callFail") }); setTimeout(() => hangup(false), 1500);
    }
  });
  return pc;
}

export async function startCall(chat, video) {
  if (cur) return;
  cur = { pendingIce: [] };
  C.set({ call: { peerId: chat.with.profileId, peerName: chat.with.username, video, phase: "calling", status: t("callRinging"), code: "", muted: false, camOff: false } });
  try { cur.stream = await media(video); } catch { hangup(false, "callNoMedia"); return; }
  upd({ localUrl: cur.stream.toURL() });
  try {
    const pc = await makePc();
    await pc.setLocalDescription(await pc.createOffer());
    wsSend({ type: "call-offer", to: chat.with.profileId, video, payload: { sdp: pc.localDescription.sdp } });
    cur.timeout = setTimeout(() => { if (cur && cur.pc && cur.pc.connectionState !== "connected") hangup(true); }, 45000);
  } catch { hangup(false, "callFail"); }
}

function incoming(d) {
  if (cur) { wsSend({ type: "call-reject", to: d.from, payload: { busy: true } }); return; }
  cur = { pendingIce: [], offer: d.payload.sdp };
  C.set({ call: { peerId: d.from, peerName: d.fromName || "?", video: !!d.video, phase: "ringing", status: t("callIncoming", { n: d.fromName || "?" }), code: "", muted: false, camOff: false } });
  cur.ringTimer = setTimeout(() => { if (cur && C.get().call && C.get().call.phase === "ringing") hangup(false); }, 40000);
}
export async function acceptCall() {
  const call = C.get().call;
  if (!cur || !call || call.phase !== "ringing") return;
  clearTimeout(cur.ringTimer);
  upd({ phase: "calling", status: t("callRinging") });
  try { cur.stream = await media(call.video); } catch { wsSend({ type: "call-reject", to: call.peerId, payload: {} }); hangup(false, "callNoMedia"); return; }
  upd({ localUrl: cur.stream.toURL() });
  try {
    const { RTCSessionDescription, RTCIceCandidate } = R();
    const pc = await makePc();
    await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: cur.offer }));
    for (const c of cur.pendingIce) { try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {} }
    cur.pendingIce = [];
    await pc.setLocalDescription(await pc.createAnswer());
    wsSend({ type: "call-answer", to: call.peerId, payload: { sdp: pc.localDescription.sdp } });
  } catch { hangup(true, "callFail"); }
}
export function rejectCall() { const c = C.get().call; if (c) wsSend({ type: "call-reject", to: c.peerId, payload: {} }); hangup(false); }

async function onSignal(d) {
  if (d.type === "call-offer") return incoming(d);
  const call = C.get().call;
  if (!cur || !call || d.from !== call.peerId) return;
  const { RTCSessionDescription, RTCIceCandidate } = R();
  if (d.type === "call-answer" && cur.pc) {
    await cur.pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: d.payload.sdp }));
    for (const c of cur.pendingIce) { try { await cur.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {} }
    cur.pendingIce = [];
  } else if (d.type === "call-ice") {
    if (cur.pc && cur.pc.remoteDescription) { try { await cur.pc.addIceCandidate(new RTCIceCandidate(d.payload)); } catch {} }
    else cur.pendingIce.push(d.payload);
  } else if (d.type === "call-end" || d.type === "call-reject") {
    hangup(false, d.type === "call-reject" && d.payload && d.payload.busy ? "callBusy" : null);
  }
}
export function hangup(notify, msgKey) {
  const call = C.get().call;
  if (!cur && !call) return;
  if (notify && call) wsSend({ type: "call-end", to: call.peerId, payload: {} });
  if (cur) {
    clearTimeout(cur.timeout); clearTimeout(cur.ringTimer);
    try { cur.stream && cur.stream.getTracks().forEach((x) => x.stop()); } catch {}
    try { cur.pc && cur.pc.close(); } catch {}
  }
  cur = null;
  C.set({ call: msgKey ? { ...call, phase: "ended", status: t(msgKey) } : null });
  if (msgKey) setTimeout(() => { const c = C.get().call; if (c && c.phase === "ended") C.set({ call: null }); }, 2500);
}
export function toggleMute() { if (!cur || !cur.stream) return; const m = !C.get().call.muted; cur.stream.getAudioTracks().forEach((x) => (x.enabled = !m)); upd({ muted: m }); }
export function toggleCam() { if (!cur || !cur.stream) return; const off = !C.get().call.camOff; cur.stream.getVideoTracks().forEach((x) => (x.enabled = !off)); upd({ camOff: off }); }
export function switchCamera() { try { cur.stream.getVideoTracks().forEach((x) => x._switchCamera()); } catch {} }

bus.on("call", onSignal);
