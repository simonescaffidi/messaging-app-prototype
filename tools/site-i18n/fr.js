// Dizionario del sito (fr). Struttura identica a it.js.
module.exports = {
  "code": "fr",
  "dir": "ltr",
  "brand": "Securmy",
  "ui": {
    "openApp": "Ouvrir l'app",
    "manual": "Manuel",
    "langAria": "Langue",
    "legalAria": "Mentions légales",
    "privacy": "Politique de confidentialité",
    "cookie": "Politique de cookies",
    "langsLabel": "Toutes les langues",
    "updated": "Dernière mise à jour : octobre 2026.",
    "tocTitle": "Sommaire",
    "cookieBanner": {
      "text": "Nous utilisons des cookies techniques nécessaires et, avec votre consentement, des cookies statistiques. Consultez la <a href=\"{privacyUrl}\">Politique de confidentialité</a> et la <a href=\"{cookieUrl}\">Politique de cookies</a>.",
      "reject": "Refuser",
      "customize": "Personnaliser",
      "accept": "Tout accepter",
      "statsQuestion": "Souhaitez-vous accepter les cookies statistiques ?"
    },
    "terms": "Conditions d'utilisation",
    "owner": "Titulaire"
  },
  "landing": {
    "title": "Securmy — Messagerie privée, coffre de fichiers et envoi P2P chiffré",
    "description": "Chat à chiffrement de bout en bout réel, coffre de fichiers, mots de passe et notes chiffrés, envoi P2P par lien, appels chiffrés et vérification en deux étapes. 11 langues.",
    "ogTitle": "Securmy — Sécurité, confidentialité et discrétion",
    "ogDesc": "Messages, fichiers, mots de passe et appels protégés par un chiffrement de bout en bout : tout est chiffré sur votre appareil, en 11 langues.",
    "badge": "Prototype fonctionnel",
    "h1": "Un chat où le mot de passe choisit votre profil",
    "lead": "Pas de numéro de téléphone. Saisissez votre nom d'utilisateur et votre mot de passe : le mot de passe décide quel profil s'ouvre. Discussions masquées, profil de couverture, messages auto-destructeurs.",
    "ctaOpen": "Ouvrir l'app →",
    "ctaHow": "Découvrir le fonctionnement",
    "featuresTitle": "Ce que vous pouvez faire",
    "features": [
      [
        "🔑",
        "Connexion par identifiant et mot de passe",
        "Le nom d'utilisateur d'abord, puis le mot de passe : même identifiant, mot de passe différent, profil différent. Aucun écran de sélection."
      ],
      [
        "🪪",
        "Profils multiples",
        "Plusieurs profils sur le même appareil, chacun avec ses propres contacts, discussions et réglages."
      ],
      [
        "🙈",
        "Discussions masquées",
        "Masquez une conversation de la liste principale. Elle ne réapparaît qu'en saisissant une combinaison secrète dans la recherche."
      ],
      [
        "🎭",
        "Profil de couverture",
        "Créez un profil anodin à montrer en cas de contrôle, sans aucun indice de l'existence d'autres profils."
      ],
      [
        "💣",
        "Messages éphémères",
        "Envoyez des messages qui s'autodétruisent après 30 secondes, 5 minutes ou une heure."
      ],
      [
        "📵",
        "Aucun numéro de téléphone",
        "Inscription par e-mail et ID public distinct de l'adresse : votre e-mail n'est jamais visible par les autres."
      ],
      [
        "🔐",
        "Vrai chiffrement de bout en bout",
        "Chaque message est chiffré dans le navigateur avec ECDH (P-256) + AES-GCM 256 bits avant de partir : le serveur ne voit que du texte chiffré, jamais le contenu en clair."
      ],
      [
        "🫆",
        "Déverrouillage biométrique",
        "Face ID, Touch ID, empreinte Android ou Windows Hello via un vrai WebAuthn/FIDO2 : aucune donnée biométrique ne quitte jamais l'appareil."
      ],
      [
        "🌍",
        "11 langues",
        "App et site disponibles en italien, anglais, espagnol, français, allemand, portugais, arabe, chinois, hindi, russe et japonais."
      ]
    ],
    "howTitle": "Comment ça marche",
    "steps": [
      [
        "Inscrivez-vous",
        "E-mail, nom d'utilisateur et mot de passe : vous recevez un ID public et une combinaison secrète. Conservez-les : ils ne sont plus affichés ensuite."
      ],
      [
        "Connectez-vous avec identifiant et mot de passe",
        "À chaque ouverture, saisissez votre identifiant et votre mot de passe : le profil correspondant s'ouvre automatiquement."
      ],
      [
        "Ajoutez des contacts",
        "Recherchez une personne grâce à son ID public et commencez à discuter en temps réel."
      ],
      [
        "Masquez ce que vous voulez",
        "Saisissez la combinaison secrète dans la barre de recherche pour révéler les discussions masquées quand vous en avez besoin."
      ]
    ],
    "disclaimerTitle": "Ce que c'est, ce que ce n'est pas",
    "disclaimerHtml": "<strong>Ceci est un prototype fonctionnel</strong>, pas un produit fini, mais la sécurité est réelle : chaque message a une nouvelle clé supprimée après lecture (forward secrecy), les clés privées sont dans un coffre chiffré avec votre mot de passe, vous pouvez vérifier l'identité du contact avec un numéro de sécurité et vous êtes averti si sa clé change. Le déverrouillage biométrique utilise un vrai WebAuthn/FIDO2. Des limites connues subsistent, expliquées sans détour dans le <a href=\"{manualUrl}\">manuel utilisateur</a> (métadonnées visibles du serveur, historique lié à l'appareil, récupération par e-mail uniquement). Il n'est pas encore conçu pour des conversations à très haut risque.",
    "nativeTitle": "Apps natives iOS et Android",
    "nativeText": "La base de l'app native (Expo/React Native, avec verrouillage biométrique du système) est prête dans le code du projet. La publication sur l'App Store et Google Play nécessite les identifiants des comptes développeur (Apple Developer Program et Google Play Console) : tant qu'ils ne sont pas reliés, l'app reste disponible comme application web, utilisable depuis n'importe quel navigateur mobile et déjà installable via « Ajouter à l'écran d'accueil ».",
    "ctaTitle": "Essayez le prototype",
    "ctaText": "Un e-mail et un nom d'utilisateur suffisent pour créer votre premier profil.",
    "secTitle": "Sécurité et confidentialité : le cœur de l'appli",
    "secLead": "Nous ne nous contentons pas de dire « c'est chiffré ». Voici concrètement ce qui protège vos conversations.",
    "security": [
      [
        "🔄",
        "Une nouvelle clé pour chaque message",
        "Chaque message a une clé à usage unique (forward secrecy), supprimée après lecture. Si quelqu'un obtenait vos clés, il ne pourrait pas déchiffrer les messages passés."
      ],
      [
        "🗝️",
        "Coffre chiffré avec votre mot de passe",
        "Les clés privées et les messages lus sont chiffrés sur l'appareil (PBKDF2 + AES-GCM) avec votre mot de passe : sans lui, ils restent illisibles."
      ],
      [
        "🔍",
        "Vérification des clés et alerte anti-interception",
        "Comparez de vive voix le numéro de sécurité avec votre contact. Si sa clé change, l'appli vous prévient et bloque l'envoi tant que vous ne confirmez pas."
      ],
      [
        "🙈",
        "Un serveur aveugle",
        "Le serveur ne conserve que du texte chiffré. L'e-mail et le nom d'utilisateur sont chiffrés au repos dans la base ; les mots de passe ne sont gardés que sous forme de hash (scrypt)."
      ],
      [
        "🛡️",
        "Défense contre les attaques de connexion",
        "Tentatives limitées par IP et par utilisateur, sessions révocables, autres sessions fermées au changement de mot de passe."
      ],
      [
        "🫆",
        "Une biométrie qui ne quitte pas votre appareil",
        "Avec WebAuthn/FIDO2, le serveur ne reçoit que la clé publique de la passkey : la donnée biométrique ne quitte jamais votre téléphone ou ordinateur."
      ]
    ],
    "suiteTitle": "Plus qu'un chat : votre coffre numérique",
    "suiteLead": "Securmy va au-delà de la messagerie. Tout ce que vous enregistrez ou partagez est chiffré sur votre appareil, avec le même coffre qui protège vos discussions.",
    "suite": [
      [
        "🗄️",
        "Coffre de fichiers",
        "Cachez et protégez documents, photos et fichiers : chiffrés sur l'appareil en AES-256 et ouverts uniquement par votre mot de passe ou la biométrie."
      ],
      [
        "🔗",
        "Envoi P2P par lien",
        "Le fichier passe directement d'un appareil à l'autre, chiffré, sans être stocké sur le serveur. Lien à usage unique avec expiration."
      ],
      [
        "🧼",
        "Nettoyage des métadonnées",
        "Supprime la position GPS, le modèle d'appareil et d'autres données cachées des photos avant de les partager."
      ],
      [
        "🔑",
        "Gestionnaire de mots de passe",
        "Enregistrez vos identifiants dans le coffre, générez des mots de passe robustes et copiez-les : le presse-papiers est vidé au bout de 20 secondes."
      ],
      [
        "📝",
        "Notes chiffrées",
        "Notes privées chiffrées sur votre appareil, jamais envoyées à un serveur."
      ],
      [
        "👁️",
        "Messages à vue unique",
        "Le destinataire ne les ouvre qu'une fois : quelques secondes après, ils sont supprimés du serveur et de son appareil."
      ],
      [
        "📞",
        "Appels audio et vidéo chiffrés",
        "Directement entre les deux appareils (DTLS-SRTP), avec un code de vérification à comparer à voix haute contre l'écoute."
      ],
      [
        "🔢",
        "Vérification en deux étapes",
        "Codes TOTP avec n'importe quelle appli d'authentification : même quelqu'un qui découvre votre mot de passe n'entre pas."
      ],
      [
        "💾",
        "Sauvegarde chiffrée",
        "Exportez fichiers, notes et mots de passe dans une seule archive chiffrée par une phrase secrète que vous seul connaissez."
      ],
      [
        "🚨",
        "Contrôle de sécurité et effacement d'urgence",
        "Un score vous dit quoi améliorer ; en cas de danger, un geste efface de l'appareil clés, fichiers et mots de passe."
      ],
      [
        "☁️",
        "Synchronisation chiffrée (payante)",
        "Synchronisez le coffre entre vos appareils avec des packs d'espace (5, 25 ou 100 Go par mois). Le serveur ne conserve que des données déjà chiffrées : la clé reste sur vos appareils. Sans offre, tout reste local."
      ],
      [
        "🛰️",
        "Protection de l'IP par relais",
        "Avec un relais chiffré (TURN), vous pouvez masquer votre adresse IP pendant les appels et envois P2P, et les faire fonctionner même sur des réseaux très restrictifs."
      ]
    ],
    "roadmapTitle": "Bientôt",
    "roadmapLead": "Ce que nous prévoyons. Ce n'est pas encore disponible et ne constitue pas une date promise.",
    "roadmap": [
      [
        "🧅",
        "Réseau Tor",
        "Le service peut être exposé en adresse .onion : les fichiers d'installation sont prêts (auto-hébergement) et activés sur demande. Tor Browser désactive WebRTC, donc les envois P2P et les appels ne fonctionnent pas via Tor ; messages, coffre et sync oui."
      ],
      [
        "📱",
        "Applis iOS et Android",
        "Applis natives avec déverrouillage biométrique, publiées sur les stores avec les mêmes garanties de sécurité et de confidentialité que le site."
      ]
    ]
  },
  "manual": {
    "title": "Manuel d'utilisation — Securmy",
    "description": "Guide complet : inscription, connexion par identifiant et mot de passe, discussions masquées, chiffrement de bout en bout, déverrouillage biométrique et langues disponibles.",
    "h1": "Manuel d'utilisation",
    "lead": "Guide complet de Securmy : comment s'inscrire, se connecter, utiliser les fonctions de confidentialité et comprendre ce que ce prototype protège vraiment — et ce qu'il ne protège pas.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Inscription et première connexion",
        "blocks": [
          [
            "p",
            "Sur l'écran d'accueil, touchez « Inscrivez-vous » et saisissez votre e-mail et un nom d'utilisateur. Aucun numéro de téléphone n'est demandé."
          ],
          [
            "p",
            "Après l'inscription, vous verrez une seule fois trois informations, à enregistrer tout de suite dans un endroit sûr (un gestionnaire de mots de passe, par exemple) :"
          ],
          [
            "ul",
            [
              "<strong>Identifiant et mot de passe</strong> : l'identifiant est le premier champ, le mot de passe décide quel profil s'ouvre. Avec le même identifiant, vous pouvez avoir plusieurs profils, chacun avec son mot de passe.",
              "<strong>ID public</strong> : c'est ce que vous partagez avec les personnes que vous voulez ajouter comme contacts. Il ne révèle pas votre e-mail.",
              "<strong>Combinaison secrète</strong> : elle sert à révéler les discussions masquées (voir la section dédiée)."
            ]
          ],
          [
            "warn",
            "Si vous perdez le mot de passe, vous pouvez le réinitialiser par e-mail, mais seulement si l'e-mail du profil est vérifié. Sans mot de passe et sans e-mail vérifié, le profil est irrécupérable."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Profils multiples sur le même appareil",
        "blocks": [
          [
            "p",
            "Vous pouvez créer plusieurs profils (par exemple un personnel et un de couverture) avec le même identifiant mais des mots de passe différents. En saisissant identifiant et mot de passe, le profil correspondant s'ouvre, sans écran de sélection révélant le nombre de profils. Vous ne pouvez pas utiliser le même mot de passe pour deux profils du même identifiant."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Ajouter des contacts et discuter",
        "blocks": [
          [
            "p",
            "Touchez « + Ajouter un contact » et saisissez l'ID public de la personne. Une discussion en temps réel s'ouvre, chiffrée de bout en bout (voir la section 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Discussions masquées et combinaison secrète",
        "blocks": [
          [
            "p",
            "Depuis une discussion, ouvrez le menu et choisissez « Masquer/afficher cette discussion ». Une discussion masquée n'apparaît plus dans la liste principale."
          ],
          [
            "p",
            "Pour la faire réapparaître, saisissez votre combinaison secrète (celle affichée une seule fois à l'inscription) dans la barre de recherche : toutes les discussions masquées redeviennent visibles jusqu'à ce que vous verrouilliez de nouveau l'app."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Profil de couverture",
        "blocks": [
          [
            "p",
            "À l'inscription, vous pouvez cocher « Créer comme profil de couverture » : un profil conçu pour être montré en cas de contrôle, sans aucun indice de l'existence d'autres profils sur le même appareil."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Messages éphémères (autodestruction)",
        "blocks": [
          [
            "p",
            "Avant d'envoyer un message, vous pouvez choisir dans le menu déroulant un délai d'autodestruction : 30 secondes, 5 minutes ou 1 heure. Passé ce délai, le message est supprimé."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. Chiffrement de bout en bout : comment il fonctionne vraiment",
        "blocks": [
          [
            "p",
            "Ce n'est pas un slogan marketing : chaque message est chiffré <strong>dans votre navigateur</strong>, avant d'être envoyé au serveur, selon ce schéma :"
          ],
          [
            "ol",
            [
              "À la première connexion, votre appareil génère une paire de clés ECDH (courbe P-256) : la clé publique va au serveur, la privée reste sur l'appareil, chiffrée avec votre mot de passe. Il prépare aussi un lot de clés publiques à usage unique (« prekeys »).",
              "Pour chaque message, votre navigateur génère une clé temporaire et récupère sur le serveur UNE prekey à usage unique du contact. Il combine trois échanges ECDH (votre identité, la clé temporaire, la prekey) et dérive avec HKDF-SHA256 une clé AES-GCM de 256 bits valable pour ce seul message.",
              "Le message est chiffré avec cette clé et un IV aléatoire ; l'en-tête est authentifié et ne peut donc pas être modifié. Le serveur ne reçoit que du texte chiffré.",
              "Le destinataire reconstruit la même clé, lit le message et supprime aussitôt la prekey privée : dès lors, plus personne ne peut le déchiffrer, pas même avec vos clés à long terme."
            ]
          ],
          [
            "p",
            "C'est le même type de mathématiques (ECDH + AES-GCM) que celui de nombreux protocoles sécurisés modernes, appliqué ici via la Web Crypto API native du navigateur, sans bibliothèque externe."
          ],
          [
            "h3",
            "Forward secrecy : les messages passés restent protégés"
          ],
          [
            "p",
            "Même si quelqu'un obtenait vos clés à long terme (par exemple en volant votre appareil), il ne pourrait pas déchiffrer les messages déjà reçus, car leurs clés ont été supprimées. Le texte déjà lu ne subsiste que dans le cache local chiffré de votre appareil."
          ],
          [
            "h3",
            "Le coffre des clés"
          ],
          [
            "p",
            "Les clés privées, les prekeys et le cache des messages ne sont stockés dans le navigateur que sous forme chiffrée (AES-GCM), avec une clé dérivée de votre mot de passe par PBKDF2-SHA256 (310 000 itérations). Si vous vous connectez par biométrie, le mot de passe est demandé une fois pour ouvrir le coffre. Quand vous changez de mot de passe, le coffre est rechiffré."
          ],
          [
            "h3",
            "Vérifier que c'est bien lui : numéro de sécurité"
          ],
          [
            "p",
            "Dans la discussion, touchez l'icône 🔑 : vous voyez un numéro de 60 chiffres, identique pour vous deux. Comparez-le avec votre contact en personne ou de vive voix : s'il correspond, personne ne s'interpose. Si la clé d'un contact change (nouvel appareil ou interception possible), un avertissement apparaît et l'envoi reste bloqué jusqu'à ce que vous choisissiez « Accepter la nouvelle clé »."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Déverrouillage biométrique (Face ID / Touch ID / empreinte)",
        "blocks": [
          [
            "p",
            "Dans les réglages du profil (icône ⚙️), vous trouverez « Activer le déverrouillage par Face ID / empreinte ». En l'activant, votre appareil crée une passkey via WebAuthn/FIDO2 et l'enregistre sur le serveur (uniquement la clé publique, jamais la donnée biométrique)."
          ],
          [
            "p",
            "Ensuite, l'écran de connexion affichera un bouton « Déverrouiller par biométrie » : utilisez-le à la place du mot de passe ; votre système d'exploitation (et non l'app) vérifie Face ID, Touch ID, l'empreinte Android ou Windows Hello. La donnée biométrique ne quitte jamais votre appareil."
          ],
          [
            "p",
            "Vous pouvez le désactiver à tout moment depuis les mêmes réglages."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Changer de langue",
        "blocks": [
          [
            "p",
            "En haut de chaque écran de l'app, vous trouverez un sélecteur de langue. Ce site est lui aussi disponible dans les mêmes 11 langues : italien, anglais, espagnol, français, allemand, portugais, arabe, chinois, hindi, russe et japonais. La langue choisie dans l'app est mémorisée sur l'appareil."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. Apps mobiles natives (iOS/Android)",
        "blocks": [
          [
            "p",
            "Une base d'app native (reposant sur Expo/React Native) est prête et ajoute un verrouillage biométrique du système à l'ouverture. La publication effective sur l'App Store et Google Play nécessite les identifiants des comptes développeur (Apple Developer Program et Google Play Console) : une fois reliés, l'app pourra être générée et publiée. D'ici là, l'application web reste utilisable depuis n'importe quel navigateur mobile et peut être « installée » sur l'écran d'accueil comme une app."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Limites de sécurité déclarées",
        "blocks": [
          [
            "p",
            "Par honnêteté, voici les limites qui subsistent, même si le chiffrement est réel et pas seulement annoncé :"
          ],
          [
            "ul",
            [
              "<strong>Prekeys épuisées</strong> : si un contact reste longtemps hors ligne et n'a plus de clés à usage unique, le message utilise quand même une clé nouvelle mais sans suppression unique, donc avec une forward secrecy plus faible.",
              "<strong>Messages liés à cet appareil</strong> : par conception, l'historique déchiffré ne se transfère pas. Sur un nouvel appareil ou après une récupération du mot de passe par e-mail, l'ancien coffre est irrécupérable : vous repartez avec une nouvelle identité et vos contacts voient l'avertissement de changement de clé.",
              "<strong>Le coffre vaut ce que vaut le mot de passe</strong> : choisissez-en un long et unique. Quiconque a votre appareil déjà déverrouillé avec l'appli ouverte peut lire les discussions, comme avec toute appli.",
              "<strong>Métadonnées visibles du serveur</strong> : expéditeur, heure, réactions et expiration des messages éphémères ne sont pas chiffrés.",
              "<strong>Récupération par e-mail uniquement</strong> : si vous perdez le mot de passe et l'accès à l'e-mail vérifié, le profil est irrécupérable. Si vous utilisez plusieurs profils (par ex. un de couverture), utilisez des e-mails différents : un lien de récupération révèle à qui contrôle l'e-mail que le profil existe."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Dépannage",
        "blocks": [
          [
            "h3",
            "« Impossible de chiffrer : le contact n'a pas encore de clé publique »"
          ],
          [
            "p",
            "Cela arrive si votre contact ne s'est pas connecté depuis la dernière mise à jour de l'app (la clé est générée et envoyée automatiquement à la connexion). Demandez-lui de se connecter une fois : ensuite vous pourrez lui écrire normalement."
          ],
          [
            "h3",
            "« J'ai perdu mon mot de passe »"
          ],
          [
            "p",
            "Utilisez « Mot de passe oublié ? » sur l'écran de connexion et saisissez e-mail et identifiant : si l'e-mail du profil est vérifié, vous recevez un lien valable 1 heure. Sinon le profil est irrécupérable et doit être recréé. Conservez toujours votre mot de passe dans un gestionnaire de mots de passe."
          ],
          [
            "h3",
            "Le déverrouillage biométrique n'apparaît pas"
          ],
          [
            "p",
            "Il nécessite un appareil avec Face ID, Touch ID, empreinte ou Windows Hello configuré, un navigateur à jour et une connexion HTTPS (l'application web en production en utilise déjà une). Il doit en outre avoir été activé au moins une fois dans les réglages."
          ],
          [
            "h3",
            "« Message illisible »"
          ],
          [
            "p",
            "Par sécurité, la clé de chaque message est supprimée dès que vous l'avez lu : le texte ne reste que dans le cache chiffré de cet appareil. Si vous changez d'appareil, effacez les données du navigateur ou réinitialisez le mot de passe par e-mail, les messages précédents sont irrécupérables. C'est le prix de la forward secrecy."
          ]
        ]
      },
      {
        "id": "suite",
        "h": "13. Coffre et outils Securmy",
        "blocks": [
          [
            "p",
            "Ouvrez le Coffre avec le bouton 🛡️ de la barre latérale. Tout son contenu est chiffré sur votre appareil en AES-256-GCM, avec une clé conservée dans votre coffre et protégée par votre mot de passe : le serveur ne reçoit jamais fichiers, notes ni mots de passe."
          ],
          [
            "h3",
            "Coffre de fichiers"
          ],
          [
            "p",
            "Ajoutez des fichiers (jusqu'à 100 Mo chacun) depuis l'onglet Fichiers. Si la case est cochée, les métadonnées des photos sont supprimées avant l'enregistrement. Vous pouvez télécharger, envoyer en P2P ou supprimer chaque fichier."
          ],
          [
            "h3",
            "Envoi P2P par lien"
          ],
          [
            "p",
            "Choisissez un fichier et une durée de validité (10 minutes ou 1 heure) : vous obtenez un lien à usage unique. Le fichier va directement au destinataire, chiffré avec une clé qui se trouve uniquement après le # du lien et n'atteint jamais le serveur. Gardez la page ouverte jusqu'à la fin du transfert."
          ],
          [
            "h3",
            "Nettoyer les photos"
          ],
          [
            "p",
            "Redessine l'image en supprimant EXIF, position GPS et miniatures. Fonctionne avec JPEG, PNG et WebP ; pour les autres formats, le nettoyage automatique n'est pas disponible."
          ],
          [
            "h3",
            "Notes et mots de passe"
          ],
          [
            "p",
            "Notes et identifiants restent chiffrés dans le coffre. Le générateur crée des mots de passe aléatoires ; quand vous en copiez un, le presse-papiers est vidé au bout de 20 secondes."
          ],
          [
            "h3",
            "Messages à vue unique"
          ],
          [
            "p",
            "Choisissez « Vue unique » à côté du champ de message. Le destinataire touche pour voir : le texte reste visible 10 secondes, puis il est détruit sur son appareil et sur le serveur. Cela n'empêche pas de photographier l'écran."
          ],
          [
            "h3",
            "Appels audio et vidéo"
          ],
          [
            "p",
            "Utilisez les boutons 📞 et 🎥 dans l'en-tête de la discussion. Audio et vidéo circulent directement entre les appareils, chiffrés. Les deux voient un code à 4 chiffres : comparez-le à voix haute ; s'il coïncide, l'appel n'a pas été intercepté."
          ],
          [
            "h3",
            "Vérification en deux étapes"
          ],
          [
            "p",
            "Dans Sécurité, vous pouvez activer les codes TOTP avec une appli d'authentification (Google Authenticator, Aegis, 1Password…). Une fois activés, la connexion par mot de passe exige aussi le code à 6 chiffres. Le déverrouillage biométrique reste une méthode d'accès distincte."
          ],
          [
            "h3",
            "Sauvegarde et effacement d'urgence"
          ],
          [
            "p",
            "La sauvegarde contient fichiers, notes et mots de passe chiffrés avec une phrase secrète d'au moins 10 caractères que vous choisissez : sans elle, elle est irrécupérable. Les messages ne sont pas inclus. L'effacement d'urgence supprime de l'appareil clés, cache des messages, fichiers, notes et mots de passe et est irréversible."
          ],
          [
            "h3",
            "Limites à connaître"
          ],
          [
            "ul",
            [
              "La synchronisation entre appareils est facultative et payante (packs d'espace) : les données restent chiffrées sur votre appareil et le serveur n'a pas la clé. Sans offre, le coffre reste local ; la sauvegarde sert toujours à le déplacer.",
              "Pour masquer votre IP lors des envois P2P et des appels, activez Sécurité → Protection de l'IP (relais chiffré), là où le service dispose d'un serveur TURN. Sans relais, l'autre personne peut voir votre IP et, sur des réseaux très restrictifs, la connexion peut échouer.",
              "Le gestionnaire de mots de passe est basique : il ne remplit pas les formulaires seul et ne remplace pas un gestionnaire dédié pour un usage professionnel.",
              "Si vous perdez votre mot de passe et la phrase de sauvegarde, les données chiffrées sont irrécupérables : personne, pas même nous, ne peut les ouvrir."
            ]
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Politique de confidentialité — Securmy",
    "description": "Politique de confidentialité du prototype Securmy : quelles données sont traitées et comment.",
    "h1": "Politique de confidentialité",
    "sections": [
      [
        "Qui traite les données",
        [
          "Ce site et le prototype associé sont un projet de démonstration personnel. Pour toute demande relative aux données, vous pouvez écrire via <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."
        ]
      ],
      [
        "Données collectées par le site de présentation",
        [
          "Ce site n'utilise aucun outil d'analyse ni de suivi tiers. Seules les préférences de cookies que vous choisissez sont enregistrées (voir la Politique de cookies), en local dans votre navigateur."
        ]
      ],
      [
        "Données collectées par le prototype (/app)",
        [
          "Pour utiliser le prototype de messagerie, vous créez un profil avec e-mail, nom d'utilisateur et mot de passe. Sont enregistrés sur le serveur (base PostgreSQL) : e-mail (chiffré), nom d'utilisateur, hash du mot de passe, ID public, combinaison des discussions masquées, contacts ajoutés, votre clé publique de chiffrement, les sessions actives et les messages envoyés.",
          "<strong>Messages :</strong> le contenu est chiffré de bout en bout dans le navigateur avant l'envoi ; le serveur ne conserve que du texte chiffré et ne peut pas le lire. Les métadonnées (expéditeur, heure, réactions, expiration des messages éphémères) restent non chiffrées.",
          "<strong>Déverrouillage biométrique :</strong> si vous l'activez, seule la clé publique de la passkey (WebAuthn) est enregistrée sur le serveur. Les données biométriques ne quittent jamais votre appareil.",
          "<strong>Important :</strong> il s'agit d'un prototype de démonstration et le service n'a pas les standards d'un produit en production. L'e-mail et le nom d'utilisateur sont chiffrés au repos dans la base (AES-256-GCM) ; l'e-mail ne sert qu'à la vérification et à la récupération. Les mots de passe ne sont pas conservés en clair (seulement un hash salé, scrypt) et les tentatives de connexion échouées sont limitées par IP et par utilisateur. Ne saisissez pas d'informations réelles sensibles : utilisez des données de test.",
          "<strong>Clés de chiffrement :</strong> les clés privées ne quittent jamais votre appareil et sont stockées chiffrées avec votre mot de passe (PBKDF2 + AES-GCM), tout comme le cache local des messages déjà lus. Le serveur ne détient que votre clé publique et un lot de clés publiques à usage unique, qu'il supprime à chaque livraison."
        ]
      ],
      [
        "Finalité du traitement",
        [
          "Les données servent uniquement à faire fonctionner la démo (authentification, messagerie, contacts). Elles ne sont pas cédées à des tiers et ne sont pas utilisées pour du profilage publicitaire."
        ]
      ],
      [
        "Conservation",
        [
          "Les données sont conservées dans une base persistante jusqu'à la suppression du profil ; lors de mises à jour ou de réinitialisations de la démo, elles peuvent toutefois être supprimées sans préavis."
        ]
      ],
      [
        "Vos droits",
        [
          "Vous pouvez demander à tout moment la suppression des données saisies dans le prototype en écrivant via les contacts indiqués ci-dessus."
        ]
      ],
      [
        "Fonctions Securmy : coffre, envois P2P et appels",
        [
          "Fichiers, notes, mots de passe et sauvegardes du coffre restent sur votre appareil, chiffrés par une clé qui n'en sort jamais : nous ne les recevons pas et ne pouvons ni les lire ni les récupérer.",
          "Synchronisation (offre payante uniquement) : le serveur conserve fichiers, notes et mots de passe déjà chiffrés sur votre appareil, sans la clé pour les ouvrir, jusqu'à leur suppression par vous ou avec le compte. Pour les paiements nous utilisons Stripe : nous ne voyons ni ne conservons les données de votre carte.",
          "Pour les envois P2P et les appels, le contenu circule directement entre appareils, chiffré. Le serveur ne traite que les informations de connexion (SDP et candidats ICE), conservées en mémoire au plus une heure puis supprimées ; l'autre participant et un serveur STUN public peuvent voir votre adresse IP.",
          "Si vous activez la vérification en deux étapes, nous conservons le secret TOTP, chiffré au repos ; les messages à vue unique sont supprimés du serveur quelques secondes après leur ouverture."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Politique de cookies — Securmy",
    "description": "Informations sur les cookies utilisés par le site de présentation du prototype Securmy.",
    "h1": "Politique de cookies",
    "sections": [
      [
        "Que sont les cookies",
        [
          "Les cookies sont de petits fichiers enregistrés par le navigateur lorsque vous visitez un site. Ce site n'utilise pas de cookies de suivi tiers."
        ]
      ],
      [
        "Cookies techniques",
        [
          "Nous utilisons une seule préférence technique (enregistrée dans le localStorage du navigateur, et non comme cookie HTTP) pour mémoriser votre choix sur le bandeau de cookies. Sans elle, le bandeau réapparaîtrait à chaque visite. L'app (/app) enregistre en outre localement la langue choisie et vos clés de chiffrement, indispensables à son fonctionnement."
        ]
      ],
      [
        "Cookies statistiques",
        [
          "Pour le moment, ce site n'utilise aucun outil d'analyse statistique. La catégorie « statistiques » du bandeau est prévue pour un éventuel usage futur : si des outils comme Google Analytics sont activés, le script ne démarrera qu'après un consentement explicite."
        ]
      ],
      [
        "Cookies de marketing",
        [
          "Nous n'utilisons pas de cookies ni de pixels de marketing ou de publicité."
        ]
      ],
      [
        "Comment gérer vos préférences",
        [
          "Vous pouvez effacer la préférence enregistrée en supprimant les données de navigation de votre navigateur pour ce site : le bandeau réapparaîtra à la prochaine visite."
        ]
      ]
    ]
  },
  "terms": {
    "title": "Conditions d'utilisation et licence — Securmy",
    "description": "Conditions d'utilisation et licence de l'appli et du site Securmy.",
    "h1": "Conditions d'utilisation et licence",
    "sections": [
      [
        "1. Objet et titulaire",
        [
          "Ces Conditions régissent l'utilisation de l'appli et du site « Securmy » (le « Service »). En vous inscrivant ou en l'utilisant, vous les acceptez. Sinon, ne l'utilisez pas."
        ]
      ],
      [
        "2. Nature du Service",
        [
          "Le Service est un prototype fonctionnel fourni « en l'état ». Il peut changer, être interrompu ou réinitialisé sans préavis. Utilisez des données de test et ne lui confiez pas de conversations à très haut risque ni d'informations indispensables."
        ]
      ],
      [
        "3. Compte et sécurité",
        [
          "Vous devez avoir au moins 14 ans. Vous êtes responsable de votre mot de passe et de votre appareil. Les clés de chiffrement ne sont conservées que sur votre appareil, chiffrées avec votre mot de passe : si vous le perdez ou le réinitialisez, l'historique local est irrécupérable et nous ne pouvons pas le restaurer."
        ]
      ],
      [
        "4. Usage autorisé",
        [
          "Il est interdit d'utiliser le Service pour des activités illicites, du harcèlement, des menaces, du spam, des escroqueries, la diffusion de logiciels malveillants, des contenus exploitant des mineurs ou portant atteinte aux droits d'autrui, ou pour tenter de contourner, surcharger ou violer ses mesures de sécurité."
        ]
      ],
      [
        "5. Signalements et suspension",
        [
          "Vous pouvez bloquer et signaler tout contact. Les messages sont chiffrés de bout en bout et le Titulaire ne peut pas les lire : les signalements reposent sur ce qu'indique l'utilisateur et sur les données techniques disponibles. Le Titulaire peut suspendre ou supprimer les comptes qui enfreignent ces Conditions ou la loi et coopérer avec les autorités lorsque c'est requis."
        ]
      ],
      [
        "6. Licence d'utilisation",
        [
          "Vous recevez une licence personnelle, non exclusive, non transférable et révocable pour utiliser l'appli et le site à des fins licites. Logiciel, graphismes, marques et textes restent la propriété du Titulaire. Vous ne pouvez ni copier, vendre, décompiler ni créer d'œuvres dérivées, sauf dans les limites permises par la loi impérative."
        ]
      ],
      [
        "7. Garanties et responsabilité",
        [
          "Dans la mesure permise par la loi, le Service est fourni sans garantie de continuité, d'absence d'erreurs ou d'adéquation à un usage particulier, et le Titulaire n'est pas responsable des dommages indirects ni de la perte de données. Les droits des consommateurs et les responsabilités non excluables restent inchangés."
        ]
      ],
      [
        "8. Suppression du compte et données",
        [
          "Vous pouvez supprimer votre compte à tout moment depuis les Réglages : profil, contacts et discussions sont effacés définitivement. Le traitement des données est décrit dans la Politique de confidentialité."
        ]
      ],
      [
        "9. Droit applicable et modifications",
        [
          "Ces Conditions sont régies par le droit italien ; les consommateurs conservent les protections et le for prévus par le Code italien de la consommation et les règles impératives de l'UE. Nous pouvons mettre à jour ces Conditions : les changements importants seront annoncés dans le Service. Contact : info@simonescaffidi.it."
        ]
      ],
      [
        "10. Partage de fichiers et appels",
        [
          "Vous êtes responsable des fichiers que vous partagez et des appels que vous passez. Il est interdit de partager des contenus illicites ou de porter atteinte aux droits d'autrui. Les contenus étant chiffrés de bout en bout, nous ne pouvons pas les voir, mais nous pouvons suspendre les comptes visés par des signalements fondés. Les fonctions sont fournies « en l'état » et peuvent évoluer ou être suspendues."
        ]
      ]
    ]
  }
};
