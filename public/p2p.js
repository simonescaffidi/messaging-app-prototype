// Pagina pubblica del destinatario: nessun account necessario.
(function () {
  const $ = (s) => document.querySelector(s);
  const t = (k) => I18N.t(k);
  const sel = $("#lang-select");
  I18N.LANGS.forEach((c) => { const o = document.createElement("option"); o.value = c; o.textContent = I18N.LANG_NAMES[c]; if (c === I18N.current) o.selected = true; sel.appendChild(o); });
  sel.addEventListener("change", () => { I18N.setLang(sel.value); });
  I18N.apply();

  const fmt = (n) => n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
  const status = (k, cls) => { $("#p2p-status").textContent = t(k); $("#p2p-status").className = "subtitle" + (cls ? " " + cls : ""); };

  const m = /^#([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(location.hash);
  if (!m) { status("p2pBadLink", "error"); return; }
  const id = m[1], keyB64 = m[2];
  history.replaceState(null, "", location.pathname); // la chiave non resta nella barra degli indirizzi

  (async () => {
    status("p2pConnecting");
    let key;
    try { key = await P2P.keyFromB64(keyB64); } catch { return status("p2pBadLink", "error"); }
    let offer;
    for (let tries = 0; tries < 20; tries++) {
      const r = await fetch("/api/p2p/" + id + "/offer", { cache: "no-store" });
      if (r.status === 425) { status("p2pWaitSender"); await new Promise((x) => setTimeout(x, 3000)); continue; }
      if (!r.ok) return status("p2pBadLink", "error");
      offer = await r.json(); break;
    }
    if (!offer) return status("p2pWaitSender", "error");

    const pc = new RTCPeerConnection(await P2P.iceConfig());
    let finished = false;
    pc.ondatachannel = (ev) => {
      const dc = ev.channel;
      let blob = null, hdr = null;
      P2P.receiver(dc, key, {
        onHeader: (h) => { hdr = h; $("#p2p-name").textContent = h.name; $("#p2p-size").textContent = fmt(h.size); $("#p2p-file").classList.remove("hidden"); $("#p2p-bar").classList.remove("hidden"); status("p2pReceiving"); },
        onProgress: (g, tot) => { $("#p2p-bar").value = tot ? Math.round(g * 100 / tot) : 100; },
        onDone: (b, h) => {
          finished = true; blob = b; $("#p2p-bar").value = 100; status("p2pReady", "ok");
          $("#p2p-save").classList.remove("hidden"); $("#p2p-close").classList.remove("hidden");
          $("#p2p-save").onclick = () => {
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = h.name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_") || "file"; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 60000);
          };
        },
        onError: () => status("p2pBadLink", "error")
      });
    };
    pc.onconnectionstatechange = () => { if (!finished && (pc.connectionState === "failed")) status("p2pFail", "error"); };
    await pc.setRemoteDescription({ type: "offer", sdp: offer.sdp });
    await pc.setLocalDescription(await pc.createAnswer());
    await P2P.waitIce(pc);
    const r = await fetch("/api/p2p/" + id + "/answer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sdp: pc.localDescription.sdp }) });
    if (!r.ok) return status("p2pBadLink", "error");
    status("p2pConnecting");
  })().catch(() => status("p2pFail", "error"));
})();
