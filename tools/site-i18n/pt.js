module.exports = {
  code: "pt",
  dir: "ltr",
  brand: "Mensagens Privadas",
  ui: {
    openApp: "Abrir o app",
    manual: "Manual",
    langAria: "Idioma",
    legalAria: "Legal",
    privacy: "Política de Privacidade",
    cookie: "Política de Cookies",
    langsLabel: "Todos os idiomas",
    updated: "Última atualização: outubro de 2026.",
    tocTitle: "Índice",
    cookieBanner: {
      text: 'Usamos cookies técnicos necessários e, com o seu consentimento, cookies estatísticos. Consulte a <a href="{privacyUrl}">Política de Privacidade</a> e a <a href="{cookieUrl}">Política de Cookies</a>.',
      reject: "Recusar",
      customize: "Personalizar",
      accept: "Aceitar todos",
      statsQuestion: "Deseja aceitar os cookies estatísticos?"
    }
  },
  landing: {
    title: "Mensagens Privadas — Chat com perfis múltiplos e chats ocultos",
    description: "Chat privado com criptografia de ponta a ponta real, desbloqueio biométrico, perfis múltiplos e chats ocultos. 11 idiomas, sem número de telefone.",
    ogTitle: "Mensagens Privadas — Protótipo",
    ogDesc: "Criptografia de ponta a ponta, desbloqueio biométrico, perfis múltiplos, chats ocultos e perfil de fachada em 11 idiomas.",
    badge: "Protótipo funcional",
    h1: "Um chat onde o código é a sua identidade",
    lead: "Sem número de telefone. Um código de acesso abre o seu perfil, outro código abre um perfil diferente. Chats ocultos, perfil de fachada, mensagens que se autodestroem.",
    ctaOpen: "Abrir o app →",
    ctaHow: "Veja como funciona",
    featuresTitle: "O que você pode fazer",
    features: [
      ["🔑", "Acesso por código", "Cada código abre automaticamente o perfil associado. Sem tela de escolha: o código <em>é</em> a identidade."],
      ["🪪", "Perfis múltiplos", "Vários perfis no mesmo dispositivo, cada um com contatos, chats e configurações independentes."],
      ["🙈", "Chats ocultos", "Oculte uma conversa da lista principal. Ela só volta a aparecer ao digitar uma combinação secreta na busca."],
      ["🎭", "Perfil de fachada", "Crie um perfil inofensivo para mostrar em caso de fiscalização, sem pistas da existência de outros perfis."],
      ["💣", "Mensagens temporárias", "Envie mensagens que se autodestroem após 30 segundos, 5 minutos ou uma hora."],
      ["📵", "Sem número de telefone", "Cadastro por e-mail e ID público separado do endereço: o seu e-mail nunca fica visível para os outros."],
      ["🔐", "Criptografia de ponta a ponta real", "Cada mensagem é criptografada no navegador com ECDH (P-256) + AES-GCM de 256 bits antes de sair: o servidor só vê texto cifrado, nunca o conteúdo em claro."],
      ["🫆", "Desbloqueio biométrico", "Face ID, Touch ID, impressão digital do Android ou Windows Hello via WebAuthn/FIDO2 real: nenhum dado biométrico sai do dispositivo."],
      ["🌍", "11 idiomas", "App e site disponíveis em italiano, inglês, espanhol, francês, alemão, português, árabe, chinês, hindi, russo e japonês."]
    ],
    howTitle: "Como funciona",
    steps: [
      ["Cadastre-se", "E-mail e nome de usuário: você recebe um código de acesso, um ID público e uma combinação secreta. Guarde-os: não são mostrados novamente."],
      ["Entre com o código", "A cada abertura, digite o código: o perfil correspondente abre automaticamente."],
      ["Adicione contatos", "Procure uma pessoa pelo ID público dela e comece a conversar em tempo real."],
      ["Oculte o que quiser", "Digite a combinação secreta na barra de busca para revelar os chats ocultos quando precisar."]
    ],
    disclaimerTitle: "O que é e o que não é",
    disclaimerHtml: "<strong>Este é um protótipo funcional</strong>, não um produto acabado. As mensagens têm criptografia de ponta a ponta (ECDH P-256 + AES-GCM de 256 bits, derivação HKDF-SHA256): o servidor nunca vê o texto em claro. O desbloqueio biométrico usa WebAuthn/FIDO2 real. Permanecem limites conhecidos, explicados sem rodeios no <a href=\"{manualUrl}\">manual do usuário</a>: ainda não há um ratchet com forward secrecy \"à la Signal\", não há verificação fora de banda das chaves públicas (em teoria, um servidor malicioso poderia substituí-las), a chave privada fica no navegador sem enclave seguro de hardware e o envio real de e-mails para recuperação de conta ainda não está ligado. Útil para experimentar o uso com segurança real, mas não \"à prova de Estado\" — ainda não para conversas de altíssimo risco.",
    nativeTitle: "Apps nativos para iOS e Android",
    nativeText: "A base do app nativo (Expo/React Native, com bloqueio biométrico do sistema) está pronta no código do projeto. A publicação na App Store e no Google Play exige as credenciais das contas de desenvolvedor (Apple Developer Program e Google Play Console): até serem ligadas, o app continua disponível como aplicação web, utilizável em qualquer navegador móvel e já instalável como app em \"Adicionar à tela inicial\".",
    ctaTitle: "Experimente o protótipo",
    ctaText: "Basta um e-mail e um nome de usuário para criar o seu primeiro perfil."
  },
  manual: {
    title: "Manual do usuário — Mensagens Privadas",
    description: "Guia completo: cadastro, acesso por código, chats ocultos, criptografia de ponta a ponta, desbloqueio biométrico e idiomas disponíveis.",
    h1: "Manual do usuário",
    lead: "Guia completo de Mensagens Privadas: como se cadastrar, entrar, usar os recursos de privacidade e entender o que este protótipo realmente protege — e o que não protege.",
    sections: [
      { id: "signup", h: "1. Cadastro e primeiro acesso", blocks: [
        ["p", "Na tela inicial, toque em \"Cadastre-se\" e informe seu e-mail e um nome de usuário. Não é necessário número de telefone."],
        ["p", "Após o cadastro você verá uma única vez três informações, que deve guardar imediatamente em local seguro (um gerenciador de senhas, por exemplo):"],
        ["ul", [
          "<strong>Código de acesso</strong>: é a sua \"senha\" — a cada abertura do app você o digita e o seu perfil abre automaticamente.",
          "<strong>ID público</strong>: é o que você compartilha com as pessoas que quer adicionar como contatos. Não revela o seu e-mail.",
          "<strong>Combinação secreta</strong>: serve para revelar os chats ocultos (veja a seção dedicada)."
        ]],
        ["warn", "Se perder o código de acesso, você perde o acesso ao perfil: ainda não existe recuperação real por e-mail (veja \"Limites de segurança declarados\")."]
      ]},
      { id: "profiles", h: "2. Perfis múltiplos no mesmo dispositivo", blocks: [
        ["p", "Você pode criar vários perfis (por exemplo, um pessoal e um de fachada), todos acessíveis do mesmo dispositivo. Cada perfil tem o seu código de acesso: ao abrir o app e digitar um código, o perfil correspondente abre automaticamente, sem uma tela de escolha que revele quantos perfis existem."]
      ]},
      { id: "contacts", h: "3. Adicionar contatos e conversar", blocks: [
        ["p", "Toque em \"+ Adicionar contato\" e informe o ID público da pessoa. Abre-se um chat em tempo real, com criptografia de ponta a ponta (veja a seção 7)."]
      ]},
      { id: "hidden", h: "4. Chats ocultos e combinação secreta", blocks: [
        ["p", "Em um chat, abra o menu e escolha \"Ocultar/mostrar este chat\". Um chat oculto deixa de aparecer na lista principal."],
        ["p", "Para fazê-lo reaparecer, digite a sua combinação secreta (a mostrada uma única vez no cadastro) na barra de busca: todos os chats ocultos voltam a ficar visíveis até você bloquear o app novamente."]
      ]},
      { id: "cover", h: "5. Perfil de fachada", blocks: [
        ["p", "No cadastro você pode marcar \"Criar como perfil de fachada\": um perfil pensado para ser mostrado em caso de fiscalização, sem pistas da existência de outros perfis no mesmo dispositivo."]
      ]},
      { id: "timed", h: "6. Mensagens temporárias (autodestruição)", blocks: [
        ["p", "Antes de enviar uma mensagem, você pode escolher no menu suspenso um tempo de autodestruição: 30 segundos, 5 minutos ou 1 hora. Passado esse tempo, a mensagem é removida."]
      ]},
      { id: "encryption", h: "7. Criptografia de ponta a ponta: como funciona de verdade", blocks: [
        ["p", "Isto não é um slogan de marketing: cada mensagem é criptografada <strong>no seu navegador</strong>, antes de ser enviada ao servidor, com este esquema:"],
        ["ol", [
          "No primeiro acesso, o seu dispositivo gera um par de chaves ECDH na curva P-256 (uma pública e uma privada). A chave pública é enviada ao servidor; a chave privada permanece apenas no seu navegador.",
          "Quando você escreve a um contato, o seu navegador combina a sua chave privada com a chave pública dele (troca ECDH) e deriva, via HKDF-SHA256, uma chave simétrica AES-GCM de 256 bits específica para esse par de pessoas.",
          "Cada mensagem é criptografada com essa chave e um número aleatório (IV) diferente a cada vez, e então enviada ao servidor já cifrada.",
          "O servidor apenas guarda e transmite texto cifrado: não consegue ler o conteúdo das mensagens."
        ]],
        ["p", "É o mesmo tipo de matemática (ECDH + AES-GCM) usado por muitos protocolos seguros modernos, aplicado aqui pela Web Crypto API nativa do navegador, sem bibliotecas externas."]
      ]},
      { id: "biometric", h: "8. Desbloqueio biométrico (Face ID / Touch ID / impressão digital)", blocks: [
        ["p", "Nas configurações do perfil (ícone ⚙️) você encontra \"Ativar desbloqueio com Face ID / impressão digital\". Ao ativá-lo, o seu dispositivo cria uma passkey via WebAuthn/FIDO2 e a registra no servidor (apenas a chave pública, nunca o dado biométrico)."],
        ["p", "A partir daí, a tela de acesso mostrará um botão \"Desbloquear com biometria\": você o usa no lugar do código, e o seu sistema operacional (não o app) verifica Face ID, Touch ID, a impressão digital do Android ou o Windows Hello. O dado biométrico nunca sai do seu dispositivo."],
        ["p", "Você pode desativá-lo a qualquer momento nas mesmas configurações."]
      ]},
      { id: "languages", h: "9. Mudar de idioma", blocks: [
        ["p", "No canto superior de cada tela do app há um seletor de idioma. Este site também está disponível nos mesmos 11 idiomas: italiano, inglês, espanhol, francês, alemão, português, árabe, chinês, hindi, russo e japonês. O idioma escolhido no app fica guardado no dispositivo."]
      ]},
      { id: "mobile", h: "10. Apps móveis nativos (iOS/Android)", blocks: [
        ["p", "Há uma base pronta para um app nativo (baseada em Expo/React Native) que acrescenta um bloqueio biométrico do sistema na abertura. A publicação real na App Store e no Google Play exige as credenciais das contas de desenvolvedor (Apple Developer Program e Google Play Console): depois de ligadas, o app poderá ser gerado e publicado. Até lá, a aplicação web continua utilizável em qualquer navegador móvel e pode ser \"instalada\" na tela inicial como se fosse um app."]
      ]},
      { id: "limits", h: "11. Limites de segurança declarados", blocks: [
        ["p", "Por honestidade, eis o que este protótipo <strong>ainda não</strong> faz, apesar de a criptografia ser real:"],
        ["ul", [
          "<strong>Sem ratchet / forward secrecy</strong>: a chave de um chat permanece a mesma até as duas pessoas regenerarem as suas chaves (ao contrário de protocolos como o Signal, que trocam de chave a cada mensagem).",
          "<strong>Sem verificação fora de banda das chaves públicas</strong>: não há um \"número de segurança\" para comparar de viva voz com o contato. Em teoria, um servidor malicioso poderia substituir uma chave pública pela sua (ataque man-in-the-middle). Num servidor confiável e para um protótipo, serve; antes de um uso de alto risco, essa verificação deveria ser acrescentada.",
          "<strong>Chave privada no navegador</strong>: fica guardada no armazenamento local do navegador (localStorage), não num enclave seguro de hardware. Quem tiver acesso físico ou de software ao dispositivo desbloqueado poderia lê-la.",
          "<strong>Sem envio real de e-mails</strong>: o cadastro funciona, mas ainda não há um serviço de e-mail ligado para uma eventual recuperação de conta por \"magic link\"."
        ]]
      ]},
      { id: "troubleshooting", h: "12. Resolução de problemas", blocks: [
        ["h3", "\"Não consigo criptografar: o contato ainda não tem chave pública\""],
        ["p", "Acontece se o seu contato não entrou desde a última atualização do app (a chave é gerada e enviada automaticamente no login). Peça que ele entre uma vez: depois você poderá escrever-lhe normalmente."],
        ["h3", "\"Perdi o código de acesso\""],
        ["p", "Por enquanto não existe recuperação automática: é preciso cadastrar um novo perfil. Guarde sempre o código num gerenciador de senhas."],
        ["h3", "O desbloqueio biométrico não aparece"],
        ["p", "Requer um dispositivo com Face ID, Touch ID, impressão digital ou Windows Hello configurado, um navegador atualizado e uma conexão HTTPS (a aplicação web em produção já usa uma). Também precisa ter sido ativado pelo menos uma vez nas configurações."]
      ]}
    ]
  },
  privacy: {
    title: "Política de Privacidade — Mensagens Privadas",
    description: "Informações de privacidade do protótipo Mensagens Privadas: quais dados são tratados e como.",
    h1: "Política de Privacidade",
    sections: [
      ["Quem trata os dados", ["Este site e o protótipo associado são um projeto pessoal de demonstração. Para qualquer pedido relacionado a dados, você pode escrever através de <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."]],
      ["Dados coletados pelo site de apresentação", ["Este site não usa ferramentas de análise nem de rastreamento de terceiros. Apenas as preferências de cookies que você escolher são guardadas (veja a Política de Cookies), localmente no seu navegador."]],
      ["Dados coletados pelo protótipo (/app)", [
        "Para usar o protótipo de mensagens você cria um perfil com e-mail e nome de usuário. São guardados no servidor: e-mail, nome de usuário, ID público, código de acesso, combinação dos chats ocultos, contatos adicionados, a sua chave pública de criptografia e as mensagens enviadas.",
        "<strong>Mensagens:</strong> o conteúdo é criptografado de ponta a ponta no navegador antes do envio; o servidor guarda apenas texto cifrado e não consegue lê-lo. Os metadados (remetente, hora, reações, expiração das mensagens temporárias) permanecem sem criptografia.",
        "<strong>Desbloqueio biométrico:</strong> se o ativar, apenas a chave pública da passkey (WebAuthn) é guardada no servidor. Os dados biométricos nunca saem do seu dispositivo. A sua chave privada de criptografia permanece no navegador (localStorage).",
        "<strong>Importante:</strong> é um protótipo de demonstração: e-mail, nome de usuário e códigos de acesso são guardados sem criptografia e o serviço não atinge os padrões de um produto em produção. Não insira informações reais sensíveis: use dados de teste."
      ]],
      ["Finalidade do tratamento", ["Os dados servem exclusivamente para fazer a demonstração funcionar (autenticação, mensagens, contatos). Não são cedidos a terceiros nem usados para perfilamento publicitário."]],
      ["Conservação", ["Os dados do protótipo podem ser apagados a qualquer momento por ocasião de atualizações ou reinícios da demonstração, sem aviso prévio."]],
      ["Os seus direitos", ["Você pode pedir a qualquer momento a eliminação dos dados inseridos no protótipo escrevendo pelos contatos indicados acima."]]
    ]
  },
  cookie: {
    title: "Política de Cookies — Mensagens Privadas",
    description: "Informações sobre os cookies usados pelo site de apresentação do protótipo Mensagens Privadas.",
    h1: "Política de Cookies",
    sections: [
      ["O que são cookies", ["Cookies são pequenos arquivos guardados pelo navegador enquanto você visita um site. Este site não usa cookies de rastreamento de terceiros."]],
      ["Cookies técnicos", ["Usamos uma única preferência técnica (guardada no localStorage do navegador, não como cookie HTTP) para lembrar a sua escolha no banner de cookies. Sem ela, o banner reapareceria a cada visita. O app (/app) também guarda localmente o idioma escolhido e as suas chaves de criptografia, indispensáveis ao seu funcionamento."]],
      ["Cookies estatísticos", ["Neste momento este site não usa ferramentas de análise estatística. A categoria \"estatísticos\" no banner está preparada para um eventual uso futuro: se ferramentas como o Google Analytics forem ativadas, o script só será iniciado após consentimento explícito."]],
      ["Cookies de marketing", ["Não usamos cookies nem pixels de marketing ou publicidade."]],
      ["Como gerenciar as preferências", ["Você pode apagar a preferência guardada limpando os dados de navegação do seu navegador para este site: no próximo acesso o banner reaparecerá."]]
    ]
  }
};
