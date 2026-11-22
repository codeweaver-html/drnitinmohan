/* KidsGastro shared site bundle — clean rebuild.
   Shared architecture and behaviour live here; each sub-page stores its own body content. */

/* ===== BLOCK: SITE_CONFIG ===== */
const SITE_CONFIG = {
  basePath: "/",
  features: {
    animations: true,
    navStyle: "hamburger", // "hamburger" | "dropdown" | "inline"
    announcementBar: true,
    whatsappBooking: true,
    whatsappFloat: true,
    photoOfMonth: true,
    videoCarousel: true,
    galleryLightbox: true,
    footerShare: true,
    backToTop: true,
    newsletter: true,
    scrollProgress: true,
    offlineCache: true
  },
  contact: {
    phoneDisplay: "+91 98210 20576",
    phoneE164: "919821020576",
    email: "drnitinmohanpaedsgastro@gmail.com",
    maps: "https://www.google.com/maps?cid=9598972484913852260&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF",
    rezeptRx: "https://rezeptrx.com/dr/dr-nitin-mohan-pediatrician-hisar",
    recaptchaSiteKey: "6LfFKg4uAAAAAOxm7Evqvms6EGZHfO5AoulNITCc",
    recaptchaVerifyUrl: "https://drnitinmohan-backend.drnitinmohanpaedsgastro.workers.dev/api/recaptcha/verify"
  },
  nav: [
    { label: "Why Dr. Nitin Mohan", path: "/about/" },
    { label: "Treatments", path: "/treatments/", children: [
      { label: "Paediatric Gastroenterology", path: "/treatments/" },
      { label: "Paediatric Hepatology — Liver Diseases", path: "/treatments/" },
      { label: "Paediatric Pancreatology — Pancreatic Disorders", path: "/treatments/" },
      { label: "Paediatric Biliary Tract Diseases", path: "/treatments/" },
      { label: "Paediatric Nutrition and Growth", path: "/treatments/" }
    ]},
    { label: "Services", path: "/services/", children: [
      { label: "Paediatric Gastrointestinal Procedures", path: "/services/" },
      { label: "Hepatology Procedures & Investigations", path: "/services/" },
      { label: "Pancreatic Investigations", path: "/services/" },
      { label: "Biliary Tract Investigations", path: "/services/" },
      { label: "Gastrointestinal Diagnostic Investigations", path: "/services/" },
      { label: "Nutrition & Growth Assessment", path: "/services/" }
    ]},
    { label: "FAQs", path: "/faqs/" },
    { label: "Blog", path: "/blog/" },
    { label: "Publication", path: "/publications/" },
    { label: "Testimonials", path: "/testimonials/" },
    { label: "Gallery", path: "/gallery/" },
    { label: "Contact Us", homeAnchor: "site-footer-mount" }
  ],
  content: {
    announcement: "OFFLINE APPOINTMENTS AVAILABLE RIGHT NOW. CLICK THE APPOINTMENT BUTTON BELOW TO PROCEED.",
    brand: "KidsGastro by Dr. Nitin Mohan",
    hospital: "Churamani Multispeciality Hospital",
    address: "Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001",
    footer: "Copyright © 2026 Dr. Nitin Mohan. All rights reserved.",
    home: {
      heroEyebrow: "Paediatric gastroenterology",
      heroTitle: "Specialist gastro care",
      aboutParagraphOne: "Dr. Nitin Mohan is a Consultant Paediatric Gastroenterologist, Hepatologist and Nutritionist at Churamani Multispeciality Hospital, Hisar. His qualifications include MBBS, MD (Paediatrics), FISPGHAN and MNNF.",
      aboutParagraphTwo: "His academic and professional journey is associated with prestigious medical institutions, including PGIMS Rohtak, Sir Ganga Ram Hospital, New Delhi, and ABVIMS & Dr. RML Hospital, New Delhi. His clinical focus includes paediatric digestive disorders, liver diseases, pancreatic conditions, feeding difficulties, poor weight gain and nutritional problems.",
      aboutLink: "Find out more",
      storiesEyebrow: "Beyond the clinic",
      storiesHeading: "Clinical work & community education",
      storiesDescription: "Selected moments from clinical practice, professional education and community health awareness.",
      clinicalImageLabel: "Clinical work",
      clinicalStoryKicker: "01 · Clinical practice",
      clinicalStoryHeading: "Care centred on children and families",
      clinicalStoryDescription: "A glimpse of the clinical setting and the work that supports paediatric digestive health.",
      educationImageLabel: "Community education",
      educationStoryKicker: "02 · Community education",
      educationStoryHeading: "Health education session",
      educationStoryDescription: "Dr. Nitin Mohan speaking at a health education event.",
      photoImageLabel: "From KidsGastro",
      photoKicker: "KidsGastro moments",
      photoHeading: "Photo of the month",
      photoDescription: "A recent moment from KidsGastro.",
      socialHeading: "Stay connected with KidsGastro",
      instagramLabel: "Instagram",
      instagramHandle: "@kidsgastro",
      instagramAction: "Visit Instagram profile ↗",
      linkedinLabel: "LinkedIn",
      linkedinName: "Dr. Nitin Mohan",
      linkedinAction: "View professional profile ↗",
      scholarLabel: "Google Scholar",
      scholarName: "Dr. Nitin Mohan",
      scholarAction: "View publications ↗",
      clinicEyebrow: "Find the clinic",
      clinicHeading: "Churamani Multispeciality Hospital",
      clinicAddress: "Delhi Road, Camp Chowk, Krishna Nagar Colony, Hisar, Haryana 125001",
      clinicPhotoCaption: "Hospital entrance",
      clinicMapAction: "Open in Google Maps ↗",
      newsletterHeading: "Newsletters",
      newsletterDescription: "Occasional updates and new resources from KidsGastro.",
      newsletterEmailLabel: "Enter your email address",
      newsletterSubmit: "Request updates"
    }
  }
};
/* ===== END BLOCK: SITE_CONFIG ===== */

