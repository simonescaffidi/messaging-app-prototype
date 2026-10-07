// Chiamate audio/video cifrate (WebRTC, DTLS-SRTP) tra due contatti.
// Audio e video viaggiano direttamente tra i dispositivi (nessun server media).
// Il server inoltra solo la segnalazione (via WebSocket). Per escludere che la
// segnalazione venga manomessa, entrambi vedono un CODICE DI VERIFICA calcolato dalle
// impronte DTLS: se i due codici coincidono a voce, la chiamata non e' intercettata.
const Calls = (() => {
  const $ = (s) => document.querySelector(s);
  const t = (k, r) => { let s = I18N.t(k); if (r) for (const x in r) s = s.replace("{" + x + "}", r[x]); return s; };
  let cur = null; // { pc, peerId, peerName, stream, video, overlay, pendingIce, muted }
  let send = () => {};

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) { if (k === "class") e.className = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
    for (const k of kids) e.append(k && k.nodeType ? k : document.createTextNode(k == null ? "" : k));
    return e;
  }
  const fp = (sdp) => { const m = /a=fingerprint:\S+\s+([0-9A-Fa-f:]+)/.exec(sdp || ""); return m ? m[1].toUpperCase() : ""; };
  async function codeFrom(a, b) {
    const d = new TextEncoder().encode([a, b].sort().join("|"));
    const h = new Uint8Array(await crypto.subtle.digest("SHA-256", d));
    return String(((h[0] << 8 | h[1]) % 10000)).padStart(4, "0");
  }

  function ui() {
    const remote = el("video", { autoplay: "", playsinline: "" });
    const local = el("video", { autoplay: "", playsinline: "", muted: "", class: "pip" }); local.muted = true;
    const status = el("p", { class: "subtitle" }, t("callRinging"));
    const code = el("p", { class: "call-code" });
    const codeHint = el("p", { class: "hint" });
    const mute = el("button", { onclick: () => { if (!cur) return; cur.muted = !cur.muted; cur.stream.getAudioTracks().forEach((x) => (x.enabled = !cur.muted)); mute.textContent = (cur.muted ? "🔇 " : "🎙 ") + t("callMute"); } }, "🎙 " + t("callMute"));
    const cam = el("button", { onclick: () => { if (!cur) return; cur.stream.getVideoTracks().forEach((x) => (x.enabled = !x.enabled)); } }, "📷 " + t("callCam"));
    const end = el("button", { class: "end", onclick: () => hangup(true) }, "📵 " + t("callEnd"));
    const bar = el("div", { class: "call-bar" }, mute, ...(cur.video ? [cam] : []), end);
    const overlay = el("div", { class: "call-overlay" }, el("h2", {}, cur.peerName), status, remote, ...(cur.video ? [local] : []), code, codeHint, bar);
    document.body.append(overlay);
    cur.overlay = overlay; cur.remote = remote; cur.local = local; cur.status = status; cur.code = code; cur.codeHint = codeHint;
  }

  async function media(video) {
    return navigator.mediaDevices.getUserMedia({ audio: true, video: video ? { width: 1280, height: 720 } : false });
  }
  async function makePc() {
    const pc = new RTCPeerConnection(await P2P.iceConfig());
    cur.pc = pc;
    cur.stream.getTracks().forEach((tr) => pc.addTrack(tr, cur.stream));
    pc.onicecandidate = (e) => { if (e.candidate) send({ type: "call-ice", to: cur.peerId, payload: e.candidate }); };
    pc.ontrack = (e) => { cur.remote.srcObject = e.streams[0]; };
    pc.onconnectionstatechange = async () => {
      if (!cur) return;
      if (pc.connectionState === "connected") {
        cur.status.textContent = "🔒 " + t("callConnected");
        const l = fp(pc.currentLocalDescription && pc.currentLocalDescription.sdp), r = fp(pc.currentRemoteDescription && pc.currentRemoteDescription.sdp);
        if (l && r) { cur.code.textContent = await codeFrom(l, r); cur.codeHint.textContent = t("callCodeHint"); }
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") { cur.status.textContent = t("callFail"); setTimeout(() => hangup(false), 1500); }
    };
    return pc;
  }

  async function start(chat, video) {
    if (cur) return;
    if (!E2E.isUnlocked()) { alert(t("msgLocked")); return; }
    cur = { peerId: chat.with.profileId, peerName: chat.with.username, video, pendingIce: [] };
    try { cur.stream = await media(video); } catch { alert(t("callNoMedia")); cur = null; return; }
    ui(); cur.local.srcObject = cur.stream;
    const pc = await makePc();
    await pc.setLocalDescription(await pc.createOffer());
    send({ type: "call-offer", to: cur.peerId, video, payload: { sdp: pc.localDescription.sdp } });
    cur.timeout = setTimeout(() => { if (cur && cur.pc && cur.pc.connectionState !== "connected") hangup(true); }, 45000);
  }

  function incoming(d) {
    if (cur) { send({ type: "call-reject", to: d.from, payload: { busy: true } }); return; }
    cur = { peerId: d.from, peerName: d.fromName || "?", video: !!d.video, pendingIce: [], offer: d.payload.sdp, ringing: true };
    const box = el("div", { class: "modal" }, el("div", { class: "modal-card" },
      el("h2", {}, "📞 " + t("callIncoming", { n: cur.peerName })),
      el("div", { class: "modal-actions" },
        el("button", { onclick: () => { box.remove(); send({ type: "call-reject", to: d.from, payload: {} }); cur = null; } }, t("callReject")),
        el("button", { class: "primary", onclick: async () => { box.remove(); await accept(); } }, t("callAccept")))));
    document.body.append(box);
    cur.ringBox = box;
    cur.ringTimer = setTimeout(() => { if (cur && cur.ringing) { box.remove(); cur = null; } }, 40000);
  }
  async function accept() {
    clearTimeout(cur.ringTimer); cur.ringing = false;
    try { cur.stream = await media(cur.video); } catch { alert(t("callNoMedia")); send({ type: "call-reject", to: cur.peerId, payload: {} }); cur = null; return; }
    ui(); cur.local.srcObject = cur.stream;
    const pc = await makePc();
    await pc.setRemoteDescription({ type: "offer", sdp: cur.offer });
    for (const c of cur.pendingIce) try { await pc.addIceCandidate(c); } catch {}
    cur.pendingIce = [];
    await pc.setLocalDescription(await pc.createAnswer());
    send({ type: "call-answer", to: cur.peerId, payload: { sdp: pc.localDescription.sdp } });
  }

  async function onSignal(d) {
    if (d.type === "call-offer") return incoming(d);
    if (!cur || d.from !== cur.peerId) return;
    if (d.type === "call-answer" && cur.pc) { await cur.pc.setRemoteDescription({ type: "answer", sdp: d.payload.sdp }); for (const c of cur.pendingIce) try { await cur.pc.addIceCandidate(c); } catch {} cur.pendingIce = []; }
    else if (d.type === "call-ice") { if (cur.pc && cur.pc.remoteDescription) { try { await cur.pc.addIceCandidate(d.payload); } catch {} } else cur.pendingIce.push(d.payload); }
    else if (d.type === "call-end" || d.type === "call-reject") { if (cur.ringBox) cur.ringBox.remove(); hangup(false, d.type === "call-reject" && d.payload && d.payload.busy ? "callBusy" : null); }
  }
  function hangup(notify, msgKey) {
    if (!cur) return;
    if (notify) send({ type: "call-end", to: cur.peerId, payload: {} });
    clearTimeout(cur.timeout); clearTimeout(cur.ringTimer);
    try { cur.stream && cur.stream.getTracks().forEach((x) => x.stop()); } catch {}
    try { cur.pc && cur.pc.close(); } catch {}
    if (cur.overlay) cur.overlay.remove();
    if (cur.ringBox) cur.ringBox.remove();
    cur = null;
    if (msgKey) alert(t(msgKey));
  }

  function init(sendFn) { send = sendFn; }
  return { init, start, onSignal, hangup, active: () => !!cur };
})();
