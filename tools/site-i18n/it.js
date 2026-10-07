// Dizionario del sito (it). Struttura identica a it.js.
module.exports = {
  "code": "it",
  "dir": "ltr",
  "brand": "Messaggistica Privata",
  "ui": {
    "openApp": "Apri l'app",
    "manual": "Manuale",
    "langAria": "Lingua",
    "legalAria": "Legale",
    "privacy": "Privacy Policy",
    "cookie": "Cookie Policy",
    "langsLabel": "Tutte le lingue",
    "updated": "Ultimo aggiornamento: ottobre 2026.",
    "tocTitle": "Indice",
    "cookieBanner": {
      "text": "Utilizziamo cookie tecnici necessari e, previo consenso, cookie statistici. Consulta la <a href=\"{privacyUrl}\">Privacy Policy</a> e la <a href=\"{cookieUrl}\">Cookie Policy</a>.",
      "reject": "Rifiuta",
      "customize": "Personalizza",
      "accept": "Accetta tutti",
      "statsQuestion": "Vuoi accettare i cookie statistici?"
    },
    "terms": "Termini di servizio",
    "owner": "Titolare"
  },
  "landing": {
    "title": "Messaggistica Privata — Chat con profili multipli e chat nascoste",
    "description": "Chat privata con crittografia end-to-end reale, sblocco biometrico, profili multipli e chat nascoste. 11 lingue, nessun numero di telefono.",
    "ogTitle": "Messaggistica Privata — Prototipo",
    "ogDesc": "Crittografia end-to-end, sblocco biometrico, profili multipli, chat nascoste e profilo di copertura in 11 lingue.",
    "badge": "Prototipo funzionale",
    "h1": "Una chat dove la password sceglie il tuo profilo",
    "lead": "Niente numero di telefono. Scrivi il tuo username e la password: la password decide quale profilo si apre. Chat nascoste, profilo di copertura, messaggi che si autodistruggono.",
    "ctaOpen": "Apri l'app →",
    "ctaHow": "Scopri come funziona",
    "featuresTitle": "Cosa puoi fare",
    "features": [
      [
        "🔑",
        "Accesso con username e password",
        "Lo username è il primo campo, poi la password: stesso username, password diversa, profilo diverso. Nessuna schermata di scelta."
      ],
      [
        "🪪",
        "Profili multipli",
        "Più profili sullo stesso dispositivo, ciascuno con contatti, chat e impostazioni indipendenti."
      ],
      [
        "🙈",
        "Chat nascoste",
        "Nascondi una conversazione dalla lista principale. Torna visibile solo digitando una combinazione segreta nella ricerca."
      ],
      [
        "🎭",
        "Profilo di copertura",
        "Crea un profilo innocuo da mostrare in caso di controlli, senza indizi sull'esistenza di altri profili."
      ],
      [
        "💣",
        "Messaggi a tempo",
        "Invia messaggi che si autodistruggono dopo 30 secondi, 5 minuti o un'ora."
      ],
      [
        "📵",
        "Nessun numero di telefono",
        "Registrazione via email, ID pubblico separato dall'indirizzo: la tua email non è mai visibile agli altri."
      ],
      [
        "🔐",
        "Crittografia end-to-end reale",
        "Ogni messaggio è cifrato nel browser con ECDH (P-256) + AES-GCM a 256 bit prima di partire: il server vede solo testo cifrato, mai il contenuto in chiaro."
      ],
      [
        "🫆",
        "Sblocco biometrico",
        "Face ID, Touch ID, impronta Android o Windows Hello tramite WebAuthn/FIDO2 reale: nessun dato biometrico lascia mai il dispositivo."
      ],
      [
        "🌍",
        "11 lingue",
        "App e sito disponibili in italiano, inglese, spagnolo, francese, tedesco, portoghese, arabo, cinese, hindi, russo e giapponese."
      ]
    ],
    "howTitle": "Come funziona",
    "steps": [
      [
        "Registrati",
        "Email, username e password: ricevi un ID pubblico e una combinazione segreta. Salvali: non vengono mostrati di nuovo."
      ],
      [
        "Accedi con username e password",
        "A ogni apertura inserisci lo username e la password: il profilo corrispondente si apre automaticamente."
      ],
      [
        "Aggiungi contatti",
        "Cerca una persona tramite il suo ID pubblico e inizia a scrivere in tempo reale."
      ],
      [
        "Nascondi se vuoi",
        "Digita la combinazione segreta nella barra di ricerca per rivelare le chat nascoste quando serve."
      ]
    ],
    "disclaimerTitle": "Cosa è, cosa non è",
    "disclaimerHtml": "<strong>Questo è un prototipo funzionale</strong>, non un prodotto finito, ma la sicurezza è reale: ogni messaggio ha una chiave nuova eliminata dopo la lettura (forward secrecy), le chiavi private sono in una cassaforte cifrata con la tua password, puoi verificare l'identità del contatto con un numero di sicurezza e ricevi un avviso se la sua chiave cambia. Lo sblocco biometrico usa WebAuthn/FIDO2 reale. Restano limiti noti, spiegati senza giri di parole nel <a href=\"{manualUrl}\">manuale utente</a> (metadati visibili al server, storico legato al dispositivo, recupero solo via email). Non è ancora pensato per conversazioni ad altissimo rischio.",
    "nativeTitle": "App native iOS e Android",
    "nativeText": "Lo scaffold dell'app nativa (Expo/React Native, con blocco biometrico di sistema) è pronto nel codice del progetto. La pubblicazione su App Store e Google Play richiede le credenziali degli account sviluppatore (Apple Developer Program e Google Play Console): finché non vengono collegate, l'app resta disponibile come webapp, utilizzabile da qualsiasi browser mobile e già installabile come app tramite \"Aggiungi a schermata Home\".",
    "ctaTitle": "Prova il prototipo",
    "ctaText": "Bastano un'email e uno username per creare il tuo primo profilo.",
    "secTitle": "Sicurezza e riservatezza: il cuore dell'app",
    "secLead": "Non ci limitiamo a dire «è cifrato». Ecco, in concreto, cosa protegge le tue conversazioni.",
    "security": [
      [
        "🔄",
        "Una chiave nuova per ogni messaggio",
        "Ogni messaggio ha una chiave monouso (forward secrecy): dopo la lettura viene eliminata. Se un giorno qualcuno ottenesse le tue chiavi, non potrebbe decifrare i messaggi passati."
      ],
      [
        "🗝️",
        "Cassaforte cifrata con la tua password",
        "Chiavi private e messaggi letti sono cifrati sul dispositivo (PBKDF2 + AES-GCM) con la tua password: senza, restano illeggibili."
      ],
      [
        "🔍",
        "Verifica delle chiavi e allarme anti-intercettazione",
        "Confronta a voce il numero di sicurezza con il tuo contatto. Se la sua chiave cambia, l'app ti avvisa e blocca l'invio finché non confermi."
      ],
      [
        "🙈",
        "Un server cieco",
        "Il server conserva solo testo cifrato. Email e username sono cifrati a riposo nel database; le password hanno solo un hash (scrypt)."
      ],
      [
        "🛡️",
        "Difesa dagli attacchi di accesso",
        "Tentativi limitati per indirizzo IP e per username, sessioni revocabili, chiusura delle altre sessioni al cambio password."
      ],
      [
        "🫆",
        "Biometria che resta sul tuo dispositivo",
        "Con WebAuthn/FIDO2 il server riceve solo la chiave pubblica della passkey: il dato biometrico non lascia mai il telefono o il computer."
      ]
    ]
  },
  "manual": {
    "title": "Manuale utente — Messaggistica Privata",
    "description": "Guida completa: registrazione, accesso con username e password, chat nascoste, crittografia end-to-end, sblocco biometrico e lingue disponibili.",
    "h1": "Manuale utente",
    "lead": "Guida completa a Messaggistica Privata: come registrarsi, accedere, usare le funzioni di privacy e capire cosa protegge davvero questo prototipo — e cosa no.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Registrazione e primo accesso",
        "blocks": [
          [
            "p",
            "Nella schermata iniziale, tocca \"Registrati\" e inserisci la tua email e uno username. Non è richiesto nessun numero di telefono."
          ],
          [
            "p",
            "Dopo la registrazione vedrai una sola volta tre informazioni, che devi salvare subito in un posto sicuro (un gestore di password, ad esempio):"
          ],
          [
            "ul",
            [
              "<strong>Username e password</strong>: lo username è il primo campo, la password decide quale profilo si apre. Con lo stesso username puoi avere più profili, ognuno con la sua password.",
              "<strong>ID pubblico</strong>: è quello che condividi con le persone che vuoi aggiungere come contatti. Non rivela la tua email.",
              "<strong>Combinazione segreta</strong>: serve per rivelare le chat nascoste (vedi la sezione dedicata)."
            ]
          ],
          [
            "warn",
            "Se perdi la password puoi reimpostarla via email, ma solo se l'email del profilo è stata verificata. Senza password e senza email verificata il profilo non è recuperabile."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Profili multipli sullo stesso dispositivo",
        "blocks": [
          [
            "p",
            "Puoi creare più profili (ad esempio uno personale e uno di copertura) con lo stesso username ma password diverse. Quando inserisci username e password si apre il profilo corrispondente, senza una schermata di scelta che riveli quanti profili esistono. Non puoi usare la stessa password per due profili con lo stesso username."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Aggiungere contatti e chattare",
        "blocks": [
          [
            "p",
            "Tocca \"+ Aggiungi contatto\" e inserisci l'ID pubblico della persona. Si apre una chat in tempo reale, cifrata end-to-end (vedi sezione 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Chat nascoste e combinazione segreta",
        "blocks": [
          [
            "p",
            "Da una chat apri il menu e scegli \"Nascondi/mostra questa chat\". Una chat nascosta non appare più nella lista principale."
          ],
          [
            "p",
            "Per farla riapparire, digita la tua combinazione segreta (quella mostrata una sola volta alla registrazione) nella barra di ricerca: tutte le chat nascoste torneranno visibili finché non blocchi di nuovo l'app."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Profilo di copertura",
        "blocks": [
          [
            "p",
            "Alla registrazione puoi spuntare \"Crea come profilo di copertura\": è un profilo pensato per essere mostrato in caso di controllo, senza contenere indizi sull'esistenza di altri profili sullo stesso dispositivo."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Messaggi a tempo (autodistruzione)",
        "blocks": [
          [
            "p",
            "Prima di inviare un messaggio, puoi scegliere dal menu a tendina un tempo di autodistruzione: 30 secondi, 5 minuti o 1 ora. Trascorso quel tempo, il messaggio viene rimosso."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. Crittografia end-to-end: come funziona davvero",
        "blocks": [
          [
            "p",
            "Questo non è uno slogan di marketing: ogni messaggio è cifrato <strong>nel tuo browser</strong>, prima di essere inviato al server, con questo schema:"
          ],
          [
            "ol",
            [
              "Al primo accesso il tuo dispositivo genera una coppia di chiavi ECDH (curva P-256): la chiave pubblica va sul server, quella privata resta sul dispositivo, cifrata con la tua password. In più prepara un lotto di chiavi pubbliche monouso («prekey»).",
              "Per ogni messaggio, il tuo browser genera una chiave temporanea e preleva dal server UNA prekey monouso del contatto. Combina tre scambi ECDH (la tua identità, la chiave temporanea, la prekey) e deriva con HKDF-SHA256 una chiave AES-GCM a 256 bit valida solo per quel messaggio.",
              "Il messaggio viene cifrato con quella chiave e un IV casuale; l'intestazione è autenticata, quindi non può essere alterata. Il server riceve solo testo cifrato.",
              "Il destinatario ricostruisce la stessa chiave, legge il messaggio e subito dopo elimina la prekey privata: da quel momento il messaggio non è più decifrabile da nessuno, nemmeno con le tue chiavi di lungo periodo."
            ]
          ],
          [
            "p",
            "È lo stesso tipo di matematica (ECDH + AES-GCM) usata da molti protocolli sicuri moderni, applicata qui tramite la Web Crypto API nativa del browser, senza librerie esterne."
          ],
          [
            "h3",
            "Forward secrecy: i messaggi passati restano al sicuro"
          ],
          [
            "p",
            "Anche se qualcuno ottenesse le tue chiavi di lungo periodo (ad esempio rubando il dispositivo), non potrebbe decifrare i messaggi che hai già ricevuto, perché le loro chiavi sono state eliminate. Il testo che hai già letto resta solo nella cache locale cifrata del tuo dispositivo."
          ],
          [
            "h3",
            "La cassaforte delle chiavi"
          ],
          [
            "p",
            "Chiavi private, prekey e cache dei messaggi sono salvate nel browser solo in forma cifrata (AES-GCM), con una chiave derivata dalla tua password tramite PBKDF2-SHA256 (310.000 iterazioni). Se accedi con la biometria, ti viene chiesta la password una volta per aprire la cassaforte. Cambiando password, la cassaforte viene ricifrata."
          ],
          [
            "h3",
            "Verifica che sia davvero lui: numero di sicurezza"
          ],
          [
            "p",
            "Nella chat tocca l'icona 🔑: vedi un numero di 60 cifre, uguale per entrambi. Confrontalo con il tuo contatto di persona o a voce: se coincide, nessuno si sta intromettendo. Se la chiave di un contatto cambia (nuovo dispositivo o possibile intercettazione), compare un avviso e l'invio resta bloccato finché non scegli «Accetta nuova chiave»."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Sblocco biometrico (Face ID / Touch ID / impronta)",
        "blocks": [
          [
            "p",
            "Nelle impostazioni del profilo (icona ⚙️) trovi \"Attiva sblocco con Face ID / impronta\". Attivandolo, il tuo dispositivo crea una passkey tramite WebAuthn/FIDO2 e la registra sul server (solo la chiave pubblica, mai il dato biometrico)."
          ],
          [
            "p",
            "Da quel momento, nella schermata di accesso apparirà un pulsante \"Sblocca con biometria\": lo usi al posto della password, e il tuo sistema operativo (non l'app) verifica Face ID, Touch ID, l'impronta Android o Windows Hello. Il dato biometrico non lascia mai il tuo dispositivo."
          ],
          [
            "p",
            "Puoi disattivarlo in qualsiasi momento dalle stesse impostazioni."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Cambiare lingua",
        "blocks": [
          [
            "p",
            "In alto a destra, in ogni schermata dell'app, trovi un selettore di lingua. Anche questo sito è disponibile nelle stesse 11 lingue: italiano, inglese, spagnolo, francese, tedesco, portoghese, arabo, cinese, hindi, russo e giapponese. La lingua scelta nell'app viene ricordata sul dispositivo."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. App mobile native (iOS/Android)",
        "blocks": [
          [
            "p",
            "È pronto uno scaffold per un'app nativa (basata su Expo/React Native) che aggiunge un blocco biometrico di sistema all'apertura. La pubblicazione reale su App Store e Google Play richiede le credenziali degli account sviluppatore (Apple Developer Program e Google Play Console): una volta collegate, si potrà generare e pubblicare l'app. Fino a quel momento, la webapp resta utilizzabile da qualsiasi browser mobile e può essere \"installata\" sulla schermata Home come se fosse un'app."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Limiti di sicurezza dichiarati",
        "blocks": [
          [
            "p",
            "Per onestà, ecco i limiti che restano, anche se la crittografia è reale e non solo dichiarata:"
          ],
          [
            "ul",
            [
              "<strong>Prekey esaurite</strong>: se un contatto resta offline a lungo e finisce le chiavi monouso, il messaggio usa comunque una chiave nuova ma senza l'eliminazione monouso, quindi con una forward secrecy meno forte.",
              "<strong>Messaggi legati a questo dispositivo</strong>: per progetto, lo storico decifrato non si sposta. Su un nuovo dispositivo o dopo un recupero password via email la cassaforte precedente non è recuperabile: si parte con una nuova identità e i contatti vedono l'avviso di cambio chiave.",
              "<strong>La cassaforte vale quanto la password</strong>: scegline una lunga e unica. Chi ha il dispositivo già sbloccato con l'app aperta può leggere le chat, come per qualunque app.",
              "<strong>Metadati visibili al server</strong>: mittente, orario, reazioni e scadenza dei messaggi a tempo non sono cifrati.",
              "<strong>Recupero solo via email</strong>: se perdi sia la password sia l'accesso all'email verificata, il profilo non è recuperabile. Se usi più profili (ad esempio uno di copertura), usa email diverse: un link di recupero rivela a chi controlla l'email che il profilo esiste."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Risoluzione dei problemi",
        "blocks": [
          [
            "h3",
            "\"Non riesco a cifrare: il contatto non ha ancora una chiave pubblica\""
          ],
          [
            "p",
            "Succede se il tuo contatto non ha ancora effettuato l'accesso dopo l'ultimo aggiornamento dell'app (la chiave viene generata e caricata automaticamente al login). Chiedigli di accedere una volta: dopo potrai scrivergli normalmente."
          ],
          [
            "h3",
            "\"Ho perso la password\""
          ],
          [
            "p",
            "Vai in «Password dimenticata?» nella schermata di accesso, inserisci email e username: se l'email del profilo è verificata ricevi un link valido 1 ora. Se l'email non era verificata, il profilo non è recuperabile e va creato di nuovo. Conserva sempre la password in un gestore di password."
          ],
          [
            "h3",
            "Lo sblocco biometrico non appare"
          ],
          [
            "p",
            "Richiede un dispositivo con Face ID, Touch ID, impronta o Windows Hello configurato, un browser aggiornato e una connessione HTTPS (la webapp in produzione la usa già). Deve inoltre essere stato attivato almeno una volta dalle impostazioni."
          ],
          [
            "h3",
            "«Messaggio non più leggibile»"
          ],
          [
            "p",
            "Per sicurezza la chiave di ogni messaggio viene eliminata appena l'hai letto: il testo resta solo nella cache cifrata di questo dispositivo. Se cambi dispositivo, svuoti i dati del browser o reimposti la password via email, i messaggi precedenti non sono più recuperabili. È il prezzo della forward secrecy."
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Privacy Policy — Messaggistica Privata",
    "description": "Informativa sulla privacy del prototipo Messaggistica Privata: quali dati vengono trattati e come.",
    "h1": "Privacy Policy",
    "sections": [
      [
        "Chi tratta i dati",
        [
          "Questo sito e il prototipo collegato sono un progetto dimostrativo personale. Per qualsiasi richiesta relativa ai dati puoi scrivere tramite <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."
        ]
      ],
      [
        "Dati raccolti dal sito di presentazione",
        [
          "Questo sito non utilizza strumenti di analytics o tracciamento di terze parti. Vengono salvate solo le preferenze cookie che scegli (vedi Cookie Policy), in locale sul tuo browser."
        ]
      ],
      [
        "Dati raccolti dal prototipo (/app)",
        [
          "Per usare il prototipo di messaggistica crei un profilo con email, username e password. Vengono salvati sul server (database PostgreSQL): email (cifrata), username, hash della password, ID pubblico, combinazione per le chat nascoste, contatti aggiunti, la tua chiave pubblica di cifratura, le sessioni attive e i messaggi inviati.",
          "<strong>Messaggi:</strong> il contenuto è cifrato end-to-end nel browser prima dell'invio; il server conserva solo testo cifrato e non può leggerlo. Restano invece in chiaro i metadati (mittente, orario, reazioni, scadenza dei messaggi a tempo).",
          "<strong>Sblocco biometrico:</strong> se lo attivi, sul server viene salvata solo la chiave pubblica della passkey (WebAuthn). I dati biometrici non lasciano mai il tuo dispositivo.",
          "<strong>Importante:</strong> è un prototipo dimostrativo e il servizio non ha gli standard di un prodotto in produzione. Email e username sono cifrati a riposo nel database (AES-256-GCM); l'email serve solo per verifica e recupero password. Le password non sono conservate in chiaro (solo un hash con salt, scrypt) e i tentativi errati di accesso sono limitati per indirizzo IP e per username. Non inserire informazioni reali sensibili: usa dati di prova.",
          "<strong>Chiavi di cifratura:</strong> le chiavi private non lasciano mai il tuo dispositivo e sono salvate cifrate con la tua password (PBKDF2 + AES-GCM), così come la cache locale dei messaggi già letti. Il server custodisce solo la tua chiave pubblica e un lotto di chiavi pubbliche monouso, che elimina a ogni consegna."
        ]
      ],
      [
        "Finalità del trattamento",
        [
          "I dati servono esclusivamente a far funzionare la demo (autenticazione, messaggistica, contatti). Non vengono ceduti a terzi, non sono usati per profilazione pubblicitaria."
        ]
      ],
      [
        "Conservazione",
        [
          "I dati sono conservati in un database persistente finché non cancelli il profilo; durante gli aggiornamenti o i reset della demo possono comunque essere cancellati, senza preavviso."
        ]
      ],
      [
        "I tuoi diritti",
        [
          "Puoi chiedere in qualsiasi momento la cancellazione dei dati inseriti nel prototipo scrivendo tramite i contatti indicati sopra."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Cookie Policy — Messaggistica Privata",
    "description": "Informativa sui cookie usati dal sito di presentazione del prototipo Messaggistica Privata.",
    "h1": "Cookie Policy",
    "sections": [
      [
        "Cosa sono i cookie",
        [
          "I cookie sono piccoli file salvati dal browser mentre visiti un sito. Questo sito non usa cookie di tracciamento di terze parti."
        ]
      ],
      [
        "Cookie tecnici",
        [
          "Usiamo un'unica preferenza tecnica (salvata nel localStorage del browser, non come cookie HTTP) per ricordare la tua scelta sul banner dei cookie. Senza di essa il banner ricomparirebbe a ogni visita. L'app (/app) salva inoltre in locale la lingua scelta e le tue chiavi di cifratura, indispensabili al suo funzionamento."
        ]
      ],
      [
        "Cookie statistici",
        [
          "Al momento questo sito non utilizza strumenti di analisi statistica. La categoria \"statistici\" nel banner è predisposta per un eventuale utilizzo futuro: se verranno attivati strumenti come Google Analytics, lo script partirà solo dopo un consenso esplicito."
        ]
      ],
      [
        "Cookie di marketing",
        [
          "Non utilizziamo cookie o pixel di marketing/pubblicitari."
        ]
      ],
      [
        "Come gestire le preferenze",
        [
          "Puoi cancellare la preferenza salvata svuotando i dati di navigazione del tuo browser per questo sito: al successivo accesso il banner ricomparirà."
        ]
      ]
    ]
  },
  "terms": {
    "title": "Termini di servizio e licenza d'uso — Messaggistica Privata",
    "description": "Termini di servizio e licenza d'uso dell'app e del sito Messaggistica Privata.",
    "h1": "Termini di servizio e licenza d'uso",
    "sections": [
      [
        "1. Oggetto e titolare",
        [
          "Questi Termini regolano l'uso dell'app e del sito «Messaggistica Privata» (il «Servizio»). Registrandoti o usando il Servizio li accetti. Se non sei d'accordo, non usarlo."
        ]
      ],
      [
        "2. Natura del Servizio",
        [
          "Il Servizio è un prototipo funzionale offerto «così com'è». Può cambiare, essere interrotto o azzerato senza preavviso. Usa dati di prova e non affidargli conversazioni ad altissimo rischio o informazioni indispensabili."
        ]
      ],
      [
        "3. Account e sicurezza",
        [
          "Devi avere almeno 14 anni. Sei responsabile della tua password e del tuo dispositivo. Le chiavi di cifratura sono custodite solo sul tuo dispositivo, cifrate con la tua password: se la perdi o la reimposti, lo storico locale non è recuperabile e non possiamo ripristinarlo."
        ]
      ],
      [
        "4. Uso consentito",
        [
          "È vietato usare il Servizio per attività illecite, molestie, minacce, spam, truffe, diffusione di malware, contenuti che sfruttano minori o violano diritti altrui, e per tentare di violare, sovraccaricare o aggirare le misure di sicurezza del Servizio."
        ]
      ],
      [
        "5. Segnalazioni e sospensione",
        [
          "Puoi bloccare e segnalare qualsiasi contatto. I messaggi sono cifrati end-to-end e il Titolare non può leggerli: le segnalazioni si basano su ciò che l'utente indica e sui dati tecnici disponibili. Il Titolare può sospendere o eliminare gli account che violano questi Termini o la legge e collaborare con le autorità nei casi previsti."
        ]
      ],
      [
        "6. Licenza d'uso",
        [
          "Ti è concessa una licenza personale, non esclusiva, non trasferibile e revocabile per usare l'app e il sito per scopi leciti. Software, grafica, marchi e testi restano del Titolare. Non puoi copiare, vendere, decompilare o creare opere derivate, salvo nei limiti consentiti inderogabilmente dalla legge."
        ]
      ],
      [
        "7. Garanzie e responsabilità",
        [
          "Nei limiti consentiti dalla legge il Servizio è fornito senza garanzie di continuità, assenza di errori o idoneità a uno scopo particolare, e il Titolare non risponde di danni indiretti o perdita di dati. Restano fermi i diritti che la legge riconosce ai consumatori e le responsabilità che non possono essere escluse."
        ]
      ],
      [
        "8. Eliminazione dell'account e dati",
        [
          "Puoi eliminare il tuo account in qualsiasi momento da Impostazioni: profilo, contatti e chat vengono cancellati definitivamente. Il trattamento dei dati è descritto nella Privacy Policy."
        ]
      ],
      [
        "9. Legge applicabile e modifiche",
        [
          "I Termini sono regolati dalla legge italiana; per i consumatori restano ferme le tutele e il foro previsti dal Codice del consumo. Possiamo aggiornare questi Termini: le modifiche rilevanti saranno comunicate nel Servizio. Per contatti: info@simonescaffidi.it."
        ]
      ]
    ]
  }
};
