# App nativa iOS / Android — Messaggistica Privata

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
