// Invio file peer-to-peer (WebRTC DataChannel) cifrato end-to-end.
//
// - Il file NON passa dal server: viaggia direttamente tra i due dispositivi.
// - La chiave AES-256 e' casuale e sta SOLO nel frammento (#) del link: i browser
//   non inviano mai il frammento al server.
// - Ogni blocco da 16 KB e' cifrato con AES-GCM; l'indice del blocco e' dato
//   autenticato (AAD), quindi non si possono riordinare, duplicare o troncare.
// - Il server vede solo le informazioni di connessione (SDP) per il tempo di vita del link.
const P2P = (() => {
  const CHUNK = 16 * 1024;
  const enc = new TextEncoder(), dec = new TextDecoder();

  const b64u = (u8) => { let s = ""; for (const b of u8) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = (s) => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); };
  const aad = (i) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, i); return b; };

  async function newKey() {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    return { raw, b64: b64u(raw), key: await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]) };
  }
  const keyFromB64 = (s) => crypto.subtle.importKey("raw", unb64u(s), "AES-GCM", false, ["encrypt", "decrypt"]);

  async function seal(key, idx, bytes) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(idx) }, key, bytes));
    const out = new Uint8Array(12 + ct.length); out.set(iv, 0); out.set(ct, 12);
    return out.buffer;
  }
  async function open(key, idx, buf) {
    const u = new Uint8Array(buf);
    return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12), additionalData: aad(idx) }, key, u.slice(12)));
  }

  async function iceConfig() {
    try {
      const relay = (() => { try { return localStorage.getItem("sm_relay") === "1"; } catch { return false; } })();
      const r = await fetch("/api/ice" + (relay ? "?relay=1" : ""), { cache: "no-store" });
      const j = await r.json();
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

  // Mittente: invia header + blocchi sul canale aperto.
  async function sendFile(dc, key, file, onProgress) {
    dc.binaryType = "arraybuffer";
    dc.bufferedAmountLowThreshold = 1024 * 1024;
    const header = enc.encode(JSON.stringify({ name: file.name, size: file.size, type: file.type || "application/octet-stream" }));
    dc.send(await seal(key, 0, header));
    let idx = 1, sent = 0;
    for (let off = 0; off < file.size; off += CHUNK) {
      const bytes = new Uint8Array(await file.slice(off, off + CHUNK).arrayBuffer());
      if (dc.readyState !== "open") throw new Error("closed");
      if (dc.bufferedAmount > 4 * 1024 * 1024) {
        await new Promise((res) => { dc.onbufferedamountlow = () => { dc.onbufferedamountlow = null; res(); }; });
      }
      dc.send(await seal(key, idx++, bytes));
      sent += bytes.length;
      if (onProgress) onProgress(sent, file.size);
    }
  }

  // Destinatario: gestisce i messaggi in arrivo; ritorna un controller.
  function receiver(dc, key, { onHeader, onProgress, onDone, onError }) {
    dc.binaryType = "arraybuffer";
    let idx = 0, header = null, got = 0; const parts = [];
    let queue = Promise.resolve();
    dc.onmessage = (ev) => {
      queue = queue.then(async () => {
        try {
          const bytes = await open(key, idx, ev.data);
          if (idx === 0) {
            header = JSON.parse(dec.decode(bytes));
            if (typeof header.size !== "number" || header.size < 0 || header.size > 2 * 1024 * 1024 * 1024) throw new Error("bad");
            if (onHeader) onHeader(header);
          } else {
            parts.push(bytes); got += bytes.length;
            if (onProgress) onProgress(got, header.size);
          }
          idx++;
          if (header && got >= header.size && idx > 0 && (idx > 1 || header.size === 0)) {
            if (onDone) onDone(new Blob(parts, { type: header.type }), header);
            try { dc.send(new TextEncoder().encode("ok")); } catch {}
          }
        } catch (e) { if (onError) onError(e); }
      });
    };
  }

  return { CHUNK, b64u, unb64u, newKey, keyFromB64, seal, open, iceConfig, waitIce, sendFile, receiver };
})();
