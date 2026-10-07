// Dizionario del sito (de). Struttura identica a it.js.
module.exports = {
  "code": "de",
  "dir": "ltr",
  "brand": "Securmy",
  "ui": {
    "openApp": "App öffnen",
    "manual": "Handbuch",
    "langAria": "Sprache",
    "legalAria": "Rechtliches",
    "privacy": "Datenschutzerklärung",
    "cookie": "Cookie-Richtlinie",
    "langsLabel": "Alle Sprachen",
    "updated": "Zuletzt aktualisiert: Oktober 2026.",
    "tocTitle": "Inhalt",
    "cookieBanner": {
      "text": "Wir verwenden notwendige technische Cookies und, mit deiner Einwilligung, Statistik-Cookies. Siehe <a href=\"{privacyUrl}\">Datenschutzerklärung</a> und <a href=\"{cookieUrl}\">Cookie-Richtlinie</a>.",
      "reject": "Ablehnen",
      "customize": "Anpassen",
      "accept": "Alle akzeptieren",
      "statsQuestion": "Möchtest du Statistik-Cookies akzeptieren?"
    },
    "terms": "Nutzungsbedingungen",
    "owner": "Verantwortlicher"
  },
  "landing": {
    "title": "Securmy — Privater Messenger, Datentresor und verschlüsselter P2P-Versand",
    "description": "Chat mit echter Ende-zu-Ende-Verschlüsselung, Datentresor, verschlüsselte Passwörter und Notizen, P2P-Versand per Link, verschlüsselte Anrufe und Zwei-Schritt-Bestätigung. 11 Sprachen.",
    "ogTitle": "Securmy — Sicherheit, Privatsphäre und Vertraulichkeit",
    "ogDesc": "Nachrichten, Dateien, Passwörter und Anrufe mit Ende-zu-Ende-Verschlüsselung geschützt: alles auf deinem Gerät verschlüsselt, in 11 Sprachen.",
    "badge": "Funktionaler Prototyp",
    "h1": "Ein Chat, in dem das Passwort dein Profil wählt",
    "lead": "Keine Telefonnummer. Gib Benutzername und Passwort ein: Das Passwort entscheidet, welches Profil sich öffnet. Versteckte Chats, Tarnprofil, selbstzerstörende Nachrichten.",
    "ctaOpen": "App öffnen →",
    "ctaHow": "So funktioniert es",
    "featuresTitle": "Was du tun kannst",
    "features": [
      [
        "🔑",
        "Anmeldung mit Benutzername und Passwort",
        "Zuerst der Benutzername, dann das Passwort: gleicher Benutzername, anderes Passwort, anderes Profil. Keine Auswahlanzeige."
      ],
      [
        "🪪",
        "Mehrere Profile",
        "Mehrere Profile auf demselben Gerät, jedes mit eigenen Kontakten, Chats und Einstellungen."
      ],
      [
        "🙈",
        "Versteckte Chats",
        "Verstecke eine Unterhaltung in der Hauptliste. Sie erscheint nur wieder, wenn du eine geheime Kombination in die Suche eingibst."
      ],
      [
        "🎭",
        "Tarnprofil",
        "Lege ein harmloses Profil an, das du bei einer Kontrolle zeigen kannst – ohne Hinweis auf weitere Profile."
      ],
      [
        "💣",
        "Zeitgesteuerte Nachrichten",
        "Sende Nachrichten, die sich nach 30 Sekunden, 5 Minuten oder einer Stunde selbst zerstören."
      ],
      [
        "📵",
        "Keine Telefonnummer",
        "Registrierung per E-Mail, öffentliche ID getrennt von der Adresse: Deine E-Mail ist für andere nie sichtbar."
      ],
      [
        "🔐",
        "Echte Ende-zu-Ende-Verschlüsselung",
        "Jede Nachricht wird im Browser mit ECDH (P-256) + 256-Bit-AES-GCM verschlüsselt, bevor sie gesendet wird: Der Server sieht nur Geheimtext, nie den Klartext."
      ],
      [
        "🫆",
        "Biometrische Entsperrung",
        "Face ID, Touch ID, Android-Fingerabdruck oder Windows Hello über echtes WebAuthn/FIDO2: Biometrische Daten verlassen nie dein Gerät."
      ],
      [
        "🌍",
        "11 Sprachen",
        "App und Website verfügbar auf Italienisch, Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Arabisch, Chinesisch, Hindi, Russisch und Japanisch."
      ]
    ],
    "howTitle": "So funktioniert es",
    "steps": [
      [
        "Registrieren",
        "E-Mail, Benutzername und Passwort: Du erhältst eine öffentliche ID und eine geheime Kombination. Speichere sie, sie werden nicht erneut angezeigt."
      ],
      [
        "Mit Benutzername und Passwort anmelden",
        "Gib bei jedem Öffnen Benutzername und Passwort ein: Das passende Profil öffnet sich automatisch."
      ],
      [
        "Kontakte hinzufügen",
        "Suche eine Person über ihre öffentliche ID und schreibe in Echtzeit."
      ],
      [
        "Verstecken, was du willst",
        "Gib die geheime Kombination in die Suchleiste ein, um versteckte Chats bei Bedarf anzuzeigen."
      ]
    ],
    "disclaimerTitle": "Was es ist, was nicht",
    "disclaimerHtml": "<strong>Dies ist ein funktionsfähiger Prototyp</strong>, kein fertiges Produkt, aber die Sicherheit ist echt: jede Nachricht hat einen neuen Schlüssel, der nach dem Lesen gelöscht wird (Forward Secrecy), private Schlüssel liegen in einem mit deinem Passwort verschlüsselten Tresor, du kannst die Identität des Kontakts per Sicherheitsnummer prüfen und wirst gewarnt, wenn sich sein Schlüssel ändert. Die biometrische Entsperrung nutzt echtes WebAuthn/FIDO2. Bekannte Grenzen bleiben, offen erklärt im <a href=\"{manualUrl}\">Benutzerhandbuch</a> (Metadaten für den Server sichtbar, Verlauf ans Gerät gebunden, Wiederherstellung nur per E-Mail). Für Gespräche mit extrem hohem Risiko ist er noch nicht gedacht.",
    "nativeTitle": "Native iOS- und Android-Apps",
    "nativeText": "Das Grundgerüst der nativen App (Expo/React Native, mit biometrischer Systemsperre) liegt im Projektcode bereit. Die Veröffentlichung im App Store und bei Google Play erfordert die Zugangsdaten der Entwicklerkonten (Apple Developer Program und Google Play Console): Bis diese verbunden sind, bleibt die App als Web-App verfügbar, in jedem mobilen Browser nutzbar und per „Zum Home-Bildschirm“ bereits als App installierbar.",
    "ctaTitle": "Teste den Prototyp",
    "ctaText": "Eine E-Mail und ein Benutzername genügen, um dein erstes Profil zu erstellen.",
    "secTitle": "Sicherheit und Privatsphäre: das Herz der App",
    "secLead": "Wir sagen nicht nur „verschlüsselt“. Hier steht konkret, was deine Unterhaltungen schützt.",
    "security": [
      [
        "🔄",
        "Für jede Nachricht ein neuer Schlüssel",
        "Jede Nachricht hat einen Einmalschlüssel (Forward Secrecy), der nach dem Lesen gelöscht wird. Selbst wenn jemand deine Schlüssel erlangt, kann er frühere Nachrichten nicht entschlüsseln."
      ],
      [
        "🗝️",
        "Tresor, mit deinem Passwort verschlüsselt",
        "Private Schlüssel und gelesene Nachrichten werden auf dem Gerät (PBKDF2 + AES-GCM) mit deinem Passwort verschlüsselt: ohne es bleiben sie unlesbar."
      ],
      [
        "🔍",
        "Schlüsselprüfung und Abhör-Warnung",
        "Vergleiche die Sicherheitsnummer mündlich mit deinem Kontakt. Ändert sich sein Schlüssel, warnt dich die App und blockiert das Senden, bis du bestätigst."
      ],
      [
        "🙈",
        "Ein blinder Server",
        "Der Server speichert nur Chiffretext. E-Mail und Benutzername sind in der Datenbank verschlüsselt; Passwörter liegen nur als Hash (scrypt) vor."
      ],
      [
        "🛡️",
        "Schutz vor Login-Angriffen",
        "Versuche pro IP-Adresse und Benutzername begrenzt, widerrufbare Sitzungen, andere Sitzungen enden bei Passwortänderung."
      ],
      [
        "🫆",
        "Biometrie, die dein Gerät nie verlässt",
        "Mit WebAuthn/FIDO2 erhält der Server nur den öffentlichen Schlüssel der Passkey: biometrische Daten verlassen nie dein Handy oder deinen Computer."
      ]
    ],
    "suiteTitle": "Mehr als ein Chat: dein digitaler Tresor",
    "suiteLead": "Securmy geht über Messaging hinaus. Alles, was du speicherst oder teilst, wird auf deinem Gerät verschlüsselt – mit demselben Tresor, der auch deine Chats schützt.",
    "suite": [
      [
        "🗄️",
        "Datentresor",
        "Verstecke und schütze Dokumente, Fotos und Dateien: auf dem Gerät mit AES-256 verschlüsselt und nur mit deinem Passwort oder per Biometrie zu öffnen."
      ],
      [
        "🔗",
        "P2P-Versand per Link",
        "Die Datei geht direkt von Gerät zu Gerät, verschlüsselt und ohne Speicherung auf dem Server. Einmal-Link mit Ablaufzeit."
      ],
      [
        "🧼",
        "Metadaten entfernen",
        "Entfernt GPS-Position, Kameramodell und andere versteckte Daten aus Fotos, bevor du sie teilst."
      ],
      [
        "🔑",
        "Passwort-Manager",
        "Speichere Zugangsdaten im Tresor, erzeuge starke Passwörter und kopiere sie: Die Zwischenablage wird nach 20 Sekunden geleert."
      ],
      [
        "📝",
        "Verschlüsselte Notizen",
        "Private Notizen, auf deinem Gerät verschlüsselt und nie an einen Server gesendet."
      ],
      [
        "👁️",
        "Einmal-Nachrichten",
        "Der Empfänger öffnet sie nur einmal: Nach wenigen Sekunden werden sie vom Server und von seinem Gerät gelöscht."
      ],
      [
        "📞",
        "Verschlüsselte Sprach- und Videoanrufe",
        "Direkt zwischen den beiden Geräten (DTLS-SRTP), mit einem Prüfcode zum mündlichen Vergleich gegen Abhören."
      ],
      [
        "🔢",
        "Zwei-Schritt-Bestätigung",
        "TOTP-Codes mit jeder Authenticator-App: Auch wer dein Passwort kennt, kommt nicht hinein."
      ],
      [
        "💾",
        "Verschlüsseltes Backup",
        "Exportiere Dateien, Notizen und Passwörter in ein einziges Archiv, verschlüsselt mit einer Passphrase, die nur du kennst."
      ],
      [
        "🚨",
        "Sicherheitscheck und Notfall-Löschung",
        "Ein Punktwert zeigt, was zu verbessern ist; in Gefahr löscht ein Tipp Schlüssel, Dateien und Passwörter vom Gerät."
      ],
      [
        "☁️",
        "Verschlüsselte Synchronisierung (kostenpflichtig)",
        "Synchronisiere deinen Tresor zwischen deinen Geräten mit Speicherpaketen (5, 25 oder 100 GB pro Monat). Der Server speichert nur bereits verschlüsselte Daten: Der Schlüssel bleibt auf deinen Geräten. Ohne Tarif bleibt alles lokal."
      ],
      [
        "🛰️",
        "IP-Schutz per Relay",
        "Mit einem verschlüsselten Relay (TURN) kannst du deine IP-Adresse bei Anrufen und P2P-Übertragungen verbergen und sie auch in sehr restriktiven Netzwerken nutzen."
      ]
    ],
    "roadmapTitle": "Demnächst",
    "roadmapLead": "Was wir planen. Noch nicht verfügbar und kein Terminversprechen.",
    "roadmap": [
      [
        "🧅",
        "Tor-Netzwerk",
        "Der Dienst kann als .onion-Adresse bereitgestellt werden: Die Installationsdateien sind fertig (Self-Hosting) und werden auf Anfrage aktiviert. Der Tor Browser deaktiviert WebRTC, daher funktionieren P2P-Übertragungen und Anrufe nicht über Tor; Nachrichten, Tresor und Sync schon."
      ],
      [
        "📱",
        "iOS- und Android-Apps",
        "Native Apps mit biometrischer Entsperrung, in den Stores veröffentlicht – mit denselben Sicherheits- und Datenschutzgarantien wie die Website."
      ]
    ]
  },
  "manual": {
    "title": "Benutzerhandbuch — Securmy",
    "description": "Vollständige Anleitung: Registrierung, Anmeldung mit Benutzername und Passwort, versteckte Chats, Ende-zu-Ende-Verschlüsselung, biometrisches Entsperren und verfügbare Sprachen.",
    "h1": "Benutzerhandbuch",
    "lead": "Eine vollständige Anleitung zu Securmy: wie du dich registrierst, anmeldest, die Datenschutzfunktionen nutzt und verstehst, was dieser Prototyp wirklich schützt – und was nicht.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Registrierung und erste Anmeldung",
        "blocks": [
          [
            "p",
            "Tippe auf dem Startbildschirm auf „Registrieren“ und gib deine E-Mail und einen Benutzernamen ein. Eine Telefonnummer ist nicht erforderlich."
          ],
          [
            "p",
            "Nach der Registrierung siehst du einmalig drei Angaben, die du sofort an einem sicheren Ort speichern musst (zum Beispiel in einem Passwortmanager):"
          ],
          [
            "ul",
            [
              "<strong>Benutzername und Passwort</strong>: Der Benutzername ist das erste Feld, das Passwort entscheidet, welches Profil sich öffnet. Unter demselben Benutzernamen kannst du mehrere Profile haben, jedes mit eigenem Passwort.",
              "<strong>Öffentliche ID</strong>: die gibst du an Personen weiter, die du als Kontakte hinzufügen möchtest. Sie verrät nicht deine E-Mail.",
              "<strong>Geheime Kombination</strong>: dient dazu, versteckte Chats anzuzeigen (siehe eigener Abschnitt)."
            ]
          ],
          [
            "warn",
            "Wenn du das Passwort verlierst, kannst du es per E-Mail zurücksetzen, aber nur wenn die E-Mail des Profils bestätigt wurde. Ohne Passwort und ohne bestätigte E-Mail ist das Profil nicht wiederherstellbar."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Mehrere Profile auf demselben Gerät",
        "blocks": [
          [
            "p",
            "Du kannst mehrere Profile (z. B. ein persönliches und ein Tarnprofil) mit demselben Benutzernamen, aber unterschiedlichen Passwörtern anlegen. Bei Eingabe von Benutzername und Passwort öffnet sich das passende Profil, ohne Auswahlanzeige, die verrät, wie viele Profile existieren. Dasselbe Passwort darf nicht für zwei Profile unter demselben Benutzernamen verwendet werden."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Kontakte hinzufügen und chatten",
        "blocks": [
          [
            "p",
            "Tippe auf „+ Kontakt hinzufügen“ und gib die öffentliche ID der Person ein. Es öffnet sich ein Echtzeit-Chat, Ende-zu-Ende-verschlüsselt (siehe Abschnitt 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Versteckte Chats und geheime Kombination",
        "blocks": [
          [
            "p",
            "Öffne in einem Chat das Menü und wähle „Diesen Chat verstecken/anzeigen“. Ein versteckter Chat erscheint nicht mehr in der Hauptliste."
          ],
          [
            "p",
            "Damit er wieder erscheint, gib deine geheime Kombination (die, die bei der Registrierung nur einmal angezeigt wurde) in die Suchleiste ein: Alle versteckten Chats sind wieder sichtbar, bis du die App erneut sperrst."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Tarnprofil",
        "blocks": [
          [
            "p",
            "Bei der Registrierung kannst du „Als Tarnprofil erstellen“ ankreuzen: ein Profil, das bei einer Kontrolle gezeigt werden kann, ohne Hinweise auf weitere Profile auf demselben Gerät."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Zeitgesteuerte Nachrichten (Selbstzerstörung)",
        "blocks": [
          [
            "p",
            "Vor dem Senden einer Nachricht kannst du im Dropdown-Menü eine Selbstzerstörungszeit wählen: 30 Sekunden, 5 Minuten oder 1 Stunde. Nach Ablauf dieser Zeit wird die Nachricht entfernt."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. Ende-zu-Ende-Verschlüsselung: wie sie wirklich funktioniert",
        "blocks": [
          [
            "p",
            "Das ist kein Marketing-Slogan: Jede Nachricht wird <strong>in deinem Browser</strong> verschlüsselt, bevor sie an den Server geht, nach diesem Schema:"
          ],
          [
            "ol",
            [
              "Bei der ersten Anmeldung erzeugt dein Gerät ein ECDH-Schlüsselpaar (Kurve P-256): der öffentliche Schlüssel geht an den Server, der private bleibt auf dem Gerät, mit deinem Passwort verschlüsselt. Außerdem bereitet es einen Vorrat öffentlicher Einmalschlüssel („Prekeys“) vor.",
              "Für jede Nachricht erzeugt dein Browser einen temporären Schlüssel und holt EINEN Einmal-Prekey des Kontakts vom Server. Er kombiniert drei ECDH-Austausche (deine Identität, den temporären Schlüssel, den Prekey) und leitet mit HKDF-SHA256 einen 256-Bit-AES-GCM-Schlüssel ab, der nur für diese Nachricht gilt.",
              "Die Nachricht wird mit diesem Schlüssel und einem zufälligen IV verschlüsselt; der Header ist authentifiziert und kann nicht verändert werden. Der Server erhält nur Chiffretext.",
              "Der Empfänger rekonstruiert denselben Schlüssel, liest die Nachricht und löscht sofort den privaten Prekey: ab dann kann niemand sie mehr entschlüsseln, auch nicht mit deinen Langzeitschlüsseln."
            ]
          ],
          [
            "p",
            "Das ist dieselbe Art von Mathematik (ECDH + AES-GCM), die viele moderne sichere Protokolle nutzen – hier über die native Web Crypto API des Browsers angewendet, ohne externe Bibliotheken."
          ],
          [
            "h3",
            "Forward Secrecy: vergangene Nachrichten bleiben sicher"
          ],
          [
            "p",
            "Selbst wenn jemand deine Langzeitschlüssel erlangt (z. B. durch Diebstahl des Geräts), kann er bereits empfangene Nachrichten nicht entschlüsseln, denn deren Schlüssel wurden gelöscht. Bereits gelesener Text bleibt nur im verschlüsselten lokalen Cache deines Geräts."
          ],
          [
            "h3",
            "Der Schlüsseltresor"
          ],
          [
            "p",
            "Private Schlüssel, Prekeys und der Nachrichten-Cache werden im Browser nur verschlüsselt (AES-GCM) gespeichert, mit einem aus deinem Passwort per PBKDF2-SHA256 (310.000 Iterationen) abgeleiteten Schlüssel. Meldest du dich per Biometrie an, wirst du einmal nach dem Passwort gefragt, um den Tresor zu öffnen. Bei einer Passwortänderung wird der Tresor neu verschlüsselt."
          ],
          [
            "h3",
            "Prüfen, ob er es wirklich ist: Sicherheitsnummer"
          ],
          [
            "p",
            "Tippe im Chat auf das 🔑-Symbol: du siehst eine 60-stellige Nummer, für beide gleich. Vergleiche sie mit deinem Kontakt persönlich oder mündlich: Stimmt sie überein, mischt sich niemand ein. Ändert sich der Schlüssel eines Kontakts (neues Gerät oder mögliches Abhören), erscheint eine Warnung und das Senden bleibt gesperrt, bis du „Neuen Schlüssel akzeptieren“ wählst."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Biometrische Entsperrung (Face ID / Touch ID / Fingerabdruck)",
        "blocks": [
          [
            "p",
            "In den Profileinstellungen (⚙️-Symbol) findest du „Entsperrung per Face ID / Fingerabdruck aktivieren“. Wenn du sie einschaltest, erstellt dein Gerät einen Passkey über WebAuthn/FIDO2 und registriert ihn beim Server (nur den öffentlichen Schlüssel, nie das biometrische Datum)."
          ],
          [
            "p",
            "Danach erscheint auf dem Anmeldebildschirm die Schaltfläche „Mit Biometrie entsperren“: Nutze sie statt des Passworts; dein Betriebssystem (nicht die App) prüft Face ID, Touch ID, den Android-Fingerabdruck oder Windows Hello. Die biometrischen Daten verlassen nie dein Gerät."
          ],
          [
            "p",
            "Du kannst sie jederzeit in denselben Einstellungen wieder ausschalten."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Sprache wechseln",
        "blocks": [
          [
            "p",
            "Oben in jedem App-Bildschirm findest du eine Sprachauswahl. Auch diese Website gibt es in denselben 11 Sprachen: Italienisch, Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Arabisch, Chinesisch, Hindi, Russisch und Japanisch. Die in der App gewählte Sprache wird auf dem Gerät gespeichert."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. Native Mobile-Apps (iOS/Android)",
        "blocks": [
          [
            "p",
            "Ein Grundgerüst für eine native App (auf Basis von Expo/React Native) ist fertig und fügt beim Start eine biometrische Systemsperre hinzu. Die tatsächliche Veröffentlichung im App Store und bei Google Play erfordert die Zugangsdaten der Entwicklerkonten (Apple Developer Program und Google Play Console): Sobald diese verbunden sind, kann die App gebaut und veröffentlicht werden. Bis dahin bleibt die Web-App in jedem mobilen Browser nutzbar und lässt sich wie eine App auf dem Home-Bildschirm „installieren“."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Erklärte Sicherheitsgrenzen",
        "blocks": [
          [
            "p",
            "Der Ehrlichkeit halber die Grenzen, die bleiben – obwohl die Verschlüsselung echt und nicht nur behauptet ist:"
          ],
          [
            "ul",
            [
              "<strong>Prekeys aufgebraucht</strong>: Ist ein Kontakt lange offline und hat keine Einmalschlüssel mehr, nutzt die Nachricht trotzdem einen neuen Schlüssel, aber ohne Einmal-Löschung – die Forward Secrecy ist dann schwächer.",
              "<strong>Nachrichten an dieses Gerät gebunden</strong>: Der entschlüsselte Verlauf wandert bewusst nicht mit. Auf einem neuen Gerät oder nach einer Passwort-Wiederherstellung per E-Mail ist der frühere Tresor nicht wiederherstellbar: du startest mit neuer Identität, deine Kontakte sehen die Warnung zum Schlüsselwechsel.",
              "<strong>Der Tresor ist so stark wie das Passwort</strong>: Wähle ein langes, einzigartiges. Wer dein bereits entsperrtes Gerät mit geöffneter App hat, kann die Chats lesen – wie bei jeder App.",
              "<strong>Metadaten für den Server sichtbar</strong>: Absender, Zeit, Reaktionen und Ablauf zeitlich begrenzter Nachrichten sind nicht verschlüsselt.",
              "<strong>Wiederherstellung nur per E-Mail</strong>: Verlierst du Passwort und Zugang zur bestätigten E-Mail, ist das Profil nicht wiederherstellbar. Nutzt du mehrere Profile (z. B. ein Tarnprofil), verwende verschiedene E-Mails: Ein Wiederherstellungslink verrät dem E-Mail-Inhaber, dass das Profil existiert."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Fehlerbehebung",
        "blocks": [
          [
            "h3",
            "„Verschlüsselung nicht möglich: Der Kontakt hat noch keinen öffentlichen Schlüssel“"
          ],
          [
            "p",
            "Das passiert, wenn sich dein Kontakt seit dem letzten App-Update nicht angemeldet hat (der Schlüssel wird bei der Anmeldung automatisch erzeugt und hochgeladen). Bitte ihn, sich einmal anzumelden – danach kannst du ihm normal schreiben."
          ],
          [
            "h3",
            "„Ich habe mein Passwort verloren“"
          ],
          [
            "p",
            "Nutze „Passwort vergessen?“ auf dem Anmeldebildschirm und gib E-Mail und Benutzernamen ein: Ist die E-Mail des Profils bestätigt, erhältst du einen 1 Stunde gültigen Link. Sonst ist das Profil nicht wiederherstellbar und muss neu angelegt werden. Bewahre das Passwort immer in einem Passwortmanager auf."
          ],
          [
            "h3",
            "Die biometrische Entsperrung erscheint nicht"
          ],
          [
            "p",
            "Sie erfordert ein Gerät mit eingerichtetem Face ID, Touch ID, Fingerabdruck oder Windows Hello, einen aktuellen Browser und eine HTTPS-Verbindung (die Web-App in Produktion nutzt bereits eine). Außerdem muss sie mindestens einmal in den Einstellungen aktiviert worden sein."
          ],
          [
            "h3",
            "„Nachricht nicht mehr lesbar“"
          ],
          [
            "p",
            "Aus Sicherheitsgründen wird der Schlüssel jeder Nachricht gelöscht, sobald du sie gelesen hast: der Text bleibt nur im verschlüsselten Cache dieses Geräts. Wechselst du das Gerät, löschst Browserdaten oder setzt das Passwort per E-Mail zurück, sind frühere Nachrichten nicht wiederherstellbar. Das ist der Preis der Forward Secrecy."
          ]
        ]
      },
      {
        "id": "suite",
        "h": "13. Securmy-Tresor und Werkzeuge",
        "blocks": [
          [
            "p",
            "Öffne den Tresor über die Schaltfläche 🛡️ in der Seitenleiste. Alles darin wird auf deinem Gerät mit AES-256-GCM verschlüsselt, mit einem Schlüssel, der in deinem Tresor liegt und durch dein Passwort geschützt ist: Der Server erhält nie Dateien, Notizen oder Passwörter."
          ],
          [
            "h3",
            "Datentresor"
          ],
          [
            "p",
            "Füge Dateien (bis 100 MB je Datei) im Tab Dateien hinzu. Ist das Kästchen aktiv, werden Fotos vor dem Speichern von Metadaten bereinigt. Jede Datei lässt sich herunterladen, per P2P senden oder löschen."
          ],
          [
            "h3",
            "P2P-Versand per Link"
          ],
          [
            "p",
            "Wähle eine Datei und eine Ablaufzeit (10 Minuten oder 1 Stunde): Du erhältst einen Einmal-Link. Die Datei geht direkt zum Empfänger, verschlüsselt mit einem Schlüssel, der nur hinter dem # im Link steht und nie zum Server gelangt. Lass die Seite offen, bis die Übertragung fertig ist."
          ],
          [
            "h3",
            "Fotos säubern"
          ],
          [
            "p",
            "Zeichnet das Bild neu und verwirft EXIF, GPS-Position und Vorschaubilder. Funktioniert mit JPEG, PNG und WebP; für andere Formate ist die automatische Bereinigung nicht verfügbar."
          ],
          [
            "h3",
            "Notizen und Passwörter"
          ],
          [
            "p",
            "Notizen und Zugangsdaten bleiben im Tresor verschlüsselt. Der Generator erzeugt zufällige Passwörter; kopierst du eines, wird die Zwischenablage nach 20 Sekunden geleert."
          ],
          [
            "h3",
            "Einmal-Nachrichten"
          ],
          [
            "p",
            "Wähle neben dem Nachrichtenfeld „Einmal ansehen“. Der Empfänger tippt zum Ansehen: Der Text bleibt 10 Sekunden sichtbar und wird dann auf seinem Gerät und auf dem Server zerstört. Ein Foto vom Bildschirm kann das nicht verhindern."
          ],
          [
            "h3",
            "Sprach- und Videoanrufe"
          ],
          [
            "p",
            "Nutze die Schaltflächen 📞 und 🎥 in der Chat-Kopfzeile. Audio und Video laufen direkt zwischen den Geräten, verschlüsselt. Beide sehen einen vierstelligen Code: Vergleicht ihn mündlich; stimmt er überein, wurde der Anruf nicht abgefangen."
          ],
          [
            "h3",
            "Zwei-Schritt-Bestätigung"
          ],
          [
            "p",
            "Unter Sicherheit kannst du TOTP-Codes mit einer Authenticator-App aktivieren (Google Authenticator, Aegis, 1Password …). Danach braucht die Anmeldung mit Passwort zusätzlich den sechsstelligen Code. Die biometrische Entsperrung bleibt eine eigene Anmeldemethode."
          ],
          [
            "h3",
            "Backup und Notfall-Löschung"
          ],
          [
            "p",
            "Das Backup enthält Dateien, Notizen und Passwörter, verschlüsselt mit einer von dir gewählten Passphrase von mindestens 10 Zeichen: Ohne sie ist es nicht wiederherstellbar. Nachrichten sind nicht enthalten. Die Notfall-Löschung entfernt Schlüssel, Nachrichten-Cache, Dateien, Notizen und Passwörter vom Gerät und ist nicht rückgängig zu machen."
          ],
          [
            "h3",
            "Grenzen, die du kennen solltest"
          ],
          [
            "ul",
            [
              "Die Synchronisierung zwischen Geräten ist optional und kostenpflichtig (Speicherpakete): Die Daten bleiben auf deinem Gerät verschlüsselt, der Server hat den Schlüssel nicht. Ohne Tarif bleibt der Tresor nur lokal; ein Backup dient weiterhin zum Umzug.",
              "Um deine IP bei P2P-Übertragungen und Anrufen zu verbergen, aktiviere Sicherheit → IP-Schutz (verschlüsseltes Relay), sofern der Dienst einen TURN-Server hat. Ohne Relay kann die andere Person deine IP sehen, und in sehr restriktiven Netzwerken kann die Verbindung scheitern.",
              "Der Passwort-Manager ist schlicht: Er füllt keine Formulare selbst aus und ersetzt für berufliche Zwecke keinen spezialisierten Manager.",
              "Verlierst du Passwort und Backup-Passphrase, sind die verschlüsselten Daten nicht wiederherstellbar: Niemand, auch wir nicht, kann sie öffnen."
            ]
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Datenschutzerklärung — Securmy",
    "description": "Datenschutzerklärung des Prototyps Securmy: welche Daten verarbeitet werden und wie.",
    "h1": "Datenschutzerklärung",
    "sections": [
      [
        "Wer die Daten verarbeitet",
        [
          "Diese Website und der verknüpfte Prototyp sind ein persönliches Demonstrationsprojekt. Für Anfragen zu Daten kannst du über <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a> schreiben."
        ]
      ],
      [
        "Von der Präsentationswebsite erhobene Daten",
        [
          "Diese Website verwendet keine Analyse- oder Tracking-Tools von Drittanbietern. Gespeichert werden nur die von dir gewählten Cookie-Einstellungen (siehe Cookie-Richtlinie), lokal in deinem Browser."
        ]
      ],
      [
        "Vom Prototyp (/app) erhobene Daten",
        [
          "Für den Messaging-Prototyp legst du ein Profil mit E-Mail, Benutzername und Passwort an. Auf dem Server (PostgreSQL-Datenbank) gespeichert werden: E-Mail (verschlüsselt), Benutzername, Passwort-Hash, öffentliche ID, Kombination für versteckte Chats, hinzugefügte Kontakte, dein öffentlicher Verschlüsselungsschlüssel, aktive Sitzungen und gesendete Nachrichten.",
          "<strong>Nachrichten:</strong> Der Inhalt wird vor dem Senden im Browser Ende-zu-Ende-verschlüsselt; der Server speichert nur Geheimtext und kann ihn nicht lesen. Metadaten (Absender, Uhrzeit, Reaktionen, Ablauf zeitgesteuerter Nachrichten) bleiben unverschlüsselt.",
          "<strong>Biometrische Entsperrung:</strong> Wenn du sie aktivierst, wird nur der öffentliche Schlüssel der Passkey (WebAuthn) auf dem Server gespeichert. Biometrische Daten verlassen nie dein Gerät.",
          "<strong>Wichtig:</strong> Dies ist ein Demonstrations-Prototyp, und der Dienst erreicht nicht die Standards eines Produktivprodukts. E-Mail und Benutzername sind in der Datenbank verschlüsselt (AES-256-GCM); die E-Mail dient nur der Bestätigung und Passwort-Wiederherstellung. Passwörter werden nicht im Klartext gespeichert (nur ein gesalzener scrypt-Hash), fehlgeschlagene Anmeldeversuche sind pro IP-Adresse und Benutzername begrenzt. Gib keine echten sensiblen Informationen ein: nutze Testdaten.",
          "<strong>Verschlüsselungsschlüssel:</strong> Private Schlüssel verlassen nie dein Gerät und werden mit deinem Passwort verschlüsselt gespeichert (PBKDF2 + AES-GCM), ebenso der lokale Cache bereits gelesener Nachrichten. Der Server hält nur deinen öffentlichen Schlüssel und einen Vorrat öffentlicher Einmalschlüssel, die er bei jeder Auslieferung löscht."
        ]
      ],
      [
        "Zweck der Verarbeitung",
        [
          "Die Daten dienen ausschließlich dazu, die Demo zum Laufen zu bringen (Authentifizierung, Nachrichten, Kontakte). Sie werden nicht an Dritte weitergegeben und nicht für Werbeprofile verwendet."
        ]
      ],
      [
        "Speicherdauer",
        [
          "Die Daten werden in einer dauerhaften Datenbank gespeichert, bis du das Profil löschst; bei Updates oder Demo-Resets können sie dennoch ohne Vorankündigung gelöscht werden."
        ]
      ],
      [
        "Deine Rechte",
        [
          "Du kannst jederzeit die Löschung der im Prototyp eingegebenen Daten verlangen, indem du über die oben genannten Kontaktmöglichkeiten schreibst."
        ]
      ],
      [
        "Securmy-Funktionen: Tresor, P2P-Versand und Anrufe",
        [
          "Tresor-Dateien, Notizen, Passwörter und Backups bleiben auf deinem Gerät, verschlüsselt mit einem Schlüssel, der es nie verlässt: Wir erhalten sie nicht und können sie weder lesen noch wiederherstellen.",
          "Synchronisierung (nur mit kostenpflichtigem Tarif): Der Server speichert Dateien, Notizen und Passwörter bereits auf deinem Gerät verschlüsselt, ohne den Schlüssel zum Öffnen, bis du oder dein Konto sie löschen. Für Zahlungen nutzen wir Stripe: Wir sehen und speichern deine Kartendaten nicht.",
          "Bei P2P-Übertragungen und Anrufen laufen die Inhalte direkt zwischen den Geräten, verschlüsselt. Der Server verarbeitet nur Verbindungsinformationen (SDP und ICE-Kandidaten), höchstens eine Stunde im Speicher gehalten und dann gelöscht; der andere Teilnehmer und ein öffentlicher STUN-Server können deine IP-Adresse sehen.",
          "Aktivierst du die Zwei-Schritt-Bestätigung, speichern wir das TOTP-Geheimnis verschlüsselt; Einmal-Nachrichten werden wenige Sekunden nach dem Öffnen vom Server gelöscht."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Cookie-Richtlinie — Securmy",
    "description": "Informationen zu den Cookies, die die Präsentationswebsite des Prototyps Securmy verwendet.",
    "h1": "Cookie-Richtlinie",
    "sections": [
      [
        "Was Cookies sind",
        [
          "Cookies sind kleine Dateien, die der Browser beim Besuch einer Website speichert. Diese Website verwendet keine Tracking-Cookies von Drittanbietern."
        ]
      ],
      [
        "Technische Cookies",
        [
          "Wir nutzen eine einzige technische Einstellung (im localStorage des Browsers gespeichert, nicht als HTTP-Cookie), um deine Auswahl im Cookie-Banner zu merken. Ohne sie würde das Banner bei jedem Besuch erneut erscheinen. Die App (/app) speichert zusätzlich lokal die gewählte Sprache und deine Verschlüsselungsschlüssel, die für ihren Betrieb notwendig sind."
        ]
      ],
      [
        "Statistik-Cookies",
        [
          "Derzeit verwendet diese Website keine statistischen Analysetools. Die Kategorie „Statistik“ im Banner ist für eine mögliche spätere Nutzung vorgesehen: Sollten Tools wie Google Analytics aktiviert werden, startet das Skript erst nach ausdrücklicher Einwilligung."
        ]
      ],
      [
        "Marketing-Cookies",
        [
          "Wir verwenden keine Marketing- oder Werbe-Cookies oder -Pixel."
        ]
      ],
      [
        "So verwaltest du deine Einstellungen",
        [
          "Du kannst die gespeicherte Einstellung löschen, indem du die Browserdaten für diese Website entfernst: Beim nächsten Besuch erscheint das Banner wieder."
        ]
      ]
    ]
  },
  "terms": {
    "title": "Nutzungsbedingungen und Lizenz — Securmy",
    "description": "Nutzungsbedingungen und Lizenz für App und Website Securmy.",
    "h1": "Nutzungsbedingungen und Lizenz",
    "sections": [
      [
        "1. Gegenstand und Verantwortlicher",
        [
          "Diese Bedingungen regeln die Nutzung von App und Website „Securmy“ (der „Dienst“). Mit Registrierung oder Nutzung akzeptierst du sie. Andernfalls nutze den Dienst nicht."
        ]
      ],
      [
        "2. Art des Dienstes",
        [
          "Der Dienst ist ein funktionsfähiger Prototyp, bereitgestellt „wie besehen“. Er kann sich ändern, unterbrochen oder zurückgesetzt werden, ohne Vorankündigung. Verwende Testdaten und vertraue ihm keine Gespräche mit extrem hohem Risiko oder unverzichtbare Informationen an."
        ]
      ],
      [
        "3. Konto und Sicherheit",
        [
          "Du musst mindestens 14 Jahre alt sein. Du bist für Passwort und Gerät verantwortlich. Verschlüsselungsschlüssel liegen nur auf deinem Gerät, mit deinem Passwort verschlüsselt: Verlierst oder setzt du es zurück, ist der lokale Verlauf nicht wiederherstellbar und wir können ihn nicht wiederherstellen."
        ]
      ],
      [
        "4. Zulässige Nutzung",
        [
          "Untersagt ist die Nutzung für rechtswidrige Handlungen, Belästigung, Drohungen, Spam, Betrug, Verbreitung von Schadsoftware, Inhalte, die Minderjährige ausbeuten oder Rechte Dritter verletzen, sowie Versuche, die Sicherheitsmaßnahmen zu umgehen, zu überlasten oder zu verletzen."
        ]
      ],
      [
        "5. Meldungen und Sperrung",
        [
          "Du kannst jeden Kontakt blockieren und melden. Nachrichten sind Ende-zu-Ende-verschlüsselt und der Verantwortliche kann sie nicht lesen: Meldungen beruhen auf den Angaben der Nutzer und verfügbaren technischen Daten. Der Verantwortliche kann Konten sperren oder löschen, die gegen diese Bedingungen oder das Gesetz verstoßen, und bei gesetzlicher Pflicht mit Behörden zusammenarbeiten."
        ]
      ],
      [
        "6. Nutzungslizenz",
        [
          "Dir wird eine persönliche, nicht ausschließliche, nicht übertragbare, widerrufliche Lizenz zur Nutzung von App und Website für rechtmäßige Zwecke erteilt. Software, Grafiken, Marken und Texte bleiben beim Verantwortlichen. Kopieren, Verkaufen, Dekompilieren und abgeleitete Werke sind untersagt, außer soweit zwingendes Recht es erlaubt."
        ]
      ],
      [
        "7. Gewährleistung und Haftung",
        [
          "Soweit gesetzlich zulässig wird der Dienst ohne Gewähr für Verfügbarkeit, Fehlerfreiheit oder Eignung für einen bestimmten Zweck bereitgestellt; der Verantwortliche haftet nicht für mittelbare Schäden oder Datenverlust. Verbraucherrechte und nicht ausschließbare Haftung bleiben unberührt."
        ]
      ],
      [
        "8. Kontolöschung und Daten",
        [
          "Du kannst dein Konto jederzeit in den Einstellungen löschen: Profil, Kontakte und Chats werden endgültig gelöscht. Die Datenverarbeitung ist in der Datenschutzerklärung beschrieben."
        ]
      ],
      [
        "9. Anwendbares Recht und Änderungen",
        [
          "Es gilt italienisches Recht; Verbraucher behalten die Schutzrechte und den Gerichtsstand nach dem italienischen Verbraucherkodex und zwingendem EU-Recht. Wir können diese Bedingungen aktualisieren: wesentliche Änderungen werden im Dienst mitgeteilt. Kontakt: info@simonescaffidi.it."
        ]
      ],
      [
        "10. Dateifreigabe und Anrufe",
        [
          "Du bist für die Dateien, die du teilst, und die Anrufe, die du führst, verantwortlich. Das Teilen rechtswidriger Inhalte oder die Verletzung fremder Rechte ist untersagt. Da Inhalte Ende-zu-Ende-verschlüsselt sind, können wir sie nicht sehen, wir können aber Konten bei begründeten Meldungen sperren. Die Funktionen werden „wie besehen“ bereitgestellt und können sich ändern oder ausgesetzt werden."
        ]
      ]
    ]
  }
};
