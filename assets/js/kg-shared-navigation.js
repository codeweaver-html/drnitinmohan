/* KidsGastro shared navigation controller
   Shared by the homepage and standalone sub-sites. Keeps page-specific content/scripts intact. */
(function () {
  "use strict";

  function init() {
    var header = document.querySelector("header.header");
    var nav = header && header.querySelector("nav.nav");
    var button = nav && nav.querySelector("button.toggle");
    var panel = header && header.querySelector("#links");
    if (!header || !nav || !button || !panel || button.dataset.kgSharedNav === "1") return;
    button.dataset.kgSharedNav = "1";
    button.type = "button";
    button.setAttribute("aria-controls", "links");

    function isOpen() { return panel.classList.contains("open"); }
    function placePanel() {
      if (!isOpen()) return;
      var rect = header.getBoundingClientRect();
      var top = Math.max(8, Math.min(Math.round(rect.bottom + 5), window.innerHeight - 100));
      panel.style.setProperty("--kg-final-menu-top", top + "px");
    }
    function setOpen(open) {
      panel.classList.toggle("open", !!open);
      panel.hidden = false;
      panel.setAttribute("aria-hidden", String(!open));
      button.setAttribute("aria-expanded", String(!!open));
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      button.classList.toggle("is-open", !!open);
      document.body.classList.toggle("kg-final-menu-open", !!open);
      if (open) {
        placePanel();
        window.requestAnimationFrame(placePanel);
      } else {
        panel.querySelectorAll("details[open]").forEach(function (item) { item.open = false; });
        panel.style.removeProperty("--kg-final-menu-top");
      }
    }

    /* Capture phase prevents legacy page handlers from reversing the toggle. */
    document.addEventListener("click", function (event) {
      var hit = event.target && event.target.closest
        ? event.target.closest('header.header button.toggle[aria-controls="links"]') : null;
      if (hit !== button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!isOpen());
    }, true);

    document.addEventListener("click", function (event) {
      if (isOpen() && !panel.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a[href]")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        button.focus();
      }
    });
    window.addEventListener("resize", placePanel, { passive: true });
    window.addEventListener("scroll", placePanel, { passive: true });
    setOpen(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
