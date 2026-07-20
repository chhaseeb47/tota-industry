/* ============================================================
   Tota Industry — Main JavaScript
   Handles: theme switching, sidebar, welcome popup,
            video card rendering, footer year.
   ============================================================ */

(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;
  const VIDEOS = window.VIDEOS || [];

  /* ---------- Theme ---------- */
  const THEME_KEY = "tota-theme";

  function applyTheme(theme) {
    if (!["dark", "light", "midnight"].includes(theme)) theme = CONFIG.defaultTheme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeSwitcher(theme);
  }

  function updateThemeSwitcher(theme) {
    const switcher = document.getElementById("themeSwitcher");
    if (!switcher) return;
    const labels = { dark: "🌙", light: "☀️", midnight: "✨" };
    switcher.textContent = labels[theme] || labels.dark;
    switcher.setAttribute("aria-label", "Switch theme (current: " + theme + ")");
    switcher.dataset.current = theme;
  }

  function cycleTheme() {
    const order = ["dark", "light", "midnight"];
    const current = document.documentElement.getAttribute("data-theme") || CONFIG.defaultTheme;
    const next = order[(order.indexOf(current) + 1) % order.length];
    applyTheme(next);
  }

  /* ---------- Sidebar ---------- */
  function initSidebar() {
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (!menuBtn || !sidebar) return;

    function open() {
      sidebar.classList.add("open");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    function close() {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }
    menuBtn.addEventListener("click", open);
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    // Close on link click (mobile)
    sidebar.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------- Welcome Popup ---------- */
  function initPopup() {
    const popup = document.getElementById("welcomePopup");
    if (!popup) return;
    const cfg = CONFIG.popup;
    if (!cfg.enabled) return;

    const KEY = "tota-popup-seen";
    if (cfg.showOncePerSession && sessionStorage.getItem(KEY)) {
      popup.remove();
      return;
    }

    // Inject content
    popup.querySelector(".popup-title").textContent = cfg.title;
    popup.querySelector(".popup-text").textContent = cfg.text;
    const btn = popup.querySelector(".popup-btn");
    btn.textContent = cfg.buttonText;
    btn.addEventListener("click", function () {
      window.open(CONFIG.whatsappLink, "_blank", "noopener");
      closePopup();
    });

    popup.classList.add("show");
    sessionStorage.setItem(KEY, "1");

    let timer = setTimeout(closePopup, cfg.delay);
    function closePopup() {
      clearTimeout(timer);
      popup.classList.remove("show");
      setTimeout(function () {
        popup.remove();
      }, 400);
    }
    popup.querySelector(".popup-close").addEventListener("click", closePopup);
  }

  /* ---------- Video Card Rendering ---------- */
  function videoCardHTML(video) {
    const hasVideo = !!video.videoUrl;
    const thumb = video.thumbnail
      ? '<img class="card-thumb" src="' + escapeAttr(video.thumbnail) + '" alt="' + escapeAttr(video.title) + '" loading="lazy">'
      : "";
    const player = hasVideo
      ? '<video class="card-video" controls preload="none" playsinline poster="' + escapeAttr(video.thumbnail || "") + '">' +
        '<source src="' + escapeAttr(video.videoUrl) + '" type="video/mp4">' +
        "</video>"
      : '<div class="card-placeholder"><span>Coming Soon</span></div>';

    const downloadBtn = hasVideo
      ? '<a class="btn btn-download" href="' + escapeAttr(video.downloadUrl) + '" download target="_blank" rel="noopener">Download</a>'
      : '<span class="btn btn-download disabled" aria-disabled="true">Download</span>';

    return (
      '<article class="video-card" data-id="' + escapeAttr(video.id) + '" data-title="' +
      escapeAttr(video.title.toLowerCase()) + '" data-movie="' +
      escapeAttr((video.movieName || "").toLowerCase()) + '" data-keywords="' +
      escapeAttr((video.keywords || []).join(" ").toLowerCase()) + '">' +
      '<div class="card-media">' + thumb + player +
      '<button class="btn btn-play" type="button" aria-label="Play">▶</button></div>' +
      '<div class="card-body">' +
      '<h3 class="card-title">' + escapeHTML(video.title) + "</h3>" +
      '<span class="card-category">' + escapeHTML(video.category) + "</span>" +
      '<div class="card-actions">' +
      '<button class="btn btn-play2" type="button">Play</button>' +
      downloadBtn +
      "</div></div></article>"
    );
  }

  function renderVideos(page) {
    const grid = document.getElementById("videoGrid");
    if (!grid) return;
    const list = VIDEOS.filter(function (v) {
      return v.page === page;
    });
    grid.innerHTML = list.map(videoCardHTML).join("");
    attachCardHandlers();
  }

  function attachCardHandlers() {
    document.querySelectorAll(".video-card").forEach(function (card) {
      const video = card.querySelector(".card-video");
      const playBtn = card.querySelector(".btn-play");
      const playBtn2 = card.querySelector(".btn-play2");
      const media = card.querySelector(".card-media");

      function togglePlay() {
        if (!video) return;
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
      if (playBtn) playBtn.addEventListener("click", togglePlay);
      if (playBtn2) playBtn2.addEventListener("click", togglePlay);
      if (video) {
        video.addEventListener("play", function () {
          media.classList.add("playing");
          if (playBtn) playBtn.style.display = "none";
        });
        video.addEventListener("pause", function () {
          media.classList.remove("playing");
          if (playBtn) playBtn.style.display = "";
        });
      }
    });
  }

  /* ---------- Current Page Detection ---------- */
  function getCurrentPage() {
    // index.html => page 1
    const path = window.location.pathname.split("/").pop() || "index.html";
    const m = path.match(/page(\d+)\.html/i);
    return m ? parseInt(m[1], 10) : 1;
  }

  /* ---------- Header brand + footer year ---------- */
  function initBranding() {
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = CONFIG.websiteName;
    });
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      el.href = CONFIG.whatsappLink;
    });
    document.querySelectorAll("[data-telegram]").forEach(function (el) {
      el.href = CONFIG.telegramLink;
    });
    document.querySelectorAll("[data-instagram]").forEach(function (el) {
      el.href = CONFIG.instagramLink;
    });
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Utils ---------- */
  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) {
    return escapeHTML(s);
  }

  /* ---------- Init ---------- */
  function init() {
    applyTheme(localStorage.getItem(THEME_KEY) || CONFIG.defaultTheme);
    const switcher = document.getElementById("themeSwitcher");
    if (switcher) switcher.addEventListener("click", cycleTheme);
    initBranding();
    initSidebar();
    initPopup();
    renderVideos(getCurrentPage());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for other scripts
  window.TotaMain = {
    renderVideos: renderVideos,
    getCurrentPage: getCurrentPage,
    escapeHTML: escapeHTML,
    escapeAttr: escapeAttr,
  };
})();
