/* KidsGastro shared announcement synchronizer
 * Reads the same configuration JSON used by the main website:
 * configuration/defaults.json
 * configuration/temporary_overrides.json
 * configuration/change-request.json
 *
 * The main homepage keeps using its existing kg-manual-settings-bridge.
 * This file is for independent associated sub-sites (FAQ, testimonials, etc.).
 */
(() => {
  "use strict";
  if (document.getElementById("kg-manual-settings-bridge")) return;

  const DEFAULT_TEXT =
    "OFFLINE APPOINTMENTS AVAILABLE RIGHT NOW. CLICK THE APPOINTMENT BUTTON BELOW TO PROCEED.";
  const ROOT = "/configuration/";
  const FALLBACK = {
    text: DEFAULT_TEXT,
    textColor: "#0759a8",
    backgroundColor: "#ffc400",
    speed: 8,
    additional: null
  };

  const safeColor = value =>
    typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
  const clampSpeed = value => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(60, Math.max(2, n)) : 28;
  };
  const readJson = async path => {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) return null;
      const value = await response.json();
      return value && typeof value === "object" ? value : null;
    } catch (_) {
      return null;
    }
  };
  const indiaLocalDateTimeToMs = value => {
    if (typeof value !== "string") return NaN;
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return NaN;
    const [, y, mo, d, h, mi, sec = "0"] = m;
    return Date.UTC(+y, +mo - 1, +d, +h, +mi, +sec) - 19800000;
  };
  const periodIsActive = (period, key, now) => {
    if (!period || (Array.isArray(period.settings) && !period.settings.includes(key))) return false;
    const start = indiaLocalDateTimeToMs(period.startDateTime || period.start);
    const end = indiaLocalDateTimeToMs(period.endDateTime || period.end);
    return Number.isFinite(start) && Number.isFinite(end) && end > start && now >= start && now < end;
  };
  const settingIsActive = (request, key, now) => {
    const schedules = request && request.changeSchedules;
    const meta = schedules && schedules.settings && schedules.settings[key];
    if (meta && meta.duration === "permanent") return true;
    if (!meta && request && (request.duration === "permanent" ||
        (request.schedule && request.schedule.type === "permanent"))) return true;
    if (meta && meta.duration === "temporary" && schedules.activateTemporary === true) {
      const group = (schedules.groups || []).find(g =>
        g && g.id === meta.scheduleGroupId && Array.isArray(g.settings) && g.settings.includes(key));
      if (periodIsActive(group, key, now)) return true;
    }
    if (request && request.schedule && request.schedule.activateTemporary === true) {
      const period = (request.schedule.periods || []).find(p =>
        p && Array.isArray(p.settings) && p.settings.includes(key));
      if (periodIsActive(period, key, now)) return true;
    }
    return false;
  };
  const requestIsActive = (request, key, now) => {
    if (!request || !request.changeSchedules) {
      if (request && request.duration === "permanent") return true;
      if (request && request.duration === "temporary" && request.schedule &&
          request.schedule.activateTemporary === true) {
        const start = indiaLocalDateTimeToMs(request.schedule.startDateTime);
        const end = indiaLocalDateTimeToMs(request.schedule.endDateTime);
        return Number.isFinite(start) && Number.isFinite(end) && end > start && now >= start && now < end;
      }
      if (request && request.schedule && request.schedule.activateTemporary === true) {
        const period = (request.schedule.periods || []).find(p =>
          p && Array.isArray(p.settings) && p.settings.includes(key));
        return periodIsActive(period, key, now);
      }
      return false;
    }
    return settingIsActive(request, key, now);
  };

  function resolve(defaultsFile, overridesFile, requestFile) {
    const result = { ...FALLBACK };
    if (defaultsFile && defaultsFile.settings && typeof defaultsFile.settings === "object") {
      const s = defaultsFile.settings;
      if (typeof s.marqueeText === "string" && s.marqueeText.trim()) result.text = s.marqueeText.trim();
      if (safeColor(s.marqueeTextColor)) result.textColor = s.marqueeTextColor;
      if (safeColor(s.marqueeBackgroundColor)) result.backgroundColor = s.marqueeBackgroundColor;
      if (Number.isFinite(Number(s.marqueeSpeedSeconds))) result.speed = clampSpeed(s.marqueeSpeedSeconds);
    }

    const now = Date.now();
    const valid = new Set(["marqueeText", "marqueeTextColor", "marqueeBackgroundColor", "marqueeSpeedSeconds"]);
    const activeOverrides = Array.isArray(overridesFile && overridesFile.overrides)
      ? overridesFile.overrides.filter(item => {
          if (!item || item.enabled !== true || !valid.has(item.key)) return false;
          const start = indiaLocalDateTimeToMs(item.startAt);
          const end = indiaLocalDateTimeToMs(item.endAt);
          return Number.isFinite(start) && Number.isFinite(end) && end > start && now >= start && now < end;
        })
      : [];
    activeOverrides.forEach(item => {
      if (item.key === "marqueeText" && typeof item.value === "string" && item.value.trim()) result.text = item.value.trim();
      if (item.key === "marqueeTextColor" && safeColor(item.value)) result.textColor = item.value;
      if (item.key === "marqueeBackgroundColor" && safeColor(item.value)) result.backgroundColor = item.value;
      if (item.key === "marqueeSpeedSeconds") result.speed = clampSpeed(item.value);
    });

    if (!requestFile || requestFile.doctor !== "Dr. Nitin Mohan" ||
        !requestFile.changes || typeof requestFile.changes !== "object") return result;

    const c = requestFile.changes;
    const d = requestFile.details || {};
    if (!requestIsActive(requestFile, "announcementMarquee", now) || c.changeAnnouncement !== "yes") return result;

    const mode = c.announcementMode;
    if (mode === "edit" && typeof d.announcementText === "string" &&
        d.announcementText.trim() && d.announcementText.length <= 500) {
      result.text = d.announcementText.trim();
      const color = (d.announcementTextColors && d.announcementTextColors.customStrip) ||
        d.mainStripTextColor || c.mainStripTextColor;
      const bg = d.mainStripBackgroundColor || c.mainStripBackgroundColor ||
        (d.announcementBackgroundColors && d.announcementBackgroundColors.mainStrip);
      if (safeColor(color)) result.textColor = color;
      if (safeColor(bg)) result.backgroundColor = bg;
      const speed = Number(d.announcementMarqueeSpeedsSeconds && d.announcementMarqueeSpeedsSeconds.customStrip);
      if (Number.isFinite(speed)) result.speed = clampSpeed(speed);
      result.additional = null;
    } else if (mode === "restore_default") {
      result.text = DEFAULT_TEXT;
      result.textColor = "#0759a8";
      result.backgroundColor = "#ffc400";
      result.speed = 8;
      result.additional = null;
    } else if (mode === "add" && typeof d.announcementText === "string" &&
        d.announcementText.trim() && d.announcementText.length <= 500) {
      const mainColor = d.announcementTextColors && d.announcementTextColors.defaultStrip;
      if (safeColor(mainColor)) result.textColor = mainColor;
      const mainSpeed = Number(d.announcementMarqueeSpeedsSeconds && d.announcementMarqueeSpeedsSeconds.standardStrip);
      if (Number.isFinite(mainSpeed)) result.speed = clampSpeed(mainSpeed);
      result.additional = {
        text: d.announcementText.trim(),
        textColor: safeColor(d.announcementTextColors && d.announcementTextColors.customStrip)
          ? d.announcementTextColors.customStrip : "#ffffff",
        backgroundColor: safeColor(d.announcementBackgroundColors && d.announcementBackgroundColors.secondStrip)
          ? d.announcementBackgroundColors.secondStrip : "#0759a8",
        speed: clampSpeed(Number(d.announcementMarqueeSpeedsSeconds &&
          d.announcementMarqueeSpeedsSeconds.customStrip) || 8)
      };
    }
    return result;
  }

  function buildStrip(id, label, text, style) {
    let strip = document.getElementById(id);
    if (!strip) {
      strip = document.createElement("div");
      strip.id = id;
      strip.className = "kg-shared-announcement-strip";
      strip.setAttribute("role", "region");
      strip.setAttribute("aria-label", label);
    }
    strip.replaceChildren();
    const track = document.createElement("div");
    track.className = "kg-shared-announcement-track";
    track.style.animationDuration = style.speed + "s";
    for (let i = 0; i < 2; i++) {
      const span = document.createElement("span");
      span.className = "kg-shared-announcement-text";
      span.textContent = text;
      span.style.color = style.textColor;
      track.appendChild(span);
    }
    strip.appendChild(track);
    strip.style.backgroundColor = style.backgroundColor;
    strip.style.color = style.textColor;
    return strip;
  }

  function render(settings) {
    if (!document.body) return;
    let main = buildStrip("kg-shared-main-announcement", "Appointment announcement",
      settings.text, settings);
    const existingMain = document.querySelector(".offline-appointment-marquee:not(#kg-shared-main-announcement)");
    if (existingMain && !document.getElementById("kg-shared-main-announcement")) {
      main.id = "kg-shared-main-announcement";
      existingMain.replaceWith(main);
    } else if (!main.isConnected) {
      const header = document.querySelector("header, .site-header, .header");
      if (header && header.parentNode) header.parentNode.insertBefore(main, header);
      else document.body.insertBefore(main, document.body.firstChild);
    }

    const oldAdditional = document.getElementById("kg-shared-additional-announcement");
    if (settings.additional) {
      const extra = buildStrip("kg-shared-additional-announcement", "Additional announcement",
        settings.additional.text, settings.additional);
      main.insertAdjacentElement("afterend", extra);
    } else if (oldAdditional) {
      oldAdditional.remove();
    }
  }

  async function refresh() {
    const [defaultsFile, overridesFile, requestFile] = await Promise.all([
      readJson(ROOT + "defaults.json"),
      readJson(ROOT + "temporary_overrides.json"),
      readJson(ROOT + "change-request.json")
    ]);
    render(resolve(defaultsFile, overridesFile, requestFile));
  }

  function start() {
    render(FALLBACK);
    refresh().catch(() => render(FALLBACK));
    window.setInterval(() => {
      if (!document.hidden) refresh().catch(() => {});
    }, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh().catch(() => {});
    });
    window.KGAnnouncementSync = { refresh };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
