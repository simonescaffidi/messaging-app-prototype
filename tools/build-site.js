#!/usr/bin/env node
// Generatore del sito di presentazione in 11 lingue.
// Uso: node tools/build-site.js
// Legge tools/site-i18n/<lingua>.js (it.js e' la struttura di riferimento) e
// scrive in site/: italiano alla radice, le altre lingue in site/<codice>/.
// Pagine per lingua: landing, manuale, privacy policy, cookie policy.
// Genera anche site/sitemap.xml. NON tocca style.css, cookie-banner.js, robots.txt.

const fs = require("fs");
const path = require("path");

const BASE = "https://messaging-app-prototype-production-ecb3.up.railway.app";
const LANGS = ["it", "en", "es", "fr", "de", "pt", "ar", "zh", "hi", "ru", "ja"];
const NAMES = {
  it: "Italiano", en: "English", es: "Español", fr: "Français", de: "Deutsch",
  pt: "Português", ar: "العربية", zh: "中文", hi: "हिन्दी", ru: "Русский", ja: "日本語"
};
const SITE = path.join(__dirname, "..", "site");
const PAGES = ["index", "manual", "demo", "privacy", "cookie"];
const DEMO = require("./site-i18n/demo.js");

const prefix = (l) => (l === "it" ? "" : "/" + l);
function fileName(l, page) {
  if (page === "index") return "index.html";
  if (page === "demo") return "demo.html";
  if (page === "manual") return l === "it" ? "manuale.html" : "manual.html";
  if (page === "privacy") return "privacy-policy.html";
  return "cookie-policy.html";
}
function url(l, page) {
  return page === "index" ? prefix(l) + "/" : prefix(l) + "/" + fileName(l, page);
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const dicts = {};
LANGS.forEach((l) => { dicts[l] = require("./site-i18n/" + l + ".js"); });

// ---------- validazione: ogni lingua deve avere la stessa struttura di it ----------
function validate() {
  const ref = dicts.it;
  const errors = [];
  const chk = (cond, msg, l) => { if (!cond) errors.push("[" + l + "] " + msg); };
  LANGS.forEach((l) => {
    const d = dicts[l];
    chk(d.code === l, "code non coincide", l);
    chk(d.landing.features.length === ref.landing.features.length, "numero features", l);
    chk(d.landing.steps.length === ref.landing.steps.length, "numero steps", l);
    chk(d.landing.disclaimerHtml.includes("{manualUrl}"), "manca {manualUrl}", l);
    chk(d.ui.cookieBanner.text.includes("{privacyUrl}") && d.ui.cookieBanner.text.includes("{cookieUrl}"), "banner: placeholder", l);
    chk(d.manual.sections.length === ref.manual.sections.length, "numero sezioni manuale", l);
    d.manual.sections.forEach((s, i) => {
      const r = ref.manual.sections[i];
      chk(s.id === r.id, "id sezione " + i, l);
      chk(s.blocks.length === r.blocks.length, "blocchi sezione " + s.id, l);
      s.blocks.forEach((b, j) => {
        const rb = r.blocks[j];
        if (!rb) return;
        chk(b[0] === rb[0], "tipo blocco " + s.id + "#" + j, l);
        if (Array.isArray(rb[1])) chk(Array.isArray(b[1]) && b[1].length === rb[1].length, "lunghezza lista " + s.id + "#" + j, l);
      });
    });
    ["privacy", "cookie"].forEach((k) => {
      chk(d[k].sections.length === ref[k].sections.length, "numero sezioni " + k, l);
      d[k].sections.forEach((s, i) => {
        chk(s[1].length === ref[k].sections[i][1].length, "paragrafi " + k + " #" + i, l);
      });
    });
  });
  LANGS.forEach((l) => {
    const d = DEMO[l], r = DEMO.it;
    if (!d) { errors.push("[" + l + "] demo mancante"); return; }
    Object.keys(r).forEach((k) => {
      if (!(k in d)) errors.push("[" + l + "] demo: manca " + k);
      else if (Array.isArray(r[k]) && d[k].length !== r[k].length) errors.push("[" + l + "] demo: lunghezza " + k);
    });
  });
  if (errors.length) {
    console.error("ERRORI DI STRUTTURA:\n" + errors.join("\n"));
    process.exit(1);
  }
}

// ---------- pezzi comuni ----------
function head(l, page, title, description, ogType) {
  const alts = LANGS.map((c) => '<link rel="alternate" hreflang="' + c + '" href="' + BASE + url(c, page) + '" />').join("\n");
  const d = dicts[l];
  const ogTitle = page === "index" ? d.landing.ogTitle : title;
  const ogDesc = page === "index" ? d.landing.ogDesc : description;
  return [
    "<!DOCTYPE html>",
    '<html lang="' + l + '" dir="' + d.dir + '">',
    "<head>",
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    "<title>" + esc(title) + "</title>",
    '<meta name="description" content="' + esc(description) + '" />',
    '<link rel="canonical" href="' + BASE + url(l, page) + '" />',
    alts,
    '<link rel="alternate" hreflang="x-default" href="' + BASE + url("it", page) + '" />',
    '<meta property="og:type" content="' + ogType + '" />',
    '<meta property="og:title" content="' + esc(ogTitle) + '" />',
    '<meta property="og:description" content="' + esc(ogDesc) + '" />',
    '<meta property="og:url" content="' + BASE + url(l, page) + '" />',
    '<meta property="og:image" content="' + BASE + '/og-image.svg" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<link rel="stylesheet" href="/style.css" />',
    "</head>"
  ].join("\n");
}

function header(l, page) {
  const d = dicts[l];
  const options = LANGS.map((c) =>
    '<option value="' + url(c, page) + '"' + (c === l ? " selected" : "") + ">" + NAMES[c] + "</option>"
  ).join("");
  return [
    '<header class="site-header">',
    '  <div class="container">',
    '    <a href="' + url(l, "index") + '" class="brand"><span class="lock">🔒</span> ' + esc(d.brand) + "</a>",
    '    <div class="header-actions">',
    '      <select class="lang-select" aria-label="' + esc(d.ui.langAria) + '" onchange="location.href=this.value">' + options + "</select>",
    '      <a href="' + url(l, "manual") + '" class="btn btn-ghost btn-sm">' + esc(d.ui.manual) + "</a>",
    '      <a href="' + url(l, "demo") + '" class="btn btn-ghost btn-sm">' + esc(DEMO[l].nav) + "</a>",
    '      <a href="/app/" class="btn btn-primary btn-sm">' + esc(d.ui.openApp) + "</a>",
    "    </div>",
    "  </div>",
    "</header>"
  ].join("\n");
}

function footer(l, page) {
  const d = dicts[l];
  const langLinks = LANGS.map((c) =>
    '<a href="' + url(c, page) + '" hreflang="' + c + '" lang="' + c + '"' + (c === l ? ' aria-current="true"' : "") + ">" + NAMES[c] + "</a>"
  ).join("\n      ");
  const cb = Object.assign({}, d.ui.cookieBanner, {
    text: d.ui.cookieBanner.text.replace("{privacyUrl}", url(l, "privacy")).replace("{cookieUrl}", url(l, "cookie"))
  });
  const cbJson = JSON.stringify(cb).replace(/</g, "\\u003c");
  return [
    '<footer class="site-footer">',
    '  <div class="container">',
    '    <p class="powered-by">Powered by <a href="https://www.simonescaffidi.it" target="_blank" rel="noopener noreferrer">www.simonescaffidi.it</a></p>',
    '    <nav class="footer-links" aria-label="' + esc(d.ui.legalAria) + '">',
    '      <a href="' + url(l, "manual") + '">' + esc(d.ui.manual) + "</a>",
    '      <a href="' + url(l, "demo") + '">' + esc(DEMO[l].nav) + "</a>",
    '      <a href="' + url(l, "privacy") + '">' + esc(d.ui.privacy) + "</a>",
    '      <a href="' + url(l, "cookie") + '">' + esc(d.ui.cookie) + "</a>",
    "    </nav>",
    '    <nav class="footer-langs" aria-label="' + esc(d.ui.langsLabel) + '">',
    "      " + langLinks,
    "    </nav>",
    "  </div>",
    "</footer>",
    "<script>window.__COOKIE_I18N=" + cbJson + ";</script>",
    '<script src="/cookie-banner.js"></script>'
  ].join("\n");
}

function wrap(l, page, title, description, ogType, bodyClass, main) {
  return [
    head(l, page, title, description, ogType),
    "<body" + (bodyClass ? ' class="' + bodyClass + '"' : "") + ">",
    "",
    header(l, page),
    "",
    main,
    "",
    footer(l, page),
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

// ---------- pagine ----------
function landing(l) {
  const d = dicts[l];
  const L = d.landing;
  const features = L.features.map((f) =>
    '        <article class="feature-card">\n          <div class="icon">' + f[0] + "</div>\n          <h3>" + f[1] + "</h3>\n          <p>" + f[2] + "</p>\n        </article>"
  ).join("\n");
  const steps = L.steps.map((s) =>
    '        <div class="step">\n          <h3>' + s[0] + "</h3>\n          <p>" + s[1] + "</p>\n        </div>"
  ).join("\n");
  const main = [
    "<main>",
    '  <section class="hero">',
    '    <div class="container">',
    '      <span class="badge">' + L.badge + "</span>",
    "      <h1>" + L.h1 + "</h1>",
    '      <p class="lead">' + L.lead + "</p>",
    '      <div class="hero-actions">',
    '        <a href="/app/" class="btn btn-primary">' + L.ctaOpen + "</a>",
    '        <a href="' + url(l, "demo") + '" class="btn btn-ghost">' + DEMO[l].cta + "</a>",
    '        <a href="#how-it-works" class="btn btn-ghost">' + L.ctaHow + "</a>",
    "      </div>",
    "    </div>",
    "  </section>",
    "",
    '  <section class="features" id="features">',
    '    <div class="container">',
    "      <h2>" + L.featuresTitle + "</h2>",
    '      <div class="feature-grid">',
    features,
    "      </div>",
    "    </div>",
    "  </section>",
    "",
    '  <section class="how" id="how-it-works">',
    '    <div class="container">',
    "      <h2>" + L.howTitle + "</h2>",
    '      <div class="steps">',
    steps,
    "      </div>",
    "    </div>",
    "  </section>",
    "",
    '  <section class="disclaimer">',
    '    <div class="container">',
    "      <h2>" + L.disclaimerTitle + "</h2>",
    '      <div class="disclaimer-box">',
    "        <p>" + L.disclaimerHtml.replace("{manualUrl}", url(l, "manual")) + "</p>",
    "      </div>",
    "    </div>",
    "  </section>",
    "",
    '  <section class="disclaimer">',
    '    <div class="container">',
    "      <h2>" + L.nativeTitle + "</h2>",
    '      <div class="disclaimer-box">',
    "        <p>" + L.nativeText + "</p>",
    "      </div>",
    "    </div>",
    "  </section>",
    "",
    '  <section class="cta">',
    '    <div class="container">',
    "      <h2>" + L.ctaTitle + "</h2>",
    "      <p>" + L.ctaText + "</p>",
    '      <a href="/app/" class="btn btn-primary">' + L.ctaOpen + "</a>",
    "    </div>",
    "  </section>",
    "",
    "</main>"
  ].join("\n");
  return wrap(l, "index", L.title, L.description, "website", "", main);
}

function manual(l) {
  const d = dicts[l];
  const M = d.manual;
  const toc = M.sections.map((s) => '      <li><a href="#' + s.id + '">' + s.h.replace(/^\d+\.\s*/, "") + "</a></li>").join("\n");
  const sections = M.sections.map((s) => {
    const blocks = s.blocks.map((b) => {
      if (b[0] === "p") return "    <p>" + b[1] + "</p>";
      if (b[0] === "warn") return '    <p class="warn">' + b[1] + "</p>";
      if (b[0] === "h3") return "    <h3>" + b[1] + "</h3>";
      return "    <" + b[0] + ">\n" + b[1].map((x) => "      <li>" + x + "</li>").join("\n") + "\n    </" + b[0] + ">";
    }).join("\n");
    return '  <section id="' + s.id + '">\n    <h2>' + s.h + "</h2>\n" + blocks + "\n  </section>";
  }).join("\n\n");
  const main = [
    "<main>",
    "  <h1>" + M.h1 + "</h1>",
    '  <p class="lead">' + M.lead + "</p>",
    "",
    '  <nav class="toc" aria-label="' + esc(d.ui.tocTitle) + '">',
    "    <strong>" + d.ui.tocTitle + "</strong>",
    "    <ol>",
    toc,
    "    </ol>",
    "  </nav>",
    "",
    sections,
    "</main>"
  ].join("\n");
  return wrap(l, "manual", M.title, M.description, "article", "manual", main);
}

function demo(l) {
  const D = DEMO[l];
  const items = D.tryItems.map((x) => "        <li>" + x + "</li>").join("\n");
  const i18n = JSON.stringify(D).replace(/</g, "\\u003c");
  const main = [
    "<main>",
    '  <div class="demo-layout">',
    '    <div class="demo-intro">',
    "      <h1>" + D.h1 + "</h1>",
    '      <p class="lead">' + D.lead + "</p>",
    '      <p class="demo-notice">' + D.notice + "</p>",
    "      <h2>" + D.tryTitle + "</h2>",
    '      <ol class="demo-try">',
    items,
    "      </ol>",
    '      <p><a href="/app/" class="btn btn-primary">' + esc(dicts[l].ui.openApp) + "</a></p>",
    "    </div>",
    '    <div id="phone" class="phone" aria-label="' + esc(D.h1) + '"></div>',
    "  </div>",
    "</main>",
    "<script>window.__DEMO_I18N=" + i18n + ";</script>",
    '<script src="/demo.js"></script>'
  ].join("\n");
  return wrap(l, "demo", D.title, D.description, "website", "", main);
}

function legal(l, key, page) {
  const d = dicts[l];
  const P = d[key];
  const body = P.sections.map((s) =>
    "  <h2>" + s[0] + "</h2>\n" + s[1].map((p) => "  <p>" + p + "</p>").join("\n")
  ).join("\n\n");
  const main = [
    '<main class="legal container">',
    "  <h1>" + P.h1 + "</h1>",
    "  <p>" + d.ui.updated + "</p>",
    "",
    body,
    "</main>"
  ].join("\n");
  return wrap(l, page, P.title, P.description, "article", "", main);
}

function sitemap() {
  const urls = [];
  LANGS.forEach((l) => PAGES.forEach((p) => {
    const alts = LANGS.map((c) => '    <xhtml:link rel="alternate" hreflang="' + c + '" href="' + BASE + url(c, p) + '" />').join("\n");
    urls.push("  <url>\n    <loc>" + BASE + url(l, p) + "</loc>\n" + alts + "\n  </url>");
  }));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.join("\n") + "\n</urlset>\n";
}

// ---------- main ----------
validate();
let count = 0;
LANGS.forEach((l) => {
  const dir = l === "it" ? SITE : path.join(SITE, l);
  fs.mkdirSync(dir, { recursive: true });
  const out = {
    index: landing(l),
    manual: manual(l),
    demo: demo(l),
    privacy: legal(l, "privacy", "privacy"),
    cookie: legal(l, "cookie", "cookie")
  };
  PAGES.forEach((p) => {
    fs.writeFileSync(path.join(dir, fileName(l, p)), out[p]);
    count++;
  });
});
fs.writeFileSync(path.join(SITE, "sitemap.xml"), sitemap());
console.log("OK: generate " + count + " pagine in " + LANGS.length + " lingue + sitemap.xml");
