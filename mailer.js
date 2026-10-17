// Invio email unico (stack-standard di Simone): API Brevo. Mai SMTP (IP Railway in blacklist).
// Env: BREVO_API_KEY, MAIL_FROM_EMAIL, MAIL_FROM_NAME.
// Fallback temporaneo: se BREVO_API_KEY manca e RESEND_API_KEY c'e', invia con Resend (EMAIL_FROM).
// Senza nessuna chiave non invia, non lancia eccezioni e restituisce { inviata: false }.
// Interfaccia: invia({ to, subject, text, html }) -> Promise<{ inviata, provider, motivo? }>

const escapeHtml = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const destinatari = (v) => [].concat(v || []).flatMap((x) => String(x).split(/[,;]/)).map((s) => s.trim()).filter(Boolean);

function provider() {
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

function mittente() {
  // MAIL_FROM_EMAIL/MAIL_FROM_NAME (standard); EMAIL_FROM ("Nome <email>") resta come fallback storico.
  const legacy = String(process.env.EMAIL_FROM || "");
  const m = legacy.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return {
    email: process.env.MAIL_FROM_EMAIL || (m ? m[2] : legacy) || "info@simonescaffidi.it",
    name: process.env.MAIL_FROM_NAME || (m && m[1]) || "Securmy"
  };
}

async function inviaBrevo({ to, subject, text, html }) {
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: mittente(),
      to: destinatari(to).map((email) => ({ email })),
      subject,
      htmlContent: html || undefined,
      textContent: text || (html ? undefined : " ")
    })
  });
  if (!r.ok) console.error("[MAIL] Brevo errore " + r.status + ": " + (await r.text()).slice(0, 200));
  return { inviata: r.ok, provider: "brevo", status: r.status };
}

async function inviaResend({ to, subject, text, html }) {
  const f = mittente();
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || (f.name + " <" + f.email + ">"),
      to: destinatari(to), subject, text: text || undefined, html: html || undefined
    })
  });
  if (!r.ok) console.error("[MAIL] Resend errore " + r.status + ": " + (await r.text()).slice(0, 200));
  return { inviata: r.ok, provider: "resend", status: r.status };
}

async function invia(msg) {
  const p = provider();
  if (!p) {
    console.warn("[MAIL] non inviata (BREVO_API_KEY assente): " + String(msg && msg.subject || "").slice(0, 80));
    return { inviata: false, provider: null, motivo: "non_configurato" };
  }
  try {
    return p === "brevo" ? await inviaBrevo(msg) : await inviaResend(msg);
  } catch (e) {
    console.error("[MAIL] " + p + ": " + (e && e.message));
    return { inviata: false, provider: p, motivo: "errore_rete" };
  }
}

module.exports = { invia, provider, configurato: () => !!provider(), escapeHtml };
