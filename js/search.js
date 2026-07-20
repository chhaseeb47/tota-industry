/* ============================================================
   Tota Industry — Live Search
   Real-time search across all videos. Clicking a result on
   a page other than the current one navigates to that page.
   ============================================================ */

(function () {
  "use strict";

  const VIDEOS = window.VIDEOS || [];
  const CONFIG = window.SITE_CONFIG;

  function getAllVideos() {
    return VIDEOS.filter(function (v) {
      return !!v.videoUrl; // only searchable videos
    });
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getAllVideos().filter(function (v) {
      const haystack = (
        v.title + " " +
        (v.movieName || "") + " " +
        (v.keywords || []).join(" ") + " " +
        (v.category || "")
      ).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function resultHTML(v) {
    const page = v.page;
    const href = page === 1 ? "index.html" : "pages/page" + page + ".html";
    const thumb = v.thumbnail
      ? '<img src="' + window.TotaMain.escapeAttr(v.thumbnail) + '" alt="" loading="lazy">'
      : '<div class="sr-thumb-placeholder">🎬</div>';
    return (
      '<a class="search-result" href="' + href + '" data-id="' + v.id + '">' +
      thumb +
      '<div class="sr-info"><span class="sr-title">' + window.TotaMain.escapeHTML(v.title) + "</span>" +
      '<span class="sr-meta">Page ' + page + " · " + window.TotaMain.escapeHTML(v.category) + "</span></div></a>"
    );
  }

  function init() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    if (!input || !results) return;

    let timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        const q = input.value;
        if (!q.trim()) {
          results.classList.remove("show");
          results.innerHTML = "";
          return;
        }
        const matches = search(q);
        if (matches.length === 0) {
          results.innerHTML = '<div class="search-empty">No videos found for "' + window.TotaMain.escapeHTML(q) + '"</div>';
        } else {
          results.innerHTML = matches.slice(0, 12).map(resultHTML).join("");
        }
        results.classList.add("show");
      }, 120);
    });

    // Click outside to close
    document.addEventListener("click", function (e) {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.classList.remove("show");
      }
    });

    input.addEventListener("focus", function () {
      if (input.value.trim() && results.innerHTML) results.classList.add("show");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
