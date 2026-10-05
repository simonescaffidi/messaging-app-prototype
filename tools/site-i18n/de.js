module.exports = {
  code: "de",
  dir: "ltr",
  brand: "Private Nachrichten",
  ui: {
    openApp: "App öffnen",
    manual: "Handbuch",
    langAria: "Sprache",
    legalAria: "Rechtliches",
    privacy: "Datenschutzerklärung",
    cookie: "Cookie-Richtlinie",
    langsLabel: "Alle Sprachen",
    updated: "Zuletzt aktualisiert: Oktober 2026.",
    tocTitle: "Inhalt",
    cookieBanner: {
      text: 'Wir verwenden notwendige technische Cookies und, mit deiner Einwilligung, Statistik-Cookies. Siehe <a href="{privacyUrl}">Datenschutzerklärung</a> und <a href="{cookieUrl}">Cookie-Richtlinie</a>.',
      reject: "Ablehnen",
      customize: "Anpassen",
      accept: "Alle akzeptieren",
      statsQuestion: "Möchtest du Statistik-Cookies akzeptieren?"
    }
  },
  landing: {
    title: "Private Nachrichten — Chat mit mehreren Profilen und versteckten Chats",
    description: "Privater Chat mit echter Ende-zu-Ende-Verschlüsselung, biometrischer Entsperrung, mehreren Profilen und versteckten Chats. 11 Sprachen, keine Telefonnummer.",
    ogTitle: "Private Nachrichten — Prototyp",
    ogDesc: "Ende-zu-Ende-Verschlüsselung, biometrische Entsperrung, mehrere Profile, versteckte Chats und Tarnprofil in 11 Sprachen.",
    badge: "Funktionaler Prototyp",
    h1: "Ein Chat, in dem dein Code deine Identität ist",
    lead: "Keine Telefonnummer. Ein Zugangscode öffnet dein Profil, ein anderer Code öffnet ein anderes. Versteckte Chats, ein Tarnprofil, selbstzerstörende Nachrichten.",
    ctaOpen: "App öffnen →",
    ctaHow: "So funktioniert es",
    featuresTitle: "Was du tun kannst",
    features: [
      ["🔑", "Zugang per Code", "Jeder Code öffnet automatisch das zugehörige Profil. Keine Auswahlanzeige: Der Code <em>ist</em> die Identität."],
      ["🪪", "Mehrere Profile", "Mehrere Profile auf demselben Gerät, jedes mit eigenen Kontakten, Chats und Einstellungen."],
      ["🙈", "Versteckte Chats", "Verstecke eine Unterhaltung in der Hauptliste. Sie erscheint nur wieder, wenn du eine geheime Kombination in die Suche eingibst."],
      ["🎭", "Tarnprofil", "Lege ein harmloses Profil an, das du bei einer Kontrolle zeigen kannst – ohne Hinweis auf weitere Profile."],
      ["💣", "Zeitgesteuerte Nachrichten", "Sende Nachrichten, die sich nach 30 Sekunden, 5 Minuten oder einer Stunde selbst zerstören."],
      ["📵", "Keine Telefonnummer", "Registrierung per E-Mail, öffentliche ID getrennt von der Adresse: Deine E-Mail ist für andere nie sichtbar."],
      ["🔐", "Echte Ende-zu-Ende-Verschlüsselung", "Jede Nachricht wird im Browser mit ECDH (P-256) + 256-Bit-AES-GCM verschlüsselt, bevor sie gesendet wird: Der Server sieht nur Geheimtext, nie den Klartext."],
      ["🫆", "Biometrische Entsperrung", "Face ID, Touch ID, Android-Fingerabdruck oder Windows Hello über echtes WebAuthn/FIDO2: Biometrische Daten verlassen nie dein Gerät."],
      ["🌍", "11 Sprachen", "App und Website verfügbar auf Italienisch, Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Arabisch, Chinesisch, Hindi, Russisch und Japanisch."]
    ],
    howTitle: "So funktioniert es",
    steps: [
      ["Registrieren", "E-Mail und Benutzername: Du erhältst einen Zugangscode, eine öffentliche ID und eine geheime Kombination. Speichere sie – sie werden nur einmal angezeigt."],
      ["Mit dem Code anmelden", "Gib bei jedem Öffnen der App deinen Code ein: Das passende Profil öffnet sich automatisch."],
      ["Kontakte hinzufügen", "Suche eine Person über ihre öffentliche ID und schreibe in Echtzeit."],
      ["Verstecken, was du willst", "Gib die geheime Kombination in die Suchleiste ein, um versteckte Chats bei Bedarf anzuzeigen."]
    ],
    disclaimerTitle: "Was es ist, was nicht",
    disclaimerHtml: "<strong>Dies ist ein funktionaler Prototyp</strong>, kein fertiges Produkt. Nachrichten sind Ende-zu-Ende-verschlüsselt (ECDH P-256 + 256-Bit-AES-GCM, Schlüsselableitung per HKDF-SHA256): Der Server sieht nie den Klartext. Die biometrische Entsperrung nutzt echtes WebAuthn/FIDO2. Bekannte Einschränkungen bleiben und werden im <a href=\"{manualUrl}\">Benutzerhandbuch</a> offen benannt: Es gibt noch keinen Ratchet mit Forward Secrecy „wie bei Signal“, keine Out-of-Band-Prüfung der öffentlichen Schlüssel (ein böswilliger Server könnte sie theoretisch austauschen), der private Schlüssel bleibt im Browser ohne Hardware-Secure-Enclave, und der echte E-Mail-Versand zur Kontowiederherstellung ist noch nicht angebunden. Geeignet, um das Nutzungserlebnis mit echter, aber nicht „staatssicherer“ Sicherheit auszuprobieren – noch nicht für Gespräche mit sehr hohem Risiko.",
    nativeTitle: "Native iOS- und Android-Apps",
    nativeText: "Das Grundgerüst der nativen App (Expo/React Native, mit biometrischer Systemsperre) liegt im Projektcode bereit. Die Veröffentlichung im App Store und bei Google Play erfordert die Zugangsdaten der Entwicklerkonten (Apple Developer Program und Google Play Console): Bis diese verbunden sind, bleibt die App als Web-App verfügbar, in jedem mobilen Browser nutzbar und per „Zum Home-Bildschirm“ bereits als App installierbar.",
    ctaTitle: "Teste den Prototyp",
    ctaText: "Eine E-Mail und ein Benutzername genügen, um dein erstes Profil zu erstellen."
  },
  manual: {
    title: "Benutzerhandbuch — Private Nachrichten",
    description: "Vollständige Anleitung: Registrierung, Anmeldung per Code, versteckte Chats, Ende-zu-Ende-Verschlüsselung, biometrische Entsperrung und verfügbare Sprachen.",
    h1: "Benutzerhandbuch",
    lead: "Eine vollständige Anleitung zu Private Nachrichten: wie du dich registrierst, anmeldest, die Datenschutzfunktionen nutzt und verstehst, was dieser Prototyp wirklich schützt – und was nicht.",
    sections: [
      { id: "signup", h: "1. Registrierung und erste Anmeldung", blocks: [
        ["p", "Tippe auf dem Startbildschirm auf „Registrieren“ und gib deine E-Mail und einen Benutzernamen ein. Eine Telefonnummer ist nicht erforderlich."],
        ["p", "Nach der Registrierung siehst du einmalig drei Angaben, die du sofort an einem sicheren Ort speichern musst (zum Beispiel in einem Passwortmanager):"],
        ["ul", [
          "<strong>Zugangscode</strong>: dein „Passwort“ – bei jedem Öffnen der App gibst du ihn ein und dein Profil öffnet sich automatisch.",
          "<strong>Öffentliche ID</strong>: die gibst du an Personen weiter, die du als Kontakte hinzufügen möchtest. Sie verrät nicht deine E-Mail.",
          "<strong>Geheime Kombination</strong>: dient dazu, versteckte Chats anzuzeigen (siehe eigener Abschnitt)."
        ]],
        ["warn", "Wenn du den Zugangscode verlierst, verlierst du den Zugriff auf das Profil: Eine echte Wiederherstellung per E-Mail gibt es noch nicht (siehe „Erklärte Sicherheitsgrenzen“)."]
      ]},
      { id: "profiles", h: "2. Mehrere Profile auf demselben Gerät", blocks: [
        ["p", "Du kannst mehrere Profile anlegen (zum Beispiel ein persönliches und ein Tarnprofil), alle vom selben Gerät aus erreichbar. Jedes Profil hat seinen eigenen Zugangscode: Wenn du die App öffnest und einen Code eingibst, öffnet sich automatisch das passende Profil – ohne Auswahlanzeige, die verraten würde, wie viele Profile existieren."]
      ]},
      { id: "contacts", h: "3. Kontakte hinzufügen und chatten", blocks: [
        ["p", "Tippe auf „+ Kontakt hinzufügen“ und gib die öffentliche ID der Person ein. Es öffnet sich ein Echtzeit-Chat, Ende-zu-Ende-verschlüsselt (siehe Abschnitt 7)."]
      ]},
      { id: "hidden", h: "4. Versteckte Chats und geheime Kombination", blocks: [
        ["p", "Öffne in einem Chat das Menü und wähle „Diesen Chat verstecken/anzeigen“. Ein versteckter Chat erscheint nicht mehr in der Hauptliste."],
        ["p", "Damit er wieder erscheint, gib deine geheime Kombination (die, die bei der Registrierung nur einmal angezeigt wurde) in die Suchleiste ein: Alle versteckten Chats sind wieder sichtbar, bis du die App erneut sperrst."]
      ]},
      { id: "cover", h: "5. Tarnprofil", blocks: [
        ["p", "Bei der Registrierung kannst du „Als Tarnprofil erstellen“ ankreuzen: ein Profil, das bei einer Kontrolle gezeigt werden kann, ohne Hinweise auf weitere Profile auf demselben Gerät."]
      ]},
      { id: "timed", h: "6. Zeitgesteuerte Nachrichten (Selbstzerstörung)", blocks: [
        ["p", "Vor dem Senden einer Nachricht kannst du im Dropdown-Menü eine Selbstzerstörungszeit wählen: 30 Sekunden, 5 Minuten oder 1 Stunde. Nach Ablauf dieser Zeit wird die Nachricht entfernt."]
      ]},
      { id: "encryption", h: "7. Ende-zu-Ende-Verschlüsselung: wie sie wirklich funktioniert", blocks: [
        ["p", "Das ist kein Marketing-Slogan: Jede Nachricht wird <strong>in deinem Browser</strong> verschlüsselt, bevor sie an den Server geht, nach diesem Schema:"],
        ["ol", [
          "Bei der ersten Anmeldung erzeugt dein Gerät ein ECDH-Schlüsselpaar auf der Kurve P-256 (einen öffentlichen und einen privaten Schlüssel). Der öffentliche Schlüssel wird auf den Server geladen; der private bleibt nur in deinem Browser.",
          "Wenn du einem Kontakt schreibst, kombiniert dein Browser deinen privaten Schlüssel mit dessen öffentlichem Schlüssel (ECDH-Austausch) und leitet per HKDF-SHA256 einen symmetrischen 256-Bit-AES-GCM-Schlüssel ab, der speziell für dieses Personenpaar gilt.",
          "Jede Nachricht wird mit diesem Schlüssel und jedes Mal einer anderen Zufallszahl (IV) verschlüsselt und dann bereits verschlüsselt an den Server gesendet.",
          "Der Server speichert und überträgt nur Geheimtext: Er kann den Inhalt deiner Nachrichten nicht lesen."
        ]],
        ["p", "Das ist dieselbe Art von Mathematik (ECDH + AES-GCM), die viele moderne sichere Protokolle nutzen – hier über die native Web Crypto API des Browsers angewendet, ohne externe Bibliotheken."]
      ]},
      { id: "biometric", h: "8. Biometrische Entsperrung (Face ID / Touch ID / Fingerabdruck)", blocks: [
        ["p", "In den Profileinstellungen (⚙️-Symbol) findest du „Entsperrung per Face ID / Fingerabdruck aktivieren“. Wenn du sie einschaltest, erstellt dein Gerät einen Passkey über WebAuthn/FIDO2 und registriert ihn beim Server (nur den öffentlichen Schlüssel, nie das biometrische Datum)."],
        ["p", "Ab dann zeigt der Anmeldebildschirm eine Schaltfläche „Mit Biometrie entsperren“: Du nutzt sie statt des Codes, und dein Betriebssystem (nicht die App) prüft Face ID, Touch ID, den Android-Fingerabdruck oder Windows Hello. Das biometrische Datum verlässt dein Gerät nie."],
        ["p", "Du kannst sie jederzeit in denselben Einstellungen wieder ausschalten."]
      ]},
      { id: "languages", h: "9. Sprache wechseln", blocks: [
        ["p", "Oben in jedem App-Bildschirm findest du eine Sprachauswahl. Auch diese Website gibt es in denselben 11 Sprachen: Italienisch, Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Arabisch, Chinesisch, Hindi, Russisch und Japanisch. Die in der App gewählte Sprache wird auf dem Gerät gespeichert."]
      ]},
      { id: "mobile", h: "10. Native Mobile-Apps (iOS/Android)", blocks: [
        ["p", "Ein Grundgerüst für eine native App (auf Basis von Expo/React Native) ist fertig und fügt beim Start eine biometrische Systemsperre hinzu. Die tatsächliche Veröffentlichung im App Store und bei Google Play erfordert die Zugangsdaten der Entwicklerkonten (Apple Developer Program und Google Play Console): Sobald diese verbunden sind, kann die App gebaut und veröffentlicht werden. Bis dahin bleibt die Web-App in jedem mobilen Browser nutzbar und lässt sich wie eine App auf dem Home-Bildschirm „installieren“."]
      ]},
      { id: "limits", h: "11. Erklärte Sicherheitsgrenzen", blocks: [
        ["p", "Aus Ehrlichkeit: Das kann dieser Prototyp <strong>noch nicht</strong>, auch wenn die Verschlüsselung echt ist:"],
        ["ul", [
          "<strong>Kein Ratchet / keine Forward Secrecy</strong>: Der Schlüssel eines Chats bleibt gleich, bis beide Personen ihre Schlüssel neu erzeugen (anders als bei Protokollen wie Signal, die den Schlüssel mit jeder Nachricht wechseln).",
          "<strong>Keine Out-of-Band-Prüfung der öffentlichen Schlüssel</strong>: Es gibt keine „Sicherheitsnummer“, die du mündlich mit dem Kontakt vergleichen könntest. Theoretisch könnte ein böswilliger Server einen öffentlichen Schlüssel durch seinen eigenen ersetzen (Man-in-the-Middle-Angriff). Für einen Prototyp auf einem vertrauenswürdigen Server in Ordnung; vor einem Einsatz mit hohem Risiko sollte diese Prüfung ergänzt werden.",
          "<strong>Privater Schlüssel im Browser</strong>: Er liegt im lokalen Speicher des Browsers (localStorage), nicht in einer Hardware-Secure-Enclave. Wer physischen oder softwareseitigen Zugriff auf das entsperrte Gerät hat, könnte ihn lesen.",
          "<strong>Kein echter E-Mail-Versand</strong>: Die Registrierung funktioniert, aber es ist noch kein E-Mail-Dienst für eine mögliche Kontowiederherstellung per „Magic Link“ angebunden."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Fehlerbehebung", blocks: [
        ["h3", "„Verschlüsselung nicht möglich: Der Kontakt hat noch keinen öffentlichen Schlüssel“"],
        ["p", "Das passiert, wenn sich dein Kontakt seit dem letzten App-Update nicht angemeldet hat (der Schlüssel wird bei der Anmeldung automatisch erzeugt und hochgeladen). Bitte ihn, sich einmal anzumelden – danach kannst du ihm normal schreiben."],
        ["h3", "„Ich habe den Zugangscode verloren“"],
        ["p", "Derzeit gibt es keine automatische Wiederherstellung: Du musst ein neues Profil registrieren. Bewahre den Code immer in einem Passwortmanager auf."],
        ["h3", "Die biometrische Entsperrung erscheint nicht"],
        ["p", "Sie erfordert ein Gerät mit eingerichtetem Face ID, Touch ID, Fingerabdruck oder Windows Hello, einen aktuellen Browser und eine HTTPS-Verbindung (die Web-App in Produktion nutzt bereits eine). Außerdem muss sie mindestens einmal in den Einstellungen aktiviert worden sein."]
      ]}
    ]
  },
  privacy: {
    title: "Datenschutzerklärung — Private Nachrichten",
    description: "Datenschutzerklärung des Prototyps Private Nachrichten: welche Daten verarbeitet werden und wie.",
    h1: "Datenschutzerklärung",
    sections: [
      ["Wer die Daten verarbeitet", ["Diese Website und der verknüpfte Prototyp sind ein persönliches Demonstrationsprojekt. Für Anfragen zu Daten kannst du über <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a> schreiben."]],
      ["Von der Präsentationswebsite erhobene Daten", ["Diese Website verwendet keine Analyse- oder Tracking-Tools von Drittanbietern. Gespeichert werden nur die von dir gewählten Cookie-Einstellungen (siehe Cookie-Richtlinie), lokal in deinem Browser."]],
      ["Vom Prototyp (/app) erhobene Daten", [
        "Um den Messaging-Prototyp zu nutzen, legst du ein Profil mit E-Mail und Benutzername an. Auf dem Server werden gespeichert: E-Mail, Benutzername, öffentliche ID, Zugangscode, Kombination der versteckten Chats, hinzugefügte Kontakte, dein öffentlicher Verschlüsselungsschlüssel und die gesendeten Nachrichten.",
        "<strong>Nachrichten:</strong> Der Inhalt wird vor dem Senden im Browser Ende-zu-Ende-verschlüsselt; der Server speichert nur Geheimtext und kann ihn nicht lesen. Metadaten (Absender, Uhrzeit, Reaktionen, Ablauf zeitgesteuerter Nachrichten) bleiben unverschlüsselt.",
        "<strong>Biometrische Entsperrung:</strong> Wenn du sie aktivierst, wird auf dem Server nur der öffentliche Schlüssel des Passkeys (WebAuthn) gespeichert. Biometrische Daten verlassen nie dein Gerät. Dein privater Verschlüsselungsschlüssel bleibt im Browser (localStorage).",
        "<strong>Wichtig:</strong> Dies ist ein Demonstrationsprototyp: E-Mail, Benutzername und Zugangscodes werden unverschlüsselt gespeichert, und der Dienst erreicht nicht die Standards eines Produktivprodukts. Gib keine echten sensiblen Informationen ein: Nutze Testdaten."
      ]],
      ["Zweck der Verarbeitung", ["Die Daten dienen ausschließlich dazu, die Demo zum Laufen zu bringen (Authentifizierung, Nachrichten, Kontakte). Sie werden nicht an Dritte weitergegeben und nicht für Werbeprofile verwendet."]],
      ["Speicherdauer", ["Die Daten des Prototyps können jederzeit bei Updates oder Zurücksetzungen der Demo ohne Vorankündigung gelöscht werden."]],
      ["Deine Rechte", ["Du kannst jederzeit die Löschung der im Prototyp eingegebenen Daten verlangen, indem du über die oben genannten Kontaktmöglichkeiten schreibst."]]
    ]
  },
  cookie: {
    title: "Cookie-Richtlinie — Private Nachrichten",
    description: "Informationen zu den Cookies, die die Präsentationswebsite des Prototyps Private Nachrichten verwendet.",
    h1: "Cookie-Richtlinie",
    sections: [
      ["Was Cookies sind", ["Cookies sind kleine Dateien, die der Browser beim Besuch einer Website speichert. Diese Website verwendet keine Tracking-Cookies von Drittanbietern."]],
      ["Technische Cookies", ["Wir nutzen eine einzige technische Einstellung (im localStorage des Browsers gespeichert, nicht als HTTP-Cookie), um deine Auswahl im Cookie-Banner zu merken. Ohne sie würde das Banner bei jedem Besuch erneut erscheinen. Die App (/app) speichert zusätzlich lokal die gewählte Sprache und deine Verschlüsselungsschlüssel, die für ihren Betrieb notwendig sind."]],
      ["Statistik-Cookies", ["Derzeit verwendet diese Website keine statistischen Analysetools. Die Kategorie „Statistik“ im Banner ist für eine mögliche spätere Nutzung vorgesehen: Sollten Tools wie Google Analytics aktiviert werden, startet das Skript erst nach ausdrücklicher Einwilligung."]],
      ["Marketing-Cookies", ["Wir verwenden keine Marketing- oder Werbe-Cookies oder -Pixel."]],
      ["So verwaltest du deine Einstellungen", ["Du kannst die gespeicherte Einstellung löschen, indem du die Browserdaten für diese Website entfernst: Beim nächsten Besuch erscheint das Banner wieder."]]
    ]
  }
};
