// URL dell'app web (quella in /public, servita da server.js su Railway).
// La webapp gestisce gia' da sola login via codice, crittografia E2E e
// sblocco biometrico via WebAuthn del browser integrato nella WebView:
// questo wrapper nativo aggiunge solo un secondo blocco biometrico a
// livello di sistema (facoltativo) prima di mostrare la WebView, utile
// perche' il Face ID/Touch ID di sistema puo' proteggere l'intera app
// anche se l'utente non ha ancora abilitato il WebAuthn dentro la chat.
export const APP_URL = "https://messaging-app-prototype-production-ecb3.up.railway.app/app/";