(() => {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const SITE_CONTROLS_API = "https://kidsgastro-site-controls.drnitinmohanpaedsgastro.workers.dev";
  const SITE_CONTROLS_CACHE_KEY = "kg_site_controls_cache_v1";
  let siteControlsResolved = false;
  let siteBookingEnabled = false;
  const cachedSiteControls = readCachedSiteControls();
  const siteControlsRequest = startSiteControlsRequest();
  const feature = name => SITE_CONFIG.features[name] !== false;
  const EXISTING_HTML_PAGES = new Set([
    "404", "about", "admin", "blog", "faqs", "gallery", "index",
    "publications", "services", "testimonials", "treatments", "updates"
  ]);
  const configuredBase = String(SITE_CONFIG.basePath || "/");
  /* All public HTML files and shared assets are at the website root. Local file
     previews therefore use ./ while the live custom domain uses /. */
  const basePath = window.location.protocol === "file:"
    ? "./"
    : (configuredBase.endsWith("/") ? configuredBase : configuredBase + "/");
  const asset = path => basePath + String(path).replace(/^\/+/, "");
  const pageSlug = slug => String(slug).replace(/^\/+|\/+$/g, "").replace(/\.html$/i, "");
  const routePath = slug => {
    const clean = pageSlug(slug);
    if (!clean || clean.toLowerCase() === "index") return homeUrl();
    if (window.location.protocol === "file:") return asset((EXISTING_HTML_PAGES.has(clean) ? clean : "index") + ".html");
    return asset(clean + "/");
  };
  const safeText = value => String(value == null ? "" : value);
  const escapeHtml = value => safeText(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
  const currentFile = String(window.location.pathname || "").split("/").pop().replace(/\.html?$/i, "").toLowerCase();
  let activePage = body.dataset.sitePage || (currentFile && currentFile !== "index" ? currentFile : "home");
  root.dataset.navStyle = SITE_CONFIG.features.navStyle;

  function ensureSharedAssets() {
    const sharedStylesheet = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .find(link => /(?:^|\/)style-shared\.css(?:[?#]|$)/i.test(link.getAttribute("href") || ""));
    if (sharedStylesheet) {
      sharedStylesheet.href = asset("style-shared.css");
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = asset("style-shared.css");
      link.dataset.kgSharedStyles = "true";
      document.head.append(link);
    }
    const faviconUrl = `${asset("assets/kg%20logo.webp")}?v=20261122`;
    const icons = [...document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]')];
    if (icons.length) {
      icons.forEach(icon => {
        icon.href = faviconUrl;
        icon.type = "image/webp";
      });
    } else {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.href = faviconUrl;
      icon.type = "image/webp";
      document.head.append(icon);
    }
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon) appleIcon.href = faviconUrl;
  }

  /* ===== BLOCK: HEADER_FOOTER ===== */
  const homeUrl = () => window.location.protocol === "file:" ? "./" : basePath;
  /* Back to top returns to the current page, not the homepage or an in-page content anchor. */
  const pageTopUrl = () => `${window.location.pathname}${window.location.search}`;
  const hrefFor = item => {
    if (item.href) return item.href;
    if (item.homeAnchor) return `${homeUrl()}#${encodeURIComponent(item.homeAnchor)}`;
    return routePath(item.path || "index");
  };

  function ensureSharedShell() {
    let announcementMount = document.getElementById("site-announcement-mount");
    let headerMount = document.getElementById("site-header-mount");
    let footerMount = document.getElementById("site-footer-mount");
    const main = document.getElementById("site-main") || document.querySelector("main");

    if (!headerMount) {
      headerMount = document.createElement("div");
      headerMount.id = "site-header-mount";
      const skip = body.querySelector(".site-skip");
      if (skip) skip.insertAdjacentElement("afterend", headerMount);
      else body.insertBefore(headerMount, body.firstChild);
    }
    if (!announcementMount) {
      announcementMount = document.createElement("div");
      announcementMount.id = "site-announcement-mount";
      headerMount.insertAdjacentElement("afterend", announcementMount);
    } else {
      headerMount.insertAdjacentElement("afterend", announcementMount);
    }
    if (!footerMount) {
      footerMount = document.createElement("div");
      footerMount.id = "site-footer-mount";
      if (main) main.insertAdjacentElement("afterend", footerMount);
      else body.append(footerMount);
    }
  }

  function renderNav() {
    const renderItem = item => {
      const label = escapeHtml(item.label);
      const description = item.description ? `<small>${escapeHtml(item.description)}</small>` : "";
      if (Array.isArray(item.children) && item.children.length) {
        const children = item.children.map(child => `<a href="${escapeHtml(hrefFor(child))}" data-site-link>${escapeHtml(child.label)}${child.description ? `<small>${escapeHtml(child.description)}</small>` : ""}</a>`).join("");
        return `<details class="site-nav-group"><summary>${label}<span aria-hidden="true">⌄</span></summary><div class="site-nav-submenu">${children}</div></details>`;
      }
      return `<a href="${escapeHtml(hrefFor(item))}" data-site-link>${label}${description}</a>`;
    };
    const links = SITE_CONFIG.nav.map(renderItem).join("");
    /* The public Login link is intentionally last. The admin route performs
       first-stage authentication and redirects to /updates. */
    const loginAction = `<a class="site-nav-login" href="${escapeHtml(routePath("admin"))}" data-site-link>Login</a>`;
    return `<nav class="site-navigation" aria-label="Main navigation">
      <a class="site-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home">
        <img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="54" height="54">
        <span>${escapeHtml(SITE_CONFIG.content.brand)}</span>
      </a>
      <button class="site-nav-trigger" type="button" aria-controls="site-nav-links" aria-expanded="false" aria-label="Open navigation">
        <span class="nav-trigger-lines" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
      <div class="site-nav-links" id="site-nav-links">
        
        ${links}${loginAction}
      </div>
    </nav>`;
  }

  function initHeaderFooter() {
    const headerMount = document.getElementById("site-header-mount");
    if (headerMount) headerMount.innerHTML = `<header class="kg-rebuild-header">${renderNav()}</header>`;
    const footerMount = document.getElementById("site-footer-mount");
    if (footerMount) {
      footerMount.innerHTML = `<footer class="site-footer">
        <div class="site-footer-contact"><div class="site-container site-footer-grid">
          <div><strong>${escapeHtml(SITE_CONFIG.content.hospital)}</strong><p>Hisar, Haryana · Appointment enquiries welcome</p><a href="${escapeHtml(SITE_CONFIG.contact.maps)}" target="_blank" rel="noopener noreferrer">View location ↗</a></div>
          <div><strong>Phone</strong><a href="tel:+${SITE_CONFIG.contact.phoneE164}">${escapeHtml(SITE_CONFIG.contact.phoneDisplay)}</a></div>
          <div id="site-footer-share-mount"></div>
        </div></div>
        <div class="site-container site-footer-bottom"><a class="site-footer-brand" href="${escapeHtml(homeUrl())}" aria-label="KidsGastro home"><img src="${asset("assets/kg%20logo.webp")}" alt="KidsGastro logo" width="50" height="50"><span>KidsGastro<small>Paediatric Gastroenterology · Dr. Nitin Mohan</small></span></a><p>${escapeHtml(SITE_CONFIG.content.footer)}</p><a class="site-back-to-top" href="${escapeHtml(pageTopUrl())}">Back to top ↑</a></div>
      </footer>`;
    }
  }
  /* ===== END BLOCK: HEADER_FOOTER ===== */

  function initBrandLogoLinks() {
    const home = homeUrl();
    document.querySelectorAll("img").forEach(image => {
      const source = image.getAttribute("src") || "";
      const alt = image.getAttribute("alt") || "";
      const isBrandLogo = /kg(?:%20|\s)logo\.webp/i.test(source) || /kidsgastro\s+logo/i.test(alt);
      if (!isBrandLogo) return;
      const existingLink = image.closest("a");
      if (existingLink) {
        existingLink.href = home;
        existingLink.removeAttribute("target");
      } else {
        const link = document.createElement("a");
        link.className = "kg-logo-link";
        link.href = home;
        link.setAttribute("aria-label", "KidsGastro home");
        image.parentNode.insertBefore(link, image);
        link.append(image);
      }
      image.draggable = false;
    });
  }



  /* ===== BLOCK: NAV ===== */
  function setNavOpen(open) {
    const nav = document.querySelector(".site-navigation");
    const trigger = nav && nav.querySelector(".site-nav-trigger");
    const links = nav && nav.querySelector(".site-nav-links");
    if (!nav || !trigger || !links) return;
    nav.dataset.open = String(Boolean(open));
    trigger.setAttribute("aria-expanded", String(Boolean(open)));
    trigger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }

  function initNav() {
    const nav = document.querySelector(".site-navigation");
    if (!nav) return;
    const trigger = nav.querySelector(".site-nav-trigger");
    trigger.addEventListener("click", () => {
      const open = nav.dataset.open !== "true";
      setNavOpen(open);
    });
    const closeFromOutside = event => {
      if (nav.contains(event.target)) return;
      nav.querySelectorAll(".site-nav-group[open]").forEach(group => { group.open = false; });
      if (nav.dataset.open === "true") setNavOpen(false);
    };
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("click", event => {
      if (event.target.closest(".site-nav-links a")) setNavOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.dataset.open === "true") {
        setNavOpen(false);
        trigger.focus();
      }
    });
  }
  /* ===== END BLOCK: NAV ===== */

  /* ===== BLOCK: CLEAN_URLS ===== */
  function initCanonicalUrls() {
    if (window.location.protocol === "file:" || activePage === "not-found") return;
    const currentSlug = pageSlug(window.location.pathname);
    const cleanSlug = !currentSlug || currentSlug.toLowerCase() === "index" ? "" : currentSlug;
    const cleanPath = cleanSlug ? `/${cleanSlug}/` : "/";
    const canonicalUrl = `${window.location.origin}${cleanPath}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
    let openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (openGraphUrl) openGraphUrl.content = canonicalUrl;
    if (window.location.pathname !== cleanPath && /(?:index|[a-z0-9-]+)\.html?$/i.test(window.location.pathname)) {
      window.history.replaceState(window.history.state, "", cleanPath + window.location.search + window.location.hash);
    }
  }
  /* ===== END BLOCK: CLEAN_URLS ===== */

  /* ===== BLOCK: PAGE_ROUTING ===== */
  function initPage() {
    const target = document.getElementById("site-page-content");
    const main = document.getElementById("site-main");
    if (!target || !main) return;

    target.querySelectorAll("a[href^='/']").forEach(link => {
      const href = link.getAttribute("href");
      const clean = href.replace(/^\/+|\/+$/g, "");
      const route = pageSlug(clean);
      link.setAttribute("href", EXISTING_HTML_PAGES.has(route) ? routePath(route) : asset(clean));
    });
    target.querySelectorAll("img[src^='/']").forEach(image => {
      image.setAttribute("src", asset(image.getAttribute("src")));
    });
    main.classList.add("site-page-main");
  }
  /* ===== END BLOCK: PAGE_ROUTING ===== */

  /* ===== BLOCK: HOME_CONTENT ===== */
  function initHomeContent() {
    if (activePage !== "home") return;
    const values = SITE_CONFIG.content.home || {};
    document.querySelectorAll("[data-site-copy]").forEach(element => {
      const key = element.dataset.siteCopy;
      if (Object.prototype.hasOwnProperty.call(values, key)) element.textContent = values[key];
    });
  }
  /* ===== END BLOCK: HOME_CONTENT ===== */

  /* ===== BLOCK: HERO_TYPING ===== */
  function initHeroTyping() {
    const target = document.querySelector("[data-typed-phrase]");
    if (!target) return;

    const phrases = ["for children", "in Hisar"];
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDuration = 400;
    target.textContent = phrases[0];
    if (reduceMotion) return;

    let index = 0;
    window.setInterval(() => {
      target.classList.add("is-fading");
      window.setTimeout(() => {
        index = (index + 1) % phrases.length;
        target.textContent = phrases[index];
        target.classList.remove("is-fading");
      }, fadeDuration);
    }, 3200);
  }
  /* ===== END BLOCK: HERO_TYPING ===== */

  /* ===== BLOCK: ANNOUNCEMENT ===== */
  function initAnnouncement() {
    if (!feature("announcementBar")) return;
    const mount = document.getElementById("site-announcement-mount");
    if (!mount) return;
    const text = escapeHtml(SITE_CONFIG.content.announcement);
    mount.innerHTML = `<div class="site-announcement" role="region" aria-label="KidsGastro announcement"><div class="site-announcement-track"><span>${text}</span><span aria-hidden="true">${text}</span><span aria-hidden="true">${text}</span><span aria-hidden="true">${text}</span></div></div>`;

    const ticker = mount.querySelector(".site-announcement");
    applyAnnouncementSettings(cachedSiteControls, ticker);
    let resumeTimer = 0;
    const pauseTicker = event => {
      if (event.pointerType === "mouse") return;
      window.clearTimeout(resumeTimer);
      ticker.classList.add("is-paused");
    };
    const resumeTicker = event => {
      if (event.pointerType === "mouse") return;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => ticker.classList.remove("is-paused"), 1700);
    };

    if ("PointerEvent" in window) {
      ticker.addEventListener("pointerdown", pauseTicker, { passive: true });
      window.addEventListener("pointerup", resumeTicker, { passive: true });
      window.addEventListener("pointercancel", resumeTicker, { passive: true });
    } else {
      ticker.addEventListener("touchstart", pauseTicker, { passive: true });
      window.addEventListener("touchend", resumeTicker, { passive: true });
      window.addEventListener("touchcancel", resumeTicker, { passive: true });
    }
  }
  /* ===== END BLOCK: ANNOUNCEMENT ===== */

  /* ===== BLOCK: BOOKING ===== */
  function initBooking() {
    const picker = document.querySelector(".appointment-picker");
    if (!feature("whatsappBooking")) {
      if (picker) picker.hidden = true;
      const existingDialog = document.getElementById("kg-rb-booking-dialog");
      if (existingDialog) existingDialog.hidden = true;
      return;
    }
    if (picker) picker.hidden = false;
    const initialTrigger = document.getElementById("appointment-trigger");
    if (initialTrigger && !siteControlsResolved) {
      initialTrigger.disabled = true;
      initialTrigger.setAttribute("aria-disabled", "true");
    }

    const bookingMarkup = `
      <form id="booking-form" class="booking-form" novalidate>
        <div class="booking-head"><h2 id="kg-rb-booking-heading">Enter details</h2><button type="button" class="dialog-close" data-close-booking aria-label="Close appointment form">×</button></div>
        <div class="booking-fields">
          <label>Child’s name<input id="booking-child-name" name="childName" type="text" autocomplete="name" required></label>
          <label>Child’s age<input id="booking-child-age" name="childAge" type="number" min="0" step="0.1" required><span>years</span></label>
          <label>Phone number<input id="booking-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" minlength="10" maxlength="10" pattern="[0-9]{10}" placeholder="10-digit phone number" required></label>
          <label class="booking-date-label">Preferred date<input id="booking-date" name="date" type="date" required><small class="booking-date-hint">Choose from today and tomorrow.</small></label>
          <label class="booking-time-field">Preferred time (30-minute slots)
            <input id="booking-time" name="time" type="hidden" required>
            <div id="booking-slot-grid" class="booking-slot-grid" role="group" tabindex="-1" aria-label="Available 30-minute appointment slots"></div>
            <small id="booking-slot-hint" class="booking-slot-hint" aria-live="polite">Enter a date.</small>
          </label>
        </div>
        <div id="recaptcha-slot" class="recaptcha-slot" role="group" aria-label="reCAPTCHA verification"></div>
        <p class="captcha-disclosure">This site is protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a> apply.</p>
        <p id="booking-error" class="site-status" role="status" aria-live="polite"></p>
        <div class="booking-actions"><button type="button" class="site-button site-button-secondary" data-close-booking>Cancel</button><button type="submit" class="site-button site-button-primary" id="booking-submit">Continue to WhatsApp</button></div>
      </form>`

    let dialog = document.getElementById("kg-rb-booking-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "kg-rb-booking-dialog";
      dialog.id = "kg-rb-booking-dialog";
      dialog.setAttribute("aria-labelledby", "kg-rb-booking-heading");
      dialog.innerHTML = bookingMarkup;
      body.append(dialog);
    } else {
      dialog.innerHTML = bookingMarkup;
    }

    let floatingButton = document.getElementById("floating-booking");
    if (!floatingButton) {
      floatingButton = document.createElement("button");
      floatingButton.className = "floating-booking";
      floatingButton.id = "floating-booking";
      floatingButton.type = "button";
      floatingButton.hidden = true;
      floatingButton.setAttribute("aria-label", "Book via WhatsApp");
      floatingButton.title = "Book via WhatsApp";
      body.append(floatingButton);
    }

    const form = dialog.querySelector("#booking-form");
    const trigger = document.getElementById("appointment-trigger");
    const options = document.getElementById("appointment-options");
    const dateInput = dialog.querySelector("#booking-date");
    const timeInput = dialog.querySelector("#booking-time");
    const slotGrid = dialog.querySelector("#booking-slot-grid");
    const slotHint = dialog.querySelector("#booking-slot-hint");
    const error = dialog.querySelector("#booking-error");
    const submit = dialog.querySelector("#booking-submit");
    if (!form || !dateInput || !timeInput || !slotGrid || !error || !submit) return;

    let recaptchaWidget = null;
    let recaptchaLoading = null;
    let recaptchaToken = "";
    let recaptchaPending = null;
    let requestInProgress = false;
    let attemptId = 0;
    let activeVerifyController = null;
    let lastOpener = null;

    let today = new Date();
    let tomorrow = new Date(today);
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    let todayKey = "";
    let tomorrowKey = "";
    function refreshDateBounds() {
      today = new Date();
      today.setHours(0, 0, 0, 0);
      tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      todayKey = dateKey(today);
      tomorrowKey = dateKey(tomorrow);
      dateInput.min = todayKey;
      dateInput.max = tomorrowKey;
      if (dateInput.value && (dateInput.value < todayKey || dateInput.value > tomorrowKey)) {
        dateInput.value = "";
      }
    }
    refreshDateBounds();
    const dateLabel = dateInput.closest(".booking-date-label");
    if (dateLabel) dateLabel.addEventListener("click", event => {
      if (event.target !== dateInput && typeof dateInput.showPicker === "function") {
        event.preventDefault();
        try { dateInput.showPicker(); } catch (_) { dateInput.focus(); }
      }
    });

    const bookedSlotsByWeekday = { 0:[660,750], 1:[540,1050], 2:[810,1020], 3:[570,1050], 4:[780,1020], 5:[540,1050], 6:[810,1020] };
    function isDialogOpen() { return Boolean(dialog.open || dialog.hasAttribute("open")); }
    function weekdayForKey(key) { const [y,m,d] = key.split("-").map(Number); return new Date(y, m - 1, d).getDay(); }
    function allowedWindows(key) { return weekdayForKey(key) === 0 ? [[600,840]] : [[540,840],[960,1080]]; }
    function isBooked(key, mins) { return (bookedSlotsByWeekday[weekdayForKey(key)] || []).includes(mins); }
    function asClock(total) {
      const h24 = Math.floor(total / 60), min = total % 60, h = h24 % 12 || 12, period = h24 >= 12 ? "PM" : "AM";
      return { h, min, period, text: `${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}` };
    }
    function rangeLabel(start, end) {
      const a = asClock(start), b = asClock(end);
      return a.period === b.period ? `${a.text}–${b.text} ${b.period}` : `${a.text} ${a.period}–${b.text} ${b.period}`;
    }
    let selectedTimeText = "";
    function renderSlots(key) {
      slotGrid.replaceChildren();
      timeInput.value = "";
      timeInput.disabled = !key;
      selectedTimeText = "";
      if (slotHint) slotHint.textContent = key ? "Enter time." : "Enter date.";
      if (!key) return;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let availableCount = 0;
      let displayedCount = 0;
      for (const [start, end] of allowedWindows(key)) {
        for (let mins = start; mins < end; mins += 30) {
          if (key === todayKey && mins < currentMinutes && !isBooked(key, mins)) continue;
          const timeText = rangeLabel(mins, mins + 30);
          const option = document.createElement("button");
          option.type = "button";
          option.className = "booking-slot";
          option.dataset.minutes = String(mins);
          const timeLabel = document.createElement("span");
          timeLabel.textContent = timeText;
          option.append(timeLabel);
          displayedCount += 1;
          if (isBooked(key, mins)) {
            option.classList.add("is-booked");
            option.disabled = true;
            const state = document.createElement("small");
            state.textContent = "Slot already booked.";
            option.append(state);
            option.setAttribute("aria-label", `${timeText}. Slot already booked.`);
          } else {
            availableCount += 1;
            option.classList.add("is-available");
            option.setAttribute("aria-pressed", "false");
            option.addEventListener("click", () => {
              slotGrid.querySelectorAll(".booking-slot.is-selected").forEach(selected => {
                selected.classList.remove("is-selected");
                selected.setAttribute("aria-pressed", "false");
              });
              option.classList.add("is-selected");
              option.setAttribute("aria-pressed", "true");
              timeInput.value = String(mins);
              selectedTimeText = timeText;
              error.textContent = "";
            });
          }
          slotGrid.append(option);
        }
      }
      if (slotHint && displayedCount) slotHint.textContent = "Enter time.";
    }

    function bookingIssues() {
      const childName = dialog.querySelector("#booking-child-name").value.trim();
      const childAge = dialog.querySelector("#booking-child-age").value.trim();
      const date = dateInput.value;
      const phone = dialog.querySelector("#booking-phone").value.trim();
      const issues = [];
      if (!childName) issues.push({ message: "Enter the child’s name.", id: "booking-child-name" });
      if (!childAge || !Number.isFinite(Number(childAge)) || Number(childAge) < 0) {
        issues.push({ message: "Enter a valid age.", id: "booking-child-age" });
      }
      if (!/^\d{10}$/.test(phone)) issues.push({ message: "Enter a valid 10-digit phone number.", id: "booking-phone" });
      if (!date || date < todayKey || date > tomorrowKey) issues.push({ message: "Choose a date from today or tomorrow.", id: "booking-date" });
      const selectedMinutes = Number(timeInput.value);
      if (!timeInput.value || !Number.isFinite(selectedMinutes) || isBooked(date, selectedMinutes)) {
        issues.push({ message: "Choose an available time.", id: "booking-slot-grid" });
      }
      return issues;
    }

    dateInput.addEventListener("change", () => {
      refreshDateBounds();
      const key = dateInput.value;
      if (key && (key < todayKey || key > tomorrowKey)) {
        dateInput.value = "";
        renderSlots("");
        error.textContent = "Enter a valid date.";
        return;
      }
      error.textContent = "";
      renderSlots(key);
    });
    form.addEventListener("input", () => { error.textContent = ""; });

    function finishClose() {
      if (isDialogOpen()) return;
      if (requestInProgress) {
        attemptId += 1;
        requestInProgress = false;
        if (activeVerifyController) activeVerifyController.abort();
        activeVerifyController = null;
        submit.disabled = false;
        submit.textContent = "Continue to WhatsApp";
      }
      if (lastOpener && lastOpener.isConnected) lastOpener.focus();
      lastOpener = null;
    }

    function closeBooking() {
      if (isDialogOpen()) {
        try {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        } catch (_) {
          dialog.removeAttribute("open");
        }
      }
      /* Explicit cleanup is deliberate: it also covers non-native dialog fallbacks
         and browsers that fail to dispatch a close event after an attribute change. */
      dialog.removeAttribute("open");
      finishClose();
    }

    function openBooking(opener) {
      if (!siteControlsResolved || !siteBookingEnabled || isDialogOpen()) return;
      lastOpener = opener || null;
      form.reset();
      refreshDateBounds();
      error.textContent = "";
      selectedTimeText = "";
      if (recaptchaWidget !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(recaptchaWidget); } catch (_) {}
      }
      requestInProgress = false;
      submit.disabled = false;
      submit.textContent = "Continue to WhatsApp";
      refreshDateBounds();
      resetRecaptcha();
      renderSlots("");
      if (options) options.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (typeof setNavOpen === "function") setNavOpen(false);
      try {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      } catch (_) {
        dialog.setAttribute("open", "");
      }
      ensureRecaptcha().catch(reason => {
        if (isDialogOpen() && reason && reason.name !== "AbortError") error.textContent = reason.message;
      });
      const name = dialog.querySelector("#booking-child-name");
      if (name) name.focus();
    }

    floatingButton.addEventListener("click", () => openBooking(floatingButton));
    document.addEventListener("click", event => {
      const opener = event.target.closest && event.target.closest("[data-open-booking]");
      if (opener) {
        event.preventDefault();
        openBooking(opener);
      }
      const closeButton = event.target.closest && event.target.closest("[data-close-booking]");
      if (closeButton && dialog.contains(closeButton)) {
        event.preventDefault();
        closeBooking();
      }
    });
    if (trigger && options) {
      trigger.addEventListener("click", () => {
        const open = options.hidden;
        options.hidden = !open;
        trigger.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", event => {
        if (!options.contains(event.target) && !trigger.contains(event.target)) {
          options.hidden = true;
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    }
    dialog.addEventListener("close", finishClose);
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeBooking();
    });
    dialog.addEventListener("click", event => { if (event.target === dialog) closeBooking(); });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && isDialogOpen()) closeBooking();
    });

    function settlePendingCaptcha(errorValue, tokenValue) {
      if (!recaptchaPending) return;
      const pending = recaptchaPending;
      recaptchaPending = null;
      window.clearTimeout(pending.timeoutId);
      if (errorValue) pending.reject(errorValue);
      else pending.resolve(tokenValue);
    }

    function resetRecaptcha() {
      recaptchaToken = "";
      if (recaptchaWidget !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(recaptchaWidget); } catch (_) {}
      }
    }

    function ensureRecaptcha() {
      if (recaptchaWidget !== null) return Promise.resolve(recaptchaWidget);
      if (recaptchaLoading) return recaptchaLoading;
      recaptchaLoading = new Promise((resolve, reject) => {
        const render = () => {
          if (!window.grecaptcha || typeof window.grecaptcha.ready !== "function") {
            reject(new Error("Google reCAPTCHA is unavailable. Refresh the page and try again."));
            return;
          }
          window.grecaptcha.ready(() => {
            try {
              const slot = dialog.querySelector("#recaptcha-slot");
              recaptchaWidget = window.grecaptcha.render(slot, {
                sitekey: SITE_CONFIG.contact.recaptchaSiteKey,
                size: "invisible",
                badge: "bottomright",
                theme: "light",
                callback: token => {
                  recaptchaToken = token || "";
                  error.textContent = "";
                  if (recaptchaToken) settlePendingCaptcha(null, recaptchaToken);
                },
                "error-callback": () => {
                  const problem = new Error("Google reCAPTCHA encountered a network or configuration error. Please try again.");
                  if (isDialogOpen()) error.textContent = problem.message;
                  settlePendingCaptcha(problem);
                },
                "expired-callback": () => {
                  recaptchaToken = "";
                  const problem = new Error("reCAPTCHA verification expired. Please submit again.");
                  if (isDialogOpen()) error.textContent = problem.message;
                  settlePendingCaptcha(problem);
                }
              });
              resolve(recaptchaWidget);
            } catch (_) {
              reject(new Error("Unable to initialize invisible reCAPTCHA. Confirm that the site key is registered as Invisible reCAPTCHA v2 for drnitinmohan.com."));
            }
          });
        };
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          render();
          return;
        }
        window.__kidsGastroCaptchaReady = render;
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?onload=__kidsGastroCaptchaReady&render=explicit";
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error("Google reCAPTCHA could not be downloaded. Check your connection or browser content blocker."));
        document.head.append(script);
      }).finally(() => { recaptchaLoading = null; });
      return recaptchaLoading;
    }

    async function executeRecaptcha() {
      await ensureRecaptcha();
      if (recaptchaToken) return recaptchaToken;
      if (!window.grecaptcha || recaptchaWidget === null || typeof window.grecaptcha.execute !== "function") {
        throw new Error("Invisible reCAPTCHA is not ready. Close and reopen the appointment form.");
      }
      return new Promise((resolve, reject) => {
        const pending = {
          resolve,
          reject,
          timeoutId: window.setTimeout(() => {
            recaptchaPending = null;
            reject(new Error("reCAPTCHA verification timed out. Please try again."));
          }, 20000)
        };
        recaptchaPending = pending;
        try {
          window.grecaptcha.execute(recaptchaWidget);
        } catch (_) {
          settlePendingCaptcha(new Error("Unable to start invisible reCAPTCHA. Please try again."));
        }
      });
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (requestInProgress) return;
      error.textContent = "";
      refreshDateBounds();
      const childName = dialog.querySelector("#booking-child-name").value.trim();
      const childAge = dialog.querySelector("#booking-child-age").value.trim();
      const phone = dialog.querySelector("#booking-phone").value.trim();
      const date = dateInput.value;
      const slotValue = timeInput.value;
      const issues = bookingIssues();
      if (issues.length) {
        error.textContent = issues[0].message;
          const firstField = dialog.querySelector(`#${issues[0].id}`);
        if (firstField && typeof firstField.focus === "function") firstField.focus();
        return;
      }
      const start = Number(slotValue);
      if (!allowedWindows(date).some(([a,b]) => start >= a && start < b) || isBooked(date, start)) {
        error.textContent = "That appointment time is no longer available. Please choose another time.";
        renderSlots(date);
        return;
      }
      if (date === todayKey && start < new Date().getHours() * 60 + new Date().getMinutes()) {
        error.textContent = "That time has passed. Choose another time.";
        renderSlots(date);
        return;
      }

      const dateText = date.split("-").reverse().join("/");
      const timeText = selectedTimeText;
      const message = [
        "Hello, I would like to request an appointment with Dr. Nitin Mohan.",
        "",
        `Child: ${childName}`,
        `Age: ${childAge} years`,
        `Parent/guardian phone: ${phone}`,
        `Preferred date: ${dateText}`,
        `Preferred time: ${timeText}`,
        "",
        "Please confirm availability."
      ].join("\n");
      const waUrl = `https://wa.me/${SITE_CONFIG.contact.phoneE164}?text=${encodeURIComponent(message)}`;
      requestInProgress = true;
      const thisAttempt = ++attemptId;
      submit.disabled = true;
      submit.textContent = "Verifying…";
      error.textContent = "Verifying securely. You can still close this window at any time…";
      try {
        const token = await executeRecaptcha();
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!token) throw new Error("Google reCAPTCHA did not return a verification token. Please try again.");
        activeVerifyController = new AbortController();
        const response = await fetch(SITE_CONFIG.contact.recaptchaVerifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, action: "BOOK_APPOINTMENT" }),
          signal: activeVerifyController.signal
        });
        activeVerifyController = null;
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!response.ok) throw new Error("The verification service is temporarily unavailable. Please try again.");
        const verification = await response.json();
        if (thisAttempt !== attemptId || !isDialogOpen()) return;
        if (!verification || verification.success !== true) throw new Error("We could not verify this request. Please try again.");
        try { sessionStorage.setItem("kg_pending_appointment_confirmation", JSON.stringify({ childName, date: dateText, time: timeText, savedAt: Date.now() })); } catch (_) {}
        requestInProgress = false;
        submit.disabled = false;
        submit.textContent = "Continue to WhatsApp";
        closeBooking();
        window.location.assign(waUrl);
      } catch (reason) {
        if (thisAttempt === attemptId && isDialogOpen() && (!reason || reason.name !== "AbortError")) {
          error.textContent = reason && reason.message ? reason.message : "Verification failed. Please try again.";
          resetRecaptcha();
        }
      } finally {
        if (thisAttempt === attemptId) {
          requestInProgress = false;
          activeVerifyController = null;
          submit.disabled = false;
          submit.textContent = "Continue to WhatsApp";
        }
      }
    });

  }
  /* ===== END BLOCK: BOOKING ===== */

  /* ===== BLOCK: WHATSAPP_FLOAT ===== */
  function initWhatsAppFloat() {
    let button = document.getElementById("floating-booking");
    if (!button) {
      button = document.createElement("button");
      button.id = "floating-booking";
      body.append(button);
    }
    button.className = "floating-booking";
    button.type = "button";
    button.setAttribute("aria-label", "Book via WhatsApp");
    button.title = "Book via WhatsApp";
    button.disabled = !siteControlsResolved || !siteBookingEnabled;
    button.setAttribute("aria-disabled", String(button.disabled));
    button.innerHTML = `<img class="whatsapp-brand-mark" src="${asset("assets/whatsapp.svg")}" alt="" width="38" height="38"><span class="floating-booking-label"><strong>Book via WhatsApp</strong></span>`;
    if (!feature("whatsappFloat")) { button.hidden = true; return; }
    button.hidden = false;

    if (!feature("whatsappBooking") && !button.dataset.directBookingBound) {
      button.addEventListener("click", () => window.open(`https://wa.me/${SITE_CONFIG.contact.phoneE164}`, "_blank", "noopener,noreferrer"));
      button.dataset.directBookingBound = "true";
    }

    let dragStart = null;
    let suppressNextClick = false;
    button.addEventListener("click", event => {
      if (suppressNextClick) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressNextClick = false;
      }
    }, true);
    button.addEventListener("pointerdown", event => {
      dragStart = { pointerId:event.pointerId, y:event.clientY, top:button.getBoundingClientRect().top, moved:false };
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener("pointermove", event => {
      if (!dragStart || dragStart.pointerId !== event.pointerId || !button.hasPointerCapture(event.pointerId)) return;
      const deltaY = event.clientY - dragStart.y;
      if (Math.abs(deltaY) > 5) dragStart.moved = true;
      if (!dragStart.moved) return;
      const top = Math.max(12, Math.min(innerHeight - button.offsetHeight - 12, dragStart.top + deltaY));
      button.style.top = `${top}px`;
      button.style.bottom = "auto";
      const right = Math.max(12, Math.min(18, window.innerWidth - button.offsetWidth - 12));
      button.style.right = `${right}px`;
    });
    const finishDrag = event => {
      if (!dragStart || dragStart.pointerId !== event.pointerId) return;
      suppressNextClick = dragStart.moved;
      dragStart = null;
    };
    button.addEventListener("pointerup", finishDrag);
    button.addEventListener("pointercancel", finishDrag);
  }
  /* ===== END BLOCK: WHATSAPP_FLOAT ===== */

  /* ===== BLOCK: PERSISTENT_SITE_CONTROLS ===== */
  function setAnnouncementFastFlickerEnabled(enabled) {
    const announcementBars = document.querySelectorAll(
      "#site-announcement-mount .site-announcement"
    );

    announcementBars.forEach(bar => {
      bar.classList.remove("has-fast-flicker");
      if (enabled === true) bar.classList.add("has-fast-flicker");
    });
  }

  function setAnnouncementShineEnabled(enabled) {
    const announcementBars = document.querySelectorAll(
      "#site-announcement-mount .site-announcement"
    );

    announcementBars.forEach(bar => {
      bar.classList.remove("has-double-shine");
      if (enabled === true) bar.classList.add("has-double-shine");
    });
  }

  function readCachedSiteControls() {
    try {
      const value = JSON.parse(window.localStorage.getItem(SITE_CONTROLS_CACHE_KEY) || "null");
      if (
        !value || value.schemaVersion !== 1 || !value.announcement ||
        !["default", "custom"].includes(value.announcement.mode) ||
        typeof value.bookingEnabled !== "boolean"
      ) return null;
      return value;
    } catch (_) {
      return null;
    }
  }

  function hasRecentVerifiedPublish(settings) {
    if (!settings || settings.verifiedByPublish !== true) return false;
    const verifiedAt = Number(settings.verifiedAt);
    return Number.isFinite(verifiedAt) && verifiedAt <= Date.now() && Date.now() - verifiedAt <= 30000;
  }

  function startSiteControlsRequest() {
    if (!window.__kgSiteControlsRequest) {
      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = SITE_CONTROLS_API;
      preconnect.crossOrigin = "anonymous";
      document.head.append(preconnect);
      window.__kgSiteControlsRequest = fetch(`${SITE_CONTROLS_API}/settings?t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { "Accept": "application/json" }
      }).then(response => response.ok ? response.json() : null).catch(() => null);
    }
    return window.__kgSiteControlsRequest;
  }

  function cacheSiteControls(settings) {
    try {
      window.localStorage.setItem(SITE_CONTROLS_CACHE_KEY, JSON.stringify(settings));
    } catch (_) {
      /* Storage may be unavailable; live settings still apply normally. */
    }
  }

  function applyAnnouncementSettings(settings, ticker) {
    if (!settings || !settings.announcement || !ticker) return;

    const announcementText = settings.announcement.mode === "custom" &&
      typeof settings.announcement.text === "string" &&
      settings.announcement.text.trim().length > 0
        ? settings.announcement.text
        : SITE_CONFIG.content.announcement;

    const track = ticker.querySelector(".site-announcement-track");
    if (track) {
      track.querySelectorAll("span").forEach(segment => {
        segment.textContent = announcementText;
      });
    }

    const rawDuration = settings.marqueeDuration ?? settings.announcement.marqueeDuration;
    const duration = Number(rawDuration);
    const safeDuration = Number.isFinite(duration) && duration >= 3 && duration <= 30 ? duration : 30;
    ticker.style.setProperty("--kg-marquee-duration", safeDuration + "s");
    ticker.classList.toggle("has-fast-flicker", settings.marqueeFastFlicker === true);
    ticker.classList.toggle("has-double-shine", settings.marqueeShine === true);
  }

  function applyBookingAvailability(enabled) {
    siteControlsResolved = true;
    siteBookingEnabled = enabled === true;
    body.classList.toggle("kg-booking-disabled", !siteBookingEnabled);

    const appointmentPicker = document.getElementById("booking") || document.querySelector(".appointment-picker");
    if (appointmentPicker) {
      appointmentPicker.hidden = false;
      appointmentPicker.style.display = "";
    }

    const appointmentTrigger = document.getElementById("appointment-trigger");
    if (appointmentTrigger) {
      appointmentTrigger.disabled = !siteBookingEnabled;
      appointmentTrigger.setAttribute("aria-disabled", String(!siteBookingEnabled));
    }

    const floatingBooking = document.getElementById("floating-booking");
    if (floatingBooking) {
      floatingBooking.hidden = !feature("whatsappFloat");
      floatingBooking.disabled = !siteBookingEnabled;
      floatingBooking.setAttribute("aria-disabled", String(!siteBookingEnabled));
    }
  }

  async function initPersistentSiteControls() {
    /* A just-published snapshot was verified against the Worker moments ago.
       It can take effect immediately on the publisher's redirect back home. */
    setAnnouncementFastFlickerEnabled(false);
    setAnnouncementShineEnabled(false);
    if (hasRecentVerifiedPublish(cachedSiteControls)) {
      applyBookingAvailability(cachedSiteControls.bookingEnabled);
    } else {
      siteControlsResolved = false;
      siteBookingEnabled = false;
      const appointmentTrigger = document.getElementById("appointment-trigger");
      if (appointmentTrigger) {
        appointmentTrigger.disabled = true;
        appointmentTrigger.setAttribute("aria-disabled", "true");
      }
      const floatingBooking = document.getElementById("floating-booking");
      if (floatingBooking) {
        floatingBooking.disabled = true;
        floatingBooking.setAttribute("aria-disabled", "true");
      }
    }

    let settings = null;
    try {
      const received = await siteControlsRequest;
      if (
        !received || received.schemaVersion !== 1 || !received.announcement ||
        !["default", "custom"].includes(received.announcement.mode) ||
        typeof received.bookingEnabled !== "boolean"
      ) {
        applyBookingAvailability(false);
        return null;
      }
      settings = received;
    } catch (_) {
      applyBookingAvailability(false);
      return null;
    }

    cacheSiteControls(settings);
    const ticker = document.querySelector("#site-announcement-mount .site-announcement");
    applyAnnouncementSettings(settings, ticker);
    setAnnouncementFastFlickerEnabled(settings.marqueeFastFlicker === true);
    setAnnouncementShineEnabled(settings.marqueeShine === true);
    applyBookingAvailability(settings.bookingEnabled);

    return settings;
  }
  /* ===== END BLOCK: PERSISTENT_SITE_CONTROLS ===== */

  /* ===== BLOCK: PHOTO_OF_MONTH ===== */
  function initPhotoOfMonth() {
    const slot = document.getElementById("photo-month-slot");
    if (!feature("photoOfMonth")) { if (slot) slot.hidden = true; return; }
    if (slot) slot.hidden = false;
  }
  /* ===== END BLOCK: PHOTO_OF_MONTH ===== */

  /* ===== BLOCK: VIDEO_CAROUSEL ===== */
  function initVideoCarousel() {
    const section = document.querySelector(".home-videos");
    if (!feature("videoCarousel")) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    const track = document.getElementById("video-track");
    if (!track) return;

    const originalCards = [...track.querySelectorAll(":scope > .video-card")];
    if (originalCards.length < 2) return;

    /* Duplicate the cards once so the scroll can wrap without a visible jump. */
    originalCards.forEach((card, index) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      clone.dataset.carouselClone = "true";
      clone.querySelectorAll("a,button").forEach(control => control.tabIndex = -1);
      clone.querySelectorAll("video").forEach(video => {
        video.pause();
        video.removeAttribute("data-motion-video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
      });
      track.append(clone);
    });

    let pausedByPointer = false;
    let pausedByTouch = false;
    let pausedByFocus = false;
    let pauseUntil = 0;
    let previousFrame = 0;
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

    let measuredLoopWidth = 0;
    const measureLoopWidth = () => {
      const first = track.children[0];
      const firstClone = track.children[originalCards.length];
      measuredLoopWidth = first && firstClone
        ? firstClone.getBoundingClientRect().left - first.getBoundingClientRect().left
        : 0;
      return measuredLoopWidth;
    };
    const loopWidth = () => measuredLoopWidth || measureLoopWidth();
    measureLoopWidth();
    window.addEventListener("resize", () => requestAnimationFrame(measureLoopWidth), { passive: true });

    const carouselViewport = track.parentElement;
    if ("IntersectionObserver" in window && carouselViewport) {
      const cloneVideoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && !document.hidden && !root.classList.contains("no-motion")) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { root:carouselViewport, rootMargin:"0px 100px", threshold:0.05 });
      track.querySelectorAll('[data-carousel-clone="true"] video').forEach(video => cloneVideoObserver.observe(video));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) track.querySelectorAll('[data-carousel-clone="true"] video').forEach(video => video.pause());
      });
    }

    document.querySelectorAll("[data-video-scroll]").forEach(button => {
      button.addEventListener("click", () => {
        const width = loopWidth();
        if (!width) return;
        const direction = Number(button.dataset.videoScroll) || 1;
        const step = Math.max(180, track.clientWidth * .78);
        const current = ((track.scrollLeft % width) + width) % width;
        const next = current + direction * step;
        track.scrollLeft = next < 0 ? width + (next % width) : next % width;
        pauseUntil = performance.now() + 1100;
      });
    });

    track.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") pausedByPointer = true;
    });
    track.addEventListener("pointerleave", event => {
      if (event.pointerType === "mouse") pausedByPointer = false;
    });
    track.addEventListener("pointerdown", event => {
      if (event.pointerType === "touch" || event.pointerType === "pen") {
        pausedByTouch = true;
        pauseUntil = 0;
      }
    }, { passive: true });
    const finishTouch = () => {
      if (!pausedByTouch) return;
      pausedByTouch = false;
      /* A tap or swipe pauses the ticker briefly, then it resumes by itself. */
      pauseUntil = performance.now() + 1200;
    };
    track.addEventListener("pointerup", finishTouch, { passive: true });
    track.addEventListener("pointercancel", finishTouch, { passive: true });
    track.addEventListener("touchstart", () => { pausedByTouch = true; pauseUntil = 0; }, { passive: true });
    track.addEventListener("touchend", finishTouch, { passive: true });
    track.addEventListener("touchcancel", finishTouch, { passive: true });
    track.addEventListener("focusin", () => { pausedByFocus = true; });
    track.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        pausedByFocus = track.contains(document.activeElement);
        if (!pausedByFocus) pauseUntil = performance.now() + 500;
      });
    });

    const animate = timestamp => {
      if (!previousFrame) previousFrame = timestamp;
      const elapsed = Math.min(50, timestamp - previousFrame);
      previousFrame = timestamp;
      const reduced = prefersReducedMotion && prefersReducedMotion.matches;
      const motionDisabled = root.classList.contains("no-motion");
      if (!reduced && !motionDisabled && !document.hidden && !pausedByPointer && !pausedByTouch && !pausedByFocus && timestamp >= pauseUntil) {
        const width = loopWidth();
        if (width > 0) {
          track.scrollLeft += elapsed * 0.048; /* smooth automatic movement at about 48 pixels per second */
          if (track.scrollLeft >= width) track.scrollLeft %= width;
        }
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  /* ===== END BLOCK: VIDEO_CAROUSEL ===== */

  /* ===== BLOCK: GALLERY_LIGHTBOX ===== */
  function initGalleryLightbox() {
    if (!feature("galleryLightbox")) return;
    const viewer = document.getElementById("image-viewer");
    if (!viewer) return;
    const image = viewer.querySelector("img");
    const level = viewer.querySelector(".viewer-zoom-level");
    const closeButton = viewer.querySelector(".viewer-close");
    let zoom = 1;
    let previousFocus = null;
    let galleryImages = [];
    let currentImageIndex = -1;
    let previousButton = viewer.querySelector(".viewer-prev");
    let nextButton = viewer.querySelector(".viewer-next");
    if (!previousButton) {
      previousButton = document.createElement("button");
      previousButton.className = "viewer-prev";
      previousButton.type = "button";
      previousButton.textContent = "‹";
      previousButton.setAttribute("aria-label", "View previous image");
      previousButton.hidden = true;
      viewer.append(previousButton);
    }
    if (!nextButton) {
      nextButton = document.createElement("button");
      nextButton.className = "viewer-next";
      nextButton.type = "button";
      nextButton.textContent = "›";
      nextButton.setAttribute("aria-label", "View next image");
      nextButton.hidden = true;
      viewer.append(nextButton);
    }

    const isBrandOrUiImage = target => {
      const src = target.getAttribute("src") || "";
      const alt = target.getAttribute("alt") || "";
      return Boolean(target.closest(
        ".site-brand,.site-footer-brand,.social-icon,.image-viewer,.kg-rb-booking-dialog," +
        ".appointment-option,.kg-rb-newsletter-form,.site-navigation,.site-footer"
      )) || target.hasAttribute("data-no-viewer") ||
        /kg(?:%20|\s)logo|favicon/i.test(src) ||
        /kids?gastro logo|rezept.?rx logo/i.test(alt);
    };
    const isViewableImage = target => target instanceof HTMLImageElement &&
      !isBrandOrUiImage(target) && Boolean(target.closest("main,.site-page-content")) &&
      (target.naturalWidth >= 80 || target.width >= 80);

    document.querySelectorAll("main img,.site-page-content img").forEach(target => {
      if (!isViewableImage(target)) return;
      target.tabIndex = 0;
      target.setAttribute("role", "button");
      target.setAttribute("aria-label", target.alt ? `Open image: ${target.alt}` : "Open image in viewer");
      target.classList.add("kg-viewable-image");
    });

    function updateNavigation() {
      const hasMultiple = galleryImages.length > 1;
      if (previousButton) previousButton.hidden = !hasMultiple;
      if (nextButton) nextButton.hidden = !hasMultiple;
    }
    function showImage(index) {
      if (!galleryImages.length) return;
      currentImageIndex = (index + galleryImages.length) % galleryImages.length;
      const target = galleryImages[currentImageIndex];
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "";
      zoom = 1;
      updateZoom();
    }
    function updateZoom() {
      image.style.transform = `scale(${zoom})`;
      image.style.cursor = zoom > 1 ? "zoom-out" : "zoom-in";
      if (level) level.textContent = `${Math.round(zoom * 100)}%`;
    }
    function close() {
      viewer.hidden = true;
      image.removeAttribute("src");
      image.alt = "";
      document.body.classList.remove("site-viewer-open");
      if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    }
    function open(target) {
      if (!isViewableImage(target)) return;
      const heroCarousel = target.closest("[data-hero-carousel]");
      if (heroCarousel) {
        galleryImages = [...heroCarousel.querySelectorAll("[data-hero-slide-item] img")];
      } else {
        galleryImages = [...document.querySelectorAll("main img,.site-page-content img")].filter(isViewableImage);
      }
      currentImageIndex = galleryImages.indexOf(target);
      if (currentImageIndex < 0) {
        galleryImages = [target];
        currentImageIndex = 0;
      }
      previousFocus = target;
      image.src = target.currentSrc || target.src;
      image.alt = target.alt || "";
      updateNavigation();
      zoom = 1;
      updateZoom();
      viewer.hidden = false;
      document.body.classList.add("site-viewer-open");
      closeButton && closeButton.focus();
    }

    document.addEventListener("click", event => {
      const target = event.target;
      if (target instanceof HTMLImageElement) open(target);
    });
    document.addEventListener("keydown", event => {
      const target = event.target;
      if (target instanceof HTMLImageElement && isViewableImage(target) &&
          (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        open(target);
        return;
      }
      if (event.key === "Escape" && !viewer.hidden) close();
    });
    closeButton.addEventListener("click", close);
    previousButton && previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
    nextButton && nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
    document.addEventListener("keydown", event => {
      if (viewer.hidden) return;
      if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
      if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
    });
    viewer.querySelector(".viewer-zoom-in").addEventListener("click", () => {
      zoom = Math.min(4, +(zoom + .25).toFixed(2)); updateZoom();
    });
    viewer.querySelector(".viewer-zoom-out").addEventListener("click", () => {
      zoom = Math.max(1, +(zoom - .25).toFixed(2)); updateZoom();
    });
    viewer.querySelector(".viewer-reset").addEventListener("click", () => {
      zoom = 1; updateZoom();
    });
    image.addEventListener("click", () => {
      if (zoom > 1) { zoom = 1; updateZoom(); }
      else { zoom = 1.25; updateZoom(); }
    });
    viewer.addEventListener("click", event => { if (event.target === viewer) close(); });
  }
  /* ===== END BLOCK: GALLERY_LIGHTBOX ===== */

  /* ===== BLOCK: FOOTER_SHARE ===== */
  function initFooterShare() {
    const mount = document.getElementById("site-footer-share-mount");
    if (!mount || !feature("footerShare")) return;
    mount.innerHTML = `<strong>Share this website</strong><button type="button" class="site-share-button" id="site-share-button">Share link ↗</button><span id="site-share-status" aria-live="polite"></span>`;
    mount.parentElement.classList.add("has-share");
    const button = document.getElementById("site-share-button");
    const status = document.getElementById("site-share-status");
    if (!button) return;
    button.addEventListener("click", async () => {
      const data = { title: document.title || "KidsGastro", text: "Visit KidsGastro — Paediatric Gastroenterology", url: location.href };
      if (navigator.share) {
        try { await navigator.share(data); if (status) status.textContent = ""; return; }
        catch (reason) { if (reason && reason.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(location.href); if (status) status.textContent = "Website link copied. You can now paste and share it."; }
      catch (_) { if (status) status.textContent = "Copy the website address from your browser to share it."; }
    });
  }
  /* ===== END BLOCK: FOOTER_SHARE ===== */

  /* ===== BLOCK: BACK_TO_TOP ===== */
  function initBackToTop() {
    /* Back-to-top is intentionally provided only by the footer link. Remove
       legacy floating buttons that may remain in older subsite HTML files. */
    document.querySelectorAll("#back-to-top, button.back-to-top").forEach(button => button.remove());
  }
  /* ===== END BLOCK: BACK_TO_TOP ===== */

  /* ===== BLOCK: NEWSLETTER ===== */
  function initNewsletter() {
    const section = document.getElementById("newsletter-section");
    const form = document.getElementById("kg-rb-newsletter-form");
    const status = document.getElementById("kg-rb-newsletter-status");
    if (!feature("newsletter")) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const email = new FormData(form).get("email");
      const subject = encodeURIComponent("Newsletter subscription request");
      const bodyText = encodeURIComponent("Please add this email address to the clinic newsletter list: " + email);
      if (status) status.textContent = "Your email app will open with a subscription request for you to review and send.";
      location.href = `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${bodyText}`;
    });
  }
  /* ===== END BLOCK: NEWSLETTER ===== */

  /* ===== BLOCK: SCROLL_PROGRESS ===== */
  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress");
    if (!feature("scrollProgress")) { if (bar) bar.hidden = true; return; }
    if (!bar) return;
    bar.hidden = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      const progress = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", update, { passive:true });
    update();
  }
  /* ===== END BLOCK: SCROLL_PROGRESS ===== */

  /* ===== BLOCK: MOTION ===== */
  function initMotion() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const disabled = SITE_CONFIG.features.animations === false || reduced;
    root.classList.toggle("no-motion", disabled);
    root.classList.toggle("kg-motion-enabled", !disabled);
    if (disabled) {
      document.querySelectorAll("[data-motion]").forEach(element => element.classList.add("motion-complete"));
      document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
      return;
    }
    const targets = [...document.querySelectorAll("[data-motion]")];
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-complete");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold:0.08 });
      targets.forEach(element => observer.observe(element));
      const videos = [...document.querySelectorAll("[data-motion-video]")];
      const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting && !document.hidden) video.play().catch(() => {});
          else video.pause();
        });
      }, { rootMargin:"0px 90px", threshold:0.15 });
      videos.forEach(video => videoObserver.observe(video));
      document.addEventListener("visibilitychange", () => { if (document.hidden) videos.forEach(video => video.pause()); });
    } else {
      targets.forEach(element => element.classList.add("motion-complete"));
      document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
    }
    const preference = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference && preference.addEventListener) preference.addEventListener("change", event => {
      if (event.matches) {
        root.classList.add("no-motion");
        document.querySelectorAll("[data-motion-video]").forEach(video => { video.pause(); video.preload = "metadata"; video.load(); });
        targets.forEach(element => element.classList.add("motion-complete"));
      }
    });
  }
  /* ===== END BLOCK: MOTION ===== */

  /* ===== BLOCK: SERVICE_WORKER ===== */
  function initServiceWorker() {
    if (!feature("offlineCache") || !("serviceWorker" in navigator)) return;
    const workerUrl = asset("service-worker.js");
    window.addEventListener("load", () => navigator.serviceWorker.register(workerUrl).catch(() => {}), { once:true });
  }
  /* ===== END BLOCK: SERVICE_WORKER ===== */

  /* ===== BLOCK: BOOTSTRAP ===== */
  ensureSharedAssets();
  ensureSharedShell();
  initHeaderFooter();
  /* Start the settings request before page widgets are initialized. */
  window.__kgSiteControlsReady = typeof initPersistentSiteControls === "function"
    ? initPersistentSiteControls()
    : Promise.resolve(null);
  initPage();
  initCanonicalUrls();
  initBrandLogoLinks();
  initNav();
  if (typeof initHomeContent === "function") initHomeContent();
  if (typeof initHeroTyping === "function") initHeroTyping();
  if (typeof initAnnouncement === "function") initAnnouncement();
  if (typeof initBooking === "function") initBooking();
  if (typeof initWhatsAppFloat === "function") initWhatsAppFloat();
  if (typeof initPhotoOfMonth === "function") initPhotoOfMonth();
  if (typeof initVideoCarousel === "function") initVideoCarousel();
  if (typeof initGalleryLightbox === "function") initGalleryLightbox();
  if (typeof initFooterShare === "function") initFooterShare();
  if (typeof initBackToTop === "function") initBackToTop();
  if (typeof initNewsletter === "function") initNewsletter();
  if (typeof initScrollProgress === "function") initScrollProgress();
  if (typeof initMotion === "function") initMotion();
  if (typeof initServiceWorker === "function") initServiceWorker();
  /* Homepage scheduled rules await the early settings request above. */
  /* ===== END BLOCK: BOOTSTRAP ===== */
})();
