/* ============================================================================
   AURAMEN UNIVERSE 2.0 — CONFIGURAZIONE
   Questo è l'UNICO file da modificare per link, progetti e skin.

   ATTENZIONE: tutto ciò che scrivi qui è PUBBLICO.
   NON inserire token, password o chiavi API.
   ============================================================================ */

window.AURAMEN_CONFIG = {

  /* --- Minecraft ---------------------------------------------------------- */
  MINECRAFT_NICK: 'auramen_',
  MINECRAFT_SKIN_PNG: 'assets/skins/auramen.png',
  MINECRAFT_SKIN_MODEL: 'auto-detect',

  /* --- Discord ------------------------------------------------------------ */
  DISCORD_SERVER_URL: 'https://discord.gg/vV7pWrFhv',

  // Da compilare dopo aver pubblicato il backend Discord con HTTPS.
  DISCORD_PROFILE_API_URL: 'https://auramen-bot-discord.onrender.com',

  DISCORD_TICKET_URL: '',
  DISCORD_TICKET_CHANNEL_NAME: '#ticket',

  /* --- Community ---------------------------------------------------------- */
  COMMUNITIES: {
    carpyy: 'https://discord.gg/Carpyy',
    barcone: 'https://discord.gg/yTY2dat3J',
    auramen: 'https://discord.gg/vV7pWrFhv'
  },

  /* --- Social ------------------------------------------------------------- */
  SOCIAL: {
    twitch: {
      url: 'https://www.twitch.tv/juliettamos',
      username: 'juliettamos'
    },
    tiktok: {
      url: 'https://www.tiktok.com/@auramen07',
      username: '@auramen07'
    },
    youtube: {
      url: 'https://www.youtube.com/channel/UCQZZ5nB-KXesk0EzXOSZacA',
      username: 'Canale ufficiale'
    },
    github: {
      url: 'https://github.com/julienvinciguerra-wq',
      username: 'julienvinciguerra-wq'
    },
    discord: {
      url: '',
      username: "auramen_'s Swamp"
    }
  },

  /* --- Pagamenti ---------------------------------------------------------- */
  PAYMENTS: {
    paypal: '',
    amazonGiftCard: ''
  },

  /* --- Progetti Minecraft ------------------------------------------------- */
  PROJECTS: [
    {
      category: 'resourcepacks',
      title: 'Texture Pack — itzcp',
      description: 'Texture pack realizzata per il content creator TikTok itzcp.',
      tag: 'Creator pack',
      creator: 'itzcp',
      creatorImage: 'assets/logos/itzcp.jpeg',
      creatorUrl: 'https://www.tiktok.com/@itzcp3',
      downloadUrl: ''
    },
    {
      category: 'resourcepacks',
      title: 'Texture Pack — IlN3roneTattico',
      description: 'Texture pack realizzata per il content creator TikTok IlN3roneTattico.',
      tag: 'Creator pack',
      creator: 'IlN3roneTattico',
      creatorImage: 'assets/logos/iln3ronetattico.jpeg',
      creatorUrl: 'https://www.tiktok.com/@iln3ronetattico',
      downloadUrl: 'https://rekonise.com/iln3ronetattico-pack-12111-d9mee'
    }
  ]
};