/**
 * KidsGastro website controls + schedule API
 *
 * Routes:
 *   POST /login             { passcode } -> { token, expiresIn }
 *   GET  /                   -> schedule rules array
 *   POST /                   { rules } (X-Token required)
 *   PUT  /img/:filename      JPEG upload (X-Token required)
 *   GET  /img/:filename      public image retrieval
 *   GET  /settings           -> permanent website settings
 *   PUT  /settings           -> save permanent website settings
 *
 * Cloudflare bindings:
 *   KV namespace: KG_DATA
 *   R2 bucket:    KG_MEDIA
 *   Secret:       ADMIN_PASSCODE
 */

const ALLOWED_ORIGINS = new Set([
  "https://drnitinmohan.com",
  "https://www.drnitinmohan.com"
]);

const SESSION_SECONDS = 15 * 60;
const MAX_JSON_BYTES = 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const MIN_MARQUEE_DURATION = 3;
const MAX_MARQUEE_DURATION = 30;
const DEFAULT_MARQUEE_DURATION = 30;

const DEFAULT_SETTINGS = Object.freeze({
  schemaVersion: 1,
  announcement: {
    mode: "default",
    text: "",
    marqueeDuration: DEFAULT_MARQUEE_DURATION
  },
  bookingEnabled: true,
  marqueeDuration: DEFAULT_MARQUEE_DURATION,
  marqueeFastFlicker: false,
  marqueeShine: false,
  updatedAt: null
});

function validMarqueeDuration(value) {
  const duration = Number(value);

  return Number.isInteger(duration) &&
    duration >= MIN_MARQUEE_DURATION &&
    duration <= MAX_MARQUEE_DURATION
    ? duration
    : null;
}

/* Older published settings allowed 45/60-second loops. Keep them readable,
   but cap them at the new maximum so the new 3–30 second editor can load them. */
function normalizeStoredMarqueeDuration(value) {
  const duration = Number(value);
  if (!Number.isInteger(duration) || duration < 3 || duration > 60) {
    return DEFAULT_MARQUEE_DURATION;
  }
  return Math.min(MAX_MARQUEE_DURATION, Math.max(MIN_MARQUEE_DURATION, duration));
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    ...extraHeaders
  });

  return new Response(JSON.stringify(data), {
    status,
    headers
  });
}

function corsResponse(request, response) {
  const origin = request.headers.get("Origin");
  const headers = new Headers(response.headers);

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, OPTIONS"
    );
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, X-Token"
    );
    headers.set("Access-Control-Max-Age", "86400");
    headers.append("Vary", "Origin");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

async function readJson(request, maxBytes = MAX_JSON_BYTES) {
  const declaredLength = Number(
    request.headers.get("Content-Length") || 0
  );

  if (declaredLength > maxBytes) {
    throw new Error("Request body is too large.");
  }

  const raw = await request.text();

  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    throw new Error("Request body is too large.");
  }

  try {
    return JSON.parse(raw);
  } catch (_) {
    throw new Error("Request body must contain valid JSON.");
  }
}

function constantTimeEqual(left, right) {
  const encoder = new TextEncoder();
  const a = encoder.encode(String(left));
  const b = encoder.encode(String(right));

  if (a.length !== b.length) return false;

  let difference = 0;

  for (let i = 0; i < a.length; i += 1) {
    difference |= a[i] ^ b[i];
  }

  return difference === 0;
}

function makeToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    byte => byte.toString(16).padStart(2, "0")
  ).join("");
}

async function requireSession(request, env) {
  const token = request.headers.get("X-Token") || "";

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return false;
  }

  return (
    await env.KG_DATA.get(`session:${token}`)
  ) === "valid";
}

async function handleLogin(request, env) {
  if (request.method !== "POST") {
    return errorResponse("Method not allowed.", 405);
  }

  if (!env.ADMIN_PASSCODE) {
    return errorResponse(
      "Worker secret ADMIN_PASSCODE is not configured.",
      503
    );
  }

  const data = await readJson(request, 4096);

  const passcode =
    data && typeof data.passcode === "string"
      ? data.passcode
      : "";

  if (
    !passcode ||
    !constantTimeEqual(passcode, env.ADMIN_PASSCODE)
  ) {
    return errorResponse(
      "The password was not accepted.",
      401
    );
  }

  const token = makeToken();

  await env.KG_DATA.put(
    `session:${token}`,
    "valid",
    { expirationTtl: SESSION_SECONDS }
  );

  return jsonResponse({
    token,
    expiresIn: SESSION_SECONDS
  });
}

