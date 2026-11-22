/* KidsGastro service worker — safe offline support and automatic asset updates.
   Keep this file beside the site root document and name it exactly: service-worker.js
*/

const CACHE_NAME = "kidsgastro-cache-v26";
const APP_ROOT = new URL(self.registration.scope);
const APP_ORIGIN = self.location.origin;

const ROOT_PAGE_SLUGS = new Set([
  "about", "admin", "blog", "faqs", "gallery", "publications",
  "services", "testimonials", "treatments", "updates"
]);

/* Optional shell files are cached one by one. A missing page will not stop
   the service worker from installing or updating. */
const SHELL_FILES = [
  "./",
  "./404.html",
  "./admin/",
  "./about/",
  "./blog/",
  "./faqs/",
  "./gallery/",
  "./publications/",
  "./services/",
  "./testimonials/",
  "./treatments/",
  "./updates/",
  "./style-shared.css",
  "./script-shared.js",
  "./service-worker.js",
  "./settings.json",
  "./robots.txt",
  "./sitemap.xml",
  "./assets/kg%20logo.webp",
  "./assets/baby%20pic.webp",
  "./assets/endo%20gallery%20pic.webp",
  "./assets/endo%20main%20pic.webp",
  "./assets/gastro%20talk.webp",
  "./assets/hospital%20pic.webp",
  "./assets/instagram.svg",
  "./assets/linkedin.svg",
  "./assets/google-scholar.svg",
  "./assets/whatsapp.svg",
  "./assets/kidsgastro-video-1-thumbnail.jpg",
  "./assets/kidsgastro-video-2-thumbnail.jpg",
  "./assets/kidsgastro-video-3-thumbnail.jpg",
  "./assets/kidsgastro-video-4-thumbnail.jpg",
  "./assets/kidsgastro-video-5-thumbnail.jpg",
  "./assets/main%20pic.webp",
  "./assets/potrait%20gallery.jpg",
  "./assets/new.webp"
];

const STATIC_DESTINATIONS = new Set([
  "script",
  "style",
  "image",
  "font",
  "manifest"
]);

function isInsideAppScope(url) {
  return url.origin === APP_ORIGIN && url.href.startsWith(APP_ROOT.href);
}

function isCacheableResponse(response) {
  if (!response || !response.ok || response.type !== "basic") return false;
  const cacheControl = response.headers.get("Cache-Control") || "";
  return !/\bno-store\b/i.test(cacheControl);
}

async function saveResponse(cache, request, response) {
  if (!isCacheableResponse(response)) return;

  /* Avoid filling the offline cache with very large media files. */
  const contentLength = Number(response.headers.get("Content-Length") || 0);
  if (contentLength > 12 * 1024 * 1024) return;

  await cache.put(request, response.clone());
}

async function precacheShell() {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(SHELL_FILES.map(async file => {
    const url = new URL(file, APP_ROOT);
    try {
      const response = await fetch(url.href, { cache: "reload" });
      if (isCacheableResponse(response)) {
        await saveResponse(cache, url.href, response);
      }
    } catch (error) {
      /* Offline at install time or an optional file is absent: continue. */
    }
  }));
}

self.addEventListener("install", event => {
  event.waitUntil(
    precacheShell().then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    /* Remove only caches created by previous KidsGastro service-worker
       versions. Leave unrelated caches on the same domain untouched. */
    const oldKidsGastroCaches = keys.filter(key =>
      /^kidsgastro-(?:shell|runtime|cache)-v\d+$/.test(key) && key !== CACHE_NAME
    );

    await Promise.all(oldKidsGastroCaches.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const requestedUrl = new URL(request.url);
  const cleanSlug = requestedUrl.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();

  /* Legacy flat URLs move to their clean route. */
  const legacyMatch = requestedUrl.pathname.match(/^\/([a-z0-9-]+)\.html$/i);
  if (legacyMatch && legacyMatch[1].toLowerCase() !== "index" && ROOT_PAGE_SLUGS.has(legacyMatch[1].toLowerCase())) {
    return Response.redirect(new URL(`/${legacyMatch[1].toLowerCase()}/`, APP_ROOT), 301);
  }

  try {
    /* Prefer a Jekyll-generated clean route. This keeps root-level source pages
       and lets GitHub Pages serve /slug/ as a normal 200 response. */
    const response = await fetch(request, { cache: "no-cache" });
    if (response.ok) {
      await saveResponse(cache, request, response);
      return response;
    }

    /* Clean URLs are primary. For older deployed copies, resolve either a
       root-level source page or a directory index without changing the URL. */
    if (response.status === 404 && ROOT_PAGE_SLUGS.has(cleanSlug)) {
      const candidates = [
        new URL(`${cleanSlug}/index.html${requestedUrl.search}`, APP_ROOT),
        new URL(`${cleanSlug}.html${requestedUrl.search}`, APP_ROOT)
      ];
      for (const pageFile of candidates) {
        const pageResponse = await fetch(pageFile.href, { cache: "no-cache" });
        if (pageResponse.ok) {
          await saveResponse(cache, request, pageResponse);
          return pageResponse;
        }
      }
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const homePage = await cache.match(APP_ROOT.href);
    if (homePage) return homePage;
    return new Response(
      "You are offline. Please reconnect and reload the KidsGastro website.",
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      }
    );
  }
}

async function refreshStaticAsset(request) {
  const response = await fetch(request, { cache: "no-cache" });
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await saveResponse(cache, request, response);
  }
  return response;
}

/* Keep CSS and JavaScript fresh without sending a network request on every
   repeat asset hit. The cache is returned immediately while a refresh runs. */
const lastCodeRefresh = new Map();
const CODE_REFRESH_INTERVAL_MS = 60 * 1000;

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("Range")) return;

  const url = new URL(request.url);
  if (!isInsideAppScope(url)) return;

  /* HTML pages use network-first so published page changes appear promptly. */
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  /* Ignore API, form, and other dynamic fetches; cache only browser static assets. */
  if (!STATIC_DESTINATIONS.has(request.destination)) return;

  let codeUpdatePromise = null;
  if (request.destination === "script" || request.destination === "style") {
    const lastRefresh = lastCodeRefresh.get(request.url) || 0;
    if (Date.now() - lastRefresh >= CODE_REFRESH_INTERVAL_MS) {
      lastCodeRefresh.set(request.url, Date.now());
      codeUpdatePromise = refreshStaticAsset(request).catch(() => {
        lastCodeRefresh.delete(request.url);
        return null;
      });
      event.waitUntil(codeUpdatePromise.then(() => undefined));
    }
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      if (codeUpdatePromise) {
        const refreshed = await codeUpdatePromise;
        if (refreshed && refreshed.ok) return refreshed;
      }
      return await refreshStaticAsset(request);
    } catch (error) {
      return new Response("This resource is unavailable while offline.", {
        status: 504,
        statusText: "Gateway Timeout",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
