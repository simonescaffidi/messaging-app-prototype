// Dizionario del sito (en). Struttura identica a it.js.
module.exports = {
  "code": "en",
  "dir": "ltr",
  "brand": "Securmy",
  "ui": {
    "openApp": "Open the app",
    "manual": "Manual",
    "langAria": "Language",
    "legalAria": "Legal",
    "privacy": "Privacy Policy",
    "cookie": "Cookie Policy",
    "langsLabel": "All languages",
    "updated": "Last updated: October 2026.",
    "tocTitle": "Contents",
    "cookieBanner": {
      "text": "We use necessary technical cookies and, with your consent, statistics cookies. See our <a href=\"{privacyUrl}\">Privacy Policy</a> and <a href=\"{cookieUrl}\">Cookie Policy</a>.",
      "reject": "Reject",
      "customize": "Customize",
      "accept": "Accept all",
      "statsQuestion": "Do you want to accept statistics cookies?"
    },
    "terms": "Terms of Service",
    "owner": "Controller"
  },
  "landing": {
    "title": "Securmy — Private messaging, file vault and encrypted P2P transfer",
    "description": "Chat with real end-to-end encryption, file vault, encrypted passwords and notes, P2P link transfer, encrypted calls and two-step verification. 11 languages.",
    "ogTitle": "Securmy — Security, privacy and confidentiality",
    "ogDesc": "Messages, files, passwords and calls protected by end-to-end encryption: everything encrypted on your device, in 11 languages.",
    "badge": "Functional prototype",
    "h1": "A chat where your password picks your profile",
    "lead": "No phone number. Enter your username and password: the password decides which profile opens. Hidden chats, a cover profile, self-destructing messages.",
    "ctaOpen": "Open the app →",
    "ctaHow": "See how it works",
    "featuresTitle": "What you can do",
    "features": [
      [
        "🔑",
        "Username and password login",
        "Username comes first, then the password: same username, different password, different profile. No selection screen."
      ],
      [
        "🪪",
        "Multiple profiles",
        "Several profiles on the same device, each with independent contacts, chats and settings."
      ],
      [
        "🙈",
        "Hidden chats",
        "Hide a conversation from the main list. It only reappears by typing a secret combination into search."
      ],
      [
        "🎭",
        "Cover profile",
        "Create an innocuous profile to show in case of a check, with no hint that other profiles exist."
      ],
      [
        "💣",
        "Timed messages",
        "Send messages that self-destruct after 30 seconds, 5 minutes or an hour."
      ],
      [
        "📵",
        "No phone number",
        "Sign up with email and username: your email is never visible to other users."
      ],
      [
        "🔐",
        "Real end-to-end encryption",
        "Every message is encrypted in the browser with ECDH (P-256) + 256-bit AES-GCM before it leaves: the server only ever sees ciphertext, never the plaintext."
      ],
      [
        "🫆",
        "Biometric unlock",
        "Face ID, Touch ID, Android fingerprint or Windows Hello via real WebAuthn/FIDO2: no biometric data ever leaves your device."
      ],
      [
        "🌍",
        "11 languages",
        "App and website available in Italian, English, Spanish, French, German, Portuguese, Arabic, Chinese, Hindi, Russian and Japanese."
      ]
    ],
    "howTitle": "How it works",
    "steps": [
      [
        "Sign up",
        "Email, username and password: you get a public ID and a secret combination. Save them: they are not shown again."
      ],
      [
        "Log in with username and password",
        "Every time you open the app, enter your username and password: the matching profile opens automatically."
      ],
      [
        "Add contacts",
        "Search for someone by their public ID and start chatting in real time."
      ],
      [
        "Hide what you want",
        "Type the secret combination into the search bar to reveal hidden chats when you need them."
      ]
    ],
    "disclaimerTitle": "What it is, what it isn't",
    "disclaimerHtml": "<strong>This is a working prototype</strong>, not a finished product, but the security is real: every message has a new key deleted after reading (forward secrecy), private keys sit in a vault encrypted with your password, you can verify your contact's identity with a safety number and you get a warning if their key changes. Biometric unlock uses real WebAuthn/FIDO2. Known limits remain, explained plainly in the <a href=\"{manualUrl}\">user manual</a> (metadata visible to the server, history tied to the device, email-only recovery). It is not yet meant for extremely high-risk conversations.",
    "nativeTitle": "Native iOS and Android apps",
    "nativeText": "The native app scaffold (Expo/React Native, with a system-level biometric lock) is ready in the project's code. Publishing to the App Store and Google Play requires the developer account credentials (Apple Developer Program and Google Play Console); until those are connected, the app remains available as a webapp, usable from any mobile browser and already installable via \"Add to Home Screen\".",
    "ctaTitle": "Try the prototype",
    "ctaText": "All you need is an email and a username to create your first profile.",
    "secTitle": "Security and privacy: the heart of the app",
    "secLead": "We don't just say \"it's encrypted\". Here is, concretely, what protects your conversations.",
    "security": [
      [
        "🔄",
        "A new key for every message",
        "Each message has a one-time key (forward secrecy), deleted after reading. If someone ever got hold of your keys, they still couldn't decrypt past messages."
      ],
      [
        "🗝️",
        "Vault encrypted with your password",
        "Private keys and read messages are encrypted on the device (PBKDF2 + AES-GCM) with your password: without it they stay unreadable."
      ],
      [
        "🔍",
        "Key verification and anti-interception alert",
        "Compare the safety number with your contact by voice. If their key changes, the app warns you and blocks sending until you confirm."
      ],
      [
        "🙈",
        "A blind server",
        "The server stores only ciphertext. Email and username are encrypted at rest in the database; passwords are kept only as a hash (scrypt)."
      ],
      [
        "🛡️",
        "Defence against login attacks",
        "Attempts limited per IP address and per username, revocable sessions, other sessions closed when you change your password."
      ],
      [
        "🫆",
        "Biometrics that never leave your device",
        "With WebAuthn/FIDO2 the server only receives the passkey's public key: biometric data never leaves your phone or computer."
      ]
    ],
    "suiteTitle": "More than a chat: your digital vault",
    "suiteLead": "Securmy goes beyond messaging. Everything you save or share is encrypted on your device, using the same vault that protects your chats.",
    "suite": [
      [
        "🗄️",
        "File vault",
        "Hide and protect documents, photos and files: encrypted on your device with AES-256 and opened only by your password or biometrics."
      ],
      [
        "🔗",
        "P2P transfer by link",
        "The file goes straight from one device to the other, encrypted, never stored on the server. One-time link with an expiry."
      ],
      [
        "🧼",
        "Metadata cleaning",
        "Removes GPS location, camera model and other hidden data from photos before you share them."
      ],
      [
        "🔑",
        "Password manager",
        "Store credentials in the vault, generate strong passwords and copy them: the clipboard is cleared after 20 seconds."
      ],
      [
        "📝",
        "Encrypted notes",
        "Private notes encrypted on your device, never sent to any server."
      ],
      [
        "👁️",
        "View-once messages",
        "The recipient opens them once: after a few seconds they are deleted from the server and from their device."
      ],
      [
        "📞",
        "Encrypted voice and video calls",
        "Directly between the two devices (DTLS-SRTP), with a verification code to compare out loud against eavesdropping."
      ],
      [
        "🔢",
        "Two-step verification",
        "TOTP codes with any authenticator app: even someone who discovers your password cannot get in."
      ],
      [
        "💾",
        "Encrypted backup",
        "Export files, notes and passwords into a single archive encrypted with a passphrase only you know."
      ],
      [
        "🚨",
        "Security check and emergency wipe",
        "A score tells you what to improve; in danger, one tap erases keys, files and passwords from the device."
      ]
    ],
    "roadmapTitle": "Coming soon",
    "roadmapLead": "What we are planning. It is not available yet and should not be taken as a promised date.",
    "roadmap": [
      [
        "🧅",
        "Tor network",
        "A .onion address for the service and a Tor mode in the native apps, to hide your network location too. A plain browser cannot route traffic over Tor: you need Tor Browser or the native app."
      ],
      [
        "📱",
        "iOS and Android apps",
        "Native apps with biometric unlock, published in the stores with the same security and privacy guarantees as the website."
      ],
      [
        "🛰️",
        "Private TURN server",
        "To hide your IP address during calls and P2P transfers and make them work even behind very restrictive networks."
      ]
    ]
  },
  "manual": {
    "title": "User manual — Securmy",
    "description": "Complete guide: sign-up, username and password login, hidden chats, end-to-end encryption, biometric unlock and available languages.",
    "h1": "User manual",
    "lead": "A complete guide to Securmy: how to sign up, log in, use the privacy features, and understand what this prototype really protects — and what it doesn't.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Sign-up and first login",
        "blocks": [
          [
            "p",
            "On the start screen, tap \"Sign up\" and enter your email and a username. No phone number is required."
          ],
          [
            "p",
            "After signing up you'll see three pieces of information only once — save them right away somewhere safe (a password manager, for instance):"
          ],
          [
            "ul",
            [
              "<strong>Username and password</strong>: the username is the first field, the password decides which profile opens. You can have several profiles under the same username, each with its own password.",
              "<strong>Public ID</strong>: this is what you share with people you want to add as contacts. It never reveals your email.",
              "<strong>Secret combination</strong>: used to reveal hidden chats (see the dedicated section)."
            ]
          ],
          [
            "warn",
            "If you lose your password you can reset it by email, but only if the profile's email was verified. Without the password and without a verified email the profile cannot be recovered."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Multiple profiles on the same device",
        "blocks": [
          [
            "p",
            "You can create several profiles (for example a personal one and a cover one) with the same username but different passwords. When you enter your username and password the matching profile opens, with no selection screen that would reveal how many profiles exist. You cannot use the same password for two profiles under the same username."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Adding contacts and chatting",
        "blocks": [
          [
            "p",
            "Tap \"+ Add contact\" and enter the person's public ID. A real-time chat opens, end-to-end encrypted (see section 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Hidden chats and the secret combination",
        "blocks": [
          [
            "p",
            "From a chat, open the menu and choose \"Hide/show this chat\". A hidden chat no longer appears in the main list."
          ],
          [
            "p",
            "To bring it back, type your secret combination (the one shown only once at sign-up) into the search bar: all hidden chats reappear until you lock the app again."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Cover profile",
        "blocks": [
          [
            "p",
            "At sign-up you can check \"Create as a cover profile\": a profile meant to be shown if asked to, with no hint that other profiles exist on the same device."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Timed (self-destructing) messages",
        "blocks": [
          [
            "p",
            "Before sending a message, you can pick a self-destruct time from the dropdown: 30 seconds, 5 minutes, or 1 hour. Once that time passes, the message is removed."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. End-to-end encryption: how it actually works",
        "blocks": [
          [
            "p",
            "This isn't a marketing slogan: every message is encrypted <strong>in your browser</strong>, before it's sent to the server, using this scheme:"
          ],
          [
            "ol",
            [
              "On first sign-in your device generates an ECDH key pair (P-256 curve): the public key goes to the server, the private key stays on the device, encrypted with your password. It also prepares a batch of one-time public keys (\"prekeys\").",
              "For every message, your browser generates a temporary key and fetches ONE one-time prekey of your contact from the server. It combines three ECDH exchanges (your identity, the temporary key, the prekey) and derives with HKDF-SHA256 a 256-bit AES-GCM key valid for that message only.",
              "The message is encrypted with that key and a random IV; the header is authenticated, so it can't be tampered with. The server only receives ciphertext.",
              "The recipient rebuilds the same key, reads the message and immediately deletes the private prekey: from then on the message can't be decrypted by anyone, not even with your long-term keys."
            ]
          ],
          [
            "p",
            "This is the same type of math (ECDH + AES-GCM) used by many modern secure protocols, applied here through the browser's native Web Crypto API, with no external libraries."
          ],
          [
            "h3",
            "Forward secrecy: past messages stay safe"
          ],
          [
            "p",
            "Even if someone obtained your long-term keys (for example by stealing your device), they couldn't decrypt messages you have already received, because their keys were deleted. Text you have already read stays only in your device's encrypted local cache."
          ],
          [
            "h3",
            "The key vault"
          ],
          [
            "p",
            "Private keys, prekeys and the message cache are stored in the browser only in encrypted form (AES-GCM), using a key derived from your password with PBKDF2-SHA256 (310,000 iterations). If you sign in with biometrics, you are asked for your password once to open the vault. When you change your password, the vault is re-encrypted."
          ],
          [
            "h3",
            "Check it's really them: safety number"
          ],
          [
            "p",
            "In a chat tap the 🔑 icon: you see a 60-digit number, identical for both of you. Compare it with your contact in person or by voice: if it matches, nobody is interfering. If a contact's key changes (new device or possible interception), a warning appears and sending stays blocked until you choose \"Accept new key\"."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Biometric unlock (Face ID / Touch ID / fingerprint)",
        "blocks": [
          [
            "p",
            "In the profile settings (⚙️ icon) you'll find \"Enable Face ID / fingerprint unlock\". Turning it on makes your device create a passkey via WebAuthn/FIDO2 and register it with the server (only the public key, never the biometric data itself)."
          ],
          [
            "p",
            "From then on, the login screen shows an \"Unlock with biometrics\" button: use it instead of the password, and your operating system (not the app) verifies Face ID, Touch ID, Android fingerprint, or Windows Hello. Biometric data never leaves your device."
          ],
          [
            "p",
            "You can turn it off at any time from the same settings."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Changing language",
        "blocks": [
          [
            "p",
            "In the top corner of every app screen you'll find a language selector. This website is available in the same 11 languages too: Italian, English, Spanish, French, German, Portuguese, Arabic, Chinese, Hindi, Russian and Japanese. The language you pick in the app is remembered on the device."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. Native mobile apps (iOS/Android)",
        "blocks": [
          [
            "p",
            "A native app scaffold (built on Expo/React Native) is ready, adding a system-level biometric lock on launch. Actually publishing to the App Store and Google Play requires the developer account credentials (Apple Developer Program and Google Play Console); once those are connected, the app can be built and published. Until then, the webapp remains usable from any mobile browser and can already be \"installed\" to the home screen like an app."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Stated security limits",
        "blocks": [
          [
            "p",
            "For honesty, here are the limits that remain, even though the encryption is real and not just claimed:"
          ],
          [
            "ul",
            [
              "<strong>Prekeys running out</strong>: if a contact stays offline for long and runs out of one-time keys, the message still uses a new key but without one-time deletion, so forward secrecy is weaker.",
              "<strong>Messages tied to this device</strong>: by design, decrypted history doesn't move. On a new device or after an email password recovery the previous vault can't be recovered: you start with a new identity and contacts see the key-change warning.",
              "<strong>The vault is only as strong as the password</strong>: choose a long, unique one. Anyone with your already unlocked device and the app open can read chats, as with any app.",
              "<strong>Metadata visible to the server</strong>: sender, time, reactions and expiry of timed messages are not encrypted.",
              "<strong>Email-only recovery</strong>: if you lose both the password and access to the verified email, the profile can't be recovered. If you use several profiles (e.g. a cover one), use different emails: a recovery link reveals to whoever controls the email that the profile exists."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Troubleshooting",
        "blocks": [
          [
            "h3",
            "\"Can't encrypt: the contact doesn't have a public key yet\""
          ],
          [
            "p",
            "This happens if your contact hasn't logged in since the latest app update (the key is generated and uploaded automatically at login). Ask them to log in once — after that you'll be able to message them normally."
          ],
          [
            "h3",
            "\"I lost my password\""
          ],
          [
            "p",
            "Use \"Forgot password?\" on the login screen and enter your email and username: if the profile's email is verified you receive a link valid for 1 hour. If the email was not verified the profile cannot be recovered and must be created again. Always keep your password in a password manager."
          ],
          [
            "h3",
            "Biometric unlock doesn't show up"
          ],
          [
            "p",
            "It requires a device with Face ID, Touch ID, a fingerprint sensor, or Windows Hello set up, an up-to-date browser, and an HTTPS connection (the production webapp already uses one). It also needs to have been enabled at least once from settings."
          ],
          [
            "h3",
            "\"Message no longer readable\""
          ],
          [
            "p",
            "For safety each message's key is deleted as soon as you've read it: the text remains only in this device's encrypted cache. If you change device, clear browser data or reset your password via email, earlier messages can't be recovered. That's the price of forward secrecy."
          ]
        ]
      },
      {
        "id": "suite",
        "h": "13. Securmy vault and tools",
        "blocks": [
          [
            "p",
            "Open the Vault from the 🛡️ button in the sidebar. Everything inside is encrypted on your device with AES-256-GCM, using a key kept in your vault and protected by your password: the server never receives files, notes or passwords."
          ],
          [
            "h3",
            "File vault"
          ],
          [
            "p",
            "Add files (up to 100 MB each) from the Files tab. If the box is ticked, photos are stripped of metadata before being saved. You can download, send via P2P or delete each file."
          ],
          [
            "h3",
            "P2P transfer by link"
          ],
          [
            "p",
            "Pick a file and an expiry time (10 minutes or 1 hour): you get a one-time link. The file travels straight to the recipient, encrypted with a key that sits only after the # in the link and never reaches the server. Keep the page open until the transfer finishes."
          ],
          [
            "h3",
            "Clean photos"
          ],
          [
            "p",
            "Redraws the image, discarding EXIF, GPS location and thumbnails. Works with JPEG, PNG and WebP; for other formats automatic cleaning is not available."
          ],
          [
            "h3",
            "Notes and passwords"
          ],
          [
            "p",
            "Notes and credentials stay encrypted in the vault. The generator creates random passwords; when you copy a password, the clipboard is cleared after 20 seconds."
          ],
          [
            "h3",
            "View-once messages"
          ],
          [
            "p",
            "Choose “View once” next to the message field. The recipient taps to see: the text stays visible for 10 seconds, then is destroyed on their device and on the server. It cannot stop a reader from photographing the screen."
          ],
          [
            "h3",
            "Voice and video calls"
          ],
          [
            "p",
            "Use the 📞 and 🎥 buttons in the chat header. Audio and video travel directly between the devices, encrypted. Both sides see a 4-digit code: compare it out loud; if it matches, the call has not been intercepted."
          ],
          [
            "h3",
            "Two-step verification"
          ],
          [
            "p",
            "In Security you can enable TOTP codes with an authenticator app (Google Authenticator, Aegis, 1Password…). Once enabled, signing in with your password also requires the 6-digit code. Biometric unlock remains a separate sign-in method."
          ],
          [
            "h3",
            "Backup and emergency wipe"
          ],
          [
            "p",
            "The backup holds files, notes and passwords encrypted with a passphrase of at least 10 characters that you choose: without it, it cannot be recovered. Messages are not included. The emergency wipe removes keys, message cache, files, notes and passwords from the device and cannot be undone."
          ],
          [
            "h3",
            "Limits to know"
          ],
          [
            "ul",
            [
              "The vault is local: files, notes and passwords do not sync between devices; use the backup to move them.",
              "In P2P transfers and calls the other person (and a public STUN server) can see your IP address, unless the service uses a TURN server; on very restrictive networks the connection may fail.",
              "The password manager is basic: it does not fill in forms by itself and does not replace a dedicated manager for professional use.",
              "If you lose your password and the backup passphrase, the encrypted data cannot be recovered: nobody, not even us, can open it."
            ]
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Privacy Policy — Securmy",
    "description": "Privacy notice for the Securmy prototype: what data is processed and how.",
    "h1": "Privacy Policy",
    "sections": [
      [
        "Who processes the data",
        [
          "This website and the linked prototype are a personal demonstration project. For any data-related request you can get in touch via <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."
        ]
      ],
      [
        "Data collected by the presentation website",
        [
          "This website does not use third-party analytics or tracking tools. Only the cookie preferences you choose are saved (see Cookie Policy), locally in your browser."
        ]
      ],
      [
        "Data collected by the prototype (/app)",
        [
          "To use the messaging prototype you create a profile with an email, a username and a password. The following is stored on the server (PostgreSQL database): email (encrypted), username, password hash, public ID, hidden-chat combination, added contacts, your public encryption key, active sessions and the messages sent.",
          "<strong>Messages:</strong> the content is end-to-end encrypted in the browser before sending; the server keeps only ciphertext and cannot read it. Metadata (sender, time, reactions, expiry of timed messages) remains unencrypted.",
          "<strong>Biometric unlock:</strong> if you enable it, only the passkey's public key (WebAuthn) is stored on the server. Biometric data never leaves your device.",
          "<strong>Important:</strong> this is a demonstration prototype and the service doesn't meet the standards of a production product. Email and username are encrypted at rest in the database (AES-256-GCM); the email is used only for verification and password recovery. Passwords are not stored in clear (only a salted scrypt hash) and failed sign-in attempts are limited per IP address and per username. Don't enter real sensitive information: use test data.",
          "<strong>Encryption keys:</strong> private keys never leave your device and are stored encrypted with your password (PBKDF2 + AES-GCM), as is the local cache of messages already read. The server holds only your public key and a batch of one-time public keys, which it deletes on each delivery."
        ]
      ],
      [
        "Purpose of processing",
        [
          "The data is used solely to make the demo work (authentication, messaging, contacts). It is not shared with third parties and not used for advertising profiling."
        ]
      ],
      [
        "Retention",
        [
          "Data is kept in a persistent database until you delete the profile; during updates or demo resets it may still be deleted without notice."
        ]
      ],
      [
        "Your rights",
        [
          "You can request deletion of the data entered in the prototype at any time by writing via the contact details above."
        ]
      ],
      [
        "Securmy features: vault, P2P transfers and calls",
        [
          "Vault files, notes, passwords and backups stay on your device, encrypted with a key that never leaves it: we do not receive them and cannot read or recover them.",
          "For P2P transfers and calls, the content travels directly between devices, encrypted. The server only handles connection information (SDP and ICE candidates), kept in memory for at most one hour and then deleted; the other participant and a public STUN server can see your IP address.",
          "If you enable two-step verification we store the TOTP secret, encrypted at rest; view-once messages are deleted from the server a few seconds after being opened."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Cookie Policy — Securmy",
    "description": "Notice on the cookies used by the Securmy prototype presentation website.",
    "h1": "Cookie Policy",
    "sections": [
      [
        "What cookies are",
        [
          "Cookies are small files saved by the browser while you visit a site. This site does not use third-party tracking cookies."
        ]
      ],
      [
        "Technical cookies",
        [
          "We use a single technical preference (saved in the browser's localStorage, not as an HTTP cookie) to remember your choice on the cookie banner. Without it the banner would reappear on every visit. The app (/app) also stores locally the chosen language and your encryption keys, which it needs in order to work."
        ]
      ],
      [
        "Statistics cookies",
        [
          "This site currently uses no statistical analysis tools. The \"statistics\" category in the banner is in place for possible future use: if tools such as Google Analytics are ever enabled, the script will only start after explicit consent."
        ]
      ],
      [
        "Marketing cookies",
        [
          "We do not use marketing/advertising cookies or pixels."
        ]
      ],
      [
        "How to manage your preferences",
        [
          "You can delete the saved preference by clearing your browser data for this site: the banner will reappear on your next visit."
        ]
      ]
    ]
  },
  "terms": {
    "title": "Terms of Service and License — Securmy",
    "description": "Terms of service and license for the Securmy app and website.",
    "h1": "Terms of Service and License",
    "sections": [
      [
        "1. Subject and owner",
        [
          "These Terms govern use of the \"Securmy\" app and website (the \"Service\"). By registering or using the Service you accept them. If you disagree, do not use it."
        ]
      ],
      [
        "2. Nature of the Service",
        [
          "The Service is a working prototype provided \"as is\". It may change, be interrupted or reset without notice. Use test data and do not entrust it with extremely high-risk conversations or essential information."
        ]
      ],
      [
        "3. Account and security",
        [
          "You must be at least 14 years old. You are responsible for your password and device. Encryption keys are held only on your device, encrypted with your password: if you lose or reset it, local history cannot be recovered and we cannot restore it."
        ]
      ],
      [
        "4. Acceptable use",
        [
          "You may not use the Service for unlawful activity, harassment, threats, spam, scams, spreading malware, content that exploits minors or violates others' rights, or to attempt to breach, overload or bypass the Service's security measures."
        ]
      ],
      [
        "5. Reports and suspension",
        [
          "You can block and report any contact. Messages are end-to-end encrypted and the Owner cannot read them: reports rely on what the user states and on available technical data. The Owner may suspend or delete accounts that violate these Terms or the law and cooperate with authorities where required."
        ]
      ],
      [
        "6. License",
        [
          "You are granted a personal, non-exclusive, non-transferable, revocable license to use the app and website for lawful purposes. Software, graphics, trademarks and texts remain the Owner's. You may not copy, sell, decompile or create derivative works, except where mandatory law allows."
        ]
      ],
      [
        "7. Warranties and liability",
        [
          "To the extent permitted by law the Service is provided without warranty of continuity, error-free operation or fitness for a particular purpose, and the Owner is not liable for indirect damages or data loss. Consumer rights and liabilities that cannot be excluded remain unaffected."
        ]
      ],
      [
        "8. Account deletion and data",
        [
          "You can delete your account at any time from Settings: profile, contacts and chats are permanently erased. Data processing is described in the Privacy Policy."
        ]
      ],
      [
        "9. Governing law and changes",
        [
          "These Terms are governed by Italian law; consumers keep the protections and forum provided by the Italian Consumer Code and mandatory EU rules. We may update these Terms: material changes will be announced in the Service. Contact: info@simonescaffidi.it."
        ]
      ],
      [
        "10. File sharing and calls",
        [
          "You are responsible for the files you share and the calls you make. Sharing illegal content or infringing the rights of others is prohibited. Because content is end-to-end encrypted we cannot see it, but we may suspend accounts subject to well-founded reports. The features are provided “as is” and may change or be suspended."
        ]
      ]
    ]
  }
};
