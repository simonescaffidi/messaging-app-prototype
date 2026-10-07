// Dizionario del sito (es). Struttura identica a it.js.
module.exports = {
  "code": "es",
  "dir": "ltr",
  "brand": "Securmy",
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
    },
    "terms": "Términos de servicio",
    "owner": "Titular"
  },
  "landing": {
    "title": "Securmy — Mensajería privada, caja fuerte de archivos y envío P2P cifrado",
    "description": "Chat con cifrado de extremo a extremo real, caja fuerte de archivos, contraseñas y notas cifradas, envío P2P por enlace, llamadas cifradas y verificación en dos pasos. 11 idiomas.",
    "ogTitle": "Securmy — Seguridad, privacidad y confidencialidad",
    "ogDesc": "Mensajes, archivos, contraseñas y llamadas protegidos con cifrado de extremo a extremo: todo cifrado en tu dispositivo, en 11 idiomas.",
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
    ],
    "suiteTitle": "Más que un chat: tu caja fuerte digital",
    "suiteLead": "Securmy va más allá de la mensajería. Todo lo que guardas o compartes se cifra en tu dispositivo, con la misma caja fuerte que protege tus chats.",
    "suite": [
      [
        "🗄️",
        "Caja fuerte de archivos",
        "Oculta y protege documentos, fotos y archivos: cifrados en tu dispositivo con AES-256 y abiertos solo con tu contraseña o biometría."
      ],
      [
        "🔗",
        "Envío P2P por enlace",
        "El archivo pasa directamente de un dispositivo a otro, cifrado, sin guardarse en el servidor. Enlace de un solo uso con caducidad."
      ],
      [
        "🧼",
        "Limpieza de metadatos",
        "Elimina la ubicación GPS, el modelo de cámara y otros datos ocultos de las fotos antes de compartirlas."
      ],
      [
        "🔑",
        "Gestor de contraseñas",
        "Guarda credenciales en la caja fuerte, genera contraseñas robustas y cópialas: el portapapeles se vacía a los 20 segundos."
      ],
      [
        "📝",
        "Notas cifradas",
        "Notas privadas cifradas en tu dispositivo, nunca enviadas a ningún servidor."
      ],
      [
        "👁️",
        "Mensajes de una sola vista",
        "El destinatario los abre una vez: a los pocos segundos se borran del servidor y de su dispositivo."
      ],
      [
        "📞",
        "Llamadas de voz y vídeo cifradas",
        "Directamente entre los dos dispositivos (DTLS-SRTP), con un código de verificación para comparar de viva voz frente a escuchas."
      ],
      [
        "🔢",
        "Verificación en dos pasos",
        "Códigos TOTP con cualquier app de autenticación: aunque alguien descubra tu contraseña, no entra."
      ],
      [
        "💾",
        "Copia de seguridad cifrada",
        "Exporta archivos, notas y contraseñas en un único archivo cifrado con una frase secreta que solo tú conoces."
      ],
      [
        "🚨",
        "Revisión de seguridad y borrado de emergencia",
        "Una puntuación te dice qué mejorar; en caso de peligro, un toque borra del dispositivo claves, archivos y contraseñas."
      ],
      [
        "☁️",
        "Sincronización cifrada (de pago)",
        "Sincroniza la caja fuerte entre tus dispositivos con paquetes de espacio (5, 25 o 100 GB al mes). El servidor solo guarda datos ya cifrados: la clave permanece en tus dispositivos. Sin plan, todo queda en local."
      ],
      [
        "🛰️",
        "Protección de IP con relay",
        "Con un relay cifrado (TURN) puedes ocultar tu dirección IP en llamadas y envíos P2P, y hacer que funcionen incluso en redes muy restrictivas."
      ]
    ],
    "roadmapTitle": "Próximamente",
    "roadmapLead": "Lo que estamos planificando. Aún no está disponible y no debe entenderse como una fecha prometida.",
    "roadmap": [
      [
        "🧅",
        "Red Tor",
        "El servicio puede exponerse como dirección .onion: los archivos de instalación están listos (autoalojamiento) y se activan bajo petición. Tor Browser desactiva WebRTC, así que los envíos P2P y las llamadas no funcionan por Tor; mensajes, caja fuerte y sync sí."
      ],
      [
        "📱",
        "Apps para iOS y Android",
        "Apps nativas con desbloqueo biométrico, publicadas en las tiendas con las mismas garantías de seguridad y privacidad que el sitio."
      ]
    ]
  },
  "manual": {
    "title": "Manual de usuario — Securmy",
    "description": "Guía completa: registro, acceso con usuario y contraseña, chats ocultos, cifrado de extremo a extremo, desbloqueo biométrico e idiomas disponibles.",
    "h1": "Manual de usuario",
    "lead": "Guía completa de Securmy: cómo registrarte, acceder, usar las funciones de privacidad y entender qué protege realmente este prototipo, y qué no.",
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
      },
      {
        "id": "suite",
        "h": "13. Caja fuerte y herramientas de Securmy",
        "blocks": [
          [
            "p",
            "Abre la Caja fuerte desde el botón 🛡️ de la barra lateral. Todo lo que contiene se cifra en tu dispositivo con AES-256-GCM, con una clave guardada en tu caja fuerte y protegida por tu contraseña: el servidor nunca recibe archivos, notas ni contraseñas."
          ],
          [
            "h3",
            "Caja fuerte de archivos"
          ],
          [
            "p",
            "Añade archivos (hasta 100 MB cada uno) desde la pestaña Archivos. Si la casilla está marcada, las fotos se limpian de metadatos antes de guardarse. Puedes descargar, enviar por P2P o eliminar cada archivo."
          ],
          [
            "h3",
            "Envío P2P por enlace"
          ],
          [
            "p",
            "Elige un archivo y un tiempo de caducidad (10 minutos o 1 hora): obtienes un enlace de un solo uso. El archivo viaja directo al destinatario, cifrado con una clave que está solo después del símbolo # del enlace y nunca llega al servidor. Mantén la página abierta hasta que termine la transferencia."
          ],
          [
            "h3",
            "Limpiar fotos"
          ],
          [
            "p",
            "Redibuja la imagen eliminando EXIF, ubicación GPS y miniaturas. Funciona con JPEG, PNG y WebP; para otros formatos la limpieza automática no está disponible."
          ],
          [
            "h3",
            "Notas y contraseñas"
          ],
          [
            "p",
            "Las notas y credenciales permanecen cifradas en la caja fuerte. El generador crea contraseñas aleatorias; al copiar una contraseña, el portapapeles se vacía a los 20 segundos."
          ],
          [
            "h3",
            "Mensajes de una sola vista"
          ],
          [
            "p",
            "Elige «Ver una vez» junto al campo del mensaje. El destinatario toca para ver: el texto permanece visible 10 segundos y luego se destruye en su dispositivo y en el servidor. No impide que quien lee fotografíe la pantalla."
          ],
          [
            "h3",
            "Llamadas de voz y vídeo"
          ],
          [
            "p",
            "Usa los botones 📞 y 🎥 en la cabecera del chat. Audio y vídeo viajan directamente entre los dispositivos, cifrados. Ambos ven un código de 4 cifras: compáralo de viva voz; si coincide, la llamada no ha sido interceptada."
          ],
          [
            "h3",
            "Verificación en dos pasos"
          ],
          [
            "p",
            "En Seguridad puedes activar los códigos TOTP con una app de autenticación (Google Authenticator, Aegis, 1Password…). Una vez activados, para entrar con la contraseña también hace falta el código de 6 cifras. El desbloqueo biométrico sigue siendo un método de acceso aparte."
          ],
          [
            "h3",
            "Copia de seguridad y borrado de emergencia"
          ],
          [
            "p",
            "La copia contiene archivos, notas y contraseñas cifrados con una frase secreta de al menos 10 caracteres que eliges tú: sin ella no se puede recuperar. Los mensajes no se incluyen. El borrado de emergencia elimina del dispositivo claves, caché de mensajes, archivos, notas y contraseñas y no se puede deshacer."
          ],
          [
            "h3",
            "Límites que conviene conocer"
          ],
          [
            "ul",
            [
              "La sincronización entre dispositivos es opcional y de pago (paquetes de espacio): los datos siguen cifrados en tu dispositivo y el servidor no tiene la clave. Sin plan, la caja fuerte es solo local; la copia de seguridad sigue sirviendo para moverla.",
              "Para ocultar tu IP en envíos P2P y llamadas activa Seguridad → Protección de IP (relay cifrado), donde el servicio tenga un servidor TURN. Sin relay la otra persona puede ver tu IP y en redes muy restrictivas la conexión puede fallar.",
              "El gestor de contraseñas es básico: no rellena formularios por sí solo y no sustituye a un gestor dedicado para uso profesional.",
              "Si pierdes la contraseña y la frase de la copia, los datos cifrados no se pueden recuperar: nadie, ni siquiera nosotros, puede abrirlos."
            ]
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Política de privacidad — Securmy",
    "description": "Información sobre la privacidad del prototipo Securmy: qué datos se tratan y cómo.",
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
      ],
      [
        "Funciones de Securmy: caja fuerte, envíos P2P y llamadas",
        [
          "Los archivos, notas, contraseñas y copias de la caja fuerte permanecen en tu dispositivo, cifrados con una clave que nunca sale de él: no los recibimos y no podemos leerlos ni recuperarlos.",
          "Sincronización (solo con plan de pago): el servidor guarda archivos, notas y contraseñas ya cifrados en tu dispositivo, sin la clave para abrirlos, hasta que tú o tu cuenta los eliminéis. Para los pagos usamos Stripe: no vemos ni guardamos los datos de tu tarjeta.",
          "En los envíos P2P y las llamadas el contenido viaja directamente entre dispositivos, cifrado. El servidor solo trata la información de conexión (SDP y candidatos ICE), conservada en memoria como máximo una hora y luego eliminada; el otro participante y un servidor STUN público pueden ver tu dirección IP.",
          "Si activas la verificación en dos pasos conservamos el secreto TOTP, cifrado en reposo; los mensajes de una sola vista se eliminan del servidor pocos segundos después de abrirse."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Política de cookies — Securmy",
    "description": "Información sobre las cookies que usa el sitio de presentación del prototipo Securmy.",
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
  },
  "terms": {
    "title": "Términos de servicio y licencia — Securmy",
    "description": "Términos de servicio y licencia de uso de la app y el sitio Securmy.",
    "h1": "Términos de servicio y licencia de uso",
    "sections": [
      [
        "1. Objeto y titular",
        [
          "Estos Términos regulan el uso de la app y el sitio «Securmy» (el «Servicio»). Al registrarte o usar el Servicio los aceptas. Si no estás de acuerdo, no lo uses."
        ]
      ],
      [
        "2. Naturaleza del Servicio",
        [
          "El Servicio es un prototipo funcional ofrecido «tal cual». Puede cambiar, interrumpirse o reiniciarse sin aviso. Usa datos de prueba y no le confíes conversaciones de riesgo extremo ni información imprescindible."
        ]
      ],
      [
        "3. Cuenta y seguridad",
        [
          "Debes tener al menos 14 años. Eres responsable de tu contraseña y tu dispositivo. Las claves de cifrado solo están en tu dispositivo, cifradas con tu contraseña: si la pierdes o la restableces, el historial local no se puede recuperar y no podemos restaurarlo."
        ]
      ],
      [
        "4. Uso permitido",
        [
          "Está prohibido usar el Servicio para actividades ilícitas, acoso, amenazas, spam, estafas, difusión de malware, contenido que explote a menores o vulnere derechos ajenos, o para intentar vulnerar, sobrecargar o eludir las medidas de seguridad."
        ]
      ],
      [
        "5. Denuncias y suspensión",
        [
          "Puedes bloquear y denunciar a cualquier contacto. Los mensajes están cifrados de extremo a extremo y el Titular no puede leerlos: las denuncias se basan en lo que indique el usuario y en los datos técnicos disponibles. El Titular puede suspender o eliminar cuentas que infrinjan estos Términos o la ley y colaborar con las autoridades cuando proceda."
        ]
      ],
      [
        "6. Licencia de uso",
        [
          "Se te concede una licencia personal, no exclusiva, intransferible y revocable para usar la app y el sitio con fines lícitos. El software, gráficos, marcas y textos siguen siendo del Titular. No puedes copiar, vender, descompilar ni crear obras derivadas, salvo en lo que la ley imperativa permita."
        ]
      ],
      [
        "7. Garantías y responsabilidad",
        [
          "En la medida permitida por la ley, el Servicio se ofrece sin garantía de continuidad, ausencia de errores o idoneidad para un fin concreto, y el Titular no responde de daños indirectos ni pérdida de datos. Se mantienen los derechos de los consumidores y las responsabilidades que no pueden excluirse."
        ]
      ],
      [
        "8. Eliminación de la cuenta y datos",
        [
          "Puedes eliminar tu cuenta en cualquier momento desde Ajustes: perfil, contactos y chats se borran definitivamente. El tratamiento de datos se describe en la Política de privacidad."
        ]
      ],
      [
        "9. Ley aplicable y cambios",
        [
          "Estos Términos se rigen por la ley italiana; los consumidores conservan las protecciones y el fuero que les reconocen el Código de Consumo italiano y las normas imperativas de la UE. Podemos actualizar estos Términos: los cambios relevantes se comunicarán en el Servicio. Contacto: info@simonescaffidi.it."
        ]
      ],
      [
        "10. Compartir archivos y llamadas",
        [
          "Eres responsable de los archivos que compartes y de las llamadas que haces. Está prohibido compartir contenido ilegal o vulnerar derechos ajenos. Como el contenido está cifrado de extremo a extremo no podemos verlo, pero podemos suspender cuentas objeto de denuncias fundadas. Las funciones se ofrecen «tal cual» y pueden cambiar o suspenderse."
        ]
      ]
    ]
  }
};
