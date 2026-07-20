/* ============================================================
   Tota Industry — Video Catalogue
   ------------------------------------------------------------
   To add a new video, simply append an object to the VIDEOS
   array below. The video will automatically appear on the
   correct page (page = Math.ceil(index / videosPerPage)).

   Fields:
     id          : unique string
     title       : video title (also used for search)
     movieName   : movie / show name (optional, for search)
     keywords    : array of extra search keywords (optional)
     videoUrl    : Cloudflare R2 streaming URL
     downloadUrl : direct download URL
     thumbnail   : optional poster image URL
     category    : e.g. "Demo", "Drama", "Music"
     page        : page number (1..10) — optional, auto-calculated
   ============================================================ */

const VIDEOS = [
  /* ---------- PAGE 1 ---------- */
  {
    id: "v001",
    title: "Fatima Jatoi Video",
    movieName: "Fatima Jatoi",
    keywords: ["leak", "fatimajatoi", "demo"],
    videoUrl:
      "https://pub-88c56af15f2d40a0845416c1602e9d1f.r2.dev/Fatima%20Jatoi%20leak%20video%20.mp4",
    downloadUrl:
      "https://pub-88c56af15f2d40a0845416c1602e9d1f.r2.dev/Fatima%20Jatoi%20leak%20video%20.mp4",
    thumbnail: "",
    category: "Tiktoker",
    page: 1,
  },
  {
    id: "v002",
    title: "Tissue lalo jan leak video",
    movieName: "Tissue lalo",
    keywords: ["leak", "tissuelalo", "viral"],
    videoUrl:
      "https://pub-88c56af15f2d40a0845416c1602e9d1f.r2.dev/Tissue%20Lalo%20leak%20video%20%20(1).mp4",
    downloadUrl:
      "https://pub-88c56af15f2d40a0845416c1602e9d1f.r2.dev/Tissue%20Lalo%20leak%20video%20%20(1).mp4",
    thumbnail: "",
    category: "Tiktoker",
    page: 1,
  },
];

/* ---------- Demo template generator ----------
   Fills the remaining slots (up to 200 total = 10 pages x 20)
   with empty-URL placeholders so they can be replaced later.
   These render as "Coming Soon" cards and are excluded from
   search results until given a real videoUrl.
------------------------------------------- */
(function generateDemoVideos() {
  const cfg = (typeof SITE_CONFIG !== "undefined") ? SITE_CONFIG : window.SITE_CONFIG;
  const totalNeeded = cfg.videosPerPage * cfg.totalPages; // 200
  let id = VIDEOS.length + 1;
  const categories = ["Demo", "Drama", "Music", "Movie", "Trailer", "Clip"];
  while (VIDEOS.length < totalNeeded) {
    const pageNum = Math.ceil((VIDEOS.length + 1) / cfg.videosPerPage);
    VIDEOS.push({
      id: "v" + String(id).padStart(3, "0"),
      title: "Coming Soon — Video " + id,
      movieName: "",
      keywords: [],
      videoUrl: "",
      downloadUrl: "",
      thumbnail: "",
      category: categories[id % categories.length],
      page: pageNum,
    });
    id++;
  }
})();

// Ensure every video has a computed page number
VIDEOS.forEach((v, i) => {
  const cfg = (typeof SITE_CONFIG !== "undefined") ? SITE_CONFIG : window.SITE_CONFIG;
  if (!v.page) v.page = Math.ceil((i + 1) / cfg.videosPerPage);
});

window.VIDEOS = VIDEOS;
