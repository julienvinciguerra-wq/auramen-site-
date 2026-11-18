/* AURAMEN UNIVERSE 2.0 — logica del sito (nessuna dipendenza). */
(function () {
  "use strict";
  const cfg = window.AURAMEN_CONFIG || {};
  const icons = window.AURAMEN_ICONS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
    const url = get(key);
    if (key.startsWith("community.")) return setLink(el, url, { disabledLabel: "Link da configurare" });
    setLink(el, url);
  });

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
  const CATS = [
    { id: "projects", title: "Progetti personali", desc: "Mappe, build e idee su cui sto lavorando.", icon: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M3 7l9 5 9-5"/>' },
    { id: "resourcepacks", title: "Resource pack", desc: "Texture e pack creati o personalizzati.", icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>' },
    { id: "configs", title: "Configurazioni", desc: "Impostazioni, keybind e setup consigliati.", icon: '<circle cx="12" cy="12" r="3"/><path d="M19.400 15a1.700 1.700 0 00.3 1.800l.1.100a2 2 0 11-2.800 2.800l-.1-.1a1.700 1.700 0 00-1.800-.3 1.700 1.700 0 00-1 1.500V21a2 2 0 11-4 0v-.1a1.700 1.700 0 00-1.100-1.500 1.700 1.700 0 00-1.800.3l-.1.100a2 2 0 11-2.800-2.800l.1-.1a1.700 1.700 0 00.3-1.800 1.700 1.700 0 00-1.500-1H3a2 2 0 110-4h.1a1.700 1.700 0 001.500-1.100 1.700 1.700 0 00-.3-1.800l-.1-.1a2 2 0 112.800-2.800l.1.100a1.700 1.700 0 001.800.3H9a1.700 1.700 0 001-1.500V3a2 2 0 114 0v.1a1.700 1.700 0 001 1.500 1.700 1.700 0 001.800-.3l.1-.1a2 2 0 112.800 2.800l-.1.100a1.700 1.700 0 00-.3 1.800V9a1.700 1.700 0 001.500 1H21a2 2 0 110 4h-.1a1.700 1.700 0 00-1.500 1z"/>' },
    { id: "community", title: "Community", desc: "Server e community Minecraft che frequento.", icon: '<circle cx="9" cy="8" r="3.500"/><path d="M2 20c0-3.500 3-6 7-6s7 2.500 7 6"/><path d="M17 11a3 3 0 100-6M22 20c0-2.500-1.500-4.500-4-5.500"/>' },
    { id: "content", title: "Contenuti Minecraft", desc: "Video, live e clip a tema Minecraft.", icon: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.500l5 2.500-5 2.500z"/>' }
  ];
  const mcCats = $("#mcCats");
  if (mcCats) {
    const projects = Array.isArray(cfg.PROJECTS) ? cfg.PROJECTS : [];
    CATS.forEach((cat, i) => {
      const items = projects.filter((p) => p && p.category === cat.id && p.title);
      const card = document.createElement("article");
      card.className = "cat-card glass reveal"; card.style.setProperty("--d", i * 60 + "ms");
      card.innerHTML = `<span class="cat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cat.icon}</svg></span><h3></h3><p class="cat-desc"></p>`;
      card.querySelector("h3").textContent = cat.title;
      card.querySelector(".cat-desc").textContent = cat.desc;
      if (items.length) {
        const list = document.createElement("div"); list.className = "cat-items";
        items.forEach((p) => {
          const el = document.createElement(isHttp(p.url) ? "a" : "div");
          el.className = "cat-item";
          if (isHttp(p.url)) { el.href = p.url; el.target = "_blank"; el.rel = "noopener noreferrer"; }
          const b = document.createElement("b"); b.textContent = p.title;
          if (p.tag) { const t = document.createElement("i"); t.textContent = p.tag; b.appendChild(t); }
          el.appendChild(b);
          if (p.description) { const s = document.createElement("span"); s.textContent = p.description; el.appendChild(s); }
          list.appendChild(el);
        });
        card.appendChild(list);
      } else {
        const e = document.createElement("div"); e.className = "cat-empty"; e.textContent = "In arrivo"; card.appendChild(e);
      }
      mcCats.appendChild(card);
    });
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
    bgVideo.play().catch((err) => console.warn("Errore play video:", err));
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
  // Il video di sfondo resta attivo anche con Risparmio dati / Movimento ridotto.
  // Parte silenzioso in autoplay e l’audio viene attivato solo su richiesta.
  bgVideo.muted = true;
  bgVideo.playsInline = true;
  bgVideo.play().catch((err) => console.warn("Autoplay video non riuscito:", err));
  // Risparmio batteria/FPS: pausa il video quando la scheda è nascosta
  document.addEventListener("visibilitychange", () => {
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
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else { $$(".reveal").forEach((el) => el.classList.add("in")); }

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
