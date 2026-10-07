module.exports = {
  code: "es",
  dir: "ltr",
  brand: "Mensajería Privada",
  ui: {
    openApp: "Abrir la app",
    manual: "Manual",
    langAria: "Idioma",
    legalAria: "Legal",
    privacy: "Política de privacidad",
    cookie: "Política de cookies",
    langsLabel: "Todos los idiomas",
    updated: "Última actualización: octubre de 2026.",
    tocTitle: "Índice",
    cookieBanner: {
      text: 'Usamos cookies técnicas necesarias y, con tu consentimiento, cookies estadísticas. Consulta la <a href="{privacyUrl}">Política de privacidad</a> y la <a href="{cookieUrl}">Política de cookies</a>.',
      reject: "Rechazar",
      customize: "Personalizar",
      accept: "Aceptar todas",
      statsQuestion: "¿Quieres aceptar las cookies estadísticas?"
    }
  },
  landing: {
    title: "Mensajería Privada — Chat con perfiles múltiples y chats ocultos",
    description: "Chat privado con cifrado de extremo a extremo real, desbloqueo biométrico, perfiles múltiples y chats ocultos. 11 idiomas, sin número de teléfono.",
    ogTitle: "Mensajería Privada — Prototipo",
    ogDesc: "Cifrado de extremo a extremo, desbloqueo biométrico, perfiles múltiples, chats ocultos y perfil de cobertura en 11 idiomas.",
    badge: "Prototipo funcional",
    h1: "Un chat donde la contraseña elige tu perfil",
    lead: "Sin número de teléfono. Escribe tu usuario y contraseña: la contraseña decide qué perfil se abre. Chats ocultos, perfil de cobertura, mensajes que se autodestruyen.",
    ctaOpen: "Abrir la app →",
    ctaHow: "Descubre cómo funciona",
    featuresTitle: "Qué puedes hacer",
    features: [
      ["🔑", "Acceso con usuario y contraseña", "Primero el usuario, luego la contraseña: mismo usuario, otra contraseña, otro perfil. Sin pantalla de selección."],
      ["🪪", "Perfiles múltiples", "Varios perfiles en el mismo dispositivo, cada uno con contactos, chats y ajustes independientes."],
      ["🙈", "Chats ocultos", "Oculta una conversación de la lista principal. Solo vuelve a verse al escribir una combinación secreta en el buscador."],
      ["🎭", "Perfil de cobertura", "Crea un perfil inofensivo para mostrar en caso de control, sin pistas sobre la existencia de otros perfiles."],
      ["💣", "Mensajes temporales", "Envía mensajes que se autodestruyen a los 30 segundos, 5 minutos o una hora."],
      ["📵", "Sin número de teléfono", "Registro con correo electrónico y un ID público distinto de tu dirección: tu correo nunca es visible para los demás."],
      ["🔐", "Cifrado de extremo a extremo real", "Cada mensaje se cifra en el navegador con ECDH (P-256) + AES-GCM de 256 bits antes de salir: el servidor solo ve texto cifrado, nunca el contenido en claro."],
      ["🫆", "Desbloqueo biométrico", "Face ID, Touch ID, huella de Android o Windows Hello mediante WebAuthn/FIDO2 real: ningún dato biométrico sale nunca del dispositivo."],
      ["🌍", "11 idiomas", "App y sitio web disponibles en italiano, inglés, español, francés, alemán, portugués, árabe, chino, hindi, ruso y japonés."]
    ],
    howTitle: "Cómo funciona",
    steps: [
      ["Regístrate", "Correo, usuario y contraseña: recibes un ID público y una combinación secreta. Guárdalos: no se vuelven a mostrar."],
      ["Inicia sesión con usuario y contraseña", "Cada vez que abres la app, introduce usuario y contraseña: el perfil correspondiente se abre automáticamente."],
      ["Añade contactos", "Busca a una persona por su ID público y empieza a escribir en tiempo real."],
      ["Oculta lo que quieras", "Escribe la combinación secreta en el buscador para mostrar los chats ocultos cuando lo necesites."]
    ],
    disclaimerTitle: "Qué es y qué no es",
    disclaimerHtml: "<strong>Esto es un prototipo funcional</strong>, no un producto terminado. Los mensajes están cifrados de extremo a extremo (ECDH P-256 + AES-GCM de 256 bits, derivación HKDF-SHA256): el servidor nunca ve el texto en claro. El desbloqueo biométrico usa WebAuthn/FIDO2 real. Quedan límites conocidos, explicados sin rodeos en el <a href=\"{manualUrl}\">manual de usuario</a>: aún no hay un ratchet con forward secrecy \"al estilo Signal\", no hay verificación fuera de banda de las claves públicas (en teoría un servidor malicioso podría sustituirlas), la clave privada permanece en el navegador sin un enclave seguro de hardware y la recuperación de contraseña por correo solo funciona con un correo verificado. Útil para probar la experiencia con seguridad real pero no \"a prueba de Estado\", todavía no para conversaciones de riesgo muy alto.",
    nativeTitle: "Apps nativas para iOS y Android",
    nativeText: "La base de la app nativa (Expo/React Native, con bloqueo biométrico del sistema) está lista en el código del proyecto. Publicarla en App Store y Google Play requiere las credenciales de las cuentas de desarrollador (Apple Developer Program y Google Play Console): hasta que se conecten, la app sigue disponible como aplicación web, utilizable desde cualquier navegador móvil e instalable como app con \"Añadir a pantalla de inicio\".",
    ctaTitle: "Prueba el prototipo",
    ctaText: "Solo necesitas un correo y un nombre de usuario para crear tu primer perfil."
  },
  manual: {
    title: "Manual de usuario — Mensajería Privada",
    description: "Guía completa: registro, acceso con usuario y contraseña, chats ocultos, cifrado de extremo a extremo, desbloqueo biométrico e idiomas disponibles.",
    h1: "Manual de usuario",
    lead: "Guía completa de Mensajería Privada: cómo registrarte, acceder, usar las funciones de privacidad y entender qué protege realmente este prototipo, y qué no.",
    sections: [
      { id: "signup", h: "1. Registro y primer acceso", blocks: [
        ["p", "En la pantalla inicial, toca \"Regístrate\" e introduce tu correo y un nombre de usuario. No hace falta ningún número de teléfono."],
        ["p", "Tras el registro verás una sola vez tres datos que debes guardar enseguida en un lugar seguro (por ejemplo, un gestor de contraseñas):"],
        ["ul", [
          "<strong>Usuario y contraseña</strong>: el usuario es el primer campo y la contraseña decide qué perfil se abre. Con el mismo usuario puedes tener varios perfiles, cada uno con su contraseña.",
          "<strong>ID público</strong>: es lo que compartes con las personas a las que quieres añadir como contactos. No revela tu correo.",
          "<strong>Combinación secreta</strong>: sirve para mostrar los chats ocultos (consulta la sección correspondiente)."
        ]],
        ["warn", "Si pierdes la contraseña puedes restablecerla por correo, pero solo si el correo del perfil está verificado. Sin contraseña y sin correo verificado el perfil no se puede recuperar."]
      ]},
      { id: "profiles", h: "2. Perfiles múltiples en el mismo dispositivo", blocks: [
        ["p", "Puedes crear varios perfiles (por ejemplo uno personal y uno de cobertura) con el mismo usuario pero distinta contraseña. Al introducir usuario y contraseña se abre el perfil correspondiente, sin pantalla de selección que revele cuántos perfiles existen. No puedes usar la misma contraseña para dos perfiles con el mismo usuario."]
      ]},
      { id: "contacts", h: "3. Añadir contactos y chatear", blocks: [
        ["p", "Toca \"+ Añadir contacto\" e introduce el ID público de la persona. Se abre un chat en tiempo real, cifrado de extremo a extremo (consulta la sección 7)."]
      ]},
      { id: "hidden", h: "4. Chats ocultos y combinación secreta", blocks: [
        ["p", "Desde un chat abre el menú y elige \"Ocultar/mostrar este chat\". Un chat oculto deja de aparecer en la lista principal."],
        ["p", "Para que vuelva a aparecer, escribe tu combinación secreta (la que se mostró una sola vez al registrarte) en el buscador: todos los chats ocultos serán visibles de nuevo hasta que vuelvas a bloquear la app."]
      ]},
      { id: "cover", h: "5. Perfil de cobertura", blocks: [
        ["p", "Al registrarte puedes marcar \"Crear como perfil de cobertura\": es un perfil pensado para mostrarse en caso de control, sin pistas sobre la existencia de otros perfiles en el mismo dispositivo."]
      ]},
      { id: "timed", h: "6. Mensajes temporales (autodestrucción)", blocks: [
        ["p", "Antes de enviar un mensaje, puedes elegir en el menú desplegable un tiempo de autodestrucción: 30 segundos, 5 minutos o 1 hora. Pasado ese tiempo, el mensaje se elimina."]
      ]},
      { id: "encryption", h: "7. Cifrado de extremo a extremo: cómo funciona de verdad", blocks: [
        ["p", "No es un eslogan de marketing: cada mensaje se cifra <strong>en tu navegador</strong>, antes de enviarse al servidor, con este esquema:"],
        ["ol", [
          "En el primer acceso, tu dispositivo genera un par de claves ECDH en la curva P-256 (una pública y una privada). La clave pública se sube al servidor; la clave privada solo permanece en tu navegador.",
          "Cuando escribes a un contacto, tu navegador combina tu clave privada con la clave pública de esa persona (intercambio ECDH) y deriva, mediante HKDF-SHA256, una clave simétrica AES-GCM de 256 bits específica para ese par de personas.",
          "Cada mensaje se cifra con esa clave y un número aleatorio (IV) distinto cada vez, y se envía al servidor ya cifrado.",
          "El servidor solo guarda y transmite texto cifrado: no puede leer el contenido de los mensajes."
        ]],
        ["p", "Es el mismo tipo de matemáticas (ECDH + AES-GCM) que usan muchos protocolos seguros modernos, aplicado aquí mediante la Web Crypto API nativa del navegador, sin librerías externas."]
      ]},
      { id: "biometric", h: "8. Desbloqueo biométrico (Face ID / Touch ID / huella)", blocks: [
        ["p", "En los ajustes del perfil (icono ⚙️) encontrarás \"Activar desbloqueo con Face ID / huella\". Al activarlo, tu dispositivo crea una passkey mediante WebAuthn/FIDO2 y la registra en el servidor (solo la clave pública, nunca el dato biométrico)."],
        ["p", "Desde entonces, la pantalla de acceso mostrará un botón \"Desbloquear con biometría\": úsalo en lugar de la contraseña, y tu sistema operativo (no la app) verifica Face ID, Touch ID, la huella de Android o Windows Hello. El dato biométrico nunca sale de tu dispositivo."],
        ["p", "Puedes desactivarlo en cualquier momento desde los mismos ajustes."]
      ]},
      { id: "languages", h: "9. Cambiar de idioma", blocks: [
        ["p", "En la esquina superior de cada pantalla de la app encontrarás un selector de idioma. Este sitio web también está disponible en los mismos 11 idiomas: italiano, inglés, español, francés, alemán, portugués, árabe, chino, hindi, ruso y japonés. El idioma elegido en la app se recuerda en el dispositivo."]
      ]},
      { id: "mobile", h: "10. Apps móviles nativas (iOS/Android)", blocks: [
        ["p", "Hay una base lista para una app nativa (basada en Expo/React Native) que añade un bloqueo biométrico del sistema al abrir. Publicarla de verdad en App Store y Google Play requiere las credenciales de las cuentas de desarrollador (Apple Developer Program y Google Play Console): una vez conectadas, se podrá generar y publicar la app. Hasta entonces, la aplicación web se puede usar desde cualquier navegador móvil y \"instalar\" en la pantalla de inicio como si fuera una app."]
      ]},
      { id: "limits", h: "11. Límites de seguridad declarados", blocks: [
        ["p", "Por honestidad, esto es lo que este prototipo <strong>todavía no</strong> hace, aunque el cifrado sea real:"],
        ["ul", [
          "<strong>Sin ratchet / forward secrecy</strong>: la clave de un chat se mantiene igual hasta que ambas personas regeneran sus claves (a diferencia de protocolos como Signal, que cambian de clave con cada mensaje).",
          "<strong>Sin verificación fuera de banda de las claves públicas</strong>: no hay un \"número de seguridad\" para comparar de viva voz con el contacto. En teoría, un servidor malicioso podría sustituir una clave pública por la suya (ataque de intermediario). En un servidor de confianza y para un prototipo es aceptable; antes de un uso de alto riesgo habría que añadir esta verificación.",
          "<strong>Clave privada en el navegador</strong>: se guarda en el almacenamiento local del navegador (localStorage), no en un enclave seguro de hardware. Quien tenga acceso físico o de software al dispositivo desbloqueado podría leerla.",
          "<strong>Recuperación solo por correo</strong>: si pierdes la contraseña y el acceso al correo verificado, el perfil no se puede recuperar. Si usas varios perfiles (por ejemplo uno de cobertura), usa correos distintos: un enlace de recuperación revela a quien controla el correo que el perfil existe."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Solución de problemas", blocks: [
        ["h3", "\"No puedo cifrar: el contacto aún no tiene clave pública\""],
        ["p", "Ocurre si tu contacto no ha iniciado sesión desde la última actualización de la app (la clave se genera y se sube automáticamente al iniciar sesión). Pídele que acceda una vez: después podrás escribirle con normalidad."],
        ["h3", "\"He perdido la contraseña\""],
        ["p", "Usa «¿Olvidaste la contraseña?» en la pantalla de acceso e indica correo y usuario: si el correo del perfil está verificado recibes un enlace válido 1 hora. Si no estaba verificado, el perfil no es recuperable y hay que crearlo de nuevo. Guarda siempre la contraseña en un gestor de contraseñas."],
        ["h3", "No aparece el desbloqueo biométrico"],
        ["p", "Requiere un dispositivo con Face ID, Touch ID, huella o Windows Hello configurado, un navegador actualizado y una conexión HTTPS (la aplicación web en producción ya la usa). Además, debe haberse activado al menos una vez desde los ajustes."]
      ]}
    ]
  },
  privacy: {
    title: "Política de privacidad — Mensajería Privada",
    description: "Información sobre la privacidad del prototipo Mensajería Privada: qué datos se tratan y cómo.",
    h1: "Política de privacidad",
    sections: [
      ["Quién trata los datos", ["Este sitio y el prototipo vinculado son un proyecto de demostración personal. Para cualquier solicitud relativa a los datos puedes escribir a través de <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."]],
      ["Datos recogidos por el sitio de presentación", ["Este sitio no utiliza herramientas de analítica ni de seguimiento de terceros. Solo se guardan las preferencias de cookies que elijas (consulta la Política de cookies), de forma local en tu navegador."]],
      ["Datos recogidos por el prototipo (/app)", [
        "Para usar el prototipo de mensajería creas un perfil con correo, usuario y contraseña. En el servidor (base de datos PostgreSQL) se guardan: correo (cifrado), usuario, hash de la contraseña, ID público, combinación de chats ocultos, contactos añadidos, tu clave pública de cifrado, las sesiones activas y los mensajes enviados.",
        "<strong>Mensajes:</strong> el contenido se cifra de extremo a extremo en el navegador antes de enviarse; el servidor conserva solo texto cifrado y no puede leerlo. Los metadatos (remitente, hora, reacciones, caducidad de los mensajes temporales) permanecen sin cifrar.",
        "<strong>Desbloqueo biométrico:</strong> si lo activas, en el servidor solo se guarda la clave pública de la passkey (WebAuthn). Los datos biométricos nunca salen de tu dispositivo. Tu clave privada de cifrado permanece en el navegador (localStorage).",
        "<strong>Importante:</strong> es un prototipo de demostración y el servicio no cumple los estándares de un producto en producción. El correo se cifra en reposo (AES-256-GCM) y se usa solo para verificación y recuperación de contraseña; el usuario queda en claro porque el acceso lo necesita. Las contraseñas no se guardan en claro (solo un hash scrypt con sal) y los intentos fallidos se limitan por dirección IP y por usuario. No introduzcas información sensible real: usa datos de prueba."
      ]],
      ["Finalidad del tratamiento", ["Los datos sirven exclusivamente para que funcione la demo (autenticación, mensajería, contactos). No se ceden a terceros ni se usan para perfilado publicitario."]],
      ["Conservación", ["Los datos se conservan en una base de datos persistente hasta que borres el perfil; durante actualizaciones o reinicios de la demo pueden borrarse sin previo aviso."]],
      ["Tus derechos", ["Puedes solicitar en cualquier momento la eliminación de los datos introducidos en el prototipo escribiendo a través de los contactos indicados arriba."]]
    ]
  },
  cookie: {
    title: "Política de cookies — Mensajería Privada",
    description: "Información sobre las cookies que usa el sitio de presentación del prototipo Mensajería Privada.",
    h1: "Política de cookies",
    sections: [
      ["Qué son las cookies", ["Las cookies son pequeños archivos que el navegador guarda mientras visitas un sitio. Este sitio no usa cookies de seguimiento de terceros."]],
      ["Cookies técnicas", ["Usamos una única preferencia técnica (guardada en el localStorage del navegador, no como cookie HTTP) para recordar tu elección en el banner de cookies. Sin ella, el banner volvería a aparecer en cada visita. Además, la app (/app) guarda localmente el idioma elegido y tus claves de cifrado, imprescindibles para su funcionamiento."]],
      ["Cookies estadísticas", ["Por el momento este sitio no utiliza herramientas de análisis estadístico. La categoría \"estadísticas\" del banner está preparada para un posible uso futuro: si se activan herramientas como Google Analytics, el script solo se iniciará tras un consentimiento explícito."]],
      ["Cookies de marketing", ["No utilizamos cookies ni píxeles de marketing o publicitarios."]],
      ["Cómo gestionar las preferencias", ["Puedes borrar la preferencia guardada eliminando los datos de navegación de tu navegador para este sitio: en el siguiente acceso el banner volverá a aparecer."]]
    ]
  }
};
