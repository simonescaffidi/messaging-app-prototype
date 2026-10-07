# Prototipo — Messaggistica Privata

Webapp dimostrativa basata su `Progetto_App_Messaggistica_v1.txt`. Implementa il meccanismo distintivo del progetto (username + password = profilo, chat nascoste, profilo di copertura) su una base di chat funzionante e in tempo reale.

## Avvio

```
cd messaging-app-prototype
npm install
npm start
```

Apri `http://localhost:3000` in due schede/browser diversi per simulare due utenti.

## Cosa puoi provare

- **Registrazione**: crea un profilo con email + username + password (nessun numero di telefono). Il sistema mostra una sola volta ID pubblico e combinazione segreta — vanno salvati.
- **Login username + password**: lo username e' il primo campo, la password decide quale profilo si apre (stesso username, password diverse = profili diversi). Password con hash scrypt e limite di tentativi per IP e per username.
- **Profilo di copertura**: spunta l'opzione in registrazione per creare un profilo "innocuo".
- **Contatti**: aggiungi qualcuno tramite il suo ID pubblico.
- **Messaggi**: testo in tempo reale (WebSocket), risposte, reazioni, messaggi con autodistruzione a tempo.
- **Chat nascoste**: nella chat apri il menu e premi "nascondi". La chat sparisce dalla lista. Digitando la combinazione segreta nella barra di ricerca, le chat nascoste tornano visibili (livello 2 di sicurezza).

## Sicurezza (punto di forza del progetto)

- **E2E con forward secrecy**: chiave nuova per ogni messaggio (X3DH semplificato con prekey monouso, ECDH P-256 + HKDF + AES-GCM); la prekey privata viene eliminata dopo la lettura.
- **Cassaforte cifrata con la password** (PBKDF2-SHA256 310k + AES-GCM): identita' privata, prekey e cache dei messaggi letti non sono mai in chiaro nel dispositivo.
- **Verifica chiavi**: numero di sicurezza a 60 cifre + avviso (e blocco invio) se la chiave di un contatto cambia.
- **Server cieco**: solo testo cifrato; email e username cifrati a riposo (AES-256-GCM) in Postgres; password con hash scrypt; limiti di tentativi per IP e username.
- **Biometria WebAuthn/FIDO2**: il server vede solo la chiave pubblica della passkey.

## Limiti dichiarati

- Metadati (mittente, orario, reazioni, scadenze) visibili al server.
- Storico decifrato legato al dispositivo; dopo il recupero password via email la cassaforte precedente non e' recuperabile.
- Se un contatto esaurisce le prekey, si usa la sua identita' al posto della prekey (forward secrecy piu' debole).
- Recupero account solo via email verificata (serve `RESEND_API_KEY` su Railway).
- Prototipo: non ancora pensato per conversazioni ad altissimo rischio.

## Prossimi passi ragionevoli

1. Validare il concept con utenti reali su questo prototipo.
2. Scrivere la v2 del documento (monetizzazione, funzioni premium).
3. Se si procede sul serio: audit di sicurezza esterno, eventuale libreria Signal Protocol (Double Ratchet) e — se l'obiettivo è mobile — portare l'auth per-codice e le chat nascoste su Kotlin/Swift nativi, dove biometria e Secure Enclave/Keystore sono disponibili.
