// Dizionario del sito (es). Struttura identica a it.js.
module.exports = {
  "code": "es",
  "dir": "ltr",
  "brand": "Mensajería Privada",
  "ui": {
    "openApp": "Abrir la app",
    "manual": "Manual",
    "langAria": "Idioma",
    "legalAria": "Legal",
    "privacy": "Política de privacidad",
    "cookie": "Política de cookies",
    "langsLabel": "Todos los idiomas",
    "updated": "Última actualización: octubre de 2026.",
    "tocTitle": "Índice",
    "cookieBanner": {
      "text": "Usamos cookies técnicas necesarias y, con tu consentimiento, cookies estadísticas. Consulta la <a href=\"{privacyUrl}\">Política de privacidad</a> y la <a href=\"{cookieUrl}\">Política de cookies</a>.",
      "reject": "Rechazar",
      "customize": "Personalizar",
      "accept": "Aceptar todas",
      "statsQuestion": "¿Quieres aceptar las cookies estadísticas?"
    }
  },
  "landing": {
    "title": "Mensajería Privada — Chat con perfiles múltiples y chats ocultos",
    "description": "Chat privado con cifrado de extremo a extremo real, desbloqueo biométrico, perfiles múltiples y chats ocultos. 11 idiomas, sin número de teléfono.",
    "ogTitle": "Mensajería Privada — Prototipo",
    "ogDesc": "Cifrado de extremo a extremo, desbloqueo biométrico, perfiles múltiples, chats ocultos y perfil de cobertura en 11 idiomas.",
    "badge": "Prototipo funcional",
    "h1": "Un chat donde la contraseña elige tu perfil",
    "lead": "Sin número de teléfono. Escribe tu usuario y contraseña: la contraseña decide qué perfil se abre. Chats ocultos, perfil de cobertura, mensajes que se autodestruyen.",
    "ctaOpen": "Abrir la app →",
    "ctaHow": "Descubre cómo funciona",
    "featuresTitle": "Qué puedes hacer",
    "features": [
      [
        "🔑",
        "Acceso con usuario y contraseña",
        "Primero el usuario, luego la contraseña: mismo usuario, otra contraseña, otro perfil. Sin pantalla de selección."
      ],
      [
        "🪪",
        "Perfiles múltiples",
        "Varios perfiles en el mismo dispositivo, cada uno con contactos, chats y ajustes independientes."
      ],
      [
        "🙈",
        "Chats ocultos",
        "Oculta una conversación de la lista principal. Solo vuelve a verse al escribir una combinación secreta en el buscador."
      ],
      [
        "🎭",
        "Perfil de cobertura",
        "Crea un perfil inofensivo para mostrar en caso de control, sin pistas sobre la existencia de otros perfiles."
      ],
      [
        "💣",
        "Mensajes temporales",
        "Envía mensajes que se autodestruyen a los 30 segundos, 5 minutos o una hora."
      ],
      [
        "📵",
        "Sin número de teléfono",
        "Registro con correo electrónico y un ID público distinto de tu dirección: tu correo nunca es visible para los demás."
      ],
      [
        "🔐",
        "Cifrado de extremo a extremo real",
        "Cada mensaje se cifra en el navegador con ECDH (P-256) + AES-GCM de 256 bits antes de salir: el servidor solo ve texto cifrado, nunca el contenido en claro."
      ],
      [
        "🫆",
        "Desbloqueo biométrico",
        "Face ID, Touch ID, huella de Android o Windows Hello mediante WebAuthn/FIDO2 real: ningún dato biométrico sale nunca del dispositivo."
      ],
      [
        "🌍",
        "11 idiomas",
        "App y sitio web disponibles en italiano, inglés, español, francés, alemán, portugués, árabe, chino, hindi, ruso y japonés."
      ]
    ],
    "howTitle": "Cómo funciona",
    "steps": [
      [
        "Regístrate",
        "Correo, usuario y contraseña: recibes un ID público y una combinación secreta. Guárdalos: no se vuelven a mostrar."
      ],
      [
        "Inicia sesión con usuario y contraseña",
        "Cada vez que abres la app, introduce usuario y contraseña: el perfil correspondiente se abre automáticamente."
      ],
      [
        "Añade contactos",
        "Busca a una persona por su ID público y empieza a escribir en tiempo real."
      ],
      [
        "Oculta lo que quieras",
        "Escribe la combinación secreta en el buscador para mostrar los chats ocultos cuando lo necesites."
      ]
    ],
    "disclaimerTitle": "Qué es y qué no es",
    "disclaimerHtml": "<strong>Este es un prototipo funcional</strong>, no un producto terminado, pero la seguridad es real: cada mensaje tiene una clave nueva que se elimina tras leerlo (forward secrecy), las claves privadas están en una caja fuerte cifrada con tu contraseña, puedes verificar la identidad del contacto con un número de seguridad y recibes un aviso si su clave cambia. El desbloqueo biométrico usa WebAuthn/FIDO2 real. Quedan límites conocidos, explicados sin rodeos en el <a href=\"{manualUrl}\">manual de usuario</a> (metadatos visibles para el servidor, historial ligado al dispositivo, recuperación solo por correo). Aún no está pensado para conversaciones de riesgo extremo.",
    "nativeTitle": "Apps nativas para iOS y Android",
    "nativeText": "La base de la app nativa (Expo/React Native, con bloqueo biométrico del sistema) está lista en el código del proyecto. Publicarla en App Store y Google Play requiere las credenciales de las cuentas de desarrollador (Apple Developer Program y Google Play Console): hasta que se conecten, la app sigue disponible como aplicación web, utilizable desde cualquier navegador móvil e instalable como app con \"Añadir a pantalla de inicio\".",
    "ctaTitle": "Prueba el prototipo",
    "ctaText": "Solo necesitas un correo y un nombre de usuario para crear tu primer perfil.",
    "secTitle": "Seguridad y privacidad: el corazón de la app",
    "secLead": "No nos limitamos a decir «está cifrado». Esto es, en concreto, lo que protege tus conversaciones.",
    "security": [
      [
        "🔄",
        "Una clave nueva para cada mensaje",
        "Cada mensaje tiene una clave de un solo uso (forward secrecy) que se elimina tras leerlo. Si alguien obtuviera tus claves, no podría descifrar los mensajes pasados."
      ],
      [
        "🗝️",
        "Caja fuerte cifrada con tu contraseña",
        "Las claves privadas y los mensajes leídos se cifran en el dispositivo (PBKDF2 + AES-GCM) con tu contraseña: sin ella son ilegibles."
      ],
      [
        "🔍",
        "Verificación de claves y alerta anti-intercepción",
        "Compara de viva voz el número de seguridad con tu contacto. Si su clave cambia, la app te avisa y bloquea el envío hasta que confirmes."
      ],
      [
        "🙈",
        "Un servidor ciego",
        "El servidor solo guarda texto cifrado. El correo y el usuario se cifran en reposo en la base de datos; de las contraseñas solo se guarda un hash (scrypt)."
      ],
      [
        "🛡️",
        "Defensa contra ataques de acceso",
        "Intentos limitados por IP y por usuario, sesiones revocables y cierre de las demás sesiones al cambiar la contraseña."
      ],
      [
        "🫆",
        "Biometría que no sale de tu dispositivo",
        "Con WebAuthn/FIDO2 el servidor solo recibe la clave pública de la passkey: el dato biométrico nunca sale del móvil u ordenador."
      ]
    ]
  },
  "manual": {
    "title": "Manual de usuario — Mensajería Privada",
    "description": "Guía completa: registro, acceso con usuario y contraseña, chats ocultos, cifrado de extremo a extremo, desbloqueo biométrico e idiomas disponibles.",
    "h1": "Manual de usuario",
    "lead": "Guía completa de Mensajería Privada: cómo registrarte, acceder, usar las funciones de privacidad y entender qué protege realmente este prototipo, y qué no.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Registro y primer acceso",
        "blocks": [
          [
            "p",
            "En la pantalla inicial, toca \"Regístrate\" e introduce tu correo y un nombre de usuario. No hace falta ningún número de teléfono."
          ],
          [
            "p",
            "Tras el registro verás una sola vez tres datos que debes guardar enseguida en un lugar seguro (por ejemplo, un gestor de contraseñas):"
          ],
          [
            "ul",
            [
              "<strong>Usuario y contraseña</strong>: el usuario es el primer campo y la contraseña decide qué perfil se abre. Con el mismo usuario puedes tener varios perfiles, cada uno con su contraseña.",
              "<strong>ID público</strong>: es lo que compartes con las personas a las que quieres añadir como contactos. No revela tu correo.",
              "<strong>Combinación secreta</strong>: sirve para mostrar los chats ocultos (consulta la sección correspondiente)."
            ]
          ],
          [
            "warn",
            "Si pierdes la contraseña puedes restablecerla por correo, pero solo si el correo del perfil está verificado. Sin contraseña y sin correo verificado el perfil no se puede recuperar."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Perfiles múltiples en el mismo dispositivo",
        "blocks": [
          [
            "p",
            "Puedes crear varios perfiles (por ejemplo uno personal y uno de cobertura) con el mismo usuario pero distinta contraseña. Al introducir usuario y contraseña se abre el perfil correspondiente, sin pantalla de selección que revele cuántos perfiles existen. No puedes usar la misma contraseña para dos perfiles con el mismo usuario."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Añadir contactos y chatear",
        "blocks": [
          [
            "p",
            "Toca \"+ Añadir contacto\" e introduce el ID público de la persona. Se abre un chat en tiempo real, cifrado de extremo a extremo (consulta la sección 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Chats ocultos y combinación secreta",
        "blocks": [
          [
            "p",
            "Desde un chat abre el menú y elige \"Ocultar/mostrar este chat\". Un chat oculto deja de aparecer en la lista principal."
          ],
          [
            "p",
            "Para que vuelva a aparecer, escribe tu combinación secreta (la que se mostró una sola vez al registrarte) en el buscador: todos los chats ocultos serán visibles de nuevo hasta que vuelvas a bloquear la app."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Perfil de cobertura",
        "blocks": [
          [
            "p",
            "Al registrarte puedes marcar \"Crear como perfil de cobertura\": es un perfil pensado para mostrarse en caso de control, sin pistas sobre la existencia de otros perfiles en el mismo dispositivo."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Mensajes temporales (autodestrucción)",
        "blocks": [
          [
            "p",
            "Antes de enviar un mensaje, puedes elegir en el menú desplegable un tiempo de autodestrucción: 30 segundos, 5 minutos o 1 hora. Pasado ese tiempo, el mensaje se elimina."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. Cifrado de extremo a extremo: cómo funciona de verdad",
        "blocks": [
          [
            "p",
            "No es un eslogan de marketing: cada mensaje se cifra <strong>en tu navegador</strong>, antes de enviarse al servidor, con este esquema:"
          ],
          [
            "ol",
            [
              "En el primer acceso tu dispositivo genera un par de claves ECDH (curva P-256): la pública va al servidor, la privada se queda en el dispositivo, cifrada con tu contraseña. También prepara un lote de claves públicas de un solo uso («prekeys»).",
              "Para cada mensaje, tu navegador genera una clave temporal y toma del servidor UNA prekey de un solo uso del contacto. Combina tres intercambios ECDH (tu identidad, la clave temporal, la prekey) y deriva con HKDF-SHA256 una clave AES-GCM de 256 bits válida solo para ese mensaje.",
              "El mensaje se cifra con esa clave y un IV aleatorio; la cabecera está autenticada, así que no puede alterarse. El servidor solo recibe texto cifrado.",
              "El destinatario reconstruye la misma clave, lee el mensaje y elimina de inmediato la prekey privada: desde ese momento nadie puede descifrarlo, ni siquiera con tus claves de largo plazo."
            ]
          ],
          [
            "p",
            "Es el mismo tipo de matemáticas (ECDH + AES-GCM) que usan muchos protocolos seguros modernos, aplicado aquí mediante la Web Crypto API nativa del navegador, sin librerías externas."
          ],
          [
            "h3",
            "Forward secrecy: los mensajes pasados siguen a salvo"
          ],
          [
            "p",
            "Aunque alguien obtuviera tus claves de largo plazo (por ejemplo robando tu dispositivo), no podría descifrar los mensajes ya recibidos, porque sus claves fueron eliminadas. El texto que ya leíste solo queda en la caché local cifrada de tu dispositivo."
          ],
          [
            "h3",
            "La caja fuerte de claves"
          ],
          [
            "p",
            "Las claves privadas, las prekeys y la caché de mensajes se guardan en el navegador solo cifradas (AES-GCM), con una clave derivada de tu contraseña mediante PBKDF2-SHA256 (310.000 iteraciones). Si entras con biometría, se te pide la contraseña una vez para abrir la caja fuerte. Al cambiar la contraseña, la caja se vuelve a cifrar."
          ],
          [
            "h3",
            "Comprueba que es realmente él: número de seguridad"
          ],
          [
            "p",
            "En el chat toca el icono 🔑: verás un número de 60 cifras, igual para ambos. Compáralo con tu contacto en persona o de viva voz: si coincide, nadie se interpone. Si la clave de un contacto cambia (nuevo dispositivo o posible intercepción), aparece un aviso y el envío queda bloqueado hasta que elijas «Aceptar nueva clave»."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Desbloqueo biométrico (Face ID / Touch ID / huella)",
        "blocks": [
          [
            "p",
            "En los ajustes del perfil (icono ⚙️) encontrarás \"Activar desbloqueo con Face ID / huella\". Al activarlo, tu dispositivo crea una passkey mediante WebAuthn/FIDO2 y la registra en el servidor (solo la clave pública, nunca el dato biométrico)."
          ],
          [
            "p",
            "Desde entonces, la pantalla de acceso mostrará un botón \"Desbloquear con biometría\": úsalo en lugar de la contraseña, y tu sistema operativo (no la app) verifica Face ID, Touch ID, la huella de Android o Windows Hello. El dato biométrico nunca sale de tu dispositivo."
          ],
          [
            "p",
            "Puedes desactivarlo en cualquier momento desde los mismos ajustes."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Cambiar de idioma",
        "blocks": [
          [
            "p",
            "En la esquina superior de cada pantalla de la app encontrarás un selector de idioma. Este sitio web también está disponible en los mismos 11 idiomas: italiano, inglés, español, francés, alemán, portugués, árabe, chino, hindi, ruso y japonés. El idioma elegido en la app se recuerda en el dispositivo."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. Apps móviles nativas (iOS/Android)",
        "blocks": [
          [
            "p",
            "Hay una base lista para una app nativa (basada en Expo/React Native) que añade un bloqueo biométrico del sistema al abrir. Publicarla de verdad en App Store y Google Play requiere las credenciales de las cuentas de desarrollador (Apple Developer Program y Google Play Console): una vez conectadas, se podrá generar y publicar la app. Hasta entonces, la aplicación web se puede usar desde cualquier navegador móvil y \"instalar\" en la pantalla de inicio como si fuera una app."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Límites de seguridad declarados",
        "blocks": [
          [
            "p",
            "Por honestidad, estos son los límites que quedan, aunque el cifrado sea real y no solo declarado:"
          ],
          [
            "ul",
            [
              "<strong>Prekeys agotadas</strong>: si un contacto está mucho tiempo sin conexión y se queda sin claves de un solo uso, el mensaje usa igualmente una clave nueva pero sin eliminación única, con una forward secrecy más débil.",
              "<strong>Mensajes ligados a este dispositivo</strong>: por diseño, el historial descifrado no se traslada. En un dispositivo nuevo o tras recuperar la contraseña por correo, la caja fuerte anterior no se recupera: empiezas con una identidad nueva y los contactos ven el aviso de cambio de clave.",
              "<strong>La caja fuerte vale lo que vale la contraseña</strong>: elige una larga y única. Quien tenga tu dispositivo ya desbloqueado con la app abierta puede leer los chats, como en cualquier app.",
              "<strong>Metadatos visibles para el servidor</strong>: remitente, hora, reacciones y caducidad de los mensajes temporales no están cifrados.",
              "<strong>Recuperación solo por correo</strong>: si pierdes la contraseña y el acceso al correo verificado, el perfil no se recupera. Si usas varios perfiles (por ejemplo uno de cobertura), usa correos distintos: un enlace de recuperación revela a quien controla el correo que el perfil existe."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Solución de problemas",
        "blocks": [
          [
            "h3",
            "\"No puedo cifrar: el contacto aún no tiene clave pública\""
          ],
          [
            "p",
            "Ocurre si tu contacto no ha iniciado sesión desde la última actualización de la app (la clave se genera y se sube automáticamente al iniciar sesión). Pídele que acceda una vez: después podrás escribirle con normalidad."
          ],
          [
            "h3",
            "\"He perdido la contraseña\""
          ],
          [
            "p",
            "Usa «¿Olvidaste la contraseña?» en la pantalla de acceso e indica correo y usuario: si el correo del perfil está verificado recibes un enlace válido 1 hora. Si no estaba verificado, el perfil no es recuperable y hay que crearlo de nuevo. Guarda siempre la contraseña en un gestor de contraseñas."
          ],
          [
            "h3",
            "No aparece el desbloqueo biométrico"
          ],
          [
            "p",
            "Requiere un dispositivo con Face ID, Touch ID, huella o Windows Hello configurado, un navegador actualizado y una conexión HTTPS (la aplicación web en producción ya la usa). Además, debe haberse activado al menos una vez desde los ajustes."
          ],
          [
            "h3",
            "«Mensaje ya no legible»"
          ],
          [
            "p",
            "Por seguridad, la clave de cada mensaje se elimina en cuanto lo lees: el texto solo queda en la caché cifrada de este dispositivo. Si cambias de dispositivo, borras los datos del navegador o restableces la contraseña por correo, los mensajes anteriores no se pueden recuperar. Es el precio de la forward secrecy."
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Política de privacidad — Mensajería Privada",
    "description": "Información sobre la privacidad del prototipo Mensajería Privada: qué datos se tratan y cómo.",
    "h1": "Política de privacidad",
    "sections": [
      [
        "Quién trata los datos",
        [
          "Este sitio y el prototipo vinculado son un proyecto de demostración personal. Para cualquier solicitud relativa a los datos puedes escribir a través de <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."
        ]
      ],
      [
        "Datos recogidos por el sitio de presentación",
        [
          "Este sitio no utiliza herramientas de analítica ni de seguimiento de terceros. Solo se guardan las preferencias de cookies que elijas (consulta la Política de cookies), de forma local en tu navegador."
        ]
      ],
      [
        "Datos recogidos por el prototipo (/app)",
        [
          "Para usar el prototipo de mensajería creas un perfil con correo, usuario y contraseña. En el servidor (base de datos PostgreSQL) se guardan: correo (cifrado), usuario, hash de la contraseña, ID público, combinación de chats ocultos, contactos añadidos, tu clave pública de cifrado, las sesiones activas y los mensajes enviados.",
          "<strong>Mensajes:</strong> el contenido se cifra de extremo a extremo en el navegador antes de enviarse; el servidor conserva solo texto cifrado y no puede leerlo. Los metadatos (remitente, hora, reacciones, caducidad de los mensajes temporales) permanecen sin cifrar.",
          "<strong>Desbloqueo biométrico:</strong> si lo activas, en el servidor solo se guarda la clave pública de la passkey (WebAuthn). Los datos biométricos nunca salen de tu dispositivo.",
          "<strong>Importante:</strong> es un prototipo de demostración y el servicio no tiene los estándares de un producto en producción. El correo y el usuario se cifran en reposo en la base de datos (AES-256-GCM); el correo solo sirve para verificación y recuperación. Las contraseñas no se guardan en claro (solo un hash con sal, scrypt) y los intentos fallidos se limitan por IP y por usuario. No introduzcas información real sensible: usa datos de prueba.",
          "<strong>Claves de cifrado:</strong> las claves privadas nunca salen de tu dispositivo y se guardan cifradas con tu contraseña (PBKDF2 + AES-GCM), igual que la caché local de mensajes ya leídos. El servidor guarda solo tu clave pública y un lote de claves públicas de un solo uso, que elimina en cada entrega."
        ]
      ],
      [
        "Finalidad del tratamiento",
        [
          "Los datos sirven exclusivamente para que funcione la demo (autenticación, mensajería, contactos). No se ceden a terceros ni se usan para perfilado publicitario."
        ]
      ],
      [
        "Conservación",
        [
          "Los datos se conservan en una base de datos persistente hasta que borres el perfil; durante actualizaciones o reinicios de la demo pueden borrarse sin previo aviso."
        ]
      ],
      [
        "Tus derechos",
        [
          "Puedes solicitar en cualquier momento la eliminación de los datos introducidos en el prototipo escribiendo a través de los contactos indicados arriba."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Política de cookies — Mensajería Privada",
    "description": "Información sobre las cookies que usa el sitio de presentación del prototipo Mensajería Privada.",
    "h1": "Política de cookies",
    "sections": [
      [
        "Qué son las cookies",
        [
          "Las cookies son pequeños archivos que el navegador guarda mientras visitas un sitio. Este sitio no usa cookies de seguimiento de terceros."
        ]
      ],
      [
        "Cookies técnicas",
        [
          "Usamos una única preferencia técnica (guardada en el localStorage del navegador, no como cookie HTTP) para recordar tu elección en el banner de cookies. Sin ella, el banner volvería a aparecer en cada visita. Además, la app (/app) guarda localmente el idioma elegido y tus claves de cifrado, imprescindibles para su funcionamiento."
        ]
      ],
      [
        "Cookies estadísticas",
        [
          "Por el momento este sitio no utiliza herramientas de análisis estadístico. La categoría \"estadísticas\" del banner está preparada para un posible uso futuro: si se activan herramientas como Google Analytics, el script solo se iniciará tras un consentimiento explícito."
        ]
      ],
      [
        "Cookies de marketing",
        [
          "No utilizamos cookies ni píxeles de marketing o publicitarios."
        ]
      ],
      [
        "Cómo gestionar las preferencias",
        [
          "Puedes borrar la preferencia guardada eliminando los datos de navegación de tu navegador para este sitio: en el siguiente acceso el banner volverá a aparecer."
        ]
      ]
    ]
  }
};
