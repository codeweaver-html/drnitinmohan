/* KidsGastro service worker — safe offline support and automatic asset updates.
   Keep this file beside the site root document and name it exactly: service-worker.js
*/

const CACHE_NAME = "kidsgastro-cache-v11";
const APP_ROOT = new URL(self.registration.scope);
const APP_ORIGIN = self.location.origin;

/* Optional shell files are cached one by one. A missing page will not stop
   the service worker from installing or updating. */
const SHELL_FILES = [
  "./",
  "./404.html",
  "./admin",
  "./style-shared.css",
  "./script-shared.js",
  "./settings.json",
  "./robots.txt",
  "./sitemap.xml",
  "./favicon.ico",
  "./about/",
  "./blog/",
  "./clinic/",
  "./clinical/",
  "./faqs/",
  "./gallery/",
  "./latest/",
  "./newsletter/",
  "./publications/",
  "./services/",
  "./socials/",
  "./testimonials/",
  "./treatments/",
  "./assets/baby%20pic.webp",
  "./assets/endo%20gallery%20pic.webp",
  "./assets/endo%20main%20pic.webp",
  "./assets/gastro%20talk.webp",
  "./assets/hospital%20pic.webp",
  "./assets/kg%20logo.webp",
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
  "./assets/potrait%20gallery.jpg"
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

  try {
    const response = await fetch(request, { cache: "no-cache" });
    if (response.ok) {
      await saveResponse(cache, request, response);
      return response;
    }

    /* GitHub Pages serves legacy root HTML files with .html extensions. When a
       clean directory route is not present, resolve the matching source page
       while keeping the visitor's clean URL in the address bar. */
    const requestedUrl = new URL(request.url);
    const cleanPath = requestedUrl.pathname.replace(/\/+$/, "");
    const lastSegment = cleanPath.split("/").pop() || "";
    if (response.status === 404 && cleanPath && !lastSegment.includes(".")) {
      const legacyUrl = new URL(`${cleanPath}.html${requestedUrl.search}`, requestedUrl.origin);
      const legacyResponse = await fetch(legacyUrl.href, { cache: "no-cache" });
      if (legacyResponse.ok) {
        await saveResponse(cache, request, legacyResponse);
        return legacyResponse;
      }
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    /* If an uncached page is requested offline, show the cached homepage. */
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
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(request, { cache: "no-cache" });
  await saveResponse(cache, request, response);
  return response;
}

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

  /* Only cache actual static assets. This avoids caching API/fetch responses. */
  if (!STATIC_DESTINATIONS.has(request.destination)) return;

  const cachePromise = caches.open(CACHE_NAME);
  const updatePromise = refreshStaticAsset(request);
  event.waitUntil(updatePromise.then(() => undefined).catch(() => undefined));

  event.respondWith((async () => {
    const cache = await cachePromise;
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      return await updatePromise;
    } catch (error) {
      return new Response("This resource is unavailable while offline.", {
        status: 504,
        statusText: "Gateway Timeout",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
