/* ============================================================================
   AURAMEN UNIVERSE 2.0 — CONFIGURAZIONE
   Questo è l'UNICO file da modificare per link, progetti e skin.

   ⚠️  Il sito è statico: tutto ciò che scrivi qui è PUBBLICO.
       NON inserire mai token del bot, password, chiavi API o dati personali.
       Qui vanno solo URL pubblici.

   Valore vuoto ('') = "non ancora configurato": il pulsante corrispondente
   viene mostrato disattivato come "da configurare". Nessun link è inventato.
   ============================================================================ */
window.AURAMEN_CONFIG = {

  /* --- Minecraft ---------------------------------------------------------- */
  MINECRAFT_NICK: 'auramen_',
  // Metti il PNG della tua skin in assets/skins/auramen.png (64x64 o 64x32).
  // Finché il file non esiste, il sito mostra un modello neutro con l'etichetta
  // "skin non ancora caricata" (NON una skin casuale).
  MINECRAFT_SKIN_PNG: 'assets/skins/auramen.png',
  MINECRAFT_SKIN_MODEL: 'auto-detect', // 'default' (Steve, braccia larghe) | 'slim' (Alex) | 'auto-detect'


  /* --- Discord --- */
  DISCORD_SERVER_URL: 'https://discord.gg/vV7pWrFhv',
  DISCORD_TICKET_URL: '',
  DISCORD_TICKET_CHANNEL_NAME: '#ticket',

  /* --- Community --- */
  COMMUNITIES: {
    carpyy: 'https://discord.gg/Carpyy',
    barcone: 'https://discord.gg/yTY2dat3J',
    auramen: 'https://discord.gg/vV7pWrFhv'
  },


  /* --- Social ------------------------------------------------------------- */
  SOCIAL: {
    twitch:  { url: 'https://www.twitch.tv/juliettamos', username: 'juliettamos' },
    tiktok:  { url: 'https://www.tiktok.com/@auramen07', username: '@auramen07' },
    youtube: { url: 'https://www.youtube.com/channel/UCQZZ5nB-KXesk0EzXOSZacA', username: 'Canale ufficiale' },
    github:  { url: 'https://github.com/julienvinciguerra-wq', username: 'julienvinciguerra-wq' },
    discord: { url: '', username: "auramen_'s Swamp" }   // vuoto = usa DISCORD_SERVER_URL
  },

  /* --- Pagamenti (solo collegamenti; il sito NON gestisce pagamenti) -------- */
  PAYMENTS: {
    paypal: '',       // es. https://paypal.me/tuonome
    amazonGiftCard: '' // istruzioni o link per l'invio della gift card
  },

  /* --- Progetti Minecraft ----------------------------------------------------
     Per aggiungere un progetto copia un blocco e incollalo nella categoria giusta.
     Categorie: 'projects' | 'resourcepacks' | 'configs' | 'community' | 'content'
     Campi: title (obbligatorio), description, url (facoltativo), tag (facoltativo)
     Esempio:
       { category: 'resourcepacks', title: 'Nome pack', description: 'Breve descrizione', url: 'https://…', tag: '1.21' }
     --------------------------------------------------------------------------- */
  PROJECTS: [
    // (nessun progetto inserito: aggiungili qui)
  ]
};
