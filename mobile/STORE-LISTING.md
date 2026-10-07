# Schede store (App Store / Google Play): testi sicurezza e privacy

La sicurezza e la riservatezza sono il punto di forza dell'app: questi testi vanno in evidenza nelle schede store (e vanno tradotti nelle 11 lingue partendo dalle stesse voci del sito, sezione "Sicurezza e riservatezza").

## Descrizione breve (IT)
Chat privata con crittografia end-to-end, chiave nuova per ogni messaggio, chat nascoste e sblocco biometrico.

## Short description (EN)
Private chat with end-to-end encryption, a new key for every message, hidden chats and biometric unlock.

## Punti chiave (IT)
- Crittografia end-to-end con forward secrecy: ogni messaggio ha una chiave monouso eliminata dopo la lettura.
- Cassaforte delle chiavi cifrata con la tua password (PBKDF2 + AES-GCM).
- Numero di sicurezza per verificare il contatto e avviso se la sua chiave cambia.
- Server cieco: solo testo cifrato; email e username cifrati a riposo.
- Sblocco con Face ID / impronta (WebAuthn/FIDO2): i dati biometrici non lasciano il dispositivo.
- Nessun numero di telefono, chat nascoste, profilo di copertura, messaggi a tempo.

## Key points (EN)
- End-to-end encryption with forward secrecy: every message has a one-time key deleted after reading.
- Key vault encrypted with your password (PBKDF2 + AES-GCM).
- Safety number to verify your contact, with a warning if their key changes.
- Blind server: ciphertext only; email and username encrypted at rest.
- Face ID / fingerprint unlock (WebAuthn/FIDO2): biometric data never leaves the device.
- No phone number, hidden chats, cover profile, timed messages.

## Limiti da dichiarare con onesta' (scheda e manuale)
Metadati visibili al server, storico legato al dispositivo, recupero solo via email.

## Apple "App Privacy" / Google "Data safety" (bozza)
- Dati raccolti: email (cifrata, per verifica/recupero), username (cifrato), messaggi (solo cifrati), identificativi di sessione.
- Nessun tracciamento, nessuna pubblicita', nessuna vendita di dati a terzi.
- Dati cifrati in transito (HTTPS/WSS) e a riposo; possibilita' di richiedere la cancellazione.
