// Dizionario del sito (pt). Struttura identica a it.js.
module.exports = {
  "code": "pt",
  "dir": "ltr",
  "brand": "Securmy",
  "ui": {
    "openApp": "Abrir o app",
    "manual": "Manual",
    "langAria": "Idioma",
    "legalAria": "Legal",
    "privacy": "Política de Privacidade",
    "cookie": "Política de Cookies",
    "langsLabel": "Todos os idiomas",
    "updated": "Última atualização: outubro de 2026.",
    "tocTitle": "Índice",
    "cookieBanner": {
      "text": "Usamos cookies técnicos necessários e, com o seu consentimento, cookies estatísticos. Consulte a <a href=\"{privacyUrl}\">Política de Privacidade</a> e a <a href=\"{cookieUrl}\">Política de Cookies</a>.",
      "reject": "Recusar",
      "customize": "Personalizar",
      "accept": "Aceitar todos",
      "statsQuestion": "Deseja aceitar os cookies estatísticos?"
    },
    "terms": "Termos de serviço",
    "owner": "Titular"
  },
  "landing": {
    "title": "Securmy — Mensagens privadas, cofre de arquivos e envio P2P cifrado",
    "description": "Chat com criptografia de ponta a ponta real, cofre de arquivos, senhas e notas cifradas, envio P2P por link, chamadas cifradas e verificação em duas etapas. 11 idiomas.",
    "ogTitle": "Securmy — Segurança, privacidade e confidencialidade",
    "ogDesc": "Mensagens, arquivos, senhas e chamadas protegidos por criptografia de ponta a ponta: tudo cifrado no seu dispositivo, em 11 idiomas.",
    "badge": "Protótipo funcional",
    "h1": "Um chat em que a senha escolhe o seu perfil",
    "lead": "Sem número de telefone. Digite seu usuário e senha: a senha decide qual perfil abre. Chats ocultos, perfil de cobertura, mensagens que se autodestroem.",
    "ctaOpen": "Abrir o app →",
    "ctaHow": "Veja como funciona",
    "featuresTitle": "O que você pode fazer",
    "features": [
      [
        "🔑",
        "Acesso com usuário e senha",
        "Primeiro o usuário, depois a senha: mesmo usuário, senha diferente, perfil diferente. Sem tela de seleção."
      ],
      [
        "🪪",
        "Perfis múltiplos",
        "Vários perfis no mesmo dispositivo, cada um com contatos, chats e configurações independentes."
      ],
      [
        "🙈",
        "Chats ocultos",
        "Oculte uma conversa da lista principal. Ela só volta a aparecer ao digitar uma combinação secreta na busca."
      ],
      [
        "🎭",
        "Perfil de fachada",
        "Crie um perfil inofensivo para mostrar em caso de fiscalização, sem pistas da existência de outros perfis."
      ],
      [
        "💣",
        "Mensagens temporárias",
        "Envie mensagens que se autodestroem após 30 segundos, 5 minutos ou uma hora."
      ],
      [
        "📵",
        "Sem número de telefone",
        "Cadastro por e-mail e ID público separado do endereço: o seu e-mail nunca fica visível para os outros."
      ],
      [
        "🔐",
        "Criptografia de ponta a ponta real",
        "Cada mensagem é criptografada no navegador com ECDH (P-256) + AES-GCM de 256 bits antes de sair: o servidor só vê texto cifrado, nunca o conteúdo em claro."
      ],
      [
        "🫆",
        "Desbloqueio biométrico",
        "Face ID, Touch ID, impressão digital do Android ou Windows Hello via WebAuthn/FIDO2 real: nenhum dado biométrico sai do dispositivo."
      ],
      [
        "🌍",
        "11 idiomas",
        "App e site disponíveis em italiano, inglês, espanhol, francês, alemão, português, árabe, chinês, hindi, russo e japonês."
      ]
    ],
    "howTitle": "Como funciona",
    "steps": [
      [
        "Cadastre-se",
        "E-mail, usuário e senha: você recebe um ID público e uma combinação secreta. Guarde-os: não serão mostrados novamente."
      ],
      [
        "Entre com usuário e senha",
        "A cada abertura, digite usuário e senha: o perfil correspondente abre automaticamente."
      ],
      [
        "Adicione contatos",
        "Procure uma pessoa pelo ID público dela e comece a conversar em tempo real."
      ],
      [
        "Oculte o que quiser",
        "Digite a combinação secreta na barra de busca para revelar os chats ocultos quando precisar."
      ]
    ],
    "disclaimerTitle": "O que é e o que não é",
    "disclaimerHtml": "<strong>Este é um protótipo funcional</strong>, não um produto acabado, mas a segurança é real: cada mensagem tem uma chave nova apagada após a leitura (forward secrecy), as chaves privadas ficam num cofre cifrado com a sua senha, você pode verificar a identidade do contato com um número de segurança e recebe um aviso se a chave dele mudar. O desbloqueio biométrico usa WebAuthn/FIDO2 real. Restam limites conhecidos, explicados com clareza no <a href=\"{manualUrl}\">manual do usuário</a> (metadados visíveis ao servidor, histórico preso ao dispositivo, recuperação só por e-mail). Ainda não é pensado para conversas de altíssimo risco.",
    "nativeTitle": "Apps nativos para iOS e Android",
    "nativeText": "A base do app nativo (Expo/React Native, com bloqueio biométrico do sistema) está pronta no código do projeto. A publicação na App Store e no Google Play exige as credenciais das contas de desenvolvedor (Apple Developer Program e Google Play Console): até serem ligadas, o app continua disponível como aplicação web, utilizável em qualquer navegador móvel e já instalável como app em \"Adicionar à tela inicial\".",
    "ctaTitle": "Experimente o protótipo",
    "ctaText": "Basta um e-mail e um nome de usuário para criar o seu primeiro perfil.",
    "secTitle": "Segurança e privacidade: o coração do app",
    "secLead": "Não nos limitamos a dizer «é cifrado». Veja, em concreto, o que protege as suas conversas.",
    "security": [
      [
        "🔄",
        "Uma chave nova a cada mensagem",
        "Cada mensagem tem uma chave de uso único (forward secrecy), apagada após a leitura. Se alguém obtivesse suas chaves, não conseguiria decifrar as mensagens passadas."
      ],
      [
        "🗝️",
        "Cofre cifrado com a sua senha",
        "Chaves privadas e mensagens lidas são cifradas no dispositivo (PBKDF2 + AES-GCM) com a sua senha: sem ela, ficam ilegíveis."
      ],
      [
        "🔍",
        "Verificação de chaves e alerta anti-interceptação",
        "Compare por voz o número de segurança com o seu contato. Se a chave dele mudar, o app avisa e bloqueia o envio até você confirmar."
      ],
      [
        "🙈",
        "Um servidor cego",
        "O servidor guarda apenas texto cifrado. E-mail e nome de usuário são cifrados em repouso no banco de dados; das senhas só se guarda um hash (scrypt)."
      ],
      [
        "🛡️",
        "Defesa contra ataques de acesso",
        "Tentativas limitadas por IP e por usuário, sessões revogáveis, outras sessões encerradas ao trocar a senha."
      ],
      [
        "🫆",
        "Biometria que não sai do seu dispositivo",
        "Com WebAuthn/FIDO2 o servidor recebe apenas a chave pública da passkey: o dado biométrico nunca sai do celular ou computador."
      ]
    ],
    "suiteTitle": "Mais que um chat: o seu cofre digital",
    "suiteLead": "O Securmy vai além das mensagens. Tudo o que você guarda ou compartilha é cifrado no seu dispositivo, com o mesmo cofre que protege os seus chats.",
    "suite": [
      [
        "🗄️",
        "Cofre de arquivos",
        "Esconda e proteja documentos, fotos e arquivos: cifrados no dispositivo com AES-256 e abertos só pela sua senha ou biometria."
      ],
      [
        "🔗",
        "Envio P2P por link",
        "O arquivo vai direto de um dispositivo ao outro, cifrado, sem ser guardado no servidor. Link de uso único com validade."
      ],
      [
        "🧼",
        "Limpeza de metadados",
        "Remove a localização GPS, o modelo da câmera e outros dados ocultos das fotos antes de você compartilhá-las."
      ],
      [
        "🔑",
        "Gerenciador de senhas",
        "Guarde credenciais no cofre, gere senhas fortes e copie-as: a área de transferência é limpa após 20 segundos."
      ],
      [
        "📝",
        "Notas cifradas",
        "Notas privadas cifradas no seu dispositivo, nunca enviadas a nenhum servidor."
      ],
      [
        "👁️",
        "Mensagens de visualização única",
        "O destinatário as abre uma só vez: poucos segundos depois são apagadas do servidor e do dispositivo dele."
      ],
      [
        "📞",
        "Chamadas de voz e vídeo cifradas",
        "Direto entre os dois dispositivos (DTLS-SRTP), com um código de verificação para comparar em voz alta contra escutas."
      ],
      [
        "🔢",
        "Verificação em duas etapas",
        "Códigos TOTP com qualquer app autenticador: mesmo quem descobrir a sua senha não entra."
      ],
      [
        "💾",
        "Backup cifrado",
        "Exporte arquivos, notas e senhas num único arquivo cifrado com uma frase secreta que só você conhece."
      ],
      [
        "🚨",
        "Verificação de segurança e apagamento de emergência",
        "Uma pontuação mostra o que melhorar; em caso de perigo, um toque apaga do dispositivo chaves, arquivos e senhas."
      ],
      [
        "☁️",
        "Sincronização cifrada (paga)",
        "Sincronize o cofre entre os seus dispositivos com pacotes de espaço (5, 25 ou 100 GB por mês). O servidor só guarda dados já cifrados: a chave fica nos seus dispositivos. Sem plano, tudo fica local."
      ],
      [
        "🛰️",
        "Proteção de IP com relay",
        "Com um relay cifrado (TURN) pode ocultar o seu endereço IP em chamadas e envios P2P, e fazê-los funcionar mesmo em redes muito restritivas."
      ]
    ],
    "roadmapTitle": "Em breve",
    "roadmapLead": "O que estamos planejando. Ainda não está disponível e não deve ser entendido como data prometida.",
    "roadmap": [
      [
        "🧅",
        "Rede Tor",
        "O serviço pode ser exposto como endereço .onion: os ficheiros de instalação estão prontos (self-hosting) e ativam-se a pedido. O Tor Browser desativa o WebRTC, por isso envios P2P e chamadas não funcionam via Tor; mensagens, cofre e sync sim."
      ],
      [
        "📱",
        "Apps para iOS e Android",
        "Apps nativos com desbloqueio biométrico, publicados nas lojas com as mesmas garantias de segurança e privacidade do site."
      ]
    ]
  },
  "manual": {
    "title": "Manual do usuário — Securmy",
    "description": "Guia completo: cadastro, acesso com usuário e senha, chats ocultos, criptografia de ponta a ponta, desbloqueio biométrico e idiomas disponíveis.",
    "h1": "Manual do usuário",
    "lead": "Guia completo de Securmy: como se cadastrar, entrar, usar os recursos de privacidade e entender o que este protótipo realmente protege — e o que não protege.",
    "sections": [
      {
        "id": "signup",
        "h": "1. Cadastro e primeiro acesso",
        "blocks": [
          [
            "p",
            "Na tela inicial, toque em \"Cadastre-se\" e informe seu e-mail e um nome de usuário. Não é necessário número de telefone."
          ],
          [
            "p",
            "Após o cadastro você verá uma única vez três informações, que deve guardar imediatamente em local seguro (um gerenciador de senhas, por exemplo):"
          ],
          [
            "ul",
            [
              "<strong>Usuário e senha</strong>: o usuário é o primeiro campo e a senha decide qual perfil abre. Com o mesmo usuário você pode ter vários perfis, cada um com sua senha.",
              "<strong>ID público</strong>: é o que você compartilha com as pessoas que quer adicionar como contatos. Não revela o seu e-mail.",
              "<strong>Combinação secreta</strong>: serve para revelar os chats ocultos (veja a seção dedicada)."
            ]
          ],
          [
            "warn",
            "Se perder a senha, você pode redefini-la por e-mail, mas só se o e-mail do perfil tiver sido verificado. Sem senha e sem e-mail verificado, o perfil não pode ser recuperado."
          ]
        ]
      },
      {
        "id": "profiles",
        "h": "2. Perfis múltiplos no mesmo dispositivo",
        "blocks": [
          [
            "p",
            "Você pode criar vários perfis (por exemplo um pessoal e um de cobertura) com o mesmo usuário e senhas diferentes. Ao digitar usuário e senha, abre-se o perfil correspondente, sem tela de seleção que revele quantos perfis existem. Não é possível usar a mesma senha em dois perfis com o mesmo usuário."
          ]
        ]
      },
      {
        "id": "contacts",
        "h": "3. Adicionar contatos e conversar",
        "blocks": [
          [
            "p",
            "Toque em \"+ Adicionar contato\" e informe o ID público da pessoa. Abre-se um chat em tempo real, com criptografia de ponta a ponta (veja a seção 7)."
          ]
        ]
      },
      {
        "id": "hidden",
        "h": "4. Chats ocultos e combinação secreta",
        "blocks": [
          [
            "p",
            "Em um chat, abra o menu e escolha \"Ocultar/mostrar este chat\". Um chat oculto deixa de aparecer na lista principal."
          ],
          [
            "p",
            "Para fazê-lo reaparecer, digite a sua combinação secreta (a mostrada uma única vez no cadastro) na barra de busca: todos os chats ocultos voltam a ficar visíveis até você bloquear o app novamente."
          ]
        ]
      },
      {
        "id": "cover",
        "h": "5. Perfil de fachada",
        "blocks": [
          [
            "p",
            "No cadastro você pode marcar \"Criar como perfil de fachada\": um perfil pensado para ser mostrado em caso de fiscalização, sem pistas da existência de outros perfis no mesmo dispositivo."
          ]
        ]
      },
      {
        "id": "timed",
        "h": "6. Mensagens temporárias (autodestruição)",
        "blocks": [
          [
            "p",
            "Antes de enviar uma mensagem, você pode escolher no menu suspenso um tempo de autodestruição: 30 segundos, 5 minutos ou 1 hora. Passado esse tempo, a mensagem é removida."
          ]
        ]
      },
      {
        "id": "encryption",
        "h": "7. Criptografia de ponta a ponta: como funciona de verdade",
        "blocks": [
          [
            "p",
            "Isto não é um slogan de marketing: cada mensagem é criptografada <strong>no seu navegador</strong>, antes de ser enviada ao servidor, com este esquema:"
          ],
          [
            "ol",
            [
              "No primeiro acesso, o dispositivo gera um par de chaves ECDH (curva P-256): a pública vai para o servidor, a privada fica no dispositivo, cifrada com a sua senha. Também prepara um lote de chaves públicas de uso único («prekeys»).",
              "Para cada mensagem, o navegador gera uma chave temporária e busca no servidor UMA prekey de uso único do contato. Combina três trocas ECDH (sua identidade, a chave temporária, a prekey) e deriva com HKDF-SHA256 uma chave AES-GCM de 256 bits válida só para aquela mensagem.",
              "A mensagem é cifrada com essa chave e um IV aleatório; o cabeçalho é autenticado e não pode ser alterado. O servidor recebe apenas texto cifrado.",
              "O destinatário reconstrói a mesma chave, lê a mensagem e apaga logo a prekey privada: a partir daí ninguém a decifra, nem com as suas chaves de longo prazo."
            ]
          ],
          [
            "p",
            "É o mesmo tipo de matemática (ECDH + AES-GCM) usado por muitos protocolos seguros modernos, aplicado aqui pela Web Crypto API nativa do navegador, sem bibliotecas externas."
          ],
          [
            "h3",
            "Forward secrecy: as mensagens passadas continuam seguras"
          ],
          [
            "p",
            "Mesmo que alguém obtivesse suas chaves de longo prazo (por exemplo, roubando o dispositivo), não conseguiria decifrar as mensagens já recebidas, pois as chaves foram apagadas. O texto já lido fica apenas no cache local cifrado do seu dispositivo."
          ],
          [
            "h3",
            "O cofre de chaves"
          ],
          [
            "p",
            "Chaves privadas, prekeys e cache de mensagens ficam no navegador apenas cifrados (AES-GCM), com uma chave derivada da sua senha por PBKDF2-SHA256 (310.000 iterações). Se entrar por biometria, a senha é pedida uma vez para abrir o cofre. Ao trocar a senha, o cofre é recifrado."
          ],
          [
            "h3",
            "Confirme que é mesmo ele: número de segurança"
          ],
          [
            "p",
            "No chat, toque no ícone 🔑: aparece um número de 60 dígitos, igual para os dois. Compare com o contato pessoalmente ou por voz: se coincidir, ninguém está interferindo. Se a chave de um contato mudar (novo dispositivo ou possível interceptação), surge um aviso e o envio fica bloqueado até você escolher «Aceitar nova chave»."
          ]
        ]
      },
      {
        "id": "biometric",
        "h": "8. Desbloqueio biométrico (Face ID / Touch ID / impressão digital)",
        "blocks": [
          [
            "p",
            "Nas configurações do perfil (ícone ⚙️) você encontra \"Ativar desbloqueio com Face ID / impressão digital\". Ao ativá-lo, o seu dispositivo cria uma passkey via WebAuthn/FIDO2 e a registra no servidor (apenas a chave pública, nunca o dado biométrico)."
          ],
          [
            "p",
            "A partir daí, a tela de acesso mostrará o botão \"Desbloquear com biometria\": use-o no lugar da senha, e seu sistema operacional (não o app) verifica Face ID, Touch ID, impressão digital Android ou Windows Hello. O dado biométrico nunca sai do seu dispositivo."
          ],
          [
            "p",
            "Você pode desativá-lo a qualquer momento nas mesmas configurações."
          ]
        ]
      },
      {
        "id": "languages",
        "h": "9. Mudar de idioma",
        "blocks": [
          [
            "p",
            "No canto superior de cada tela do app há um seletor de idioma. Este site também está disponível nos mesmos 11 idiomas: italiano, inglês, espanhol, francês, alemão, português, árabe, chinês, hindi, russo e japonês. O idioma escolhido no app fica guardado no dispositivo."
          ]
        ]
      },
      {
        "id": "mobile",
        "h": "10. Apps móveis nativos (iOS/Android)",
        "blocks": [
          [
            "p",
            "Há uma base pronta para um app nativo (baseada em Expo/React Native) que acrescenta um bloqueio biométrico do sistema na abertura. A publicação real na App Store e no Google Play exige as credenciais das contas de desenvolvedor (Apple Developer Program e Google Play Console): depois de ligadas, o app poderá ser gerado e publicado. Até lá, a aplicação web continua utilizável em qualquer navegador móvel e pode ser \"instalada\" na tela inicial como se fosse um app."
          ]
        ]
      },
      {
        "id": "limits",
        "h": "11. Limites de segurança declarados",
        "blocks": [
          [
            "p",
            "Por honestidade, estes são os limites que permanecem, embora a criptografia seja real e não apenas declarada:"
          ],
          [
            "ul",
            [
              "<strong>Prekeys esgotadas</strong>: se um contato fica muito tempo offline e acaba as chaves de uso único, a mensagem ainda usa uma chave nova, mas sem exclusão única — forward secrecy mais fraca.",
              "<strong>Mensagens ligadas a este dispositivo</strong>: por projeto, o histórico decifrado não se move. Em um novo dispositivo ou após recuperar a senha por e-mail, o cofre anterior não é recuperável: você recomeça com nova identidade e os contatos veem o aviso de troca de chave.",
              "<strong>O cofre vale o que vale a senha</strong>: escolha uma longa e única. Quem tiver seu dispositivo já desbloqueado com o app aberto pode ler os chats, como em qualquer app.",
              "<strong>Metadados visíveis ao servidor</strong>: remetente, horário, reações e expiração das mensagens temporárias não são cifrados.",
              "<strong>Recuperação só por e-mail</strong>: se perder a senha e o acesso ao e-mail verificado, o perfil não é recuperável. Se usar vários perfis (por exemplo, um de cobertura), use e-mails diferentes: um link de recuperação revela a quem controla o e-mail que o perfil existe."
            ]
          ]
        ]
      },
      {
        "id": "troubleshooting",
        "h": "12. Resolução de problemas",
        "blocks": [
          [
            "h3",
            "\"Não consigo criptografar: o contato ainda não tem chave pública\""
          ],
          [
            "p",
            "Acontece se o seu contato não entrou desde a última atualização do app (a chave é gerada e enviada automaticamente no login). Peça que ele entre uma vez: depois você poderá escrever-lhe normalmente."
          ],
          [
            "h3",
            "\"Perdi minha senha\""
          ],
          [
            "p",
            "Use \"Esqueceu a senha?\" na tela de acesso e informe e-mail e usuário: se o e-mail do perfil estiver verificado, você recebe um link válido por 1 hora. Caso contrário, o perfil não é recuperável e precisa ser criado de novo. Guarde sempre a senha em um gerenciador de senhas."
          ],
          [
            "h3",
            "O desbloqueio biométrico não aparece"
          ],
          [
            "p",
            "Requer um dispositivo com Face ID, Touch ID, impressão digital ou Windows Hello configurado, um navegador atualizado e uma conexão HTTPS (a aplicação web em produção já usa uma). Também precisa ter sido ativado pelo menos uma vez nas configurações."
          ],
          [
            "h3",
            "«Mensagem não mais legível»"
          ],
          [
            "p",
            "Por segurança, a chave de cada mensagem é apagada assim que você a lê: o texto fica só no cache cifrado deste dispositivo. Se trocar de dispositivo, limpar os dados do navegador ou redefinir a senha por e-mail, as mensagens anteriores não podem ser recuperadas. É o preço da forward secrecy."
          ]
        ]
      },
      {
        "id": "suite",
        "h": "13. Cofre e ferramentas do Securmy",
        "blocks": [
          [
            "p",
            "Abra o Cofre pelo botão 🛡️ na barra lateral. Tudo o que ele contém é cifrado no seu dispositivo com AES-256-GCM, com uma chave guardada no seu cofre e protegida pela sua senha: o servidor nunca recebe arquivos, notas ou senhas."
          ],
          [
            "h3",
            "Cofre de arquivos"
          ],
          [
            "p",
            "Adicione arquivos (até 100 MB cada) na aba Arquivos. Se a caixa estiver marcada, as fotos têm os metadados removidos antes de serem guardadas. Você pode baixar, enviar por P2P ou excluir cada arquivo."
          ],
          [
            "h3",
            "Envio P2P por link"
          ],
          [
            "p",
            "Escolha um arquivo e um prazo de validade (10 minutos ou 1 hora): você recebe um link de uso único. O arquivo vai direto ao destinatário, cifrado com uma chave que fica só depois do # do link e nunca chega ao servidor. Mantenha a página aberta até a transferência terminar."
          ],
          [
            "h3",
            "Limpar fotos"
          ],
          [
            "p",
            "Redesenha a imagem descartando EXIF, localização GPS e miniaturas. Funciona com JPEG, PNG e WebP; para outros formatos a limpeza automática não está disponível."
          ],
          [
            "h3",
            "Notas e senhas"
          ],
          [
            "p",
            "Notas e credenciais ficam cifradas no cofre. O gerador cria senhas aleatórias; ao copiar uma senha, a área de transferência é limpa após 20 segundos."
          ],
          [
            "h3",
            "Mensagens de visualização única"
          ],
          [
            "p",
            "Escolha «Ver uma vez» ao lado do campo da mensagem. O destinatário toca para ver: o texto fica visível por 10 segundos e depois é destruído no dispositivo dele e no servidor. Não impede que quem lê fotografe a tela."
          ],
          [
            "h3",
            "Chamadas de voz e vídeo"
          ],
          [
            "p",
            "Use os botões 📞 e 🎥 no cabeçalho do chat. Áudio e vídeo viajam direto entre os dispositivos, cifrados. Os dois veem um código de 4 dígitos: comparem em voz alta; se coincidir, a chamada não foi interceptada."
          ],
          [
            "h3",
            "Verificação em duas etapas"
          ],
          [
            "p",
            "Em Segurança você pode ativar códigos TOTP com um app autenticador (Google Authenticator, Aegis, 1Password…). Depois de ativada, entrar com a senha exige também o código de 6 dígitos. O desbloqueio biométrico continua sendo um método de acesso separado."
          ],
          [
            "h3",
            "Backup e apagamento de emergência"
          ],
          [
            "p",
            "O backup contém arquivos, notas e senhas cifrados com uma frase secreta de pelo menos 10 caracteres escolhida por você: sem ela não é recuperável. As mensagens não estão incluídas. O apagamento de emergência remove do dispositivo chaves, cache de mensagens, arquivos, notas e senhas e não pode ser desfeito."
          ],
          [
            "h3",
            "Limites que convém conhecer"
          ],
          [
            "ul",
            [
              "A sincronização entre dispositivos é opcional e paga (pacotes de espaço): os dados continuam cifrados no seu dispositivo e o servidor não tem a chave. Sem plano, o cofre fica só local; o backup continua a servir para o mover.",
              "Para ocultar o seu IP em envios P2P e chamadas, ative Segurança → Proteção de IP (relay cifrado), onde o serviço tenha um servidor TURN. Sem relay, a outra pessoa pode ver o seu IP e, em redes muito restritivas, a ligação pode falhar.",
              "O gerenciador de senhas é básico: não preenche formulários sozinho e não substitui um gerenciador dedicado para uso profissional.",
              "Se perder a senha e a frase do backup, os dados cifrados não são recuperáveis: ninguém, nem nós, consegue abri-los."
            ]
          ]
        ]
      }
    ]
  },
  "privacy": {
    "title": "Política de Privacidade — Securmy",
    "description": "Informações de privacidade do protótipo Securmy: quais dados são tratados e como.",
    "h1": "Política de Privacidade",
    "sections": [
      [
        "Quem trata os dados",
        [
          "Este site e o protótipo associado são um projeto pessoal de demonstração. Para qualquer pedido relacionado a dados, você pode escrever através de <a href=\"https://www.simonescaffidi.it\" target=\"_blank\" rel=\"noopener noreferrer\">www.simonescaffidi.it</a>."
        ]
      ],
      [
        "Dados coletados pelo site de apresentação",
        [
          "Este site não usa ferramentas de análise nem de rastreamento de terceiros. Apenas as preferências de cookies que você escolher são guardadas (veja a Política de Cookies), localmente no seu navegador."
        ]
      ],
      [
        "Dados coletados pelo protótipo (/app)",
        [
          "Para usar o protótipo de mensagens, você cria um perfil com e-mail, usuário e senha. Ficam salvos no servidor (banco PostgreSQL): e-mail (cifrado), usuário, hash da senha, ID público, combinação dos chats ocultos, contatos adicionados, sua chave pública de criptografia, sessões ativas e mensagens enviadas.",
          "<strong>Mensagens:</strong> o conteúdo é criptografado de ponta a ponta no navegador antes do envio; o servidor guarda apenas texto cifrado e não consegue lê-lo. Os metadados (remetente, hora, reações, expiração das mensagens temporárias) permanecem sem criptografia.",
          "<strong>Desbloqueio biométrico:</strong> se o ativar, no servidor é guardada apenas a chave pública da passkey (WebAuthn). Os dados biométricos nunca saem do seu dispositivo.",
          "<strong>Importante:</strong> é um protótipo de demonstração e o serviço não tem os padrões de um produto em produção. E-mail e nome de usuário são cifrados em repouso no banco de dados (AES-256-GCM); o e-mail serve só para verificação e recuperação. As senhas não são guardadas em claro (apenas um hash com salt, scrypt) e as tentativas de acesso falhadas são limitadas por IP e por usuário. Não insira informações reais sensíveis: use dados de teste.",
          "<strong>Chaves de cifragem:</strong> as chaves privadas nunca saem do seu dispositivo e são guardadas cifradas com a sua senha (PBKDF2 + AES-GCM), assim como o cache local das mensagens já lidas. O servidor guarda só a sua chave pública e um lote de chaves públicas de uso único, que apaga a cada entrega."
        ]
      ],
      [
        "Finalidade do tratamento",
        [
          "Os dados servem exclusivamente para fazer a demonstração funcionar (autenticação, mensagens, contatos). Não são cedidos a terceiros nem usados para perfilamento publicitário."
        ]
      ],
      [
        "Conservação",
        [
          "Os dados ficam em um banco persistente até você excluir o perfil; durante atualizações ou reinicializações da demo, ainda podem ser apagados sem aviso."
        ]
      ],
      [
        "Os seus direitos",
        [
          "Você pode pedir a qualquer momento a eliminação dos dados inseridos no protótipo escrevendo pelos contatos indicados acima."
        ]
      ],
      [
        "Funções do Securmy: cofre, envios P2P e chamadas",
        [
          "Arquivos, notas, senhas e backups do cofre ficam no seu dispositivo, cifrados com uma chave que nunca sai dele: não os recebemos e não podemos lê-los nem recuperá-los.",
          "Sincronização (só com plano pago): o servidor guarda ficheiros, notas e senhas já cifrados no seu dispositivo, sem a chave para os abrir, até que você ou a sua conta os elimine. Para pagamentos usamos o Stripe: não vemos nem guardamos os dados do seu cartão.",
          "Nos envios P2P e nas chamadas o conteúdo viaja direto entre os dispositivos, cifrado. O servidor trata apenas as informações de conexão (SDP e candidatos ICE), mantidas em memória por no máximo uma hora e depois eliminadas; o outro participante e um servidor STUN público podem ver o seu endereço IP.",
          "Se ativar a verificação em duas etapas, guardamos o segredo TOTP, cifrado em repouso; as mensagens de visualização única são eliminadas do servidor poucos segundos após serem abertas."
        ]
      ]
    ]
  },
  "cookie": {
    "title": "Política de Cookies — Securmy",
    "description": "Informações sobre os cookies usados pelo site de apresentação do protótipo Securmy.",
    "h1": "Política de Cookies",
    "sections": [
      [
        "O que são cookies",
        [
          "Cookies são pequenos arquivos guardados pelo navegador enquanto você visita um site. Este site não usa cookies de rastreamento de terceiros."
        ]
      ],
      [
        "Cookies técnicos",
        [
          "Usamos uma única preferência técnica (guardada no localStorage do navegador, não como cookie HTTP) para lembrar a sua escolha no banner de cookies. Sem ela, o banner reapareceria a cada visita. O app (/app) também guarda localmente o idioma escolhido e as suas chaves de criptografia, indispensáveis ao seu funcionamento."
        ]
      ],
      [
        "Cookies estatísticos",
        [
          "Neste momento este site não usa ferramentas de análise estatística. A categoria \"estatísticos\" no banner está preparada para um eventual uso futuro: se ferramentas como o Google Analytics forem ativadas, o script só será iniciado após consentimento explícito."
        ]
      ],
      [
        "Cookies de marketing",
        [
          "Não usamos cookies nem pixels de marketing ou publicidade."
        ]
      ],
      [
        "Como gerenciar as preferências",
        [
          "Você pode apagar a preferência guardada limpando os dados de navegação do seu navegador para este site: no próximo acesso o banner reaparecerá."
        ]
      ]
    ]
  },
  "terms": {
    "title": "Termos de serviço e licença — Securmy",
    "description": "Termos de serviço e licença de uso do app e do site Securmy.",
    "h1": "Termos de serviço e licença de uso",
    "sections": [
      [
        "1. Objeto e titular",
        [
          "Estes Termos regem o uso do app e do site «Securmy» (o «Serviço»). Ao se registrar ou usar o Serviço, você os aceita. Se não concordar, não o utilize."
        ]
      ],
      [
        "2. Natureza do Serviço",
        [
          "O Serviço é um protótipo funcional oferecido «como está». Pode mudar, ser interrompido ou zerado sem aviso. Use dados de teste e não confie a ele conversas de altíssimo risco nem informações essenciais."
        ]
      ],
      [
        "3. Conta e segurança",
        [
          "Você deve ter pelo menos 14 anos. É responsável pela sua senha e pelo seu dispositivo. As chaves de cifragem ficam apenas no seu dispositivo, cifradas com a sua senha: se a perder ou redefinir, o histórico local não pode ser recuperado e não podemos restaurá-lo."
        ]
      ],
      [
        "4. Uso permitido",
        [
          "É proibido usar o Serviço para atividades ilícitas, assédio, ameaças, spam, golpes, difusão de malware, conteúdo que explore menores ou viole direitos de terceiros, ou para tentar violar, sobrecarregar ou contornar as medidas de segurança."
        ]
      ],
      [
        "5. Denúncias e suspensão",
        [
          "Você pode bloquear e denunciar qualquer contato. As mensagens são cifradas de ponta a ponta e o Titular não pode lê-las: as denúncias se baseiam no que o usuário indica e nos dados técnicos disponíveis. O Titular pode suspender ou excluir contas que violem estes Termos ou a lei e colaborar com as autoridades quando exigido."
        ]
      ],
      [
        "6. Licença de uso",
        [
          "É concedida a você uma licença pessoal, não exclusiva, intransferível e revogável para usar o app e o site para fins lícitos. Software, gráficos, marcas e textos permanecem do Titular. Você não pode copiar, vender, descompilar nem criar obras derivadas, salvo nos limites permitidos por lei imperativa."
        ]
      ],
      [
        "7. Garantias e responsabilidade",
        [
          "Na medida permitida por lei, o Serviço é fornecido sem garantia de continuidade, ausência de erros ou adequação a uma finalidade específica, e o Titular não responde por danos indiretos ou perda de dados. Permanecem os direitos dos consumidores e as responsabilidades que não podem ser excluídas."
        ]
      ],
      [
        "8. Exclusão da conta e dados",
        [
          "Você pode excluir sua conta a qualquer momento em Configurações: perfil, contatos e chats são apagados definitivamente. O tratamento de dados está descrito na Política de privacidade."
        ]
      ],
      [
        "9. Lei aplicável e alterações",
        [
          "Estes Termos são regidos pela lei italiana; os consumidores mantêm as proteções e o foro previstos no Código do Consumidor italiano e nas normas imperativas da UE. Podemos atualizar estes Termos: alterações relevantes serão comunicadas no Serviço. Contato: info@simonescaffidi.it."
        ]
      ],
      [
        "10. Compartilhamento de arquivos e chamadas",
        [
          "Você é responsável pelos arquivos que compartilha e pelas chamadas que faz. É proibido compartilhar conteúdo ilegal ou violar direitos de terceiros. Como o conteúdo é cifrado de ponta a ponta, não podemos vê-lo, mas podemos suspender contas alvo de denúncias fundamentadas. As funções são fornecidas «como estão» e podem mudar ou ser suspensas."
        ]
      ]
    ]
  }
};
