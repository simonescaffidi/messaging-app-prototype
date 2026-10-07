// Securmy Suite: cassaforte file, note, password, invio P2P, pulizia metadati,
// controllo di sicurezza, verifica in due passaggi, backup e cancellazione di emergenza.
//
// Tutto cio' che l'utente salva qui e' cifrato NEL DISPOSITIVO (AES-256-GCM) con una
// chiave dati custodita nella cassaforte, che a sua volta e' protetta dalla password.
// Il server non riceve mai file, note o password.
const Suite = (() => {
  const $ = (s) => document.querySelector(s);
  const t = (k, r) => { let s = I18N.t(k); if (r) for (const x in r) s = s.replace("{" + x + "}", r[x]); return s; };
  const MAX_FILE = 100 * 1024 * 1024;
  let tab = "files";
  let hooks = { sendInChat: null };

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) el.append(kid.nodeType ? kid : document.createTextNode(kid));
    return el;
  }
  const fmtSize = (n) => n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(16).padStart(2, "0")).join("");
  const pid = () => (typeof state !== "undefined" && state.me ? state.me.publicId : null);

  // ------------------------------------------------------------------ IndexedDB cifrato
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      const r = indexedDB.open("securmy", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("items", { keyPath: "key" });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const wrap = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
  async function putItem(it) { const d = await db(); return wrap(d.transaction("items", "readwrite").objectStore("items").put(it)); }
  async function delItem(key) { const d = await db(); return wrap(d.transaction("items", "readwrite").objectStore("items").delete(key)); }
  async function getItem(key) { const d = await db(); return wrap(d.transaction("items").objectStore("items").get(key)); }
  async function allItems() {
    const d = await db();
    return wrap(d.transaction("items").objectStore("items").getAll(IDBKeyRange.bound(pid() + ":", pid() + ":￿")));
  }
  async function listKind(kind) {
    const out = [];
    for (const it of await allItems()) {
      if (it.kind !== kind) continue;
      try { out.push({ it, meta: await E2E.vaultOpen(it.meta) }); } catch {}
    }
    return out.sort((a, b) => (b.it.created || 0) - (a.it.created || 0));
  }
  async function saveMeta(kind, id, meta, blob) {
    await putItem({ key: pid() + ":" + id, pid: pid(), id, kind, meta: await E2E.vaultSeal(meta), blob: blob || null, created: Date.now() });
  }
  async function updateMeta(it, meta) { await putItem({ ...it, meta: await E2E.vaultSeal(meta) }); }

  // ------------------------------------------------------------------ utilita'
  function download(blob, name) {
    const a = h("a", { href: URL.createObjectURL(blob), download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }
  async function cleanImage(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return null;
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { bmp = await createImageBitmap(file); }
    const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height;
    c.getContext("2d").drawImage(bmp, 0, 0);
    return new Promise((r) => c.toBlob(r, file.type, 0.92)); // il ridisegno elimina EXIF, GPS e miniature
  }
  async function copyTemp(text, el) {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    if (el) el.textContent = "✓ " + t("copied");
    setTimeout(async () => { try { if ((await navigator.clipboard.readText()) === text) await navigator.clipboard.writeText(""); } catch { try { await navigator.clipboard.writeText(""); } catch {} } }, 20000);
  }
  function locked() { return !E2E.isUnlocked(); }

  // ------------------------------------------------------------------ pannello
  const TABS = [["files", "tabFiles"], ["notes", "tabNotes"], ["pw", "tabPw"], ["send", "tabSend"], ["clean", "tabClean"], ["sec", "tabSec"], ["backup", "tabBackup"]];
  function open(which) {
    if (which) tab = which;
    $("#suite-modal").classList.remove("hidden");
    render();
  }
  function close() { $("#suite-modal").classList.add("hidden"); }
  function render() {
    const tabs = $("#suite-tabs"); tabs.innerHTML = "";
    for (const [id, key] of TABS) tabs.append(h("button", { class: id === tab ? "active" : "", onclick: () => { tab = id; render(); } }, t(key)));
    const body = $("#suite-body"); body.innerHTML = "";
    if (locked() && tab !== "sec") { body.append(h("p", { class: "error" }, t("vaultLockedMsg"))); return; }
    ({ files: tFiles, notes: tNotes, pw: tPw, send: tSend, clean: tClean, sec: tSec, backup: tBackup })[tab](body);
  }

  // ------------------------------------------------------------------ File
  async function tFiles(body) {
    const strip = h("input", { type: "checkbox", checked: true, id: "strip-meta" });
    const input = h("input", { type: "file", multiple: true, onchange: async () => {
      for (const f of input.files) {
        if (f.size > MAX_FILE) { alert(f.name + ": " + t("fileTooBig")); continue; }
        let blob = f, note = "";
        if (strip.checked) { const c = await cleanImage(f).catch(() => null); if (c) { blob = c; note = "m"; } }
        const bytes = new Uint8Array(await blob.arrayBuffer());
        await saveMeta("file", rid(), { name: f.name, size: blob.size, type: f.type || "application/octet-stream", clean: note }, await E2E.sealBytes(bytes));
      }
      input.value = ""; render();
    } });
    body.append(h("p", { class: "hint" }, t("filesHint")), h("label", { class: "checkbox-row" }, strip, h("span", {}, t("stripMeta"))), input);
    const items = await listKind("file");
    if (!items.length) body.append(h("p", { class: "hint" }, t("noItems")));
    for (const { it, meta } of items) {
      body.append(h("div", { class: "suite-row" },
        h("span", { class: "grow", title: meta.name }, "📄 " + meta.name + " · " + fmtSize(meta.size) + (meta.clean ? " · 🧼" : "")),
        h("span", { class: "acts" },
          h("button", { onclick: async () => { const full = await getItem(it.key); download(new Blob([await E2E.openBytes(full.blob)], { type: meta.type }), meta.name); } }, t("btnDownload")),
          h("button", { onclick: async () => { const full = await getItem(it.key); const bytes = await E2E.openBytes(full.blob); tab = "send"; render(); startSend(new File([bytes], meta.name, { type: meta.type })); } }, t("btnSendP2P")),
          h("button", { onclick: async () => { if (confirm(t("confirmDelete"))) { await delItem(it.key); render(); } } }, "🗑"))));
    }
  }

  // ------------------------------------------------------------------ Note
  async function tNotes(body, editing) {
    const items = await listKind("note");
    const title = h("input", { type: "text", maxlength: 120, placeholder: t("noteTitle"), value: editing ? editing.meta.title : "" });
    const text = h("textarea", { maxlength: 20000, placeholder: t("noteBody") }); text.value = editing ? editing.meta.body : "";
    body.append(h("div", { class: "suite-form" }, title, text,
      h("button", { class: "primary", onclick: async () => {
        if (!title.value.trim() && !text.value.trim()) return;
        const meta = { title: title.value.trim() || "—", body: text.value };
        if (editing) await updateMeta(editing.it, meta); else await saveMeta("note", rid(), meta);
        render();
      } }, t("btnSave"))));
    if (!items.length) body.append(h("p", { class: "hint" }, t("noItems")));
    for (const n of items) {
      body.append(h("div", { class: "suite-row" },
        h("span", { class: "grow", title: n.meta.body.slice(0, 200) }, "📝 " + n.meta.title),
        h("span", { class: "acts" },
          h("button", { onclick: () => { const b = $("#suite-body"); b.innerHTML = ""; tNotes(b, n); } }, t("btnEdit")),
          h("button", { onclick: async () => { if (confirm(t("confirmDelete"))) { await delItem(n.it.key); render(); } } }, "🗑"))));
    }
  }

  // ------------------------------------------------------------------ Password
  function genPassword(len, sets) {
    const pools = [];
    if (sets.lower) pools.push("abcdefghijkmnopqrstuvwxyz");
    if (sets.upper) pools.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
    if (sets.digits) pools.push("23456789");
    if (sets.symbols) pools.push("!@#$%^&*()-_=+[]{}?");
    if (!pools.length) pools.push("abcdefghijkmnopqrstuvwxyz");
    const all = pools.join("");
    const rnd = (n) => { const a = new Uint32Array(1); const lim = Math.floor(0x100000000 / n) * n; do { crypto.getRandomValues(a); } while (a[0] >= lim); return a[0] % n; };
    const out = pools.map((p) => p[rnd(p.length)]);
    while (out.length < len) out.push(all[rnd(all.length)]);
    for (let i = out.length - 1; i > 0; i--) { const j = rnd(i + 1); [out[i], out[j]] = [out[j], out[i]]; }
    return out.slice(0, len).join("");
  }
  async function tPw(body, editing) {
    const items = await listKind("pw");
    const site = h("input", { type: "text", maxlength: 120, placeholder: t("pwSite"), value: editing ? editing.meta.site : "" });
    const user = h("input", { type: "text", maxlength: 120, placeholder: t("pwUser"), autocomplete: "off", value: editing ? editing.meta.user : "" });
    const pw = h("input", { type: "text", maxlength: 256, placeholder: t("pwValue"), autocomplete: "off", value: editing ? editing.meta.pw : "" });
    const notes = h("input", { type: "text", maxlength: 300, placeholder: t("pwNotes"), value: editing ? editing.meta.notes || "" : "" });
    const len = h("input", { type: "range", min: 12, max: 48, value: 20 });
    const lenLbl = h("span", {}, "20"); len.addEventListener("input", () => (lenLbl.textContent = len.value));
    const gen = h("button", { type: "button", onclick: () => { pw.value = genPassword(Number(len.value), { lower: true, upper: true, digits: true, symbols: true }); } }, "🎲 " + t("pwGen"));
    body.append(h("div", { class: "suite-form" }, site, user, pw,
      h("div", { class: "suite-row" }, h("span", {}, t("pwLen") + ": ", lenLbl), len, gen), notes,
      h("button", { class: "primary", onclick: async () => {
        if (!site.value.trim() || !pw.value) return;
        const meta = { site: site.value.trim(), user: user.value.trim(), pw: pw.value, notes: notes.value.trim() };
        if (editing) await updateMeta(editing.it, meta); else await saveMeta("pw", rid(), meta);
        render();
      } }, t("btnSave"))));
    if (!items.length) body.append(h("p", { class: "hint" }, t("noItems")));
    for (const p of items) {
      const status = h("span", { class: "hint" });
      body.append(h("div", { class: "suite-row" },
        h("span", { class: "grow" }, "🔑 " + p.meta.site + (p.meta.user ? " · " + p.meta.user : ""), " ", status),
        h("span", { class: "acts" },
          h("button", { onclick: () => copyTemp(p.meta.pw, status) }, t("btnCopy")),
          h("button", { onclick: (e) => { status.textContent = status.textContent ? "" : p.meta.pw; e.target.textContent = status.textContent ? "🙈" : "👁"; } }, "👁"),
          h("button", { onclick: () => { const b = $("#suite-body"); b.innerHTML = ""; tPw(b, p); } }, t("btnEdit")),
          h("button", { onclick: async () => { if (confirm(t("confirmDelete"))) { await delItem(p.it.key); render(); } } }, "🗑"))));
    }
  }

  // ------------------------------------------------------------------ Invio P2P via link
  let send = null; // { id, link, status, pct, pc, timer }
  function stopSend(revoke) {
    if (!send) return;
    clearInterval(send.timer);
    try { send.pc && send.pc.close(); } catch {}
    if (revoke && send.id) api("/api/p2p/" + send.id, { method: "DELETE" }).catch(() => {});
    send = null;
  }
  async function startSend(file, minutes) {
    stopSend(true);
    send = { file, status: "sendWaiting", pct: 0 };
    const cur = send; render();
    try {
      const { id, expires } = await api("/api/p2p", { method: "POST", body: JSON.stringify({ minutes: minutes || 10 }) });
      const k = await P2P.newKey();
      cur.id = id; cur.expires = expires;
      cur.link = location.origin + "/app/p2p.html#" + id + "." + k.b64;
      const pc = new RTCPeerConnection(await P2P.iceConfig()); cur.pc = pc;
      const dc = pc.createDataChannel("file");
      dc.onopen = async () => {
        cur.status = "sendProgress"; update();
        try {
          await P2P.sendFile(dc, k.key, file, (s, tot) => { cur.pct = tot ? Math.round(s * 100 / tot) : 100; update(); });
          cur.status = "sendDone"; cur.pct = 100; update();
        } catch { cur.status = "sendFail"; update(); }
      };
      dc.onmessage = () => { cur.status = "sendDone"; update(); setTimeout(() => stopSend(true), 2000); };
      await pc.setLocalDescription(await pc.createOffer());
      await P2P.waitIce(pc);
      await api("/api/p2p/" + id + "/offer", { method: "POST", body: JSON.stringify({ sdp: pc.localDescription.sdp }) });
      update();
      let answered = false;
      cur.timer = setInterval(async () => {
        if (send !== cur) return;
        if (Date.now() > cur.expires && !answered) { cur.status = "sendFail"; stopSend(false); update(); return; }
        try {
          const s = await api("/api/p2p/" + id + "/state");
          if (s.joined && cur.status === "sendWaiting") { cur.status = "sendJoined"; update(); }
          if (s.answer && !answered) { answered = true; await pc.setRemoteDescription({ type: "answer", sdp: s.answer }); }
        } catch { /* link scaduto */ }
      }, 1500);
      pc.onconnectionstatechange = () => { if (pc.connectionState === "failed" && cur.status !== "sendDone") { cur.status = "sendFail"; update(); } };
    } catch (e) { cur.status = "sendFail"; cur.err = e.message; update(); }
  }
  function update() { if (tab === "send" && !$("#suite-modal").classList.contains("hidden")) render(); }
  function tSend(body) {
    body.append(h("p", { class: "hint" }, t("sendHint")), h("p", { class: "hint" }, t("sendOneUse")));
    if (send) {
      const bar = h("progress", { value: send.pct, max: 100 });
      body.append(h("p", { class: send.status === "sendFail" ? "error" : "subtitle" }, t(send.status) + (send.status === "sendProgress" ? " " + send.pct + "%" : "")), bar);
      if (send.link) {
        body.append(h("div", { class: "suite-link" }, send.link),
          h("div", { class: "suite-row" },
            h("button", { onclick: async (e) => { await navigator.clipboard.writeText(send.link).catch(() => {}); e.target.textContent = "✓"; } }, t("sendCopyLink")),
            hooks.sendInChat ? h("button", { onclick: () => { hooks.sendInChat(send.link); close(); } }, t("sendInChat")) : null,
            h("button", { onclick: () => { stopSend(true); render(); } }, t("sendRevoke"))));
      }
      return;
    }
    const exp = h("select", {}, h("option", { value: 10 }, t("min10")), h("option", { value: 60 }, t("min60")));
    const input = h("input", { type: "file", onchange: () => { if (input.files[0]) startSend(input.files[0], Number(exp.value)); } });
    body.append(h("label", {}, t("sendExpire")), exp, h("label", {}, t("sendPick")), input);
  }

  // ------------------------------------------------------------------ Pulisci foto
  function tClean(body) {
    body.append(h("p", { class: "hint" }, t("cleanHint")));
    const out = h("p", { class: "subtitle" });
    const input = h("input", { type: "file", accept: "image/jpeg,image/png,image/webp,*/*", onchange: async () => {
      const f = input.files[0]; if (!f) return;
      const c = await cleanImage(f).catch(() => null);
      if (!c) { out.textContent = t("metaNone"); return; }
      download(c, f.name.replace(/(\.[^.]+)?$/, "-clean$1"));
      out.textContent = "🧼 " + t("cleanDone"); input.value = "";
    } });
    body.append(h("label", {}, t("cleanPick")), input, out);
  }

  // ------------------------------------------------------------------ Controllo di sicurezza + 2FA
  async function tSec(body) {
    const me = state.me || {};
    const rows = [];
    rows.push(["chkVault", E2E.isUnlocked()]);
    rows.push(["chkPw", !me.weakPassword]);
    rows.push(["chkEmail", !!me.emailVerified]);
    rows.push(["chkBio", !!me.hasBiometric]);
    rows.push(["chk2fa", !!me.has2fa]);
    let withKey = 0, verified = 0;
    for (const c of state.chats || []) if (c.with.publicKey) { withKey++; try { if ((await E2E.checkPeer(me.publicId, c.with.publicId, c.with.publicKey)).verified) verified++; } catch {} }
    rows.push(["chkKeys", withKey === 0 || verified === withKey, { a: verified, b: withKey }]);
    const last = Number(localStorage.getItem("sm_" + me.publicId + "_backup") || 0);
    rows.push(["chkBackup", last && Date.now() - last < 30 * 86400 * 1000]);
    const score = Math.round(rows.filter((r) => r[1]).length * 100 / rows.length);
    body.append(h("h3", {}, t("secTitle")), h("p", { class: "hint" }, t("scoreLabel") + ": " + score + "%"), h("div", { class: "score" }, h("div", { style: "width:" + score + "%" })));
    for (const [k, ok, r] of rows) body.append(h("div", { class: "chk" }, h("span", { class: "dot " + (ok ? "ok" : "no") }, ok ? "✓" : "!"), h("span", {}, t(k, r))));

    body.append(h("h3", {}, t("tfaTitle")));
    const msg = h("p", { class: "hint" });
    if (me.has2fa) {
      const pw = h("input", { type: "password", placeholder: t("loginPassLabel"), autocomplete: "current-password" });
      const code = h("input", { type: "text", inputmode: "numeric", maxlength: 6, placeholder: t("tfaCodeLabel") });
      body.append(h("p", { class: "hint" }, "✅ " + t("tfaOn")), pw, code,
        h("button", { class: "danger", onclick: async () => {
          try { await api("/api/2fa/disable", { method: "POST", body: JSON.stringify({ password: pw.value, code: code.value }) }); me.has2fa = false; render(); }
          catch (e) { msg.textContent = e.message; }
        } }, t("tfaDisable")), msg);
    } else {
      body.append(h("button", { onclick: async () => {
        try {
          const r = await api("/api/2fa/setup", { method: "POST", body: "{}" });
          const code = h("input", { type: "text", inputmode: "numeric", maxlength: 6, placeholder: t("tfaCodeLabel") });
          const box = h("div", { class: "suite-form" }, h("p", { class: "hint" }, t("tfaScan")), h("div", { class: "suite-link" }, r.secret), h("a", { href: r.uri }, r.uri.slice(0, 60) + "…"), h("p", { class: "hint" }, t("tfaConfirm")), code,
            h("button", { class: "primary", onclick: async () => {
              try { await api("/api/2fa/enable", { method: "POST", body: JSON.stringify({ code: code.value }) }); me.has2fa = true; render(); } catch (e) { msg.textContent = e.message; }
            } }, t("tfaEnable")), msg);
          body.append(box);
        } catch (e) { msg.textContent = e.message; body.append(msg); }
      } }, t("tfaEnable")));
    }

    body.append(h("h3", {}, t("panicTitle")), h("p", { class: "hint" }, t("panicHint")),
      h("button", { class: "danger", onclick: async () => {
        if (!confirm(t("panicConfirm"))) return;
        try { const d = await db(); d.close(); dbp = null; await new Promise((res) => { const r = indexedDB.deleteDatabase("securmy"); r.onsuccess = r.onerror = r.onblocked = () => res(); }); } catch {}
        E2E.wipeLocal(me.publicId);
        try { localStorage.removeItem("webauthn_enrolled"); } catch {}
        alert(t("panicDone")); location.reload();
      } }, t("panicBtn")));
  }

  // ------------------------------------------------------------------ Backup cifrato
  const readB64 = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] || ""); r.onerror = rej; r.readAsDataURL(blob); });
  const fromB64 = async (s) => new Uint8Array(await (await fetch("data:application/octet-stream;base64," + s)).arrayBuffer());
  function tBackup(body) {
    const pass = h("input", { type: "password", minlength: 10, maxlength: 128, placeholder: t("backupPass"), autocomplete: "new-password" });
    const msg = h("p", { class: "hint" });
    body.append(h("p", { class: "hint" }, t("backupHint")), pass,
      h("div", { class: "suite-row" },
        h("button", { class: "primary", onclick: async () => {
          if (pass.value.length < 10) { msg.textContent = t("backupPass"); return; }
          const items = [];
          for (const it of await allItems()) items.push({ id: it.id, kind: it.kind, created: it.created, meta: it.meta, blob: it.blob ? await readB64(new Blob([it.blob])) : null });
          const file = { app: "securmy-backup", v: 1, wrap: await E2E.wrapDataKey(pass.value), items };
          download(new Blob([JSON.stringify(file)], { type: "application/json" }), "securmy-" + new Date().toISOString().slice(0, 10) + ".securmy");
          localStorage.setItem("sm_" + pid() + "_backup", String(Date.now()));
          msg.textContent = "✓ " + t("backupDone");
        } }, t("backupExport")),
        h("label", { class: "small" }, t("backupImport"), h("input", { type: "file", accept: ".securmy,application/json", style: "display:none", onchange: async (e) => {
          const f = e.target.files[0]; e.target.value = ""; if (!f) return;
          try {
            const j = JSON.parse(await f.text());
            if (j.app !== "securmy-backup") throw new Error("bad");
            const k = await E2E.unwrapDataKey(pass.value, j.wrap);
            let n = 0;
            for (const x of j.items) {
              const meta = await E2E.openWithKey(k, x.meta);
              let blob = null;
              if (x.blob) blob = await E2E.sealBytes(await E2E.openBytesWith(k, await fromB64(x.blob)));
              await putItem({ key: pid() + ":" + x.id, pid: pid(), id: x.id, kind: x.kind, meta: await E2E.vaultSeal(meta), blob, created: x.created || Date.now() });
              n++;
            }
            msg.textContent = "✓ " + t("backupRestored", { n });
          } catch { msg.textContent = t("backupBad"); }
        } }))), msg);
  }

  function init(h2) {
    hooks = Object.assign(hooks, h2 || {});
    $("#btn-suite").addEventListener("click", () => open());
    $("#suite-close").addEventListener("click", close);
  }
  function reset() { stopSend(true); tab = "files"; }
  return { init, open, close, reset, render };
})();
