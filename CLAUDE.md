# messaging-app-prototype (Securmy) – regole di progetto

Segui la skill **stack-standard** di Simone (standard tecnico unico) e la skill **alert-email-errori**.

## Progetto
- Slug: `messaging-app-prototype` (GitHub simonescaffidi/messaging-app-prototype, **repo pubblico**: mai segreti nel codice o nei commit; progetto Railway messaging-app-prototype). Nome commerciale: Securmy.
- Messaggistica privata E2E: profili multipli con codice, chat nascoste, chiamate WebRTC, P2P, cassaforte e sync cifrata a pagamento (Stripe), passkey WebAuthn, TOTP 2FA.
- Stack: Node 20, Express 4, `ws`, `@simplewebauthn/server`, PostgreSQL (`pg`, tabelle JSONB create con `CREATE TABLE IF NOT EXISTS` in `db.js`/`sync.js`; senza `DATABASE_URL` usa `data.json` in locale). Webapp vanilla in `public/` (servita su `/app`), sito statico multilingua in `site/` generato da `tools/build-site.js`, app mobile Expo in `mobile/`, coturn/Tor in `deploy/`.
- **Non toccare crittografia e protocollo** (ECDH/AES-GCM, `DATA_KEY`, `CODE_PEPPER`, formato messaggi WS) senza decisione esplicita di Simone: cambiarli rende illeggibili i dati esistenti.

## Deploy
- Push su `main` = deploy automatico Railway (app in uso: modifiche mirate; prima `git fetch && git rebase origin/main`). Lavori strutturali su branch + PR.
- `railway.json`: healthcheck `/health` (app + `select 1` sul DB), restart ON_FAILURE. Nessuna migrazione: lo schema si crea all'avvio ed e' idempotente.
- Variabili documentate in `.env.example`.

## Email e alert
- Email solo tramite `mailer.js` → API Brevo (`BREVO_API_KEY`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`). Resend (`RESEND_API_KEY`, `EMAIL_FROM`) e' solo fallback temporaneo finche' Brevo non e' su Railway. Mai SMTP. Escape HTML dei dati utente (`mailer.escapeHtml`) se si usano mail HTML.
- Alert: `alert.js` → `ALERT_EMAIL` (default info@simonescaffidi.it), anti-spam 30 min; agganciato a crash di processo, 5xx, /health KO, email fallite. Ogni nuova integrazione esterna o job deve chiamare `sendAlert`. Prova: `GET /health/test-alert?token=ALERT_TEST_TOKEN`.
- Monitor esterno `.github/workflows/uptime.yml` ogni 30 min (secret GitHub `BREVO_API_KEY`).
- All'utente mai `err.message` per errori 5xx.
- Sicurezza: header impostati in `server.js` senza CSP restrittiva (WebRTC, WebSocket e WebAuthn devono funzionare); rate limit in memoria su login, registrazioni e invio mail.

## Regola fissa: manuale e sito sempre allineati
A ogni nuova funzione o modifica visibile aggiorna nello stesso lavoro:
1. Manuale d'uso (`site/manuale.html` e `site/<lingua>/manual.html`, via `tools/build-site.js`).
2. Sito di presentazione in tutte le lingue (`tools/build-site.js` → `site/`).
3. Dizionari webapp (`public/i18n*.js`) e, se toccati, `mobile/src/dicts.json`.
Footer con "Powered by www.simonescaffidi.it".
