module.exports = {
  code: "en",
  dir: "ltr",
  brand: "Private Messaging",
  ui: {
    openApp: "Open the app",
    manual: "Manual",
    langAria: "Language",
    legalAria: "Legal",
    privacy: "Privacy Policy",
    cookie: "Cookie Policy",
    langsLabel: "All languages",
    updated: "Last updated: October 2026.",
    tocTitle: "Contents",
    cookieBanner: {
      text: 'We use necessary technical cookies and, with your consent, statistics cookies. See our <a href="{privacyUrl}">Privacy Policy</a> and <a href="{cookieUrl}">Cookie Policy</a>.',
      reject: "Reject",
      customize: "Customize",
      accept: "Accept all",
      statsQuestion: "Do you want to accept statistics cookies?"
    }
  },
  landing: {
    title: "Private Messaging — Chat with multiple profiles and hidden chats",
    description: "Private chat with real end-to-end encryption, biometric unlock, multiple profiles and hidden chats. 11 languages, no phone number.",
    ogTitle: "Private Messaging — Prototype",
    ogDesc: "End-to-end encryption, biometric unlock, multiple profiles, hidden chats and a cover profile in 11 languages.",
    badge: "Functional prototype",
    h1: "A chat where your password picks your profile",
    lead: "No phone number. Enter your username and password: the password decides which profile opens. Hidden chats, a cover profile, self-destructing messages.",
    ctaOpen: "Open the app →",
    ctaHow: "See how it works",
    featuresTitle: "What you can do",
    features: [
      ["🔑", "Username and password login", "Username comes first, then the password: same username, different password, different profile. No selection screen."],
      ["🪪", "Multiple profiles", "Several profiles on the same device, each with independent contacts, chats and settings."],
      ["🙈", "Hidden chats", "Hide a conversation from the main list. It only reappears by typing a secret combination into search."],
      ["🎭", "Cover profile", "Create an innocuous profile to show in case of a check, with no hint that other profiles exist."],
      ["💣", "Timed messages", "Send messages that self-destruct after 30 seconds, 5 minutes or an hour."],
      ["📵", "No phone number", "Sign up with email and username: your email is never visible to other users."],
      ["🔐", "Real end-to-end encryption", "Every message is encrypted in the browser with ECDH (P-256) + 256-bit AES-GCM before it leaves: the server only ever sees ciphertext, never the plaintext."],
      ["🫆", "Biometric unlock", "Face ID, Touch ID, Android fingerprint or Windows Hello via real WebAuthn/FIDO2: no biometric data ever leaves your device."],
      ["🌍", "11 languages", "App and website available in Italian, English, Spanish, French, German, Portuguese, Arabic, Chinese, Hindi, Russian and Japanese."]
    ],
    howTitle: "How it works",
    steps: [
      ["Sign up", "Email, username and password: you get a public ID and a secret combination. Save them: they are not shown again."],
      ["Log in with username and password", "Every time you open the app, enter your username and password: the matching profile opens automatically."],
      ["Add contacts", "Search for someone by their public ID and start chatting in real time."],
      ["Hide what you want", "Type the secret combination into the search bar to reveal hidden chats when you need them."]
    ],
    disclaimerTitle: "What it is, what it isn't",
    disclaimerHtml: "<strong>This is a functional prototype</strong>, not a finished product. Messages are end-to-end encrypted (ECDH P-256 + 256-bit AES-GCM, HKDF-SHA256 key derivation): the server never sees the plaintext. Biometric unlock uses real WebAuthn/FIDO2. Some known limits remain, spelled out plainly in the <a href=\"{manualUrl}\">user manual</a>: there's no Signal-style ratchet with forward secrecy yet, no out-of-band verification of public keys (so in theory a malicious server could swap one), the private key stays in the browser without a hardware secure enclave, and real email sending for account recovery isn't wired up yet. Good for trying the experience with real security that isn't yet \"nation-state proof\" — not yet for extremely high-risk conversations.",
    nativeTitle: "Native iOS and Android apps",
    nativeText: "The native app scaffold (Expo/React Native, with a system-level biometric lock) is ready in the project's code. Publishing to the App Store and Google Play requires the developer account credentials (Apple Developer Program and Google Play Console); until those are connected, the app remains available as a webapp, usable from any mobile browser and already installable via \"Add to Home Screen\".",
    ctaTitle: "Try the prototype",
    ctaText: "All you need is an email and a username to create your first profile."
  },
  manual: {
    title: "User manual — Private Messaging",
    description: "Complete guide: sign-up, username and password login, hidden chats, end-to-end encryption, biometric unlock and available languages.",
    h1: "User manual",
    lead: "A complete guide to Private Messaging: how to sign up, log in, use the privacy features, and understand what this prototype really protects — and what it doesn't.",
    sections: [
      { id: "signup", h: "1. Sign-up and first login", blocks: [
        ["p", "On the start screen, tap \"Sign up\" and enter your email and a username. No phone number is required."],
        ["p", "After signing up you'll see three pieces of information only once — save them right away somewhere safe (a password manager, for instance):"],
        ["ul", [
          "<strong>Username and password</strong>: the username is the first field, the password decides which profile opens. You can have several profiles under the same username, each with its own password.",
          "<strong>Public ID</strong>: this is what you share with people you want to add as contacts. It never reveals your email.",
          "<strong>Secret combination</strong>: used to reveal hidden chats (see the dedicated section)."
        ]],
        ["warn", "If you lose your password, you lose access to the profile: there is no real email recovery yet (see \"Declared security limits\")."]
      ]},
      { id: "profiles", h: "2. Multiple profiles on the same device", blocks: [
        ["p", "You can create several profiles (for example a personal one and a cover one) with the same username but different passwords. When you enter your username and password the matching profile opens, with no selection screen that would reveal how many profiles exist. You cannot use the same password for two profiles under the same username."]
      ]},
      { id: "contacts", h: "3. Adding contacts and chatting", blocks: [
        ["p", "Tap \"+ Add contact\" and enter the person's public ID. A real-time chat opens, end-to-end encrypted (see section 7)."]
      ]},
      { id: "hidden", h: "4. Hidden chats and the secret combination", blocks: [
        ["p", "From a chat, open the menu and choose \"Hide/show this chat\". A hidden chat no longer appears in the main list."],
        ["p", "To bring it back, type your secret combination (the one shown only once at sign-up) into the search bar: all hidden chats reappear until you lock the app again."]
      ]},
      { id: "cover", h: "5. Cover profile", blocks: [
        ["p", "At sign-up you can check \"Create as a cover profile\": a profile meant to be shown if asked to, with no hint that other profiles exist on the same device."]
      ]},
      { id: "timed", h: "6. Timed (self-destructing) messages", blocks: [
        ["p", "Before sending a message, you can pick a self-destruct time from the dropdown: 30 seconds, 5 minutes, or 1 hour. Once that time passes, the message is removed."]
      ]},
      { id: "encryption", h: "7. End-to-end encryption: how it actually works", blocks: [
        ["p", "This isn't a marketing slogan: every message is encrypted <strong>in your browser</strong>, before it's sent to the server, using this scheme:"],
        ["ol", [
          "On first login, your device generates an ECDH key pair on curve P-256 (one public, one private). The public key is uploaded to the server; the private key stays only in your browser.",
          "When you message a contact, your browser combines your private key with their public key (an ECDH exchange) and derives, via HKDF-SHA256, a 256-bit AES-GCM symmetric key specific to that pair of people.",
          "Each message is encrypted with that key and a different random number (an IV) every time, then sent to the server already encrypted.",
          "The server only stores and transmits ciphertext: it cannot read the content of your messages."
        ]],
        ["p", "This is the same type of math (ECDH + AES-GCM) used by many modern secure protocols, applied here through the browser's native Web Crypto API, with no external libraries."]
      ]},
      { id: "biometric", h: "8. Biometric unlock (Face ID / Touch ID / fingerprint)", blocks: [
        ["p", "In the profile settings (⚙️ icon) you'll find \"Enable Face ID / fingerprint unlock\". Turning it on makes your device create a passkey via WebAuthn/FIDO2 and register it with the server (only the public key, never the biometric data itself)."],
        ["p", "From then on, the login screen shows an \"Unlock with biometrics\" button: use it instead of the password, and your operating system (not the app) verifies Face ID, Touch ID, Android fingerprint, or Windows Hello. Biometric data never leaves your device."],
        ["p", "You can turn it off at any time from the same settings."]
      ]},
      { id: "languages", h: "9. Changing language", blocks: [
        ["p", "In the top corner of every app screen you'll find a language selector. This website is available in the same 11 languages too: Italian, English, Spanish, French, German, Portuguese, Arabic, Chinese, Hindi, Russian and Japanese. The language you pick in the app is remembered on the device."]
      ]},
      { id: "mobile", h: "10. Native mobile apps (iOS/Android)", blocks: [
        ["p", "A native app scaffold (built on Expo/React Native) is ready, adding a system-level biometric lock on launch. Actually publishing to the App Store and Google Play requires the developer account credentials (Apple Developer Program and Google Play Console); once those are connected, the app can be built and published. Until then, the webapp remains usable from any mobile browser and can already be \"installed\" to the home screen like an app."]
      ]},
      { id: "limits", h: "11. Stated security limits", blocks: [
        ["p", "In the interest of honesty, here's what this prototype does <strong>not</strong> do yet, even though the encryption itself is real:"],
        ["ul", [
          "<strong>No ratchet / forward secrecy</strong>: a chat's key stays the same until both people regenerate their keys (unlike protocols such as Signal, which rotate keys with every message).",
          "<strong>No out-of-band verification of public keys</strong>: there's no \"safety number\" to compare out loud with a contact. In theory, a malicious server could swap in its own public key (a man-in-the-middle attack). Fine on a trusted server for a prototype; this verification should be added before any high-risk use.",
          "<strong>Private key lives in the browser</strong>: it's stored in the browser's local storage, not in a hardware secure enclave. Anyone with physical or software access to your unlocked device could read it.",
          "<strong>No real email sending</strong>: sign-up works, but there's no email service connected yet for a \"magic link\" account-recovery flow."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Troubleshooting", blocks: [
        ["h3", "\"Can't encrypt: the contact doesn't have a public key yet\""],
        ["p", "This happens if your contact hasn't logged in since the latest app update (the key is generated and uploaded automatically at login). Ask them to log in once — after that you'll be able to message them normally."],
        ["h3", "\"I lost my password\""],
        ["p", "There's currently no automatic recovery: you'll need to register a new profile. Always keep your password in a password manager."],
        ["h3", "Biometric unlock doesn't show up"],
        ["p", "It requires a device with Face ID, Touch ID, a fingerprint sensor, or Windows Hello set up, an up-to-date browser, and an HTTPS connection (the production webapp already uses one). It also needs to have been enabled at least once from settings."]
      ]}
    ]
  },
  privacy: {
    title: "Privacy Policy — Private Messaging",
    description: "Privacy notice for the Private Messaging prototype: what data is processed and how.",
    h1: "Privacy Policy",
    sections: [
      ["Who processes the data", ["This website and the linked prototype are a personal demonstration project. For any data-related request you can get in touch via <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."]],
      ["Data collected by the presentation website", ["This website does not use third-party analytics or tracking tools. Only the cookie preferences you choose are saved (see Cookie Policy), locally in your browser."]],
      ["Data collected by the prototype (/app)", [
        "To use the messaging prototype you create a profile with an email, a username and a password. The following is stored on the server: email, username, password hash, public ID, hidden-chat combination, added contacts, your public encryption key and the messages sent.",
        "<strong>Messages:</strong> the content is end-to-end encrypted in the browser before sending; the server keeps only ciphertext and cannot read it. Metadata (sender, time, reactions, expiry of timed messages) remains unencrypted.",
        "<strong>Biometric unlock:</strong> if you enable it, only the passkey's public key (WebAuthn) is stored on the server. Biometric data never leaves your device. Your private encryption key stays in the browser (localStorage).",
        "<strong>Important:</strong> this is a demonstration prototype: email and username are stored unencrypted and the service does not meet the standards of a production product. Passwords are not kept in plain text (only a salted scrypt hash) and failed login attempts are rate-limited per IP address and per username. Do not enter real sensitive information: use test data."
      ]],
      ["Purpose of processing", ["The data is used solely to make the demo work (authentication, messaging, contacts). It is not shared with third parties and not used for advertising profiling."]],
      ["Retention", ["Prototype data may be deleted at any time during demo updates or resets, without notice."]],
      ["Your rights", ["You can request deletion of the data entered in the prototype at any time by writing via the contact details above."]]
    ]
  },
  cookie: {
    title: "Cookie Policy — Private Messaging",
    description: "Notice on the cookies used by the Private Messaging prototype presentation website.",
    h1: "Cookie Policy",
    sections: [
      ["What cookies are", ["Cookies are small files saved by the browser while you visit a site. This site does not use third-party tracking cookies."]],
      ["Technical cookies", ["We use a single technical preference (saved in the browser's localStorage, not as an HTTP cookie) to remember your choice on the cookie banner. Without it the banner would reappear on every visit. The app (/app) also stores locally the chosen language and your encryption keys, which it needs in order to work."]],
      ["Statistics cookies", ["This site currently uses no statistical analysis tools. The \"statistics\" category in the banner is in place for possible future use: if tools such as Google Analytics are ever enabled, the script will only start after explicit consent."]],
      ["Marketing cookies", ["We do not use marketing/advertising cookies or pixels."]],
      ["How to manage your preferences", ["You can delete the saved preference by clearing your browser data for this site: the banner will reappear on your next visit."]]
    ]
  }
};
