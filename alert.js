// Alert via email al gestore quando qualcosa non funziona (crash, errori 5xx, DB giu').
// Destinatario: ALERT_EMAIL (default info@simonescaffidi.it). Invio tramite mailer.js (API Brevo;
// Resend solo come fallback se BREVO_API_KEY manca). Senza chiavi l'alert resta nei log ([ALERT]).
// Il contenuto NON include dati degli utenti: solo tipo di errore, messaggio tecnico e stack sintetico.
// Anti-spam: una mail per tipo di errore ogni 30 minuti.
const mailer = require("./mailer");
const TO = process.env.ALERT_EMAIL || "info@simonescaffidi.it";
const SLUG = "securmy";
const WINDOW = 30 * 60 * 1000;
const last = new Map();

const when = () => new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });

async function sendAlert(type, message, stack) {
  const now = Date.now();
  if (now - (last.get(type) || 0) < WINDOW) return false;
  last.set(type, now);
  console.error("[ALERT] " + type + ": " + message);
  if (!mailer.configurato()) return false; // in attesa delle credenziali: resta nei log
  const body = [
    "Servizio: " + SLUG, "Quando (Europe/Rome): " + when(), "Tipo: " + type, "",
    "Messaggio: " + String(message).slice(0, 500), "",
    stack ? "Stack:\n" + String(stack).split("\n").slice(0, 6).join("\n") : "",
    "", "Railway: https://railway.app/dashboard"
  ].join("\n");
  const r = await mailer.invia({ to: TO, subject: "[ALERT] " + SLUG + " – " + type, text: body });
  return r.inviata;
}

function install(app, { store, db }) {
  process.on("unhandledRejection", (e) => { sendAlert("unhandledRejection", (e && e.message) || e, e && e.stack); });
  process.on("uncaughtException", async (e) => {
    await Promise.race([sendAlert("uncaughtException", e.message, e.stack), new Promise((r) => setTimeout(r, 3000))]);
    process.exit(1);
  });
  // /health: 200 se app e database rispondono (da usare con un monitor esterno di uptime)
  app.get("/health", async (_req, res) => {
    try {
      store.load();
      if (db && db.hasPg()) await db.query("select 1");
      res.json({ ok: true });
    } catch (e) {
      sendAlert("health-check", e.message, e.stack);
      res.status(503).json({ ok: false });
    }
  });
  // alert di test (protetto da token): GET /health/test-alert?token=ALERT_TEST_TOKEN
  app.get("/health/test-alert", async (req, res) => {
    if (!process.env.ALERT_TEST_TOKEN || req.query.token !== process.env.ALERT_TEST_TOKEN) return res.status(404).end();
    last.delete("test");
    res.json({ sent: await sendAlert("test", "Alert di prova") });
  });
}
// Da registrare DOPO tutte le route.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  if (status >= 500) sendAlert("errore-5xx " + req.method + " " + (req.route ? req.route.path : req.path.replace(/[0-9a-f-]{8,}/gi, ":id")), err.message, err.stack);
  res.status(status).json({ error: status >= 500 ? "errore interno" : err.message });
}
module.exports = { sendAlert, install, errorHandler };
