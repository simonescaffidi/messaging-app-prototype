// Cookie banner GDPR-compliant, vanilla JS, nessuna dipendenza esterna.
// Nessuno script di tracciamento e' presente in questo sito: il banner
// esiste comunque per coerenza GDPR e come base pronta se in futuro
// si aggiungono strumenti statistici (vedi window.onCookieConsent).
(function () {
  var COOKIE_NAME = "cookie_consent_v1";
  var listeners = [];
  var lang = document.documentElement.lang === "en" ? "en" : "it";

  var STRINGS = {
    it: {
      text: 'Utilizziamo cookie tecnici necessari e, previo consenso, cookie statistici. Consulta la <a href="/privacy-policy.html">Privacy Policy</a> e la <a href="/cookie-policy.html">Cookie Policy</a>.',
      reject: "Rifiuta",
      customize: "Personalizza",
      accept: "Accetta tutti",
      statsQuestion: "Vuoi accettare i cookie statistici?"
    },
    en: {
      text: 'We use necessary technical cookies and, with your consent, statistics cookies. See our <a href="/en/privacy-policy.html">Privacy Policy</a> and <a href="/en/cookie-policy.html">Cookie Policy</a>.',
      reject: "Reject",
      customize: "Customize",
      accept: "Accept all",
      statsQuestion: "Do you want to accept statistics cookies?"
    }
  };

  window.onCookieConsent = function (cb) {
    var existing = getConsent();
    if (existing) { cb(existing); } else { listeners.push(cb); }
  };

  function getConsent() {
    var raw = localStorage.getItem(COOKIE_NAME);
    return raw ? JSON.parse(raw) : null;
  }

  function setConsent(consent) {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));
    var el = document.getElementById("cookie-banner");
    if (el) el.style.display = "none";
    listeners.forEach(function (cb) { cb(consent); });
  }

  function buildBanner() {
    var s = STRINGS[lang];
    var wrap = document.createElement("div");
    wrap.id = "cookie-banner";
    wrap.className = "cookie-banner";
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
    if (!getConsent()) {
      buildBanner();
    }
  });
})();
