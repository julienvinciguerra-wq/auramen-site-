/* AURAMEN UNIVERSE 2.0 â€” logica del sito (nessuna dipendenza). */
(function () {
  "use strict";
  const cfg = window.AURAMEN_CONFIG || {};
  const icons = window.AURAMEN_ICONS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lite = reduceMotion || (navigator.connection && navigator.connection.saveData);

  const isHttp = (u) => typeof u === "string" && /^https?:\/\//i.test(u.trim());
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), cfg);

  /* ---------- Icone ufficiali ---------- */
  $$("path[data-icon]").forEach((p) => { const d = icons[p.dataset.icon]; if (d) p.setAttribute("d", d); });

  /* ---------- Link configurabili ---------- */
  function setLink(el, url, { disabledLabel } = {}) {
    if (isHttp(url)) {
      el.href = url; el.removeAttribute("aria-disabled"); el.classList.remove("is-disabled");
    } else {
      el.removeAttribute("href"); el.setAttribute("aria-disabled", "true"); el.classList.add("is-disabled");
      if (disabledLabel) el.textContent = disabledLabel;
    }
  }
  const serverUrl = cfg.DISCORD_SERVER_URL;
  const ticketUrl = cfg.DISCORD_TICKET_URL;

  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    if (key === "server") return setLink(el, serverUrl);
    if (key.startsWith("community.")) {
      const communityName = key.slice("community.".length);
      return setLink(el, (cfg.COMMUNITIES || {})[communityName], { disabledLabel: "Link da configurare" });
    }
    const url = get(key);
    setLink(el, url);
  });

  /* ---------- Profilo Discord dinamico ---------- */
  const discordApiUrl = cfg.DISCORD_PROFILE_API_URL;
  const discordAvatar = $("[data-discord-avatar]");
  const discordName = $("[data-discord-name]");
  const discordDot = $("[data-discord-status-dot]");
  const discordStatusText = $("[data-discord-status-text]");
  const discordCustomStatus = $("[data-discord-custom-status]");
  const discordStatusLabels = {
    online: "Online",
    idle: "Assente",
    dnd: "Non disturbare",
    offline: "Offline"
  };

  async function refreshDiscordProfile() {
    if (!discordApiUrl || !discordAvatar || document.hidden) return;
    try {
      const response = await fetch(discordApiUrl.replace(/\/$/, "") + "/api/discord-profile", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const profile = await response.json();

      if (profile.avatarUrl && isHttp(profile.avatarUrl)) {
        if (discordAvatar.src !== profile.avatarUrl) discordAvatar.src = profile.avatarUrl;
      }
      if (profile.displayName && discordName) discordName.textContent = profile.displayName;

      const status = Object.prototype.hasOwnProperty.call(discordStatusLabels, profile.status)
        ? profile.status : "offline";
      if (discordDot) {
        discordDot.className = "status-dot is-" + status;
        discordDot.title = discordStatusLabels[status];
      }
      if (discordStatusText) discordStatusText.textContent = discordStatusLabels[status];

      if (discordCustomStatus) {
        const custom = typeof profile.customStatus === "string" ? profile.customStatus.trim() : "";
        discordCustomStatus.textContent = custom;
        discordCustomStatus.hidden = !custom;
      }
    } catch (error) {
      if (discordStatusText) discordStatusText.textContent = "Stato Discord non raggiungibile";
      console.warn("Profilo Discord non aggiornato:", error);
    }
  }

  if (discordApiUrl) {
    refreshDiscordProfile();
    window.setInterval(refreshDiscordProfile, 30000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshDiscordProfile();
    });
  }

  /* ---------- Informazioni pubbliche del server Discord ---------- */
  const serverIcon = $("[data-server-icon]");
  const serverBanner = $("[data-server-banner]");
  const serverName = $("[data-server-name]");
  const serverDescription = $("[data-server-description]");
  const serverMembers = $("[data-server-members]");
  const serverCounters = $("[data-server-counters]");

  async function refreshDiscordServer() {
    if (!discordApiUrl || !serverName || document.hidden) return;
    try {
      const response = await fetch(discordApiUrl.replace(/\/$/, "") + "/api/discord-server", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const serverInfo = await response.json();

      if (serverInfo.name) serverName.textContent = serverInfo.name;
      if (serverDescription) {
        serverDescription.textContent = serverInfo.description || "Community ufficiale Discord";
      }
      if (serverIcon && isHttp(serverInfo.iconUrl) && serverIcon.src !== serverInfo.iconUrl) {
        serverIcon.src = serverInfo.iconUrl;
      }
      if (serverBanner) {
        if (isHttp(serverInfo.bannerUrl)) {
          serverBanner.src = serverInfo.bannerUrl;
          serverBanner.hidden = false;
        } else {
          serverBanner.removeAttribute("src");
          serverBanner.hidden = true;
        }
      }
      if (serverMembers) {
        const count = Number(serverInfo.memberCount);
        serverMembers.textContent = Number.isFinite(count) && count >= 0
          ? count.toLocaleString("it-IT") + " membri"
          : "";
      }
    } catch (error) {
      console.warn("Informazioni server Discord non aggiornate:", error);
      if (serverMembers && !serverMembers.textContent) serverMembers.textContent = "Dati server in caricamento";
    }
  }

  if (discordApiUrl && serverName) {
    refreshDiscordServer();
    window.setInterval(refreshDiscordServer, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshDiscordServer();
    });
  }

  async function refreshDiscordServerCounters() {
    if (!discordApiUrl || !serverCounters || document.hidden) return;
    try {
      const response = await fetch(discordApiUrl.replace(/\/$/, "") + "/api/discord-servers", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      serverCounters.replaceChildren();
      (Array.isArray(data.servers) ? data.servers : []).forEach((server) => {
        if (!server || typeof server.name !== "string") return;
        const item = document.createElement("div");
        item.className = "server-counter-item";
        const name = document.createElement("span");
        name.className = "server-counter-name";
        name.textContent = server.name;
        const count = document.createElement("strong");
        count.className = "server-counter-value";
        const members = Number(server.memberCount);
        count.textContent = Number.isFinite(members) && members >= 0
          ? members.toLocaleString("it-IT") + " membri"
          : "Conteggio non disponibile";
        item.append(name, count);
        serverCounters.appendChild(item);
      });
      serverCounters.hidden = !serverCounters.childElementCount;
    } catch (error) {
      console.warn("Contatori membri Discord non aggiornati:", error);
    }
  }

  if (discordApiUrl && serverCounters) {
    refreshDiscordServerCounters();
    window.setInterval(refreshDiscordServerCounters, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshDiscordServerCounters();
    });
  }

  const social = cfg.SOCIAL || {};
  $$("[data-social]").forEach((el) => {
    const s = social[el.dataset.social] || {};
    setLink(el, s.url || (el.dataset.social === "discord" ? serverUrl : ""));
  });
  $$("[data-user]").forEach((el) => { const s = social[el.dataset.user]; if (s && s.username) el.textContent = s.username; });
  $$("[data-ticket-channel]").forEach((el) => { if (cfg.DISCORD_TICKET_CHANNEL_NAME) el.textContent = cfg.DISCORD_TICKET_CHANNEL_NAME; });

  /* ---------- Pulsanti ticket ---------- */
  // Con DISCORD_TICKET_URL: collega al canale del pannello. Senza: guida + invito al server.
  $$("[data-ticket]").forEach((el) => {
    if (isHttp(ticketUrl)) {
      el.href = ticketUrl; el.target = "_blank"; el.rel = "noopener noreferrer";
    } else {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("ticketModal");
      });
    }
  });

  /* ---------- Progetti Minecraft ---------- */
  /* ---------- Resource pack Minecraft ---------- */
  const mcCats = $("#mcCats");
  if (mcCats) {
    const packs = (Array.isArray(cfg.PROJECTS) ? cfg.PROJECTS : [])
      .filter((p) => p && p.category === "resourcepacks" && p.title);

    mcCats.classList.add("resourcepack-grid");
    if (!packs.length) {
      const empty = document.createElement("div");
      empty.className = "cat-empty";
      empty.textContent = "Resource pack in arrivo";
      mcCats.appendChild(empty);
    }

    packs.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "resourcepack-card glass reveal";
      card.style.setProperty("--d", (i * 90) + "ms");

      const head = document.createElement("div");
      head.className = "resourcepack-head";

      if (p.creatorImage) {
        const logo = document.createElement("img");
        logo.className = "resourcepack-creator-logo";
        logo.src = p.creatorImage;
        logo.alt = "Logo profilo " + (p.creator || "creator");
        logo.loading = "lazy";
        logo.onerror = () => { logo.hidden = true; };
        head.appendChild(logo);
      }

      const titleWrap = document.createElement("div");
      titleWrap.className = "resourcepack-title-wrap";
      const title = document.createElement("h3");
      title.textContent = p.title;
      titleWrap.appendChild(title);
      if (p.tag) {
        const tag = document.createElement("span");
        tag.className = "resourcepack-tag";
        tag.textContent = p.tag;
        titleWrap.appendChild(tag);
      }
      head.appendChild(titleWrap);
      card.appendChild(head);

      if (p.description) {
        const description = document.createElement("p");
        description.className = "resourcepack-description";
        description.textContent = p.description;
        card.appendChild(description);
      }

      const actions = document.createElement("div");
      actions.className = "resourcepack-actions";

      if (p.creator && isHttp(p.creatorUrl)) {
        const creatorLink = document.createElement("a");
        creatorLink.className = "resourcepack-button resourcepack-profile";
        creatorLink.href = p.creatorUrl;
        creatorLink.target = "_blank";
        creatorLink.rel = "noopener noreferrer";
        creatorLink.textContent = "Visita TikTok di " + p.creator;
        actions.appendChild(creatorLink);
      }

      const downloadUrl = isHttp(p.downloadUrl) ? p.downloadUrl : (isHttp(p.url) ? p.url : "");
      if (downloadUrl) {
        const downloadLink = document.createElement("a");
        downloadLink.className = "resourcepack-button resourcepack-download";
        downloadLink.href = downloadUrl;
        downloadLink.target = "_blank";
        downloadLink.rel = "noopener noreferrer";
        downloadLink.textContent = "Scarica la resource pack";
        actions.appendChild(downloadLink);
      } else {
        const pending = document.createElement("span");
        pending.className = "resourcepack-pending";
        pending.textContent = "Download prossimamente";
        actions.appendChild(pending);
      }

      card.appendChild(actions);
      mcCats.appendChild(card);
    });

    if ("IntersectionObserver" in window && !reduceMotion) {
      const packReveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("in", entry.isIntersecting));
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      $$(".resourcepack-card.reveal", mcCats).forEach((el) => packReveal.observe(el));
    } else {
      $$(".resourcepack-card.reveal", mcCats).forEach((el) => el.classList.add("in"));
    }
  }

  const nickBtn = $("#copyNick");
  if (nickBtn) {
    $("code", nickBtn).textContent = cfg.MINECRAFT_NICK || "auramen_";
    nickBtn.addEventListener("click", async () => {
      const state = $(".copy-state", nickBtn);
      try { await navigator.clipboard.writeText(cfg.MINECRAFT_NICK || "auramen_"); state.textContent = "Copiato!"; }
      catch (e) { state.textContent = "Selezionalo a mano"; }
      setTimeout(() => (state.textContent = "Copia"), 1800);
    });
  }
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Entrata, video e volume (originali) ---------- */
  const bgVideo = $("#bgVideo"), enterOverlay = $("#enterOverlay"), volumeRange = $("#volumeRange"), volumeWidget = $("#volumeWidget");
  function enterSite() {
    enterOverlay.classList.add("hidden");
    bgVideo.muted = false; bgVideo.volume = parseFloat(volumeRange.value);
    if (!lite) bgVideo.play().catch((err) => console.warn("Errore play video:", err));
  }
  enterOverlay.addEventListener("click", enterSite);
  enterOverlay.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterSite(); } });
  $("#volumeToggleBtn").addEventListener("click", () => volumeWidget.classList.toggle("visible"));
  volumeRange.addEventListener("input", (e) => { const v = parseFloat(e.target.value); bgVideo.volume = v; bgVideo.muted = v === 0; });
  document.addEventListener("click", (e) => { const c = $(".volume-container"); if (c && !c.contains(e.target)) volumeWidget.classList.remove("visible"); });

  bgVideo.loop = true;
  bgVideo.addEventListener("canplay", () => bgVideo.classList.remove("loading"));
  bgVideo.addEventListener("error", () => { bgVideo.classList.remove("loading"); bgVideo.style.display = "none"; });
  if (bgVideo.readyState >= 3) bgVideo.classList.remove("loading");
  if (lite) { bgVideo.removeAttribute("autoplay"); bgVideo.pause(); bgVideo.classList.remove("loading"); }
  // Risparmio batteria/FPS: pausa il video quando la scheda Ã¨ nascosta
  document.addEventListener("visibilitychange", () => {
    if (lite) return;
    if (document.hidden) bgVideo.pause(); else if (enterOverlay.classList.contains("hidden") || bgVideo.muted) bgVideo.play().catch(() => {});
  });

  /* ---------- Navbar ---------- */
  const nav = $("#nav"), burger = $("#navBurger"), navLinks = $("#navLinks");
  const closeMenu = () => { navLinks.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Apri il menu"); };
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) closeMenu(); });
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 24), { passive: true });

  // Sezione attiva
  const links = new Map($$("[data-nav]").map((a) => [a.dataset.nav, a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.remove("active"));
      const a = links.get(en.target.id); if (a) a.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-section]").forEach((s) => spy.observe(s));

  /* ---------- Scroll reveal ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Aggiunge la classe quando l'elemento entra nella vista e la rimuove
        // quando esce: l'animazione si ripete sia scendendo sia risalendo.
        entry.target.classList.toggle("in", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach((el) => revealObserver.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Luce che segue il cursore (solo mouse, solo elementi visibili) ---------- */
  if (finePointer && !reduceMotion) {
    const visible = new Set();
    const vis = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))));
    $$(".glass").forEach((el) => vis.observe(el));
    let raf = 0, px = 0, py = 0;
    const update = () => {
      raf = 0;
      visible.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", Math.max(-20, Math.min(120, ((px - r.left) / r.width) * 100)).toFixed(1) + "%");
        el.style.setProperty("--my", Math.max(-20, Math.min(120, ((py - r.top) / r.height) * 100)).toFixed(1) + "%");
      });
    };
    window.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  }

  /* ---------- Modali ---------- */
  let lastFocus = null;
  function openModal(id) {
    const m = document.getElementById(id); if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add("open"); document.body.classList.add("no-scroll");
    const c = $(".close-btn", m); if (c) c.focus();
  }
  function closeModal(id) {
    const m = document.getElementById(id); if (!m) return;
    m.classList.remove("open");
    if (!$(".modal-backdrop.open")) document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-open-modal]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.openModal)));
  $$(".modal-backdrop").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m) closeModal(m.id); });
    $$("[data-close-modal]", m).forEach((b) => b.addEventListener("click", () => closeModal(m.id)));
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal-backdrop.open").forEach((m) => closeModal(m.id)); });

  /* ---------- Cookie (originale) ---------- */
  $("#cookieCorner").addEventListener("click", () => openModal("cookieModal"));
  $$("[data-cookie]").forEach((b) => b.addEventListener("click", () => {
    try { localStorage.setItem("auramen_cookie", "accepted"); } catch (err) { console.warn("LocalStorage non accessibile:", err); }
    closeModal("cookieModal");
  }));
})();

