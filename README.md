# Prototipo — Messaggistica Privata

Webapp dimostrativa basata su `Progetto_App_Messaggistica_v1.txt`. Implementa il meccanismo distintivo del progetto (codice = profilo, chat nascoste, profilo di copertura) su una base di chat funzionante e in tempo reale.

## Avvio

```
cd messaging-app-prototype
npm install
npm start
```

Apri `http://localhost:3000` in due schede/browser diversi per simulare due utenti.

## Cosa puoi provare

- **Registrazione**: crea un profilo con email + username (nessun numero di telefono). Il sistema mostra una sola volta codice di accesso, ID pubblico e combinazione segreta — vanno salvati, non sono recuperabili.
- **Login per codice**: ogni codice apre automaticamente il profilo corrispondente, senza schermata di scelta.
- **Profilo di copertura**: spunta l'opzione in registrazione per creare un profilo "innocuo".
- **Contatti**: aggiungi qualcuno tramite il suo ID pubblico.
- **Messaggi**: testo in tempo reale (WebSocket), risposte, reazioni, messaggi con autodistruzione a tempo.
- **Chat nascoste**: nella chat apri il menu e premi "nascondi". La chat sparisce dalla lista. Digitando la combinazione segreta nella barra di ricerca, le chat nascoste tornano visibili (livello 2 di sicurezza).

## Cosa NON c'è (di proposito, per restare un prototipo)

- Nessuna crittografia E2E reale (niente X3DH/Double Ratchet/LibSignal) — i messaggi sono in chiaro sul server.
- Nessun invio email reale per il magic link.
- Nessuna biometria (Face ID / impronta) — è una feature nativa mobile, non simulabile in webapp.
- Nessun multi-device, backup cifrato, chiamate.
- I codici di accesso sono salvati in chiaro nello storage (`data.json`) — andrebbero hashati.
- Storage su file JSON, non un database vero (ok per demo, non per produzione o scala).

## Prossimi passi ragionevoli

1. Validare il concept con utenti reali su questo prototipo.
2. Scrivere la v2 del documento (monetizzazione, funzioni premium).
3. Se si procede sul serio: sostituire lo storage con Postgres, aggiungere hashing dei codici, valutare libreria Signal Protocol per la crittografia reale, e — se l'obiettivo è mobile — portare l'auth per-codice e le chat nascoste su Kotlin/Swift nativi, dove biometria e Secure Enclave/Keystore sono disponibili.
