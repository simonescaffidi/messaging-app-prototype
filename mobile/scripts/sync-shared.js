// Genera i file condivisi con la webapp, cosi' app nativa e web usano LO STESSO codice di
// cifratura e gli stessi testi (compatibilita' garantita).
//   src/shared/e2e.js   <- public/crypto.js  (protocollo E2E, cassaforte, prekey)
//   src/dicts.json      <- public/i18n*.js   (testi in 11 lingue) + src/i18n-mobile.js
// Uso: npm run sync-shared   (da rifare quando cambiano i file in /public)
const fs = require("fs"), path = require("path");
const pub = path.join(__dirname, "..", "..", "public") + path.sep;
const out = path.join(__dirname, "..", "src") + path.sep;

const crypto = fs.readFileSync(pub + "crypto.js", "utf8");
fs.mkdirSync(out + "shared", { recursive: true });
fs.writeFileSync(out + "shared/e2e.js", "// GENERATO da scripts/sync-shared.js a partire da public/crypto.js: non modificare a mano.\n" + crypto + "\nmodule.exports = E2E;\n");

let src = fs.readFileSync(pub + "i18n.js", "utf8").replace("return { LANGS, LANG_NAMES, t, extend, setLang, apply,", "return { DICTS, LANGS, LANG_NAMES, t, extend, setLang, apply,");
const mem = {};
const I18N = new Function("localStorage", "navigator", "document", src + "\nreturn I18N;")(
  { getItem: (k) => mem[k] || null, setItem: (k, v) => (mem[k] = v) }, { language: "it" }, { documentElement: {}, querySelectorAll: () => [] });
for (const f of ["i18n-suite.js", "i18n-sync.js"]) new Function("I18N", fs.readFileSync(pub + f, "utf8"))(I18N);
const extra = require("../src/i18n-mobile.js");
for (const l of I18N.LANGS) Object.assign(I18N.DICTS[l], extra[l] || {}, l === "it" ? {} : {});
const dicts = {};
for (const l of I18N.LANGS) dicts[l] = I18N.DICTS[l];
fs.writeFileSync(out + "dicts.json", JSON.stringify({ langs: I18N.LANGS, names: I18N.LANG_NAMES, dicts }));
console.log("ok: e2e.js e dicts.json (" + I18N.LANGS.length + " lingue, " + Object.keys(dicts.it).length + " testi)");
