# Securmy su VPS: TURN e Tor

Questa cartella serve a due cose, entrambe facoltative e indipendenti dal server principale (Railway).

## 1. Server TURN proprio (nasconde l'IP e aiuta dietro NAT rigidi)

Alternativa al servizio gestito (Cloudflare/Metered, vedi sotto). Serve una VPS con IP pubblico (es. Hetzner, ~4 €/mese) con le porte 3478 (UDP/TCP) e 49160–49200 (UDP) aperte.

1. Copia `.env.example` in `.env` e compila `PUBLIC_IP`, `TURN_REALM`, `TURN_SECRET` (`openssl rand -hex 32`).
2. `docker compose up -d coturn`
3. Su Railway imposta: `TURN_URL=turn:IL_TUO_IP:3478?transport=udp,turn:IL_TUO_IP:3478?transport=tcp` e `TURN_SECRET=<lo stesso segreto>`. Il server genera credenziali temporanee (24 h) per ogni richiesta.

### Servizio gestito (consigliato per iniziare)
- **Cloudflare Realtime TURN**: crea una TURN key nella dashboard, poi su Railway imposta `CF_TURN_KEY_ID` e `CF_TURN_API_TOKEN`.
- **Metered**: crea un'app, poi imposta `METERED_APP` (la parte prima di `.metered.live`) e `METERED_API_KEY`.

Con un TURN attivo, nell'app compare l'interruttore **Sicurezza → Protezione IP**. Con `TURN_RELAY_ONLY=1` il relay diventa obbligatorio per tutti.

## 2. Indirizzo .onion (Tor)

Espone Securmy come servizio onion v3: chi usa Tor Browser raggiunge il server senza rivelare il proprio IP, e il server non vede mai l'IP dell'utente (vede solo la VPS).

1. Imposta `UPSTREAM_HOST` in `.env` (dominio pubblico del server).
2. `docker compose up -d onion-proxy tor`
3. L'indirizzo si legge con `docker compose exec tor cat /var/lib/tor/securmy/hostname`.
4. **Fai un backup del volume `tor-keys`**: contiene la chiave privata, senza la quale l'indirizzo .onion va perso.

Limiti da conoscere: Tor Browser disabilita WebRTC, quindi invio P2P e chiamate non funzionano via .onion (messaggi, cassaforte e sync sì). Il server vede comunque l'indirizzo della VPS, quindi la VPS deve essere gestita con cura (niente log degli accessi: nginx è già configurato così).
