# AURAMEN UNIVERSE 2.0 — sito

Portfolio statico (HTML + CSS + JavaScript, **nessun build, nessun backend**). Stile Liquid Glass / dark, skin Minecraft 3D con [skinview3d](https://github.com/bs-community/skinview3d) (MIT, incluso in `assets/vendor/`).

## Avvio

```bash
# dalla cartella del sito
python3 -m http.server 8080      # oppure: npx serve .
# apri http://localhost:8080
```

Per pubblicarlo basta caricare l'intera cartella su qualunque hosting statico (GitHub Pages, Netlify, Cloudflare Pages…).

## Configurazione — tutto in `js/config.js`

| Chiave | Cosa fa |
|---|---|
| `DISCORD_TICKET_URL` | Link del pulsante **APRI UN TICKET** (vedi sotto) |
| `DISCORD_SERVER_URL` | Invito al server (già impostato dal sito originale) |
| `DISCORD_TICKET_CHANNEL_NAME` | Nome del canale pannello mostrato nelle istruzioni |
| `COMMUNITIES.carpyy` / `.barcone` | Inviti ai due server (vuoti = pulsante "Link da configurare") |
| `SOCIAL.*` | URL e username dei social |
| `PAYMENTS.paypal` / `.amazonGiftCard` | Collegamenti pagamento (vuoti = "da configurare") |
| `MINECRAFT_SKIN_PNG` | Percorso della skin PNG |
| `PROJECTS` | Elenco progetti Minecraft (aggiungi un blocco per categoria) |

> ⚠️ Il sito è pubblico: in `config.js` vanno **solo URL pubblici**. Mai token, password o chiavi.

### Collegamento sito → ticket
1. Nel server Discord, tasto destro sul canale del pannello → **Copia link canale** (serve la Modalità sviluppatore).
2. Incolla il link in `DISCORD_TICKET_URL` (formato `https://discord.com/channels/ID_SERVER/ID_CANALE`).
3. Finché è vuoto, il pulsante apre una finestra con le istruzioni ("vai nel canale #ticket e premi Apri Ticket") e il pulsante per entrare nel server. Discord non permette di aprire un ticket "dall'esterno": l'utente deve premere il pulsante del bot nel server.

### Skin Minecraft
Salva il PNG (64×64 o 64×32) come `assets/skins/auramen.png`: viene caricata da sola. Se il file non c'è, il sito mostra un modello neutro viola con l'etichetta **"Skin non ancora caricata"** (non una skin casuale). Per le braccia sottili imposta `MINECRAFT_SKIN_MODEL: 'slim'`.

### Aggiungere un progetto
In `PROJECTS`, ad esempio:
```js
{ category: 'resourcepacks', title: 'Nome pack', description: 'Breve descrizione', url: 'https://…', tag: '1.21' }
```
Categorie: `projects`, `resourcepacks`, `configs`, `community`, `content`.

## Struttura
```
index.html          pagina unica (7 sezioni)
css/style.css       stile
js/config.js        ← configurazione (da modificare)
js/main.js          navbar, reveal, modali, link, progetti
js/skin.js          viewer 3D con fallback
js/icons.js         loghi ufficiali (Simple Icons, CC0)
assets/             video, avatar, loghi community, skin, vendor
```

## Note tecniche
- Rispetta `prefers-reduced-motion` e "risparmio dati" (video in pausa, niente rotazione).
- Il 3D si mette in pausa fuori schermo/a scheda nascosta; senza WebGL compare l'avatar.
- Il video di sfondo (`new-video.mp4`, 11 MB) è quello originale. Il file ha bordi neri incorporati: compensati con un leggero ingrandimento.
- Nessun cookie di tracciamento (la finestra cookie originale è mantenuta).
