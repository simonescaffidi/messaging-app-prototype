# App nativa iOS / Android — Securmy

Questa cartella contiene lo scaffold **Expo/React Native** per pubblicare
l'app come app nativa su App Store e Google Play, oltre alla versione web
già online.

## Come funziona

Non è stata riscritta l'intera UI in React Native: l'app nativa è un
**wrapper WebView** attorno alla webapp già funzionante
(`https://messaging-app-prototype-production-ecb3.up.railway.app/app/`).
Questo perché:

- la webapp ha già login a codice, crittografia E2E reale, sblocco
  biometrico via WebAuthn e localizzazione in 11 lingue — riscriverla da
  zero in React Native duplicherebbe tutta la logica e introdurrebbe
  nuovi bug, senza nessun beneficio pratico per un prototipo;
- le WebView sia iOS che Android supportano Web Crypto API e WebAuthn in
  un contesto HTTPS, quindi tutte le funzionalità restano reali, non
  "finte";
- in più, questo wrapper aggiunge un blocco biometrico *di sistema*
  all'apertura dell'app (Face ID / Touch ID / impronta), separato dal
  WebAuthn interno alla chat.

Se in futuro si vuole una UI nativa "vera" (navigazione, notifiche push
native, animazioni native), si può migrare gradualmente le singole
schermate da WebView a componenti React Native dentro questo stesso
progetto Expo.

## Cosa manca per pubblicare davvero

Serve quanto segue, che **non può essere generato da qui** (richiede le
credenziali reali degli account, non ancora fornite):

1. **Apple Developer Program** (già attivo secondo quanto indicato) →
   serve per firmare la build iOS e per pubblicarla su App Store Connect.
2. **Google Play Console** (già attivo) → serve per firmare la build
   Android e pubblicarla sul Play Store.
3. Un account **Expo/EAS** (gratuito) collegato a questo progetto, per
   eseguire le build in cloud senza bisogno di Xcode/Android Studio
   installati localmente.

## Procedura (quando le credenziali saranno disponibili)

```bash
cd mobile
npm install
npm install -g eas-cli
eas login
eas init                     # crea il progetto EAS e aggiorna app.json
eas build --platform ios     # richiede Apple Developer Program
eas build --platform android # richiede keystore Android (eas lo genera)
eas submit --platform ios
eas submit --platform android
```

Il file `eas.json` ha già i profili `development`, `preview` e
`production` pronti; `app.json` ha già bundle id/package name
provvisori (`it.simonescaffidi.messaggistica`) da confermare o cambiare.

## Test locale (senza pubblicare nulla)

```bash
cd mobile
npm install
npx expo start
```

Poi si scansiona il QR code con l'app **Expo Go** (iOS/Android) per
provare l'app sul proprio telefono, senza bisogno di build o account
sviluppatore.

## File di questa cartella

- `App.js` — schermata principale: blocco biometrico di sistema +
  WebView che carica la webapp.
- `config.js` — URL della webapp (da aggiornare se cambia il dominio).
- `app.json` — configurazione Expo (nome app, bundle id, permessi).
- `eas.json` — profili di build/submit per EAS.
- `package.json` — dipendenze (Expo, WebView, biometria).

## Pubblicazione negli store (passi che richiedono le tue credenziali)

1. `npm install -g eas-cli && cd mobile && npm install && eas login` (account Expo gratuito) poi `eas init` (scrive il projectId in `app.json`).
2. Scegli l'identificativo definitivo (`bundleIdentifier` iOS e `package` Android) prima della prima build: dopo la pubblicazione non cambia più. Oggi è `it.simonescaffidi.messaggistica`.
3. Android: `eas build --platform android --profile production` (AAB), poi crea l'app in Google Play Console (account sviluppatore, 25 USD una tantum) e carica con `eas submit`.
4. iOS: serve Apple Developer Program (99 USD/anno); `eas build --platform ios`, poi `eas submit`. Compila `appleId`, `ascAppId`, `appleTeamId` in `eas.json`.
5. Testi per gli store: `STORE-LISTING.md`. Apple richiede un URL di privacy e la dichiarazione "Privacy nutrition label"; Google la scheda "Sicurezza dei dati": usa i contenuti della privacy policy del sito.
6. Nota: Apple può contestare le app che sono solo un involucro web (linea guida 4.2). Il blocco biometrico nativo, le chiamate e la cassaforte aiutano, ma valuta di aggiungere funzioni native (notifiche push) prima dell'invio.