async function handleSchedule(request, env) {
  if (request.method === "GET") {
    const stored = await env.KG_DATA.get("schedule:v1");

    if (!stored) {
      return jsonResponse([]);
    }

    try {
      const rules = JSON.parse(stored);

      return jsonResponse(
        Array.isArray(rules) ? rules : []
      );
    } catch (_) {
      return jsonResponse([]);
    }
  }

  if (request.method === "POST") {
    if (!(await requireSession(request, env))) {
      return errorResponse(
        "Your session has expired. Sign in again.",
        401
      );
    }

    const data = await readJson(request);

    if (!data || !Array.isArray(data.rules)) {
      return errorResponse(
        "The request must contain a rules array."
      );
    }

    if (data.rules.length > 100) {
      return errorResponse(
        "A maximum of 100 scheduled entries is allowed."
      );
    }

    if (
      data.rules.some(
        rule =>
          !rule ||
          typeof rule !== "object" ||
          Array.isArray(rule)
      )
    ) {
      return errorResponse(
        "Every schedule entry must be a JSON object."
      );
    }

    await env.KG_DATA.put(
      "schedule:v1",
      JSON.stringify(data.rules)
    );

    return jsonResponse({
      success: true,
      count: data.rules.length
    });
  }

  return errorResponse("Method not allowed.", 405);
}

async function handleSettings(request, env) {

  // ==========================================
  // GET PERMANENT SETTINGS
  // ==========================================

  if (request.method === "GET") {
    const stored = await env.KG_DATA.get("settings:v1");

    if (!stored) {
      return jsonResponse(DEFAULT_SETTINGS);
    }

    try {
      const value = JSON.parse(stored);

      if (
        !value ||
        value.schemaVersion !== 1 ||
        !value.announcement ||
        typeof value.bookingEnabled !== "boolean"
      ) {
        return jsonResponse(DEFAULT_SETTINGS);
      }

      const mode =
        value.announcement.mode === "custom"
          ? "custom"
          : "default";

      const text =
        typeof value.announcement.text === "string"
          ? value.announcement.text
          : "";

      const savedDuration =
        value.marqueeDuration ??
        value.announcement.marqueeDuration;

      const marqueeDuration = normalizeStoredMarqueeDuration(savedDuration);
      const marqueeFastFlicker = value.marqueeFastFlicker === true;
      const marqueeShine = value.marqueeShine === true;

      return jsonResponse({
        schemaVersion: 1,

        announcement: {
          mode,
          text,
          marqueeDuration
        },

        bookingEnabled: value.bookingEnabled,

        marqueeDuration,
        marqueeFastFlicker,
        marqueeShine,

        updatedAt:
          typeof value.updatedAt === "string"
            ? value.updatedAt
            : null
      });

    } catch (_) {
      return jsonResponse(DEFAULT_SETTINGS);
    }
  }

  // ==========================================
  // SAVE PERMANENT SETTINGS
  // ==========================================

  if (request.method === "PUT") {

    if (!(await requireSession(request, env))) {
      return errorResponse(
        "Your session has expired. Sign in again.",
        401
      );
    }

    const data = await readJson(request, 16 * 1024);

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      return errorResponse("Invalid settings format.");
    }

    const announcement = data.announcement;

    const mode =
      announcement && announcement.mode;

    // Preserve repeated spaces and line breaks.
    const text =
      announcement &&
      typeof announcement.text === "string"
        ? announcement.text
        : "";

    if (mode !== "default" && mode !== "custom") {
      return errorResponse(
        "Announcement mode must be default or custom."
      );
    }

    if (text.length > 500) {
      return errorResponse(
        "Announcement text must be 500 characters or fewer."
      );
    }

    if (mode === "custom" && !text.trim()) {
      return errorResponse(
        "Enter custom announcement text or switch back to the default message."
      );
    }

    // Read the previous record once so older clients that omit new fields
    // do not accidentally erase saved preferences.
    const previousStored = await env.KG_DATA.get("settings:v1");
    let previous = null;
    if (previousStored) {
      try { previous = JSON.parse(previousStored); }
      catch (_) { previous = null; }
    }

    let rawDuration =
      data.marqueeDuration ??
      (announcement && announcement.marqueeDuration);

    if (rawDuration == null && previous) {
      rawDuration = previous.marqueeDuration ??
        (previous.announcement && previous.announcement.marqueeDuration);
    }

    const marqueeDuration = rawDuration == null
      ? DEFAULT_MARQUEE_DURATION
      : validMarqueeDuration(rawDuration);

    if (marqueeDuration === null) {
      return errorResponse(
        "marqueeDuration must be a whole number from 3 to 30 seconds."
      );
    }

    let marqueeFastFlicker = data.marqueeFastFlicker;
    if (marqueeFastFlicker == null) {
      marqueeFastFlicker = previous ? previous.marqueeFastFlicker === true : false;
    }
    if (typeof marqueeFastFlicker !== "boolean") {
      return errorResponse("marqueeFastFlicker must be true or false.");
    }

    let marqueeShine = data.marqueeShine;
    if (marqueeShine == null) {
      marqueeShine = previous ? previous.marqueeShine === true : false;
    }
    if (typeof marqueeShine !== "boolean") {
      return errorResponse("marqueeShine must be true or false.");
    }

    if (typeof data.bookingEnabled !== "boolean") {
      return errorResponse(
        "bookingEnabled must be true or false."
      );
    }

    // IMPORTANT:
    // bookingEnabled is explicitly read from data.
    // This prevents the previous ReferenceError.

    const settings = {
      schemaVersion: 1,

      announcement: {
        mode,
        text,
        marqueeDuration
      },

      bookingEnabled: data.bookingEnabled,

      marqueeDuration,
      marqueeFastFlicker,
      marqueeShine,

      updatedAt: new Date().toISOString()
    };

    await env.KG_DATA.put(
      "settings:v1",
      JSON.stringify(settings)
    );

    return jsonResponse({
      success: true,
      settings
    });
  }

  return errorResponse("Method not allowed.", 405);
}

