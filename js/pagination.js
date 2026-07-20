/* ============================================================
   Tota Industry — Pagination
   Renders Prev / 1..10 / Next and highlights the active page.
   ============================================================ */

(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;

  function init() {
    const container = document.getElementById("pagination");
    if (!container) return;

    const current = window.TotaMain ? window.TotaMain.getCurrentPage() : 1;
    const total = CONFIG.totalPages;

    // Determine relative path prefix for pages
    const path = window.location.pathname.split("/").pop() || "index.html";
    const inPagesDir = /page\d+\.html/i.test(path);
    const prefix = inPagesDir ? "" : "pages/";
    const homeHref = inPagesDir ? "../index.html" : "index.html";

    function pageHref(n) {
      return n === 1 ? homeHref : prefix + "page" + n + ".html";
    }

    let html = "";
    // Prev
    if (current > 1) {
      html += '<a class="page-nav" href="' + pageHref(current - 1) + '" rel="prev">Previous</a>';
    } else {
      html += '<span class="page-nav disabled">Previous</span>';
    }
    // Numbers
    for (let i = 1; i <= total; i++) {
      if (i === current) {
        html += '<span class="page-num active">' + i + "</span>";
      } else {
        html += '<a class="page-num" href="' + pageHref(i) + '">' + i + "</a>";
      }
    }
    // Next
    if (current < total) {
      html += '<a class="page-nav" href="' + pageHref(current + 1) + '" rel="next">Next</a>';
    } else {
      html += '<span class="page-nav disabled">Next</span>';
    }

    container.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
