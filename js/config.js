/* ============================================================
   Tota Industry — Global Configuration
   Edit everything from this single file.
   ============================================================ */

const SITE_CONFIG = {
  // Branding
  websiteName: "Tota Industry",
  tagline: "Watch & Download Premium Videos",

  // Social / external links (used by sidebar + floating button + popup)
  whatsappLink: "https://whatsapp.com/channel/0029Vb8DBYAAYlUAvrzuZ3W",
  telegramLink: "https://t.me/totaindustry",
  instagramLink: "https://instagram.com/totaindustry",

  // Welcome popup
  popup: {
    enabled: true,
    title: "New Videos Update",
    text: "New Videos Update — Follow on WhatsApp",
    buttonText: "Follow WhatsApp",
    delay: 4000, // auto-dismiss after N ms
    showOncePerSession: true, // uses sessionStorage
  },

  // Pagination
  videosPerPage: 20,
  totalPages: 10,

  // Default theme: "dark" | "light" | "midnight"
  defaultTheme: "dark",
};

// Expose globally for non-module scripts
window.SITE_CONFIG = SITE_CONFIG;
