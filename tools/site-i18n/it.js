// Lingua di riferimento del sito (struttura che tutte le altre lingue devono rispettare).
module.exports = {
  code: "it",
  dir: "ltr",
  brand: "Messaggistica Privata",
  ui: {
    openApp: "Apri l'app",
    manual: "Manuale",
    langAria: "Lingua",
    legalAria: "Legale",
    privacy: "Privacy Policy",
    cookie: "Cookie Policy",
    langsLabel: "Tutte le lingue",
    updated: "Ultimo aggiornamento: ottobre 2026.",
    tocTitle: "Indice",
    cookieBanner: {
      text: 'Utilizziamo cookie tecnici necessari e, previo consenso, cookie statistici. Consulta la <a href="{privacyUrl}">Privacy Policy</a> e la <a href="{cookieUrl}">Cookie Policy</a>.',
      reject: "Rifiuta",
      customize: "Personalizza",
      accept: "Accetta tutti",
      statsQuestion: "Vuoi accettare i cookie statistici?"
    }
  },
  landing: {
    title: "Messaggistica Privata — Chat con profili multipli e chat nascoste",
    description: "Chat privata con crittografia end-to-end reale, sblocco biometrico, profili multipli e chat nascoste. 11 lingue, nessun numero di telefono.",
    ogTitle: "Messaggistica Privata — Prototipo",
    ogDesc: "Crittografia end-to-end, sblocco biometrico, profili multipli, chat nascoste e profilo di copertura in 11 lingue.",
    badge: "Prototipo funzionale",
    h1: "Una chat dove il codice è la tua identità",
    lead: "Niente numero di telefono. Un codice di accesso apre il tuo profilo, un altro codice ne apre uno diverso. Chat nascoste, profilo di copertura, messaggi che si autodistruggono.",
    ctaOpen: "Apri l'app →",
    ctaHow: "Scopri come funziona",
    featuresTitle: "Cosa puoi fare",
    features: [
      ["🔑", "Accesso per codice", "Ogni codice apre automaticamente il profilo associato. Nessuna schermata di scelta: il codice <em>è</em> l'identità."],
      ["🪪", "Profili multipli", "Più profili sullo stesso dispositivo, ciascuno con contatti, chat e impostazioni indipendenti."],
      ["🙈", "Chat nascoste", "Nascondi una conversazione dalla lista principale. Torna visibile solo digitando una combinazione segreta nella ricerca."],
      ["🎭", "Profilo di copertura", "Crea un profilo innocuo da mostrare in caso di controlli, senza indizi sull'esistenza di altri profili."],
      ["💣", "Messaggi a tempo", "Invia messaggi che si autodistruggono dopo 30 secondi, 5 minuti o un'ora."],
      ["📵", "Nessun numero di telefono", "Registrazione via email, ID pubblico separato dall'indirizzo: la tua email non è mai visibile agli altri."],
      ["🔐", "Crittografia end-to-end reale", "Ogni messaggio è cifrato nel browser con ECDH (P-256) + AES-GCM a 256 bit prima di partire: il server vede solo testo cifrato, mai il contenuto in chiaro."],
      ["🫆", "Sblocco biometrico", "Face ID, Touch ID, impronta Android o Windows Hello tramite WebAuthn/FIDO2 reale: nessun dato biometrico lascia mai il dispositivo."],
      ["🌍", "11 lingue", "App e sito disponibili in italiano, inglese, spagnolo, francese, tedesco, portoghese, arabo, cinese, hindi, russo e giapponese."]
    ],
    howTitle: "Come funziona",
    steps: [
      ["Registrati", "Email e username: ricevi un codice di accesso, un ID pubblico e una combinazione segreta. Salvali: non vengono mostrati di nuovo."],
      ["Accedi col codice", "A ogni apertura inserisci il codice: il profilo corrispondente si apre automaticamente."],
      ["Aggiungi contatti", "Cerca una persona tramite il suo ID pubblico e inizia a scrivere in tempo reale."],
      ["Nascondi se vuoi", "Digita la combinazione segreta nella barra di ricerca per rivelare le chat nascoste quando serve."]
    ],
    disclaimerTitle: "Cosa è, cosa non è",
    disclaimerHtml: "<strong>Questo è un prototipo funzionale</strong>, non un prodotto finito. I messaggi sono cifrati end-to-end (ECDH P-256 + AES-GCM 256 bit, derivazione HKDF-SHA256): il server non vede mai il testo in chiaro. Lo sblocco biometrico usa WebAuthn/FIDO2 reale. Restano dei limiti noti, spiegati senza giri di parole nel <a href=\"{manualUrl}\">manuale utente</a>: non c'è ancora un ratchet con forward secrecy \"alla Signal\", non c'è verifica fuori banda delle chiavi pubbliche (quindi in teoria un server malevolo potrebbe sostituirle), la chiave privata resta nel browser senza secure enclave hardware, e l'invio email per il recupero account non è ancora collegato a un servizio reale. Utile per provare l'esperienza d'uso con una sicurezza vera ma non \"a prova di stato\", non ancora per conversazioni ad altissimo rischio.",
    nativeTitle: "App native iOS e Android",
    nativeText: "Lo scaffold dell'app nativa (Expo/React Native, con blocco biometrico di sistema) è pronto nel codice del progetto. La pubblicazione su App Store e Google Play richiede le credenziali degli account sviluppatore (Apple Developer Program e Google Play Console): finché non vengono collegate, l'app resta disponibile come webapp, utilizzabile da qualsiasi browser mobile e già installabile come app tramite \"Aggiungi a schermata Home\".",
    ctaTitle: "Prova il prototipo",
    ctaText: "Bastano un'email e uno username per creare il tuo primo profilo."
  },
  manual: {
    title: "Manuale utente — Messaggistica Privata",
    description: "Guida completa: registrazione, accesso per codice, chat nascoste, crittografia end-to-end, sblocco biometrico e lingue disponibili.",
    h1: "Manuale utente",
    lead: "Guida completa a Messaggistica Privata: come registrarsi, accedere, usare le funzioni di privacy e capire cosa protegge davvero questo prototipo — e cosa no.",
    sections: [
      { id: "signup", h: "1. Registrazione e primo accesso", blocks: [
        ["p", "Nella schermata iniziale, tocca \"Registrati\" e inserisci la tua email e uno username. Non è richiesto nessun numero di telefono."],
        ["p", "Dopo la registrazione vedrai una sola volta tre informazioni, che devi salvare subito in un posto sicuro (un gestore di password, ad esempio):"],
        ["ul", [
          "<strong>Codice di accesso</strong>: è la tua \"password\" — a ogni apertura dell'app lo inserisci e il tuo profilo si apre automaticamente.",
          "<strong>ID pubblico</strong>: è quello che condividi con le persone che vuoi aggiungere come contatti. Non rivela la tua email.",
          "<strong>Combinazione segreta</strong>: serve per rivelare le chat nascoste (vedi la sezione dedicata)."
        ]],
        ["warn", "Se perdi il codice di accesso, perdi l'accesso al profilo: non esiste ancora un recupero via email reale (vedi \"Limiti di sicurezza dichiarati\")."]
      ]},
      { id: "profiles", h: "2. Profili multipli sullo stesso dispositivo", blocks: [
        ["p", "Puoi creare più profili (ad esempio uno personale e uno di copertura) tutti accessibili dallo stesso dispositivo. Ogni profilo ha il suo codice di accesso: quando apri l'app e inserisci un codice, si apre automaticamente il profilo corrispondente, senza una schermata di scelta che riveli quanti profili esistono."]
      ]},
      { id: "contacts", h: "3. Aggiungere contatti e chattare", blocks: [
        ["p", "Tocca \"+ Aggiungi contatto\" e inserisci l'ID pubblico della persona. Si apre una chat in tempo reale, cifrata end-to-end (vedi sezione 7)."]
      ]},
      { id: "hidden", h: "4. Chat nascoste e combinazione segreta", blocks: [
        ["p", "Da una chat apri il menu e scegli \"Nascondi/mostra questa chat\". Una chat nascosta non appare più nella lista principale."],
        ["p", "Per farla riapparire, digita la tua combinazione segreta (quella mostrata una sola volta alla registrazione) nella barra di ricerca: tutte le chat nascoste torneranno visibili finché non blocchi di nuovo l'app."]
      ]},
      { id: "cover", h: "5. Profilo di copertura", blocks: [
        ["p", "Alla registrazione puoi spuntare \"Crea come profilo di copertura\": è un profilo pensato per essere mostrato in caso di controllo, senza contenere indizi sull'esistenza di altri profili sullo stesso dispositivo."]
      ]},
      { id: "timed", h: "6. Messaggi a tempo (autodistruzione)", blocks: [
        ["p", "Prima di inviare un messaggio, puoi scegliere dal menu a tendina un tempo di autodistruzione: 30 secondi, 5 minuti o 1 ora. Trascorso quel tempo, il messaggio viene rimosso."]
      ]},
      { id: "encryption", h: "7. Crittografia end-to-end: come funziona davvero", blocks: [
        ["p", "Questo non è uno slogan di marketing: ogni messaggio è cifrato <strong>nel tuo browser</strong>, prima di essere inviato al server, con questo schema:"],
        ["ol", [
          "Al primo accesso, il tuo dispositivo genera una coppia di chiavi ECDH sulla curva P-256 (una pubblica e una privata). La chiave pubblica viene caricata sul server; la chiave privata resta solo nel tuo browser.",
          "Quando scrivi a un contatto, il tuo browser combina la tua chiave privata con la sua chiave pubblica (scambio ECDH) e deriva, tramite HKDF-SHA256, una chiave simmetrica AES-GCM a 256 bit specifica per quella coppia di persone.",
          "Ogni messaggio viene cifrato con quella chiave e un numero casuale (IV) diverso ogni volta, poi inviato al server già cifrato.",
          "Il server salva e trasmette solo il testo cifrato: non può leggere il contenuto dei messaggi."
        ]],
        ["p", "È lo stesso tipo di matematica (ECDH + AES-GCM) usata da molti protocolli sicuri moderni, applicata qui tramite la Web Crypto API nativa del browser, senza librerie esterne."]
      ]},
      { id: "biometric", h: "8. Sblocco biometrico (Face ID / Touch ID / impronta)", blocks: [
        ["p", "Nelle impostazioni del profilo (icona ⚙️) trovi \"Attiva sblocco con Face ID / impronta\". Attivandolo, il tuo dispositivo crea una passkey tramite WebAuthn/FIDO2 e la registra sul server (solo la chiave pubblica, mai il dato biometrico)."],
        ["p", "Da quel momento, nella schermata di accesso apparirà un pulsante \"Sblocca con biometria\": lo usi al posto del codice, e il tuo sistema operativo (non l'app) verifica Face ID, Touch ID, l'impronta Android o Windows Hello. Il dato biometrico non lascia mai il tuo dispositivo."],
        ["p", "Puoi disattivarlo in qualsiasi momento dalle stesse impostazioni."]
      ]},
      { id: "languages", h: "9. Cambiare lingua", blocks: [
        ["p", "In alto a destra, in ogni schermata dell'app, trovi un selettore di lingua. Anche questo sito è disponibile nelle stesse 11 lingue: italiano, inglese, spagnolo, francese, tedesco, portoghese, arabo, cinese, hindi, russo e giapponese. La lingua scelta nell'app viene ricordata sul dispositivo."]
      ]},
      { id: "mobile", h: "10. App mobile native (iOS/Android)", blocks: [
        ["p", "È pronto uno scaffold per un'app nativa (basata su Expo/React Native) che aggiunge un blocco biometrico di sistema all'apertura. La pubblicazione reale su App Store e Google Play richiede le credenziali degli account sviluppatore (Apple Developer Program e Google Play Console): una volta collegate, si potrà generare e pubblicare l'app. Fino a quel momento, la webapp resta utilizzabile da qualsiasi browser mobile e può essere \"installata\" sulla schermata Home come se fosse un'app."]
      ]},
      { id: "limits", h: "11. Limiti di sicurezza dichiarati", blocks: [
        ["p", "Per onestà, ecco cosa questo prototipo <strong>non</strong> fa ancora, anche se la crittografia è reale:"],
        ["ul", [
          "<strong>Nessun ratchet / forward secrecy</strong>: la chiave di una chat resta la stessa finché entrambe le persone non rigenerano le proprie chiavi (diversamente da protocolli come Signal, che cambiano chiave a ogni messaggio).",
          "<strong>Nessuna verifica fuori banda delle chiavi pubbliche</strong>: non c'è un \"numero di sicurezza\" da confrontare a voce con il contatto. In teoria, un server malevolo potrebbe sostituire una chiave pubblica con la propria (attacco man-in-the-middle). Su un server fidato per un prototipo va bene; prima di un uso ad alto rischio andrebbe aggiunta questa verifica.",
          "<strong>Chiave privata nel browser</strong>: è salvata nella memoria locale del browser (localStorage), non in un secure enclave hardware. Chi ha accesso fisico o software al dispositivo sbloccato potrebbe leggerla.",
          "<strong>Nessun invio email reale</strong>: la registrazione funziona, ma non c'è ancora un servizio email collegato per un eventuale recupero account via \"magic link\"."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Risoluzione dei problemi", blocks: [
        ["h3", "\"Non riesco a cifrare: il contatto non ha ancora una chiave pubblica\""],
        ["p", "Succede se il tuo contatto non ha ancora effettuato l'accesso dopo l'ultimo aggiornamento dell'app (la chiave viene generata e caricata automaticamente al login). Chiedigli di accedere una volta: dopo potrai scrivergli normalmente."],
        ["h3", "\"Ho perso il codice di accesso\""],
        ["p", "Al momento non esiste un recupero automatico: è necessario registrare un nuovo profilo. Conserva sempre il codice in un gestore di password."],
        ["h3", "Lo sblocco biometrico non appare"],
        ["p", "Richiede un dispositivo con Face ID, Touch ID, impronta o Windows Hello configurato, un browser aggiornato e una connessione HTTPS (la webapp in produzione la usa già). Deve inoltre essere stato attivato almeno una volta dalle impostazioni."]
      ]}
    ]
  },
  privacy: {
    title: "Privacy Policy — Messaggistica Privata",
    description: "Informativa sulla privacy del prototipo Messaggistica Privata: quali dati vengono trattati e come.",
    h1: "Privacy Policy",
    sections: [
      ["Chi tratta i dati", ["Questo sito e il prototipo collegato sono un progetto dimostrativo personale. Per qualsiasi richiesta relativa ai dati puoi scrivere tramite <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."]],
      ["Dati raccolti dal sito di presentazione", ["Questo sito non utilizza strumenti di analytics o tracciamento di terze parti. Vengono salvate solo le preferenze cookie che scegli (vedi Cookie Policy), in locale sul tuo browser."]],
      ["Dati raccolti dal prototipo (/app)", [
        "Per usare il prototipo di messaggistica crei un profilo con email e username. Vengono salvati sul server: email, username, ID pubblico, codice di accesso, combinazione per le chat nascoste, contatti aggiunti, la tua chiave pubblica di cifratura e i messaggi inviati.",
        "<strong>Messaggi:</strong> il contenuto è cifrato end-to-end nel browser prima dell'invio; il server conserva solo testo cifrato e non può leggerlo. Restano invece in chiaro i metadati (mittente, orario, reazioni, scadenza dei messaggi a tempo).",
        "<strong>Sblocco biometrico:</strong> se lo attivi, sul server viene salvata solo la chiave pubblica della passkey (WebAuthn). I dati biometrici non lasciano mai il tuo dispositivo. La tua chiave privata di cifratura resta nel browser (localStorage).",
        "<strong>Importante:</strong> è un prototipo dimostrativo: email e username sono salvati senza cifratura e il servizio non ha gli standard di un prodotto in produzione. I codici di accesso non sono conservati in chiaro (solo un hash) e i tentativi errati di accesso sono limitati. Non inserire informazioni reali sensibili: usa dati di prova."
      ]],
      ["Finalità del trattamento", ["I dati servono esclusivamente a far funzionare la demo (autenticazione, messaggistica, contatti). Non vengono ceduti a terzi, non sono usati per profilazione pubblicitaria."]],
      ["Conservazione", ["I dati del prototipo possono essere cancellati in qualsiasi momento in occasione di aggiornamenti o reset della demo, senza preavviso."]],
      ["I tuoi diritti", ["Puoi chiedere in qualsiasi momento la cancellazione dei dati inseriti nel prototipo scrivendo tramite i contatti indicati sopra."]]
    ]
  },
  cookie: {
    title: "Cookie Policy — Messaggistica Privata",
    description: "Informativa sui cookie usati dal sito di presentazione del prototipo Messaggistica Privata.",
    h1: "Cookie Policy",
    sections: [
      ["Cosa sono i cookie", ["I cookie sono piccoli file salvati dal browser mentre visiti un sito. Questo sito non usa cookie di tracciamento di terze parti."]],
      ["Cookie tecnici", ["Usiamo un'unica preferenza tecnica (salvata nel localStorage del browser, non come cookie HTTP) per ricordare la tua scelta sul banner dei cookie. Senza di essa il banner ricomparirebbe a ogni visita. L'app (/app) salva inoltre in locale la lingua scelta e le tue chiavi di cifratura, indispensabili al suo funzionamento."]],
      ["Cookie statistici", ["Al momento questo sito non utilizza strumenti di analisi statistica. La categoria \"statistici\" nel banner è predisposta per un eventuale utilizzo futuro: se verranno attivati strumenti come Google Analytics, lo script partirà solo dopo un consenso esplicito."]],
      ["Cookie di marketing", ["Non utilizziamo cookie o pixel di marketing/pubblicitari."]],
      ["Come gestire le preferenze", ["Puoi cancellare la preferenza salvata svuotando i dati di navigazione del tuo browser per questo sito: al successivo accesso il banner ricomparirà."]]
    ]
  }
};
