module.exports = {
  code: "fr",
  dir: "ltr",
  brand: "Messagerie Privée",
  ui: {
    openApp: "Ouvrir l'app",
    manual: "Manuel",
    langAria: "Langue",
    legalAria: "Mentions légales",
    privacy: "Politique de confidentialité",
    cookie: "Politique de cookies",
    langsLabel: "Toutes les langues",
    updated: "Dernière mise à jour : octobre 2026.",
    tocTitle: "Sommaire",
    cookieBanner: {
      text: 'Nous utilisons des cookies techniques nécessaires et, avec votre consentement, des cookies statistiques. Consultez la <a href="{privacyUrl}">Politique de confidentialité</a> et la <a href="{cookieUrl}">Politique de cookies</a>.',
      reject: "Refuser",
      customize: "Personnaliser",
      accept: "Tout accepter",
      statsQuestion: "Souhaitez-vous accepter les cookies statistiques ?"
    }
  },
  landing: {
    title: "Messagerie Privée — Chat à profils multiples et discussions masquées",
    description: "Chat privé avec un vrai chiffrement de bout en bout, déverrouillage biométrique, profils multiples et discussions masquées. 11 langues, sans numéro de téléphone.",
    ogTitle: "Messagerie Privée — Prototype",
    ogDesc: "Chiffrement de bout en bout, déverrouillage biométrique, profils multiples, discussions masquées et profil de couverture en 11 langues.",
    badge: "Prototype fonctionnel",
    h1: "Un chat où votre code est votre identité",
    lead: "Pas de numéro de téléphone. Un code d'accès ouvre votre profil, un autre code en ouvre un différent. Discussions masquées, profil de couverture, messages qui s'autodétruisent.",
    ctaOpen: "Ouvrir l'app →",
    ctaHow: "Découvrir le fonctionnement",
    featuresTitle: "Ce que vous pouvez faire",
    features: [
      ["🔑", "Accès par code", "Chaque code ouvre automatiquement le profil associé. Pas d'écran de choix : le code <em>est</em> l'identité."],
      ["🪪", "Profils multiples", "Plusieurs profils sur le même appareil, chacun avec ses propres contacts, discussions et réglages."],
      ["🙈", "Discussions masquées", "Masquez une conversation de la liste principale. Elle ne réapparaît qu'en saisissant une combinaison secrète dans la recherche."],
      ["🎭", "Profil de couverture", "Créez un profil anodin à montrer en cas de contrôle, sans aucun indice de l'existence d'autres profils."],
      ["💣", "Messages éphémères", "Envoyez des messages qui s'autodétruisent après 30 secondes, 5 minutes ou une heure."],
      ["📵", "Aucun numéro de téléphone", "Inscription par e-mail et ID public distinct de l'adresse : votre e-mail n'est jamais visible par les autres."],
      ["🔐", "Vrai chiffrement de bout en bout", "Chaque message est chiffré dans le navigateur avec ECDH (P-256) + AES-GCM 256 bits avant de partir : le serveur ne voit que du texte chiffré, jamais le contenu en clair."],
      ["🫆", "Déverrouillage biométrique", "Face ID, Touch ID, empreinte Android ou Windows Hello via un vrai WebAuthn/FIDO2 : aucune donnée biométrique ne quitte jamais l'appareil."],
      ["🌍", "11 langues", "App et site disponibles en italien, anglais, espagnol, français, allemand, portugais, arabe, chinois, hindi, russe et japonais."]
    ],
    howTitle: "Comment ça marche",
    steps: [
      ["Inscrivez-vous", "E-mail et nom d'utilisateur : vous recevez un code d'accès, un ID public et une combinaison secrète. Conservez-les : ils ne sont plus affichés ensuite."],
      ["Connectez-vous avec le code", "À chaque ouverture, saisissez le code : le profil correspondant s'ouvre automatiquement."],
      ["Ajoutez des contacts", "Recherchez une personne grâce à son ID public et commencez à discuter en temps réel."],
      ["Masquez ce que vous voulez", "Saisissez la combinaison secrète dans la barre de recherche pour révéler les discussions masquées quand vous en avez besoin."]
    ],
    disclaimerTitle: "Ce que c'est, ce que ce n'est pas",
    disclaimerHtml: "<strong>Ceci est un prototype fonctionnel</strong>, pas un produit fini. Les messages sont chiffrés de bout en bout (ECDH P-256 + AES-GCM 256 bits, dérivation HKDF-SHA256) : le serveur ne voit jamais le texte en clair. Le déverrouillage biométrique utilise un vrai WebAuthn/FIDO2. Des limites connues demeurent, exposées sans détour dans le <a href=\"{manualUrl}\">manuel d'utilisation</a> : il n'y a pas encore de ratchet avec forward secrecy « à la Signal », pas de vérification hors bande des clés publiques (un serveur malveillant pourrait donc, en théorie, les remplacer), la clé privée reste dans le navigateur sans enclave sécurisée matérielle, et l'envoi réel d'e-mails pour la récupération de compte n'est pas encore branché. Utile pour tester l'expérience avec une vraie sécurité, mais pas « à l'épreuve d'un État » — pas encore pour des conversations à très haut risque.",
    nativeTitle: "Apps natives iOS et Android",
    nativeText: "La base de l'app native (Expo/React Native, avec verrouillage biométrique du système) est prête dans le code du projet. La publication sur l'App Store et Google Play nécessite les identifiants des comptes développeur (Apple Developer Program et Google Play Console) : tant qu'ils ne sont pas reliés, l'app reste disponible comme application web, utilisable depuis n'importe quel navigateur mobile et déjà installable via « Ajouter à l'écran d'accueil ».",
    ctaTitle: "Essayez le prototype",
    ctaText: "Un e-mail et un nom d'utilisateur suffisent pour créer votre premier profil."
  },
  manual: {
    title: "Manuel d'utilisation — Messagerie Privée",
    description: "Guide complet : inscription, connexion par code, discussions masquées, chiffrement de bout en bout, déverrouillage biométrique et langues disponibles.",
    h1: "Manuel d'utilisation",
    lead: "Guide complet de Messagerie Privée : comment s'inscrire, se connecter, utiliser les fonctions de confidentialité et comprendre ce que ce prototype protège vraiment — et ce qu'il ne protège pas.",
    sections: [
      { id: "signup", h: "1. Inscription et première connexion", blocks: [
        ["p", "Sur l'écran d'accueil, touchez « Inscrivez-vous » et saisissez votre e-mail et un nom d'utilisateur. Aucun numéro de téléphone n'est demandé."],
        ["p", "Après l'inscription, vous verrez une seule fois trois informations, à enregistrer tout de suite dans un endroit sûr (un gestionnaire de mots de passe, par exemple) :"],
        ["ul", [
          "<strong>Code d'accès</strong> : c'est votre « mot de passe ». À chaque ouverture de l'app vous le saisissez et votre profil s'ouvre automatiquement.",
          "<strong>ID public</strong> : c'est ce que vous partagez avec les personnes que vous voulez ajouter comme contacts. Il ne révèle pas votre e-mail.",
          "<strong>Combinaison secrète</strong> : elle sert à révéler les discussions masquées (voir la section dédiée)."
        ]],
        ["warn", "Si vous perdez le code d'accès, vous perdez l'accès au profil : il n'existe pas encore de vraie récupération par e-mail (voir « Limites de sécurité déclarées »)."]
      ]},
      { id: "profiles", h: "2. Profils multiples sur le même appareil", blocks: [
        ["p", "Vous pouvez créer plusieurs profils (par exemple un personnel et un de couverture), tous accessibles depuis le même appareil. Chaque profil a son propre code d'accès : quand vous ouvrez l'app et saisissez un code, le profil correspondant s'ouvre automatiquement, sans écran de sélection qui révélerait combien de profils existent."]
      ]},
      { id: "contacts", h: "3. Ajouter des contacts et discuter", blocks: [
        ["p", "Touchez « + Ajouter un contact » et saisissez l'ID public de la personne. Une discussion en temps réel s'ouvre, chiffrée de bout en bout (voir la section 7)."]
      ]},
      { id: "hidden", h: "4. Discussions masquées et combinaison secrète", blocks: [
        ["p", "Depuis une discussion, ouvrez le menu et choisissez « Masquer/afficher cette discussion ». Une discussion masquée n'apparaît plus dans la liste principale."],
        ["p", "Pour la faire réapparaître, saisissez votre combinaison secrète (celle affichée une seule fois à l'inscription) dans la barre de recherche : toutes les discussions masquées redeviennent visibles jusqu'à ce que vous verrouilliez de nouveau l'app."]
      ]},
      { id: "cover", h: "5. Profil de couverture", blocks: [
        ["p", "À l'inscription, vous pouvez cocher « Créer comme profil de couverture » : un profil conçu pour être montré en cas de contrôle, sans aucun indice de l'existence d'autres profils sur le même appareil."]
      ]},
      { id: "timed", h: "6. Messages éphémères (autodestruction)", blocks: [
        ["p", "Avant d'envoyer un message, vous pouvez choisir dans le menu déroulant un délai d'autodestruction : 30 secondes, 5 minutes ou 1 heure. Passé ce délai, le message est supprimé."]
      ]},
      { id: "encryption", h: "7. Chiffrement de bout en bout : comment il fonctionne vraiment", blocks: [
        ["p", "Ce n'est pas un slogan marketing : chaque message est chiffré <strong>dans votre navigateur</strong>, avant d'être envoyé au serveur, selon ce schéma :"],
        ["ol", [
          "À la première connexion, votre appareil génère une paire de clés ECDH sur la courbe P-256 (une publique et une privée). La clé publique est envoyée au serveur ; la clé privée reste uniquement dans votre navigateur.",
          "Quand vous écrivez à un contact, votre navigateur combine votre clé privée avec sa clé publique (échange ECDH) et dérive, via HKDF-SHA256, une clé symétrique AES-GCM 256 bits propre à ce couple de personnes.",
          "Chaque message est chiffré avec cette clé et un nombre aléatoire (IV) différent à chaque fois, puis envoyé au serveur déjà chiffré.",
          "Le serveur ne stocke et ne transmet que du texte chiffré : il ne peut pas lire le contenu des messages."
        ]],
        ["p", "C'est le même type de mathématiques (ECDH + AES-GCM) que celui de nombreux protocoles sécurisés modernes, appliqué ici via la Web Crypto API native du navigateur, sans bibliothèque externe."]
      ]},
      { id: "biometric", h: "8. Déverrouillage biométrique (Face ID / Touch ID / empreinte)", blocks: [
        ["p", "Dans les réglages du profil (icône ⚙️), vous trouverez « Activer le déverrouillage par Face ID / empreinte ». En l'activant, votre appareil crée une passkey via WebAuthn/FIDO2 et l'enregistre sur le serveur (uniquement la clé publique, jamais la donnée biométrique)."],
        ["p", "Dès lors, l'écran de connexion affiche un bouton « Déverrouiller par biométrie » : vous l'utilisez à la place du code, et votre système d'exploitation (pas l'app) vérifie Face ID, Touch ID, l'empreinte Android ou Windows Hello. La donnée biométrique ne quitte jamais votre appareil."],
        ["p", "Vous pouvez le désactiver à tout moment depuis les mêmes réglages."]
      ]},
      { id: "languages", h: "9. Changer de langue", blocks: [
        ["p", "En haut de chaque écran de l'app, vous trouverez un sélecteur de langue. Ce site est lui aussi disponible dans les mêmes 11 langues : italien, anglais, espagnol, français, allemand, portugais, arabe, chinois, hindi, russe et japonais. La langue choisie dans l'app est mémorisée sur l'appareil."]
      ]},
      { id: "mobile", h: "10. Apps mobiles natives (iOS/Android)", blocks: [
        ["p", "Une base d'app native (reposant sur Expo/React Native) est prête et ajoute un verrouillage biométrique du système à l'ouverture. La publication effective sur l'App Store et Google Play nécessite les identifiants des comptes développeur (Apple Developer Program et Google Play Console) : une fois reliés, l'app pourra être générée et publiée. D'ici là, l'application web reste utilisable depuis n'importe quel navigateur mobile et peut être « installée » sur l'écran d'accueil comme une app."]
      ]},
      { id: "limits", h: "11. Limites de sécurité déclarées", blocks: [
        ["p", "Par honnêteté, voici ce que ce prototype ne fait <strong>pas encore</strong>, même si le chiffrement est bien réel :"],
        ["ul", [
          "<strong>Pas de ratchet / forward secrecy</strong> : la clé d'une discussion reste la même tant que les deux personnes ne régénèrent pas leurs clés (contrairement à des protocoles comme Signal, qui changent de clé à chaque message).",
          "<strong>Pas de vérification hors bande des clés publiques</strong> : il n'y a pas de « numéro de sécurité » à comparer de vive voix avec le contact. En théorie, un serveur malveillant pourrait remplacer une clé publique par la sienne (attaque de l'homme du milieu). Acceptable sur un serveur de confiance pour un prototype ; cette vérification devrait être ajoutée avant tout usage à haut risque.",
          "<strong>Clé privée dans le navigateur</strong> : elle est enregistrée dans le stockage local du navigateur (localStorage), pas dans une enclave sécurisée matérielle. Quiconque a un accès physique ou logiciel à l'appareil déverrouillé pourrait la lire.",
          "<strong>Pas d'envoi d'e-mails réel</strong> : l'inscription fonctionne, mais aucun service d'e-mail n'est encore relié pour une éventuelle récupération de compte par « lien magique »."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Dépannage", blocks: [
        ["h3", "« Impossible de chiffrer : le contact n'a pas encore de clé publique »"],
        ["p", "Cela arrive si votre contact ne s'est pas connecté depuis la dernière mise à jour de l'app (la clé est générée et envoyée automatiquement à la connexion). Demandez-lui de se connecter une fois : ensuite vous pourrez lui écrire normalement."],
        ["h3", "« J'ai perdu le code d'accès »"],
        ["p", "Il n'existe pour l'instant aucune récupération automatique : il faut créer un nouveau profil. Conservez toujours le code dans un gestionnaire de mots de passe."],
        ["h3", "Le déverrouillage biométrique n'apparaît pas"],
        ["p", "Il nécessite un appareil avec Face ID, Touch ID, empreinte ou Windows Hello configuré, un navigateur à jour et une connexion HTTPS (l'application web en production en utilise déjà une). Il doit en outre avoir été activé au moins une fois dans les réglages."]
      ]}
    ]
  },
  privacy: {
    title: "Politique de confidentialité — Messagerie Privée",
    description: "Politique de confidentialité du prototype Messagerie Privée : quelles données sont traitées et comment.",
    h1: "Politique de confidentialité",
    sections: [
      ["Qui traite les données", ["Ce site et le prototype associé sont un projet de démonstration personnel. Pour toute demande relative aux données, vous pouvez écrire via <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."]],
      ["Données collectées par le site de présentation", ["Ce site n'utilise aucun outil d'analyse ni de suivi tiers. Seules les préférences de cookies que vous choisissez sont enregistrées (voir la Politique de cookies), en local dans votre navigateur."]],
      ["Données collectées par le prototype (/app)", [
        "Pour utiliser le prototype de messagerie, vous créez un profil avec un e-mail et un nom d'utilisateur. Sont enregistrés sur le serveur : e-mail, nom d'utilisateur, ID public, code d'accès, combinaison des discussions masquées, contacts ajoutés, votre clé publique de chiffrement et les messages envoyés.",
        "<strong>Messages :</strong> le contenu est chiffré de bout en bout dans le navigateur avant l'envoi ; le serveur ne conserve que du texte chiffré et ne peut pas le lire. Les métadonnées (expéditeur, heure, réactions, expiration des messages éphémères) restent non chiffrées.",
        "<strong>Déverrouillage biométrique :</strong> si vous l'activez, seule la clé publique de la passkey (WebAuthn) est enregistrée sur le serveur. Les données biométriques ne quittent jamais votre appareil. Votre clé privée de chiffrement reste dans le navigateur (localStorage).",
        "<strong>Important :</strong> il s'agit d'un prototype de démonstration : l'e-mail, le nom d'utilisateur et les codes d'accès sont stockés sans chiffrement et le service n'atteint pas les standards d'un produit en production. Ne saisissez pas d'informations réelles sensibles : utilisez des données de test."
      ]],
      ["Finalité du traitement", ["Les données servent uniquement à faire fonctionner la démo (authentification, messagerie, contacts). Elles ne sont pas cédées à des tiers et ne sont pas utilisées pour du profilage publicitaire."]],
      ["Conservation", ["Les données du prototype peuvent être supprimées à tout moment lors de mises à jour ou de réinitialisations de la démo, sans préavis."]],
      ["Vos droits", ["Vous pouvez demander à tout moment la suppression des données saisies dans le prototype en écrivant via les contacts indiqués ci-dessus."]]
    ]
  },
  cookie: {
    title: "Politique de cookies — Messagerie Privée",
    description: "Informations sur les cookies utilisés par le site de présentation du prototype Messagerie Privée.",
    h1: "Politique de cookies",
    sections: [
      ["Que sont les cookies", ["Les cookies sont de petits fichiers enregistrés par le navigateur lorsque vous visitez un site. Ce site n'utilise pas de cookies de suivi tiers."]],
      ["Cookies techniques", ["Nous utilisons une seule préférence technique (enregistrée dans le localStorage du navigateur, et non comme cookie HTTP) pour mémoriser votre choix sur le bandeau de cookies. Sans elle, le bandeau réapparaîtrait à chaque visite. L'app (/app) enregistre en outre localement la langue choisie et vos clés de chiffrement, indispensables à son fonctionnement."]],
      ["Cookies statistiques", ["Pour le moment, ce site n'utilise aucun outil d'analyse statistique. La catégorie « statistiques » du bandeau est prévue pour un éventuel usage futur : si des outils comme Google Analytics sont activés, le script ne démarrera qu'après un consentement explicite."]],
      ["Cookies de marketing", ["Nous n'utilisons pas de cookies ni de pixels de marketing ou de publicité."]],
      ["Comment gérer vos préférences", ["Vous pouvez effacer la préférence enregistrée en supprimant les données de navigation de votre navigateur pour ce site : le bandeau réapparaîtra à la prochaine visite."]]
    ]
  }
};
