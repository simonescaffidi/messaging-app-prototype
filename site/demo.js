// Demo interattiva simulata (vanilla JS). Nessun dato lascia il browser.
// Testi da window.__DEMO_I18N. Codici: 1111 = personale, 2222 = copertura, 7777 = combinazione segreta.
(function () {
  var T = window.__DEMO_I18N;
  var root = document.getElementById("phone");
  if (!T || !root) return;
  var SECRET = "7777";
  var TIMERS = [0, 30, 300, 3600];
  var key = null;
  var S = { profile: null, chats: [], open: null, showHidden: false, serverView: false, query: "", toast: "", scanning: false, err: "" };
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
  function lock() { S.profile = null; S.open = null; S.showHidden = false; S.query = ""; S.toast = ""; stopTick(); render(); }

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
      '<label for="ph-code">' + esc(T.codeLabel) + "</label>" +
      '<input id="ph-code" type="password" inputmode="numeric" autocomplete="off" placeholder="' + esc(T.codePh) + '" />' +
      '<button id="ph-enter" class="btn btn-primary">' + esc(T.enter) + "</button>" +
      '<button id="ph-bio" class="btn btn-ghost">' + (S.scanning ? "⏳ " + esc(T.bioScan) : "🫆 " + esc(T.bio)) + "</button>" +
      '<p class="ph-err" role="alert">' + esc(S.err) + "</p>" +
      "</div>";
    var inp = document.getElementById("ph-code");
    function go() {
      var v = inp.value.trim();
      if (v === "1111") login("main");
      else if (v === "2222") login("cover");
      else { S.err = T.wrongCode; renderLogin(); }
    }
    document.getElementById("ph-enter").onclick = go;
    inp.onkeydown = function (e) { if (e.key === "Enter") go(); };
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
      '<div class="ph-toast" role="status">' + esc(S.toast) + "</div>";
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

  function render() {
    if (!S.profile) renderLogin();
    else if (S.open) renderChat();
    else renderList();
  }
  render();
})();
