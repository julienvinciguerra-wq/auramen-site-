/* Skin Minecraft 3D (skinview3d). Carica assets/skins/auramen.png se esiste,
   altrimenti un modello neutro etichettato. Nessuna skin casuale/altrui. */
(function () {
  "use strict";
  const cfg = window.AURAMEN_CONFIG || {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewers = [];

  function probe(url) {
    return new Promise((resolve) => {
      if (!url) return resolve(false);
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth === 64 && (img.naturalHeight === 64 || img.naturalHeight === 32));
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function webglOk() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }

  async function mount(host, opts) {
    const canvas = host.querySelector("canvas");
    const fallback = host.querySelector(".skin-fallback");
    const badge = host.querySelector(".skin-badge");
    const showFallback = () => { host.classList.add("is-fallback"); if (fallback) fallback.hidden = false; };

    if (!window.skinview3d || !webglOk()) return showFallback();

    try {
      const hasCustom = await probe(cfg.MINECRAFT_SKIN_PNG);
      const skinUrl = hasCustom ? cfg.MINECRAFT_SKIN_PNG : "assets/skins/placeholder.png";
      const rect = host.getBoundingClientRect();
      const viewer = new skinview3d.SkinViewer({
        canvas,
        width: Math.max(160, Math.round(rect.width)),
        height: Math.max(220, Math.round(rect.height)),
        skin: skinUrl,
        model: hasCustom ? (cfg.MINECRAFT_SKIN_MODEL || "auto-detect") : "default",
        enableControls: true,
        zoom: opts.zoom || 0.82,
        fov: 40,
        renderPaused: false
      });
      viewer.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      viewer.playerObject.rotation.y = -0.55; // leggera vista 3/4 iniziale
      viewer.controls.enableZoom = false;   // la rotella scorre la pagina
      viewer.controls.enablePan = false;
      viewer.controls.rotateSpeed = 0.9;
      viewer.autoRotate = !reduce;
      viewer.autoRotateSpeed = 0.55;        // rotazione lenta
      if (!reduce) viewer.animation = new skinview3d.IdleAnimation();
      viewer.animation && (viewer.animation.speed = 0.8);
      if (badge) badge.hidden = hasCustom;
      host.dataset.skin = hasCustom ? "custom" : "placeholder";

      // Il canvas non deve bloccare lo scroll verticale su smartphone.
      canvas.style.touchAction = "pan-y";

      // Ridimensionamento
      const ro = new ResizeObserver(() => {
        const r = host.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) viewer.setSize(Math.round(r.width), Math.round(r.height));
      });
      ro.observe(host);

      // Niente rendering fuori schermo / a tab nascosta (FPS)
      let visible = true;
      const sync = () => { viewer.renderPaused = !visible || document.hidden; };
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; sync(); }, { threshold: 0.01 }).observe(host);
      document.addEventListener("visibilitychange", sync);

      // Interazione: durante il trascinamento ferma l'auto-rotazione, poi riprende
      let resumeTimer;
      canvas.addEventListener("pointerdown", () => { viewer.autoRotate = false; clearTimeout(resumeTimer); });
      const resume = () => { clearTimeout(resumeTimer); if (!reduce) resumeTimer = setTimeout(() => { viewer.autoRotate = true; }, 2500); };
      window.addEventListener("pointerup", resume);

      // Se il contesto WebGL viene perso, mostra il fallback
      canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); showFallback(); });

      viewers.push(viewer);
      host.classList.add("is-ready");
    } catch (err) {
      console.warn("Skin 3D non disponibile:", err);
      showFallback();
    }
  }

  window.AuramenSkin = { mount };
  document.querySelectorAll("[data-skin-viewer]").forEach((host) => {
    mount(host, { zoom: parseFloat(host.dataset.zoom) || 0.82 });
  });
})();
