// Cookie banner GDPR-compliant, vanilla JS, nessuna dipendenza esterna.
// Le stringhe (11 lingue) sono iniettate da ogni pagina in window.__COOKIE_I18N
// dal generatore (tools/build-site.js). Nessuno script di tracciamento e'
// presente: usare window.onCookieConsent per eventuali strumenti futuri.
(function () {
  var COOKIE_NAME = "cookie_consent_v1";
  var listeners = [];

  var FALLBACK = {
    text: 'Utilizziamo cookie tecnici necessari e, previo consenso, cookie statistici. Consulta la <a href="/privacy-policy.html">Privacy Policy</a> e la <a href="/cookie-policy.html">Cookie Policy</a>.',
    reject: "Rifiuta",
    customize: "Personalizza",
    accept: "Accetta tutti",
    statsQuestion: "Vuoi accettare i cookie statistici?"
  };
  var s = window.__COOKIE_I18N || FALLBACK;

  window.onCookieConsent = function (cb) {
    var existing = getConsent();
    if (existing) { cb(existing); } else { listeners.push(cb); }
  };

  function getConsent() {
    try {
      var raw = localStorage.getItem(COOKIE_NAME);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function setConsent(consent) {
    try { localStorage.setItem(COOKIE_NAME, JSON.stringify(consent)); } catch (e) {}
    var el = document.getElementById("cookie-banner");
    if (el) el.style.display = "none";
    listeners.forEach(function (cb) { cb(consent); });
  }

  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.id = "cookie-banner";
    wrap.className = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p class="cookie-banner-text">' + s.text + '</p>' +
        '<div class="cookie-banner-actions">' +
          '<button id="cb-reject" type="button">' + s.reject + '</button>' +
          '<button id="cb-customize" type="button">' + s.customize + '</button>' +
          '<button id="cb-accept" type="button" class="primary">' + s.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    document.getElementById("cb-accept").addEventListener("click", function () {
      setConsent({ necessary: true, statistics: true, marketing: false });
    });
    document.getElementById("cb-reject").addEventListener("click", function () {
      setConsent({ necessary: true, statistics: false, marketing: false });
    });
    document.getElementById("cb-customize").addEventListener("click", function () {
      var statistics = confirm(s.statsQuestion);
      setConsent({ necessary: true, statistics: statistics, marketing: false });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!getConsent()) buildBanner();
  });
})();