function validImageName(name) {
  return /^img-[a-z0-9-]{8,80}\.jpg$/i.test(name);
}

async function handleImage(request, env, name) {

  if (!validImageName(name)) {
    return errorResponse("Invalid image name.", 400);
  }

  if (!env.KG_MEDIA) {
    return errorResponse(
      "R2 bucket binding KG_MEDIA is not configured.",
      503
    );
  }

  const key = `img/${name}`;

  if (request.method === "PUT") {

    if (!(await requireSession(request, env))) {
      return errorResponse(
        "Your session has expired. Sign in again.",
        401
      );
    }

    const contentType = (
      request.headers.get("Content-Type") || ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (contentType !== "image/jpeg") {
      return errorResponse(
        "Only JPEG image uploads are accepted.",
        415
      );
    }

    const declaredLength = Number(
      request.headers.get("Content-Length") || 0
    );

    if (declaredLength > MAX_IMAGE_BYTES) {
      return errorResponse(
        "Image must be 8 MB or smaller.",
        413
      );
    }

    const bytes = await request.arrayBuffer();

    if (
      bytes.byteLength === 0 ||
      bytes.byteLength > MAX_IMAGE_BYTES
    ) {
      return errorResponse(
        "Image must be non-empty and 8 MB or smaller.",
        413
      );
    }

    await env.KG_MEDIA.put(key, bytes, {
      httpMetadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000, immutable"
      }
    });

    return jsonResponse({
      success: true,
      name
    });
  }

  if (
    request.method === "GET" ||
    request.method === "HEAD"
  ) {
    const object = await env.KG_MEDIA.get(key);

    if (!object) {
      return errorResponse("Image not found.", 404);
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set("Content-Type", "image/jpeg");

    headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    headers.set("ETag", object.httpEtag);

    return new Response(
      request.method === "HEAD"
        ? null
        : object.body,
      {
        status: 200,
        headers
      }
    );
  }

  return errorResponse("Method not allowed.", 405);
}

async function route(request, env) {

  if (!env.KG_DATA) {
    return errorResponse(
      "KV binding KG_DATA is not configured.",
      503
    );
  }

  const url = new URL(request.url);

  const path =
    url.pathname.replace(/\/+$/, "") || "/";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (
    path === "/health" &&
    request.method === "GET"
  ) {
    return jsonResponse({
      ok: true,
      service: "kidsgastro-site-controls"
    });
  }

  if (path === "/login") {
    return handleLogin(request, env);
  }

  if (path === "/settings") {
    return handleSettings(request, env);
  }

  if (path === "/") {
    return handleSchedule(request, env);
  }

  const imageMatch =
    path.match(/^\/img\/([^/]+)$/);

  if (imageMatch) {
    return handleImage(
      request,
      env,
      imageMatch[1]
    );
  }

  return errorResponse("Not found.", 404);
}

export default {
  async fetch(request, env) {

    const origin = request.headers.get("Origin");

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse(
        { error: "Origin is not allowed." },
        403
      );
    }

    try {

      const response = await route(request, env);

      return corsResponse(request, response);

    } catch (error) {

      const message =
        error && error.message
          ? error.message
          : "Unexpected server error.";

      const status =
        /too large/i.test(message)
          ? 413
          : 500;

      return corsResponse(
        request,
        errorResponse(message, status)
      );
    }
  }
};