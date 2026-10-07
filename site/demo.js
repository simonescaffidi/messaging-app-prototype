// Demo interattiva simulata (vanilla JS). Nessun dato lascia il browser.
// Testi da window.__DEMO_I18N. Codici: 1111 = personale, 2222 = copertura, 7777 = combinazione segreta.
(function () {
  var T = window.__DEMO_I18N;
  var root = document.getElementById("phone");
  if (!T || !root) return;
  var SECRET = "7777";
  var TIMERS = [0, 30, 300, 3600];
  var key = null;
  var S = { view: "chats", vtab: "files", files: [], cipherOn: false, pw: "", p2p: { step: 0, pct: 0 }, once: { step: 0, left: 0 }, call: { step: 0, code: "" }, sec: [true, false, false, false, false], profile: null, chats: [], open: null, showHidden: false, serverView: false, query: "", toast: "", scanning: false, err: "" };
  var tick = null;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function b64(u8) { var s = ""; for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return btoa(s); }

  function encrypt(text) {
    try {
      var p = key ? Promise.resolve(key) : crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt"]).then(function (k) { key = k; return k; });
      return p.then(function (k) {
        var iv = crypto.getRandomValues(new Uint8Array(12));
        return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, new TextEncoder().encode(text)).then(function (ct) {
          return b64(iv) + ":" + b64(new Uint8Array(ct));
        });
      });
    } catch (e) {
      return Promise.resolve(btoa(unescape(encodeURIComponent(text))).split("").reverse().join(""));
    }
  }

  function seed(kind) {
    var defs = kind === "cover"
      ? [{ id: "c0", name: T.nc, hidden: false, msgs: [{ from: "them", text: T.mc }] }]
      : [
          { id: "c1", name: T.n1, hidden: false, msgs: [{ from: "them", text: T.m1 }] },
          { id: "c2", name: T.n2, hidden: false, msgs: [{ from: "them", text: T.m2 }] },
          { id: "c3", name: T.n3, hidden: true, msgs: [{ from: "them", text: T.m3 }] }
        ];
    var jobs = [];
    defs.forEach(function (c) { c.msgs.forEach(function (m) { jobs.push(encrypt(m.text).then(function (x) { m.cipher = x; })); }); });
    return Promise.all(jobs).then(function () { return defs; });
  }

  function login(kind) {
    S.err = ""; S.scanning = false;
    seed(kind).then(function (chats) {
      S.profile = kind; S.chats = chats; S.open = null; S.showHidden = false; S.query = ""; S.serverView = false;
      startTick(); render();
    });
  }
  function lock() { S.view = "chats"; S.profile = null; S.open = null; S.showHidden = false; S.query = ""; S.toast = ""; stopTick(); render(); }

  function startTick() {
    stopTick();
    tick = setInterval(function () {
      var now = Date.now(), changed = false, live = false;
      S.chats.forEach(function (c) {
        var n = c.msgs.length;
        c.msgs = c.msgs.filter(function (m) { return !m.exp || m.exp > now; });
        if (c.msgs.length !== n) changed = true;
        c.msgs.forEach(function (m) { if (m.exp) live = true; });
      });
      if (changed || live) { if (S.open) renderChatBody(true); }
    }, 1000);
  }
  function stopTick() { if (tick) clearInterval(tick); tick = null; }

  function chatById(id) { for (var i = 0; i < S.chats.length; i++) if (S.chats[i].id === id) return S.chats[i]; return null; }

  // ---------- viste ----------
  function renderLogin() {
    root.innerHTML =
      '<div class="ph-login">' +
      '<div class="ph-logo">🔒</div>' +
      '<label for="ph-user">' + esc(T.userLabel) + "</label>" +
      '<input id="ph-user" type="text" autocomplete="off" value="demo" />' +
      '<label for="ph-code">' + esc(T.codeLabel) + "</label>" +
      '<input id="ph-code" type="password" autocomplete="off" placeholder="' + esc(T.codePh) + '" />' +
      '<button id="ph-enter" class="btn btn-primary">' + esc(T.enter) + "</button>" +
      '<button id="ph-bio" class="btn btn-ghost">' + (S.scanning ? "⏳ " + esc(T.bioScan) : "🫆 " + esc(T.bio)) + "</button>" +
      '<p class="ph-err" role="alert">' + esc(S.err) + "</p>" +
      "</div>";
    var inp = document.getElementById("ph-code");
    function go() {
      var v = inp.value.trim();
      var u = document.getElementById("ph-user").value.trim().toLowerCase();
      if (u === "demo" && v === "1111") login("main");
      else if (u === "demo" && v === "2222") login("cover");
      else { S.err = T.wrongCode; renderLogin(); }
    }
    document.getElementById("ph-enter").onclick = go;
    inp.onkeydown = function (e) { if (e.key === "Enter") go(); };
    document.getElementById("ph-user").onkeydown = inp.onkeydown;
    document.getElementById("ph-bio").onclick = function () {
      if (S.scanning) return;
      S.scanning = true; S.err = ""; renderLogin();
      setTimeout(function () { login("main"); }, 1200);
    };
  }

  function visibleChats() {
    var q = S.query.trim().toLowerCase();
    return S.chats.filter(function (c) {
      if (c.hidden && !S.showHidden) return false;
      return !q || c.name.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderList() {
    var items = visibleChats().map(function (c) {
      var last = c.msgs.length ? c.msgs[c.msgs.length - 1].text : "";
      return '<li><button class="ph-chat" data-id="' + c.id + '"><span class="ph-av">' + esc(c.name.charAt(0)) + "</span>" +
        '<span class="ph-ct"><strong>' + esc(c.name) + (c.hidden ? ' <em class="ph-tag">' + esc(T.hiddenTag) + "</em>" : "") + "</strong>" +
        "<small>" + esc(last) + "</small></span></button></li>";
    }).join("");
    root.innerHTML =
      '<div class="ph-bar"><strong>' + esc(T.chatsTitle) + '</strong><button id="ph-lock" class="ph-icon" aria-label="' + esc(T.lockBtn) + '">🔒 ' + esc(T.lockBtn) + "</button></div>" +
      '<input id="ph-search" class="ph-search" type="search" placeholder="' + esc(T.searchPh) + '" value="' + esc(S.query) + '" autocomplete="off" />' +
      '<ul class="ph-list">' + (items || '<li class="ph-empty">' + esc(T.empty) + "</li>") + "</ul>" +
      '<div class="ph-toast" role="status">' + esc(S.toast) + "</div>" + navHtml("chats");
    bindNav();
    document.getElementById("ph-lock").onclick = lock;
    var s = document.getElementById("ph-search");
    s.oninput = function () {
      if (s.value.trim() === SECRET) { S.showHidden = true; S.query = ""; S.toast = T.secretFound; renderList(); return; }
      S.query = s.value; S.toast = ""; var pos = s.selectionStart; renderList();
      var n = document.getElementById("ph-search"); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {}
    };
    Array.prototype.forEach.call(root.querySelectorAll(".ph-chat"), function (b) {
      b.onclick = function () { S.open = b.getAttribute("data-id"); S.toast = ""; render(); };
    });
  }

  function msgHtml(m) {
    var shown = S.serverView ? (m.cipher || "") : m.text;
    var left = m.exp ? Math.max(0, Math.ceil((m.exp - Date.now()) / 1000)) : 0;
    return '<div class="ph-msg ' + (m.from === "me" ? "me" : "them") + (S.serverView ? " cipher" : "") + '"><span>' + esc(shown) + "</span>" +
      (m.exp ? '<small class="ph-exp">⏱ ' + esc(T.expiresIn.replace("{s}", left)) + "</small>" : "") + "</div>";
  }
  function renderChatBody(keepInput) {
    var c = chatById(S.open); if (!c) return;
    var box = document.getElementById("ph-msgs"); if (!box) return;
    box.innerHTML = c.msgs.map(msgHtml).join("");
    box.scrollTop = box.scrollHeight;
  }

  function renderChat() {
    var c = chatById(S.open);
    var opts = T.timers.map(function (t, i) { return '<option value="' + TIMERS[i] + '">' + esc(t) + "</option>"; }).join("");
    root.innerHTML =
      '<div class="ph-bar"><button id="ph-back" class="ph-icon" aria-label="' + esc(T.back) + '">←</button><strong>' + esc(c.name) + "</strong>" +
      '<button id="ph-hide" class="ph-icon">' + esc(c.hidden ? T.unhide : T.hide) + "</button></div>" +
      '<div class="ph-sub"><span>🔒 ' + esc(T.e2eTag) + '</span><label class="ph-sv"><input type="checkbox" id="ph-sv"' + (S.serverView ? " checked" : "") + " /> " + esc(T.serverView) + "</label></div>" +
      '<div id="ph-msgs" class="ph-msgs"></div>' +
      '<form id="ph-form" class="ph-form"><select id="ph-timer" aria-label="timer">' + opts + "</select>" +
      '<input id="ph-text" type="text" placeholder="' + esc(T.msgPh) + '" autocomplete="off" /><button class="btn btn-primary btn-sm" type="submit">' + esc(T.send) + "</button></form>";
    renderChatBody();
    document.getElementById("ph-back").onclick = function () { S.open = null; render(); };
    document.getElementById("ph-hide").onclick = function () { c.hidden = !c.hidden; if (c.hidden && !S.showHidden) { S.open = null; } render(); };
    document.getElementById("ph-sv").onchange = function (e) { S.serverView = e.target.checked; renderChatBody(); };
    document.getElementById("ph-form").onsubmit = function (e) {
      e.preventDefault();
      var inp = document.getElementById("ph-text"), v = inp.value.trim(); if (!v) return;
      var secs = parseInt(document.getElementById("ph-timer").value, 10) || 0;
      inp.value = "";
      var m = { from: "me", text: v, cipher: "…", exp: secs ? Date.now() + secs * 1000 : 0 };
      c.msgs.push(m); renderChatBody();
      encrypt(v).then(function (x) { m.cipher = x; renderChatBody(); });
      setTimeout(function () {
        var r = T.replies[Math.floor(Math.random() * T.replies.length)];
        var rm = { from: "them", text: r, cipher: "…" };
        c.msgs.push(rm); if (S.open === c.id) renderChatBody();
        encrypt(r).then(function (x) { rm.cipher = x; if (S.open === c.id) renderChatBody(); });
      }, 1300);
    };
  }

  // ---------- Cassaforte (demo simulata) ----------
  var SAMPLES = [{ n: "vacanze.jpg", kb: 2480, img: true }, { n: "contratto.pdf", kb: 312 }, { n: "note.txt", kb: 4 }];
  function navHtml(active) {
    return '<nav class="ph-nav"><button data-nav="chats"' + (active === "chats" ? ' class="on"' : "") + ">💬 " + esc(T.sNavChats) + "</button>" +
      '<button data-nav="vault"' + (active === "vault" ? ' class="on"' : "") + ">🛡️ " + esc(T.sNavVault) + "</button></nav>";
  }
  function bindNav() {
    Array.prototype.forEach.call(root.querySelectorAll("[data-nav]"), function (b) {
      b.onclick = function () { S.view = b.getAttribute("data-nav"); S.open = null; render(); };
    });
  }
  function randHex(n) { var a = crypto.getRandomValues(new Uint8Array(n)), o = ""; for (var i = 0; i < a.length; i++) o += ("0" + a[i].toString(16)).slice(-2); return o; }
  function genPw() {
    var set = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*?", a = crypto.getRandomValues(new Uint32Array(18)), o = "";
    for (var i = 0; i < a.length; i++) o += set.charAt(a[i] % set.length);
    return o;
  }
  var VTABS = [["files", "sTabFiles"], ["pw", "sTabPw"], ["p2p", "sTabP2p"], ["once", "sTabOnce"], ["call", "sTabCall"], ["sec", "sTabSec"]];
  function vaultBody() {
    var h = "";
    if (S.vtab === "files") {
      h += '<button id="v-add" class="btn btn-primary btn-sm">+ ' + esc(T.sAddFile) + "</button>";
      if (S.files.length) h += '<label class="ph-sv"><input type="checkbox" id="v-cipher"' + (S.cipherOn ? " checked" : "") + " /> " + esc(T.sShowCipher) + "</label>";
      h += '<ul class="ph-vlist">' + (S.files.length ? S.files.map(function (f) {
        return "<li><span>" + (f.img ? "🖼️" : "📄") + " " + esc(f.n) + " <small>(" + f.kb + " KB)</small>" + (f.img ? ' <em class="ph-tag">🧼 ' + esc(T.sStripped) + "</em>" : "") + "</span>" +
          '<small class="ph-cipher">🔒 ' + esc(T.sEnc) + (S.cipherOn ? ": " + esc(f.c) : "") + "</small></li>";
      }).join("") : '<li class="ph-empty">' + esc(T.sFilesEmpty) + "</li>") + "</ul>";
    } else if (S.vtab === "pw") {
      h += '<button id="v-gen" class="btn btn-primary btn-sm">🎲 ' + esc(T.sGen) + "</button>";
      if (S.pw) h += '<div class="ph-pw"><code>' + esc(S.pw) + '</code><button id="v-copy" class="btn btn-ghost btn-sm">' + esc(T.sCopy) + "</button></div>" +
        '<div class="ph-meter" aria-label="' + esc(T.sStrength) + '"><i style="width:96%"></i></div><small>' + esc(T.sStrength) + " 96%</small>";
    } else if (S.vtab === "p2p") {
      var st = S.p2p.step;
      if (st === 0) h += '<button id="v-p2p" class="btn btn-primary btn-sm">🔗 ' + esc(T.sP2pCreate) + "</button>";
      else {
        h += '<div class="ph-link">securmy…/app/p2p.html#' + esc(S.p2p.id) + '.<span>••••••••</span></div><small>' + esc(T.sP2pLink) + "</small>";
        h += "<p>" + esc(st === 1 ? T.sP2pWait : st === 2 ? T.sP2pJoined : st === 3 ? T.sP2pSending + " " + S.p2p.pct + "%" : T.sP2pDone) + "</p>";
        if (st >= 2) h += '<div class="ph-meter"><i style="width:' + (st === 4 ? 100 : S.p2p.pct) + '%"></i></div>';
        if (st === 4) h += '<button id="v-p2p" class="btn btn-ghost btn-sm">↻</button>';
      }
      h += '<p class="ph-note">' + esc(T.sP2pNote) + "</p>";
    } else if (S.vtab === "once") {
      var o = S.once;
      if (o.step === 0) h += '<button id="v-once" class="btn btn-primary btn-sm">👁️ ' + esc(T.sOnceSend) + "</button>";
      else if (o.step === 1) h += '<div class="ph-msg them"><button id="v-tap" class="btn btn-ghost btn-sm">👁️ ' + esc(T.sOnceTap) + "</button></div>";
      else if (o.step === 2) h += '<div class="ph-msg them"><span>' + esc(T.sOnceText) + '</span><small class="ph-exp">⏱ ' + esc(T.sOnceIn.replace("{s}", o.left)) + "</small></div>";
      else h += '<div class="ph-msg them cipher"><span>🔥 ' + esc(T.sOnceGone) + '</span></div><button id="v-once" class="btn btn-ghost btn-sm">↻</button>';
    } else if (S.vtab === "call") {
      var c = S.call;
      if (c.step === 0) h += '<button id="v-call" class="btn btn-primary btn-sm">📞 ' + esc(T.sCallStart) + "</button>";
      else if (c.step === 1) h += "<p>" + esc(T.sCallRinging) + "</p>";
      else h += "<p>🔒 " + esc(T.sCallConnected) + '</p><p>' + esc(T.sCallCode) + '</p><p class="ph-code">' + esc(c.code) + " · " + esc(c.code) + "</p><small>" + esc(T.sCallHint) + '</small><p><button id="v-end" class="btn btn-ghost btn-sm">' + esc(T.sCallEnd) + "</button></p>";
    } else {
      var n = S.sec.filter(Boolean).length, pct = Math.round(n * 100 / S.sec.length);
      h += "<strong>" + esc(T.sSecTitle) + '</strong><div class="ph-meter"><i style="width:' + pct + '%"></i></div><small>' + esc(T.sSecLevel) + ": " + pct + "%</small><ul class=\"ph-vlist\">" +
        S.sec.map(function (v, i) { return '<li><button class="ph-chk" data-sec="' + i + '">' + (v ? "✅" : "⚠️") + " " + esc(T["sSec" + (i + 1)]) + "</button></li>"; }).join("") + "</ul><small>" + esc(T.sSecTap) + "</small>";
    }
    return h;
  }
  function renderVault() {
    var tabs = VTABS.map(function (t) { return '<button data-vt="' + t[0] + '"' + (S.vtab === t[0] ? ' class="on"' : "") + ">" + esc(T[t[1]]) + "</button>"; }).join("");
    root.innerHTML = '<div class="ph-bar"><strong>🛡️ ' + esc(T.sNavVault) + '</strong><button id="ph-lock" class="ph-icon">🔒 ' + esc(T.lockBtn) + "</button></div>" +
      '<div class="ph-tabs">' + tabs + '</div><div class="ph-vbody">' + vaultBody() + "</div>" + navHtml("vault");
    bindNav();
    document.getElementById("ph-lock").onclick = lock;
    Array.prototype.forEach.call(root.querySelectorAll("[data-vt]"), function (b) { b.onclick = function () { S.vtab = b.getAttribute("data-vt"); renderVault(); }; });
    var g = function (id) { return document.getElementById(id); };
    if (g("v-add")) g("v-add").onclick = function () {
      var smp = SAMPLES[S.files.length % SAMPLES.length];
      var f = { n: smp.n, kb: smp.kb, img: !!smp.img, c: "…" }; S.files.push(f); renderVault();
      encrypt(smp.n + randHex(24)).then(function (x) { f.c = x.slice(0, 44) + "…"; if (S.view === "vault" && S.vtab === "files") renderVault(); });
    };
    if (g("v-cipher")) g("v-cipher").onchange = function (e) { S.cipherOn = e.target.checked; renderVault(); };
    if (g("v-gen")) g("v-gen").onclick = function () { S.pw = genPw(); renderVault(); };
    if (g("v-copy")) g("v-copy").onclick = function () { g("v-copy").textContent = "✓ " + T.sCopied; };
    if (g("v-p2p")) g("v-p2p").onclick = function () {
      S.p2p = { step: 1, pct: 0, id: randHex(11) }; renderVault();
      setTimeout(function () { S.p2p.step = 2; refreshV("p2p"); }, 1400);
      setTimeout(function () { S.p2p.step = 3; refreshV("p2p"); var iv = setInterval(function () { S.p2p.pct = Math.min(100, S.p2p.pct + 12); if (S.p2p.pct >= 100) { clearInterval(iv); S.p2p.step = 4; } refreshV("p2p"); }, 300); }, 2600);
    };
    if (g("v-once")) g("v-once").onclick = function () { S.once = { step: 1, left: 0 }; renderVault(); };
    if (g("v-tap")) g("v-tap").onclick = function () {
      S.once = { step: 2, left: 6 }; renderVault();
      var iv = setInterval(function () { S.once.left--; if (S.once.left <= 0) { clearInterval(iv); S.once.step = 3; } refreshV("once"); }, 1000);
    };
    if (g("v-call")) g("v-call").onclick = function () {
      S.call = { step: 1, code: String(1000 + (crypto.getRandomValues(new Uint16Array(1))[0] % 9000)) }; renderVault();
      setTimeout(function () { if (S.call.step === 1) { S.call.step = 2; refreshV("call"); } }, 1400);
    };
    if (g("v-end")) g("v-end").onclick = function () { S.call = { step: 0, code: "" }; renderVault(); };
    Array.prototype.forEach.call(root.querySelectorAll("[data-sec]"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-sec"); S.sec[i] = !S.sec[i]; renderVault(); }; });
  }
  function refreshV(tab) { if (S.profile && S.view === "vault" && S.vtab === tab) renderVault(); }

  function render() {
    if (!S.profile) renderLogin();
    else if (S.view === "vault") renderVault();
    else if (S.open) renderChat();
    else renderList();
  }
  render();
})();
