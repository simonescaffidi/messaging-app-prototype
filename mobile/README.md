# App nativa Securmy (iOS / Android)

App **React Native + Expo** (non più una WebView): interfaccia nativa, stessa crittografia end-to-end e stesso server della webapp, quindi chat, cassaforte, backup `.securmy` e sync sono compatibili tra web e telefono.

Funzioni: chat E2E (reazioni, messaggi a visualizzazione singola, auto-distruzione, chat nascoste), cassaforte (file, note, password con generatore), invio file P2P via link, pulizia metadati foto, backup, sync cifrata a pagamento, chiamate audio/video WebRTC, 2FA, blocco app con biometria, cancellazione di emergenza, notifiche push senza contenuto.

## Struttura

- `App.js` navigazione e blocco app; `src/screens/*` schermate; `src/session.js` login, WebSocket, chat; `src/vault.js` cassaforte/backup/sync; `src/p2psend.js`, `src/calls.js` WebRTC; `src/push.js` notifiche.
- `src/subtle.js` implementa in JS puro il sottoinsieme WebCrypto usato da `crypto.js` (ECDH P-256, AES-GCM, PBKDF2, HKDF, SHA-256). `src/shared/e2e.js` e `src/dicts.json` sono **generati**: `npm run sync-shared` li ricrea da `public/crypto.js` e dalle traduzioni web.
- `npm test` verifica l'interoperabilità crittografica tra `subtle.js` e il WebCrypto reale.

## Build

```bash
git pull && cd mobile && npm install
npm run sync-shared && npm test
eas build --platform android --profile preview   # APK di prova
eas build --platform ios --profile preview       # richiede account Apple Developer
```

## Notifiche push

- **Android**: crea un progetto Firebase, aggiungi l'app Android `it.simonescaffidi.securmy`, scarica `google-services.json` e mettilo in `mobile/` (poi `eas credentials` per la chiave FCM).
- **iOS**: `eas credentials` genera la chiave APNs con il tuo account Apple Developer.
- Il server invia solo "Nuovo messaggio" tramite il servizio Expo: mai mittente né testo.

## Note

- Il telefono non ha WebCrypto: la derivazione della chiave (PBKDF2 310k) richiede qualche secondo al login. I file della cassaforte sono limitati a 25 MB.
- Le chiamate e l'invio P2P usano `react-native-webrtc`, che funziona solo in build EAS (non in Expo Go).
- Pubblicazione negli store: vedi `STORE-LISTING.md`.
