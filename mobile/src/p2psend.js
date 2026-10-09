// Invio file peer-to-peer (stesso protocollo di public/p2pcore.js): il file viaggia cifrato
// direttamente tra i dispositivi; la chiave AES sta solo nel frammento (#) del link.
// Il destinatario apre il link in un browser (pagina /app/p2p.html), senza account.
import * as FileSystem from "expo-file-system";
import { api } from "./api";
import { ORIGIN } from "./config";
import { createStore } from "./store";
import { storage } from "./storage";
import { toBase64, fromBase64, utf8 } from "./bytes";

const CHUNK = 16 * 1024;
export const P = createStore({ active: null }); // { id, link, status, pct, err }
let cur = null;

const b64u = (u8) => toBase64(u8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const aad = (i) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, i); return b; };
async function seal(key, idx, bytes) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(idx) }, key, bytes));
  const out = new Uint8Array(12 + ct.length); out.set(iv, 0); out.set(ct, 12);
  return out;
}
async function iceConfig() {
  try {
    const relay = storage.getItem("sm_relay") === "1";
    const j = await api("/api/ice" + (relay ? "?relay=1" : ""));
    return { iceServers: j.iceServers, iceTransportPolicy: j.relayOnly ? "relay" : "all" };
  } catch { return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }; }
}
function waitIce(pc, ms = 6000) {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    const done = () => { pc.removeEventListener("icegatheringstatechange", on); resolve(); };
    const on = () => { if (pc.iceGatheringState === "complete") done(); };
    pc.addEventListener("icegatheringstatechange", on);
    setTimeout(done, ms);
  });
}
const set = (patch) => { if (cur) P.set({ active: { ...P.get().active, ...patch } }); };

export function stopSend(revoke = true) {
  if (!cur) return;
  clearInterval(cur.timer);
  try { cur.pc && cur.pc.close(); } catch {}
  if (revoke && cur.id) api("/api/p2p/" + cur.id, { method: "DELETE" }).catch(() => {});
  cur = null;
  P.set({ active: null });
}

async function pump(dc, key, uri, name, size, type) {
  const header = utf8(JSON.stringify({ name, size, type: type || "application/octet-stream" }));
  dc.send(await seal(key, 0, header));
  let idx = 1, sent = 0;
  const BIG = CHUNK * 16;
  for (let off = 0; off < size; off += BIG) {
    const len = Math.min(BIG, size - off);
    const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64, position: off, length: len });
    const bytes = fromBase64(b64);
    for (let p = 0; p < bytes.length; p += CHUNK) {
      if (dc.readyState !== "open") throw new Error("closed");
      while (dc.bufferedAmount > 2 * 1024 * 1024) await new Promise((r) => setTimeout(r, 40));
      dc.send(await seal(key, idx++, bytes.subarray(p, Math.min(p + CHUNK, bytes.length))));
    }
    sent += bytes.length;
    set({ pct: size ? Math.round((sent * 100) / size) : 100 });
  }
}

export async function startSend({ uri, name, size, type }, minutes = 10) {
  stopSend(true);
  const { RTCPeerConnection } = require("react-native-webrtc");
  cur = { status: "sendWaiting" };
  const me = cur;
  P.set({ active: { status: "sendWaiting", pct: 0, link: null } });
  try {
    const { id, expires } = await api("/api/p2p", { method: "POST", body: JSON.stringify({ minutes }) });
    const raw = crypto.getRandomValues(new Uint8Array(32));
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
    me.id = id;
    set({ link: ORIGIN + "/app/p2p.html#" + id + "." + b64u(raw) });
    const pc = new RTCPeerConnection(await iceConfig());
    me.pc = pc;
    const dc = pc.createDataChannel("file");
    dc.onopen = async () => {
      set({ status: "sendProgress" });
      try { await pump(dc, key, uri, name, size, type); } catch { set({ status: "sendFail" }); }
    };
    dc.onmessage = () => { set({ status: "sendDone", pct: 100 }); setTimeout(() => { if (cur === me) stopSend(true); }, 2500); };
    await pc.setLocalDescription(await pc.createOffer());
    await waitIce(pc);
    await api("/api/p2p/" + id + "/offer", { method: "POST", body: JSON.stringify({ sdp: pc.localDescription.sdp }) });
    let answered = false;
    me.timer = setInterval(async () => {
      if (cur !== me) return;
      if (Date.now() > expires && !answered) { set({ status: "sendFail" }); stopSend(false); return; }
      try {
        const s = await api("/api/p2p/" + id + "/state");
        if (s.joined && P.get().active && P.get().active.status === "sendWaiting") set({ status: "sendJoined" });
        if (s.answer && !answered) { answered = true; await pc.setRemoteDescription({ type: "answer", sdp: s.answer }); }
      } catch { /* link scaduto */ }
    }, 1500);
    pc.addEventListener("connectionstatechange", () => {
      const st = P.get().active && P.get().active.status;
      if (pc.connectionState === "failed" && st !== "sendDone") set({ status: "sendFail" });
    });
  } catch (e) { set({ status: "sendFail", err: e.message }); }
}
