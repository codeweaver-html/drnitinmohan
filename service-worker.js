/* KidsGastro service worker — lightweight offline support and efficient asset caching.
   Keep this file beside the site root document and name it exactly: service-worker.js.
*/

const CACHE_NAME = "kidsgastro-cache-v35";
const APP_ROOT = new URL(self.registration.scope);
const APP_ORIGIN = self.location.origin;

const ROOT_PAGE_SLUGS = new Set([
  "about", "admin", "blog", "faqs", "gallery", "publications",
  "services", "testimonials", "treatments", "updates"
]);

/* Cache only the homepage shell at install. Other pages and media enter the
   cache naturally as visitors open them, avoiding a large first-visit download. */
const SHELL_FILES = [
  "./",
  "./style-shared.css",
  "./script-shared.js",
  "./service-worker.js",
  "./assets/kg%20logo.webp",
  "./assets/main%20pic.webp",
  "./assets/whatsapp.svg"
];

const STATIC_DESTINATIONS = new Set([
  "script",
  "style",
  "image",
  "font",
  "manifest"
]);

const MAX_CACHEABLE_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_CACHE_BYTES = 8 * 1024 * 1024;
const CODE_REFRESH_INTERVAL_MS = 60 * 1000;
const IMAGE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const OTHER_ASSET_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const NAVIGATION_CACHE_FALLBACK_MS = 1200;

const lastRefreshByUrl = new Map();
const inFlightRefreshes = new Map();

function isInsideAppScope(url) {
  return url.origin === APP_ORIGIN && url.pathname.startsWith(APP_ROOT.pathname);
}

function isCacheableResponse(response) {
  if (!response || !response.ok || response.type !== "basic") return false;
  const cacheControl = response.headers.get("Cache-Control") || "";
  return !/\bno-store\b/i.test(cacheControl);
}

async function saveResponse(cache, request, response) {
  if (!isCacheableResponse(response)) return;

  const contentLength = Number(response.headers.get("Content-Length") || 0);
  const destination = request instanceof Request ? request.destination : "";
  if (contentLength > MAX_CACHEABLE_BYTES) return;
  if (destination === "image" && contentLength > MAX_IMAGE_CACHE_BYTES) return;

  /* A full cache must never turn a successful network response into a page failure. */
  try {
    await cache.put(request, response.clone());
  } catch (_) {
    /* Storage quota, opaque cache-key, or browser storage errors are non-fatal. */
  }
}

async function precacheShell() {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(SHELL_FILES.map(async file => {
    const url = new URL(file, APP_ROOT);
    try {
      /* Use the normal HTTP cache where possible; don't force duplicate downloads. */
      const response = await fetch(url.href, { cache: "default", credentials: "same-origin" });
      if (isCacheableResponse(response)) await saveResponse(cache, url.href, response);
    } catch (_) {
      /* Offline at install time or an optional shell file is absent: continue. */
    }
  }));
}

self.addEventListener("install", event => {
  event.waitUntil(precacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const oldKidsGastroCaches = keys.filter(key =>
      /^kidsgastro-(?:shell|runtime|cache)-v\d+$/.test(key) && key !== CACHE_NAME
    );
    await Promise.all(oldKidsGastroCaches.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const requestedUrl = new URL(request.url);
  const cleanSlug = requestedUrl.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();

  /* Legacy flat URLs move to their clean route. */
  const legacyMatch = requestedUrl.pathname.match(/^\/([a-z0-9-]+)\.html$/i);
  if (legacyMatch && legacyMatch[1].toLowerCase() !== "index" && ROOT_PAGE_SLUGS.has(legacyMatch[1].toLowerCase())) {
    return Response.redirect(new URL(`/${legacyMatch[1].toLowerCase()}/`, APP_ROOT), 301);
  }

  const networkPromise = (async () => {
    /* Always check the network for HTML so published page edits appear promptly. */
    const response = await fetch(request, { cache: "no-cache" });
    if (response.ok) {
      await saveResponse(cache, request, response);
      return response;
    }

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
  })();

  /* Keep a slow network refresh alive if a cached page wins the timeout race. */
  event.waitUntil(networkPromise.then(() => undefined).catch(() => undefined));

  let timeoutId;
  const timeoutToken = Symbol("navigation-timeout");
  try {
    const result = await Promise.race([
      networkPromise,
      new Promise(resolve => {
        timeoutId = setTimeout(() => resolve(timeoutToken), NAVIGATION_CACHE_FALLBACK_MS);
      })
    ]);
    if (timeoutId) clearTimeout(timeoutId);

    if (result !== timeoutToken) return result;

    const cached = await cache.match(request);
    if (cached) return cached;
    return await networkPromise;
  } catch (_) {
    if (timeoutId) clearTimeout(timeoutId);
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

function refreshIntervalFor(request) {
  if (request.destination === "script" || request.destination === "style") return CODE_REFRESH_INTERVAL_MS;
  if (request.destination === "image") return IMAGE_REFRESH_INTERVAL_MS;
  return OTHER_ASSET_REFRESH_INTERVAL_MS;
}

function startAssetRefresh(request) {
  const key = request.url;
  const inFlight = inFlightRefreshes.get(key);
  if (inFlight) return inFlight;

  const work = (async () => {
    const response = await fetch(request, { cache: "no-cache" });
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await saveResponse(cache, request, response);
    }
    return response;
  })().catch(() => {
    lastRefreshByUrl.delete(key);
    return null;
  }).finally(() => {
    inFlightRefreshes.delete(key);
  });

  inFlightRefreshes.set(key, work);
  return work;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("Range")) return;

  const url = new URL(request.url);
  if (!isInsideAppScope(url)) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request, event));
    return;
  }

  /* Do not cache video streams or API/form requests. WebM files use browser/HTTP
     caching and are only requested when their carousel card approaches view. */
  if (!STATIC_DESTINATIONS.has(request.destination)) return;

  const cacheKey = request.url;
  const refreshInterval = refreshIntervalFor(request);
  const lastRefresh = lastRefreshByUrl.get(cacheKey) || 0;
  let refreshPromise = null;

  if (Date.now() - lastRefresh >= refreshInterval) {
    lastRefreshByUrl.set(cacheKey, Date.now());
    refreshPromise = startAssetRefresh(request);
    event.waitUntil(refreshPromise.then(() => undefined));
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = refreshPromise || startAssetRefresh(request);
      const received = await response;
      if (received) return received;
    } catch (_) {
      /* Fall through to the offline response below. */
    }

    return new Response("This resource is unavailable while offline.", {
      status: 504,
      statusText: "Gateway Timeout",
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  })());
});
