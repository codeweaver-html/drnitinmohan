
/* ===== PAGE OWNERSHIP GUARD ===== */
(() => {
  "use strict";
  if (document.documentElement.dataset.kgSite !== "main") return;

/* ===== MAIN-SITE ANNOUNCEMENT SYNCHRONIZER ===== */
/* Main-site announcement synchronizer.
 * Reads the configuration JSON used by the site:
 * configuration/defaults.json
 * configuration/temporary_overrides.json
 * configuration/change-request.json
 *
 * This main-site copy renders into the existing offline-appointment-marquee.
 * The separate subsite copy remains inside kg-shared.js.
 */
(() => {
  "use strict";
  if (document.documentElement.dataset.kgSite !== "main" || document.getElementById("kg-manual-settings-bridge")) return;

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
      strip.className = "offline-appointment-marquee";
      strip.setAttribute("role", "region");
      strip.setAttribute("aria-label", label);
    }
    strip.replaceChildren();
    const track = document.createElement("div");
    track.className = "offline-appointment-marquee__track";
    track.style.setProperty("animation-duration", style.speed + "s", "important");
    for (let i = 0; i < 2; i++) {
      const span = document.createElement("span");
      span.className = "offline-appointment-marquee__text";
      span.textContent = text;
      span.style.setProperty("color", style.textColor, "important");
      track.appendChild(span);
    }
    strip.appendChild(track);
    strip.style.setProperty("background-color", style.backgroundColor, "important");
    strip.style.setProperty("color", style.textColor, "important");
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
    }, 300000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh().catch(() => {});
    });
    window.KGHomepageAnnouncementSync = { refresh };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();


/*
 * KIDSGASTRO MAIN-SITE JAVASCRIPT
 * Owner: the main-site app shell only (html[data-kg-site="main"]).
 * Contains homepage interactions, in-shell page routes, announcement sync,
 * main navigation and the homepage WhatsApp control.
 * Standalone subsite behavior belongs exclusively to /assets/kg-shared.js.
 * Main logo source: /assets/kg%20logo.webp.
 */


/* ===== MAIN: navigation content and FAQ cleanup ===== */
{
document.addEventListener('DOMContentLoaded',()=>{const health=[...document.querySelectorAll('.nav-dropdown')].find(menu=>menu.querySelector('summary')?.textContent.trim().startsWith('Health Library'));if(health)health.querySelectorAll('.nav-dropdown-menu a').forEach(link=>{if(link.dataset.secondaryPage!=='publications')link.remove()});const tidyFaq=()=>setTimeout(()=>{const content=document.querySelector('#secondary-page-content');if(!content)return;const eyebrow=[...content.querySelectorAll('.eyebrow')].find(item=>item.textContent.trim()==='Family information');if(eyebrow)eyebrow.remove();const disclaimer=[...content.querySelectorAll('details')].find(item=>item.querySelector('summary')?.textContent.trim()==='Medical Disclaimer');if(disclaimer)disclaimer.open=true},0);tidyFaq();window.addEventListener('popstate',tidyFaq)})
}

/* ===== missing-image-preview-fallback-script ===== */
{
document.addEventListener('DOMContentLoaded',()=>{
 const rootAssets=new Set(['kg logo.webp','main pic.webp','potrait gallery.jpg','baby pic.webp','hospital pic.webp','endo main pic.webp','gastro talk.webp','rezept-rx-logo.png','endo gallery pic.webp']);
 document.querySelectorAll('img[src]').forEach(img=>{
  const path=decodeURIComponent((img.getAttribute('src')||'').replace(/^\.\//,'').replace(/^\/assets\//,''));
  if(!rootAssets.has(path)) return;
  const fallback=()=>{
   if(img.dataset.previewFallback==='1') return;
   img.dataset.previewFallback='1'; img.classList.add('asset-pending');
   const box=document.createElement('div'); box.className='asset-preview-placeholder';
   box.textContent=(img.alt||'Website image')+' — image could not be loaded. Check that the image file is in the /assets/ folder.';
   img.insertAdjacentElement('afterend',box);
  };
  img.addEventListener('error',fallback,{once:true});
  if(img.complete && img.naturalWidth===0) fallback();
 });
});
}

/* ===== embedded-kidsgastro-logo ===== */
{
(function(){const LOGO_DATA="/assets/kg%20logo.webp";function applyLogo(root){if(root&&root.matches&&root.matches('[data-embedded-logo]'))root.setAttribute('src',LOGO_DATA);if(root&&root.querySelectorAll)root.querySelectorAll('[data-embedded-logo]').forEach(function(img){img.setAttribute('src',LOGO_DATA)});}document.documentElement.style.setProperty('--embedded-logo-bg','url("'+LOGO_DATA+'")');const icon=document.getElementById('embedded-logo-favicon');if(icon)icon.href=LOGO_DATA;function init(){applyLogo(document);const observer=new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1)applyLogo(node);});});});observer.observe(document.documentElement,{childList:true,subtree:true});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();
}

/* ===== remove-opd-section ===== */
{
(function(){
  function removeOpd(){document.querySelectorAll('.opd-hours,.opd-hours-under-booking').forEach(function(node){node.remove();});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',removeOpd,{once:true});}else{removeOpd();}
})();
}

/* ===== kg-seo-hash-metadata ===== */
{
(()=>{
 const pages={
  profile:{title:'About Dr. Nitin Mohan | KidsGastro, Hisar',description:'Learn about Dr. Nitin Mohan and his paediatric gastroenterology practice in Hisar.'},
  services:{title:'Paediatric Gastroenterology Services | KidsGastro, Hisar',description:'Explore paediatric gastroenterology consultation services at KidsGastro with Dr. Nitin Mohan in Hisar.'},
  treatments:{title:'Child Digestive Health & Treatments | KidsGastro, Hisar',description:'Information about children’s digestive and liver health concerns and consultation options at KidsGastro, Hisar.'},
  faqs:{title:'Frequently Asked Questions | KidsGastro, Hisar',description:'Read common family questions about paediatric gastroenterology consultations and child digestive health.'},
  gallery:{title:'Clinic & Clinical Gallery | KidsGastro, Hisar',description:'View the KidsGastro gallery featuring clinical practice, health education and clinic-related images.'},
  hospital:{title:'Clinic Location & OPD Timings | KidsGastro, Hisar',description:'Find clinic location information and OPD timings for KidsGastro in Hisar.'},
  clinical:{title:'Clinical Practice | Dr. Nitin Mohan, KidsGastro',description:'Learn about the clinical practice and paediatric gastroenterology focus of Dr. Nitin Mohan.'},
  blog:{title:'Health Articles & Updates | KidsGastro',description:'Read health education articles and updates for families from KidsGastro.'},
  latest:{title:'Latest Health Updates | KidsGastro',description:'Explore recent health and medical updates shared by KidsGastro.'},
  publications:{title:'Research & Publications | Dr. Nitin Mohan',description:'Explore research publications and academic work associated with Dr. Nitin Mohan.'},
  testimonials:{title:'Family Feedback | KidsGastro, Hisar',description:'Read feedback displayed on the KidsGastro website.'},
  socials:{title:'KidsGastro on Social Media',description:'Find KidsGastro social media channels and educational content.'},
  newsletter:{title:'KidsGastro Health Updates',description:'Explore health education updates from KidsGastro.'}
 };
 const baseTitle='KidsGastro | Paediatric Gastroenterology in Hisar · Dr. Nitin Mohan';
 const baseDescription='Paediatric gastroenterology consultations in Hisar with Dr. Nitin Mohan. Find clinic information, child digestive health resources and appointment options.';
 const apply=()=>{const slug=location.pathname.split('/').filter(Boolean)[0]||'';const routeToPage={about:'profile',clinic:'hospital'};const pageId=routeToPage[slug]||slug;const m=pageId?{1:pageId}:null;const p=m&&pages[m[1]];document.title=p?p.title:baseTitle;const d=document.querySelector('meta[name="description"]');if(d)d.content=p?p.description:baseDescription;const ogt=document.querySelector('meta[property="og:title"]');if(ogt)ogt.content=document.title;const ogd=document.querySelector('meta[property="og:description"]');if(ogd)ogd.content=d?d.content:baseDescription;};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();window.addEventListener('popstate',apply);
})();
}

/* ===== MAIN: dropdowns, reveal effects, newsletter and full-site search ===== */
{
document.querySelectorAll('.nav-dropdown').forEach(dropdown=>{const syncUnderline=()=>dropdown.classList.toggle('dropdown-active',dropdown.open);dropdown.addEventListener('toggle',syncUnderline);dropdown.querySelector(':scope > summary')?.addEventListener('click',()=>{document.querySelectorAll('.nav-dropdown[open]').forEach(other=>{if(other!==dropdown)other.open=false})});syncUnderline()});document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown[open]').forEach(dropdown=>dropdown.open=false)});/* Removed duplicate hamburger handlers that were immediately reversing the menu state. The primary handler controls #links. */const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible','scroll-visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));const cinematicTargets=document.querySelectorAll('.strip-grid>div,.section-heading,.credential-card,.reel-slide,.latest-card,.qr-card,.hospital-photo,.map-frame,.social-placeholder');cinematicTargets.forEach((el,index)=>{el.classList.add('scroll-cinematic');el.style.setProperty('--scroll-delay',(index%3)*90+'ms');observer.observe(el)});document.querySelectorAll('.reel-slide img,.photo-story-media img,.latest-image img,.hospital-photo img').forEach(img=>{img.classList.add('scroll-photo');observer.observe(img)});
document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const email=new FormData(f).get('email');const subject=encodeURIComponent('Newsletter subscription request');const body=encodeURIComponent('Please add this email address to the clinic newsletter list: '+email);document.querySelector('#newsletter-status').textContent='Your email app will open with a subscription request for you to review and send.';location.href='mailto:drnitinmohanpaedsgastro@gmail.com?subject='+subject+'&body='+body});const siteSearch=document.querySelector('#site-search'),searchInput=document.querySelector('#site-search-input'),searchStatus=document.querySelector('#search-status'),mainContent=document.querySelector('#main'),secondaryTemplates=document.querySelector('#secondary-templates'),secondaryContent=document.querySelector('#secondary-page-content');let searchMatches=[],searchCursor=0,lastSearch='';const searchPageNames={profile:'About Dr. Nitin Mohan',treatments:'Treatments',services:'Services',publications:'Research Articles & Publications',hospital:'Hospital',clinical:'Clinical work',gallery:'KidsGastro Photo Gallery',latest:'Latest from KidsGastro',newsletter:'Newsletter',socials:'Social profiles',faqs:'FAQs',testimonials:'Patient & Family Testimonials'};function normalizedSearchText(value){return value.replace(/\s+/g,' ').trim().toLocaleLowerCase()}function buildFullSiteSearchIndex(){const entries=[],seen=new Set(),selector='h1,h2,h3,p,li,summary,dt,dd,small,strong,figcaption';function add(element,page,targetId){const text=element.textContent.replace(/\s+/g,' ').trim();if(!text)return;const key=(page||'home')+'|'+normalizedSearchText(text);if(seen.has(key))return;seen.add(key);entries.push({element,page,text,targetId})}mainContent.querySelectorAll(selector).forEach(element=>{const target=element.closest('#main [id]');add(element,'',target?target.id:'top')});secondaryTemplates.content.querySelectorAll('section[data-page]').forEach(section=>{const page=section.dataset.page;section.querySelectorAll(selector).forEach(element=>add(element,page,''))});return entries}function showSearchMatch(match){const pageRoutes={profile:'about',hospital:'clinic'};const destination=match.page?'/'+(pageRoutes[match.page]||match.page)+'/':'#'+match.targetId;if(match.page&&location.pathname!==destination){location.href=destination;return;}requestAnimationFrame(()=>requestAnimationFrame(()=>{let target=match.element;if(match.page){const candidates=secondaryContent.querySelectorAll('h1,h2,h3,p,li,summary,dt,dd,small,strong,figcaption');target=[...candidates].find(element=>normalizedSearchText(element.textContent)===normalizedSearchText(match.text))||secondaryContent.querySelector('[data-page]')}if(target){document.querySelectorAll('.search-hit').forEach(element=>element.classList.remove('search-hit'));target.classList.add('search-hit');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})}}))}siteSearch.addEventListener('submit',event=>{event.preventDefault();const rawQuery=searchInput.value.trim(),query=normalizedSearchText(rawQuery);document.querySelectorAll('.search-hit').forEach(element=>element.classList.remove('search-hit'));if(!query){searchStatus.textContent='Enter a word or phrase to search all pages.';return}if(query!==lastSearch){searchMatches=buildFullSiteSearchIndex().filter(entry=>normalizedSearchText(entry.text).includes(query));searchCursor=0;lastSearch=query}const count=searchMatches.length;if(!count){searchStatus.textContent='No matches';return}searchStatus.textContent=count+' '+(count===1?'match':'matches');const match=searchMatches[searchCursor];searchCursor=(searchCursor+1)%count;showSearchMatch(match)});searchInput.addEventListener('input',()=>{searchStatus.textContent='';lastSearch='';searchCursor=0})
}

/* ===== MAIN: internal route renderer for the main-site shell ===== */
{
(()=>{const main=document.querySelector('#main'),site=document.querySelector('#secondary-site'),content=document.querySelector('#secondary-page-content'),templates=document.querySelector('#secondary-templates');if(!main||!site||!content||!templates)return;const labels={profile:'About Dr. Nitin Mohan',treatments:'Treatments',services:'Services',publications:'Research Articles & Publications',hospital:'Hospital',clinical:'Clinical work',gallery:'KidsGastro Photo Gallery',latest:'Latest from KidsGastro',blog:'KidsGastro Blog',newsletter:'KidsGastro newsletter',socials:'KidsGastro social profiles',faqs:'Frequently asked questions',testimonials:'Patient & Family Testimonials'};function renderRoute(){const routeSlug=location.pathname.split('/').filter(Boolean)[0]||'';const routeToTemplate={about:'profile',clinic:'hospital'};const id=routeToTemplate[routeSlug]||routeSlug||null;if(!labels[id]){site.hidden=true;main.hidden=false;document.title='KidsGastro | Kids Gastro in Hisar · Dr. Nitin Mohan';return}const template=templates.content.querySelector('[data-page="'+id+'"]');if(!template)return;main.hidden=true;site.hidden=false;content.innerHTML=template.innerHTML;const localTop=document.createElement('a');localTop.className='secondary-page-back-top';localTop.href='/gallery/';localTop.innerHTML='Back to top of this section <span aria-hidden="true">↑</span>';localTop.setAttribute('aria-label','Back to top of this section');content.appendChild(localTop);localTop.addEventListener('click',event=>{event.preventDefault();const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';const activePage=site.querySelector('#secondary-page-content');if(activePage){const header=document.querySelector('.header');const offset=(header?header.getBoundingClientRect().height:0)+12;const targetY=activePage.getBoundingClientRect().top+window.scrollY-offset;window.scrollTo({top:Math.max(0,targetY),behavior});}else{content.scrollIntoView({behavior,block:'start'});}});document.title=labels[id]+' | KidsGastro';site.querySelectorAll('.secondary-nav a').forEach(a=>{if(a.dataset.secondaryPage===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}document.addEventListener('click',e=>{const a=e.target.closest('a[data-secondary-page]');if(!a)return;return;const treatmentIndex=a.hasAttribute('data-treatment-index')?Number(a.dataset.treatmentIndex):null;const serviceIndex=a.hasAttribute('data-service-index')?Number(a.dataset.serviceIndex):null;const goToIndexedSection=()=>{if(treatmentIndex!==null){const card=content.querySelectorAll('.treatment-card')[treatmentIndex];if(card){card.setAttribute('tabindex','-1');card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});card.focus({preventScroll:true});}}if(serviceIndex!==null){const card=content.querySelectorAll('.service-card')[serviceIndex];if(card){card.setAttribute('tabindex','-1');card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});card.focus({preventScroll:true});}}};if(treatmentIndex!==null||serviceIndex!==null)requestAnimationFrame(()=>requestAnimationFrame(goToIndexedSection));});window.addEventListener('popstate',renderRoute);renderRoute()})();
}

/* ===== MAIN: core page interactions and navigation utilities ===== */
{
(()=>{
 const dialog=document.getElementById('whatsapp-booking-dialog');
 const bookingDialogTitle=document.getElementById('booking-dialog-title');
 const form=document.getElementById('whatsapp-booking-form');
 const dateInput=document.getElementById('preferred-date');
 const manualDateInput=document.getElementById('manual-date');
 const datePanel=document.getElementById('date-panel');
 const childNameInput=document.getElementById('child-name');
 const childAgeInput=document.getElementById('child-age');
 const parentNameInput=document.getElementById('parent-name');
 const phoneStep=document.getElementById('booking-phone-step');
 const dateSummary=document.getElementById('date-summary');
 const dateError=document.getElementById('booking-date-error');
 const monthLabel=document.getElementById('calendar-month');
 const calendarGrid=document.getElementById('calendar-grid');
 const timePanel=document.getElementById('time-panel');
 const timeSlotSelect=document.getElementById('time-slot-select');
 const typedTime=document.getElementById('preferred-time');
 const manualAm=document.getElementById('manual-am');
 const manualPm=document.getElementById('manual-pm');
 const face=document.getElementById('booking-clock');
 const hand=document.getElementById('booking-clock-hand');
 const hourButton=document.getElementById('clock-hour');
 const minuteButton=document.getElementById('clock-minute');
 const amButton=document.getElementById('clock-am');
 const pmButton=document.getElementById('clock-pm');
 const instruction=document.getElementById('clock-instruction');
 const error=document.getElementById('booking-dialog-error');
 const opdDateGuidance=document.getElementById('opd-date-guidance'); const opdTimeGuidance=document.getElementById('opd-time-guidance');
 let errorTimer;
 function showTemporaryError(message){clearTimeout(errorTimer);error.textContent=message;errorTimer=setTimeout(()=>{error.textContent=''},1500)}
 let dateErrorTimer;function showTemporaryDateError(message){clearTimeout(dateErrorTimer);dateError.textContent=message;dateErrorTimer=setTimeout(()=>{dateError.textContent=''},1800)}
 const phone='919821020576';
 let hour=9,minute=0,period='AM',manualPeriod='AM',part='hour',selectedDate='',viewDate=new Date(),dragPart=null,timeSource='clock',timeChosen=false,lastValidTime='',periodExplicit=false;
 const today=new Date();today.setHours(0,0,0,0);
 const todayKey=toKey(today);
 const tomorrow=new Date(today);tomorrow.setDate(tomorrow.getDate()+1);
 const tomorrowKey=toKey(tomorrow);
 function toKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
function weekdayForKey(key){const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d).getDay()}
 function allowedTimeText(key){return 'Choose an available appointment time.'}
  function isAllowedTime(key,h,m,p){const mins=(h%12)*60+m+(p==='PM'?720:0);return weekdayForKey(key)===0?mins>=600&&mins<840:(mins>=540&&mins<840)||(mins>=960&&mins<1080)}
  // Fixed internally booked slots: weekday index uses Sunday=0. Times are slot start minutes after midnight.
  const bookedSlotsByWeekday={0:[660,750],1:[540,1050],2:[810,1020],3:[570,1050],4:[780,1020],5:[540,1050],6:[810,1020]};
  function isBookedTime(key,h,m,p){if(!key)return false;const mins=(h%12)*60+m+(p==='PM'?720:0);return (bookedSlotsByWeekday[weekdayForKey(key)]||[]).includes(mins)}
  function isSelectableTime(key,h,m,p){if(!key||!isAllowedTime(key,h,m,p)||isBookedTime(key,h,m,p))return false;if(key===todayKey){const now=new Date(),nowMinutes=now.getHours()*60+now.getMinutes(),chosen=(h%12)*60+m+(p==='PM'?720:0);if(chosen<nowMinutes)return false}return true}
  function canChooseHour(key,h,p){return [0,5,10,15,20,25,30,35,40,45,50,55].some(m=>isSelectableTime(key,h,m,p))}
  function hasBookableSlot(key){return Boolean(key&&key>=todayKey&&key<=tomorrowKey&&getFirstBookableTime(key))}
 function getFirstBookableTime(key){if(!key||key<todayKey)return null;const windows=weekdayForKey(key)===0?[[600,840]]:[[540,840],[960,1080]];let candidate=windows[0][0];if(key===todayKey){const now=new Date();candidate=Math.ceil((now.getHours()*60+now.getMinutes())/5)*5}for(const [start,end] of windows){const minutes=Math.max(start,candidate);if(minutes<end){const hour24=Math.floor(minutes/60),minuteValue=minutes%60;return{hour:hour24%12||12,minute:minuteValue,period:hour24>=12?'PM':'AM'}}}return null}
 function applyFirstBookableTime(key){const first=getFirstBookableTime(key);if(!first)return false;hour=first.hour;minute=first.minute;period=first.period;manualPeriod=first.period;periodExplicit=false;part='hour';timeChosen=true;return true}
 function validateCurrentTime(){if(!selectedDate)return;opdTimeGuidance.textContent=allowedTimeText(selectedDate);if(!timeChosen)return;const chosen=(hour%12)*60+minute+(period==='PM'?720:0);if(!isAllowedTime(selectedDate,hour,minute,period)){timeChosen=false;typedTime.setAttribute('aria-invalid','true');opdTimeGuidance.textContent=(chosen>=840&&chosen<960?'That time is unavailable. ':'That time is unavailable. ')+allowedTimeText(selectedDate);return}if(!isSelectableTime(selectedDate,hour,minute,period)){timeChosen=false;typedTime.setAttribute('aria-invalid','true');opdTimeGuidance.textContent='That time has already passed. Choose a later time today, or select another date.';return}typedTime.removeAttribute('aria-invalid')}
 function formatClockMinutes(totalMinutes){const normalized=((totalMinutes%1440)+1440)%1440;const h24=Math.floor(normalized/60),minuteValue=normalized%60,h=h24%12||12,p=h24>=12?'PM':'AM';return {text:`${String(h).padStart(2,'0')}:${String(minuteValue).padStart(2,'0')}`,period:p}}
 function formatSlotLabel(hour24,minuteValue){const p=hour24>=12?'PM':'AM',h=hour24%12||12;return `${String(h).padStart(2,'0')}:${String(minuteValue).padStart(2,'0')} ${p}`}
 function formatSlotRange(startMinutes,endMinutes){const start=formatClockMinutes(startMinutes),end=formatClockMinutes(endMinutes);return start.period===end.period?`${start.text}–${end.text} ${end.period}`:`${start.text} ${start.period}–${end.text} ${end.period}`}
 function populateTimeSlots(key){
   timeSlotSelect.replaceChildren();
   const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=key?'Choose a 30-minute slot':'Choose a date to show slots';timeSlotSelect.appendChild(placeholder);
   timeSlotSelect.disabled=false;
   if(!key){timeChosen=false;opdTimeGuidance.textContent='';return}
   const windows=weekdayForKey(key)===0?[[600,840]]:[[540,840],[960,1080]];
   const strikeText=text=>Array.from(text).map(char=>char===' '?' ':char+'\u0336').join('');
   for(const [start,end] of windows){for(let mins=start;mins<end;mins+=30){const h24=Math.floor(mins/60),m=mins%60,h=h24%12||12,p=h24>=12?'PM':'AM';const option=document.createElement('option');option.value=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}|${p}`;if(isBookedTime(key,h,m,p)){option.disabled=true;option.textContent=`${formatSlotRange(mins,mins+30)}  ·  Slot already booked`;timeSlotSelect.appendChild(option);continue}if(!isSelectableTime(key,h,m,p))continue;option.textContent=formatSlotRange(mins,mins+30);timeSlotSelect.appendChild(option)}}
   if(timeSlotSelect.options.length>1){timeSlotSelect.selectedIndex=0;timeChosen=false;opdTimeGuidance.textContent=''}else{timeSlotSelect.value='';timeChosen=false}
 }
 function applySelectedSlot(){const value=timeSlotSelect.value;if(!value){timeChosen=false;return}const [clock,p]=value.split('|'),[h,m]=clock.split(':').map(Number);hour=h;minute=m;period=p;manualPeriod=p;timeSource='typed';timeChosen=true;typedTime.value=clock;lastValidTime=clock;typedTime.removeAttribute('aria-invalid');opdTimeGuidance.textContent='Selected slot: '+timeSlotSelect.options[timeSlotSelect.selectedIndex].text+(selectedDate?'. '+allowedTimeText(selectedDate):'. Select a date to confirm this slot is available.')}
 timeSlotSelect.addEventListener('change',()=>{applySelectedSlot();error.textContent=''});
 function setSelectedDate(key){
   if(!hasBookableSlot(key)){selectedDate='';dateInput.value='';timePanel.disabled=false;dateError.textContent=key<todayKey?'Past dates are unavailable. Choose today or tomorrow.':key>tomorrowKey?'Only today and tomorrow are available for booking.':'No OPD hours remain on this date.';return false}
   selectedDate=key;periodExplicit=false;typedTime.value='';lastValidTime='';timeSource='clock';typedTime.removeAttribute('aria-invalid');applyFirstBookableTime(key);opdDateGuidance.textContent=allowedTimeText(key)+' Select an available 30-minute slot from the dropdown.';opdTimeGuidance.textContent='Selected time: '+String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0')+' '+period+'. '+allowedTimeText(key);dateInput.value=key;const [chosenYear,chosenMonth,chosenDay]=key.split("-");manualDateInput.value=`${chosenDay}/${chosenMonth}/${chosenYear}`;timePanel.disabled=false;
   const [y,m,d]=key.split('-').map(Number),chosen=new Date(y,m-1,d);
   dateSummary.textContent="";dateError.textContent="";clearTimeout(dateErrorTimer);
   viewDate=new Date(y,m-1,1);error.textContent='';drawCalendar();updateClock();populateTimeSlots(key);return true;
 }
 function openDialog(){error.textContent='';bookingDialogTitle.textContent='Choose a preferred date and time';childNameInput.value='';childAgeInput.value='';if(parentNameInput)parentNameInput.value='';if(phoneStep)phoneStep.hidden=true;if(parentNameInput)parentNameInput.required=false;selectedDate='';dateInput.value='';manualDateInput.value='';typedTime.value='';timeSource='clock';timeChosen=false;lastValidTime='';manualPeriod='AM';periodExplicit=false;datePanel.disabled=false;timePanel.disabled=false;dateSummary.textContent="";dateError.textContent="";clearTimeout(dateErrorTimer);viewDate=new Date();viewDate.setDate(1);hour=9;minute=0;period='AM';part='hour';drawCalendar();populateTimeSlots('');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');requestAnimationFrame(updateClock);childNameInput.focus()}
function updateNameGate(){bookingDialogTitle.textContent=selectedDate?"Choose a preferred date and time":"Select an appointment date";if(datePanel)datePanel.disabled=false;}
  childAgeInput.addEventListener('input',()=>{const match=childAgeInput.value.match(/^\d*(?:\.\d*)?/);const clean=match?match[0]:'';if(clean!==childAgeInput.value){childAgeInput.value=clean;showTemporaryError('Enter the age as a number.')}updateNameGate()});
childAgeInput.addEventListener('blur',()=>{let value=childAgeInput.value.trim();if(value.startsWith('.'))value='0'+value;if(value.endsWith('.'))value=value.slice(0,-1);childAgeInput.value=value});
function sanitizeName(field){const original=field.value;const clean=Array.from(original).filter(character=>/[\p{L}\p{M}\s.'’-]/u.test(character)).join('');if(clean!==original){field.value=clean;showTemporaryError('Use letters for names.')}updateNameGate()}
childNameInput.addEventListener('input',()=>sanitizeName(childNameInput));if(parentNameInput)parentNameInput.addEventListener('input',()=>updateNameGate());
 function drawCalendar(){
   const year=viewDate.getFullYear(),month=viewDate.getMonth();
   monthLabel.textContent=new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric'}).format(viewDate);
   calendarGrid.replaceChildren();
   const firstDay=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();
   for(let i=0;i<firstDay;i++){const spacer=document.createElement('span');spacer.className='calendar-empty';spacer.setAttribute('aria-hidden','true');calendarGrid.appendChild(spacer)}
   for(let day=1;day<=days;day++){
     const date=new Date(year,month,day),key=toKey(date),button=document.createElement('button');
     button.type='button';button.className='calendar-day';button.textContent=String(day);
     button.setAttribute('aria-label',new Intl.DateTimeFormat('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date));
     const isBookableDate=hasBookableSlot(key);
     if(!isBookableDate){button.disabled=true;button.setAttribute('aria-disabled','true');button.tabIndex=-1;button.title=key<todayKey?'Past dates are unavailable':key>tomorrowKey?'Only today and tomorrow are available':'No OPD appointment hours remain today'}
     if(key===todayKey)button.classList.add('is-today');
     button.setAttribute('aria-pressed',String(key===selectedDate));
     if(isBookableDate)button.addEventListener('click',()=>setSelectedDate(key));calendarGrid.appendChild(button);
   }
   document.getElementById('calendar-previous').disabled=year===today.getFullYear()&&month===today.getMonth();
 }
 function formatManualDate(value){
   const digits=value.replace(/\D/g,'').slice(0,8);
   if(digits.length<=2)return digits;
   if(digits.length<=4)return `${digits.slice(0,2)}/${digits.slice(2)}`;
   return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
 }
 manualDateInput.addEventListener('input',()=>{
   clearTimeout(dateErrorTimer);dateError.textContent='';
   clearTimeout(dateErrorTimer);dateError.textContent='';
   const formatted=formatManualDate(manualDateInput.value);
   if(formatted!==manualDateInput.value){manualDateInput.value=formatted;manualDateInput.setSelectionRange(formatted.length,formatted.length)}
   const digits=formatted.replace(/\D/g,'');
   if(digits.length>=2){const dayPrefix=Number(digits.slice(0,2));if(dayPrefix<1||dayPrefix>31){selectedDate='';dateInput.value='';timePanel.disabled=false;showTemporaryDateError('Day must be 01–31. Use DD/MM/YYYY.');return}}
   if(digits.length>=4){const dayCheck=Number(digits.slice(0,2)),monthCheck=Number(digits.slice(2,4));if(monthCheck<1||monthCheck>12){selectedDate='';dateInput.value='';timePanel.disabled=false;showTemporaryDateError('Month must be 01–12. Use DD/MM/YYYY.');return}const maxDay=new Date(2000,monthCheck,0).getDate();if(dayCheck<1||dayCheck>maxDay){selectedDate='';dateInput.value='';timePanel.disabled=false;showTemporaryDateError('That day does not exist in this month. Use DD/MM/YYYY.');return}}
   if(digits.length<8){selectedDate='';dateInput.value='';timePanel.disabled=false;return}
   const day=Number(digits.slice(0,2)),month=Number(digits.slice(2,4)),year=Number(digits.slice(4,8)),parsed=new Date(year,month-1,day);
   if(month<1||month>12||day<1||parsed.getFullYear()!==year||parsed.getMonth()!==month-1||parsed.getDate()!==day){selectedDate='';dateInput.value='';timePanel.disabled=false;showTemporaryDateError('Use DD/MM/YYYY: day 01–31, month 01–12, and a valid year.');return}
   const key=`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
   if(!hasBookableSlot(key)){selectedDate='';dateInput.value='';manualDateInput.value='';timePanel.disabled=false;showTemporaryDateError(key<todayKey?'Past dates are unavailable. Choose today or tomorrow.':key>tomorrowKey?'Only today and tomorrow are available for booking.':'No OPD hours remain on this date.');return}
   setSelectedDate(key);
 }); document.getElementById('calendar-previous').addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);drawCalendar()});
 document.getElementById('calendar-next').addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);drawCalendar()});
 function drawClock(){
   face.querySelectorAll('.clock-number').forEach(n=>n.remove());
   const values=part==='hour'?Array.from({length:24},(_,i)=>i):Array.from({length:12},(_,i)=>i*5);
   const rect=face.getBoundingClientRect(),center=rect.width/2,outerRadius=center-30,innerRadius=center-61;
   values.forEach((value,index)=>{
     const angle=((index%12)*30-90)*Math.PI/180;
     const button=document.createElement('button');button.type='button';button.className='clock-number'+(part==='hour'&&value>=12?' clock-number-inner':'');
     const displayValue=part==='hour'?(value%12||12):String(value).padStart(2,'0');
     button.dataset.clockValue=String(value);
     button.textContent=part==='hour'?String(displayValue):displayValue;
     button.setAttribute('aria-pressed',String(part==='hour'?(value%12||12)===hour&&(value>=12?'PM':'AM')===period:value===minute));
     button.setAttribute('aria-label',part==='hour'?`${value===0?'12 AM':value===12?'12 PM':value<12?value+' AM':(value-12)+' PM'}`:`${value} minutes`);
     const hour12=part==='hour'?(value%12||12):hour,period24=part==='hour'?(value>=12?'PM':'AM'):period;
     button.disabled=part==='hour'?!canChooseHour(selectedDate,hour12,period24):!isSelectableTime(selectedDate,hour,value,period);
     const radius=part==='hour'&&value>=12?innerRadius:outerRadius;
     button.style.left=`${center+Math.cos(angle)*radius}px`;button.style.top=`${center+Math.sin(angle)*radius}px`;
     button.addEventListener('click',()=>{if(button.disabled)return;useClock();if(part==='hour'){hour=value%12||12;period=value>=12?'PM':'AM';manualPeriod=period;periodExplicit=false;part='minute';timeChosen=false}else{minute=value;part='hour';timeChosen=true}updateClock()});
     face.appendChild(button);
   });
   hand.style.transform=`rotate(${(part==='hour'?hour%12:minute/5)*30}deg)`;
   instruction.textContent=part==='hour'?'Choose an hour — drag the hand or select a number':'Choose minutes — drag the hand or select a number';
   hourButton.textContent=String(hour).padStart(2,'0');minuteButton.textContent=String(minute).padStart(2,'0');
   hourButton.setAttribute('aria-pressed',String(part==='hour'));minuteButton.setAttribute('aria-pressed',String(part==='minute'));
   amButton.setAttribute('aria-pressed',String(period==='AM'));pmButton.setAttribute('aria-pressed',String(period==='PM'));manualAm.setAttribute('aria-pressed',String(manualPeriod==='AM'));manualPm.setAttribute('aria-pressed',String(manualPeriod==='PM'));face.dataset.period=period;
 }
 function updateClock(){drawClock();if(timeSource==='clock'){typedTime.value=String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');lastValidTime=typedTime.value;manualPeriod=period;manualAm.setAttribute('aria-pressed',String(manualPeriod==='AM'));manualPm.setAttribute('aria-pressed',String(manualPeriod==='PM'));typedTime.removeAttribute('aria-invalid')}validateCurrentTime()}
 function useClock(){timeSource='clock';typedTime.value=String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');lastValidTime=typedTime.value;manualPeriod=period;typedTime.removeAttribute('aria-invalid')}
 hourButton.addEventListener('click',()=>{useClock();part='hour';updateClock()});
 minuteButton.addEventListener('click',()=>{useClock();part='minute';updateClock()});
 amButton.addEventListener('click',()=>{useClock();periodExplicit=true;period='AM';manualPeriod='AM';timeChosen=isSelectableTime(selectedDate,hour,minute,period);updateClock()});
 pmButton.addEventListener('click',()=>{useClock();periodExplicit=true;period='PM';manualPeriod='PM';timeChosen=isSelectableTime(selectedDate,hour,minute,period);updateClock()});
 function chooseManualPeriod(value){periodExplicit=true;manualPeriod=value;period=value;const match=typedTime.value.match(/^(0?[1-9]|1[0-2]):([0-5]?\d)$/);if(match){hour=Number(match[1]);minute=Number(match[2]);timeSource='typed';if(isSelectableTime(selectedDate,hour,minute,value)){timeChosen=true;part='hour'}else{typedTime.value='';lastValidTime='';timeChosen=false;typedTime.setAttribute('aria-invalid','true');opdTimeGuidance.textContent='That time is unavailable. '+allowedTimeText(selectedDate)+' Choose an available time.'}}updateClock()}
 manualAm.addEventListener('click',()=>chooseManualPeriod('AM'));
 manualPm.addEventListener('click',()=>chooseManualPeriod('PM'));
 function isValidTimePrefix(value){
   if(/^\d{3}$/.test(value)){const hh=Number(value.slice(0,2)),minuteTens=Number(value[2]);return hh>=1&&hh<=12&&minuteTens<=5}
   if(!/^[0-9:]*$/.test(value)||value.split(':').length>2)return false;
   const pieces=value.split(':'),rawHour=pieces[0];
   if(rawHour.length>2)return false;
   if(rawHour==='0'&&pieces.length===1)return true;
   if(rawHour&&(+rawHour<1||+rawHour>12))return false;
   if(pieces.length===1)return true;
   if(!rawHour||+rawHour<1||+rawHour>12)return false;
   const rawMinute=pieces[1];
   if(rawMinute.length>2)return false;
   return rawMinute.length<2||Number(rawMinute)<=59;
 } function getManualTime(){return typedTime.value.match(/^(0?[1-9]|1[0-2]):([0-5]?\d)$/)}
 typedTime.addEventListener('keydown',event=>{
   if(event.key!==' ')return;
   const typedHour=typedTime.value.trim();
   if(!/^(0?[1-9]|1[0-2])$/.test(typedHour))return;
   event.preventDefault();typedTime.value=`${typedHour.padStart(2,'0')}:`;lastValidTime=typedTime.value;timeSource='typed';timeChosen=false;typedTime.setAttribute('aria-invalid','true');
   requestAnimationFrame(()=>typedTime.setSelectionRange(typedTime.value.length,typedTime.value.length));
 });
 typedTime.addEventListener('input',()=>{
   // Smart 24-hour entry: 00:xx → 12:xx AM; 12:xx → 12:xx PM; 13:xx–23:xx → 01:xx–11:xx PM. Hours 01–11 default to AM, unless the user explicitly chooses a period.
   const twentyFourHourMatch=typedTime.value.match(/^(\d{2}):([0-5]\d)$/);
   if(twentyFourHourMatch){const enteredHour=Number(twentyFourHourMatch[1]),enteredMinute=Number(twentyFourHourMatch[2]);if(enteredHour>=0&&enteredHour<=23){let chosenPeriod=enteredHour>=12?'PM':'AM',chosenHour=enteredHour%12||12;manualPeriod=chosenPeriod;period=chosenPeriod;periodExplicit=false;hour=chosenHour;minute=enteredMinute;typedTime.value=String(chosenHour).padStart(2,'0')+':'+String(enteredMinute).padStart(2,'0');lastValidTime=typedTime.value;timeSource='typed';part='hour';manualAm.setAttribute('aria-pressed',String(manualPeriod==='AM'));manualPm.setAttribute('aria-pressed',String(manualPeriod==='PM'));const valid=isSelectableTime(selectedDate,hour,minute,manualPeriod);timeChosen=valid;typedTime.setAttribute('aria-invalid',String(!valid));if(!valid){opdTimeGuidance.textContent=(isAllowedTime(selectedDate,hour,minute,manualPeriod)?'That time has already passed. ':'That time is unavailable. ')+allowedTimeText(selectedDate)+' Choose an available time.'}updateClock();return}}
   if(/^\d{3,4}$/.test(typedTime.value)){
     const digits=typedTime.value,typedHour=Number(digits.slice(0,2)),minuteDigits=digits.slice(2),typedMinute=Number(minuteDigits);
     const validHour=typedHour>=1&&typedHour<=12,validMinute=digits.length===3?typedMinute<=5:typedMinute<=59;
     if(validHour&&validMinute){typedTime.value=`${String(typedHour).padStart(2,'0')}:${minuteDigits}`;lastValidTime=typedTime.value;requestAnimationFrame(()=>typedTime.setSelectionRange(typedTime.value.length,typedTime.value.length))}
     else{showTemporaryError('Hours must be 1–12 and minutes 0–59.');typedTime.value=lastValidTime;typedTime.setSelectionRange(typedTime.value.length,typedTime.value.length);return}
   }
   if(!isValidTimePrefix(typedTime.value)){typedTime.value=lastValidTime;typedTime.setSelectionRange(typedTime.value.length,typedTime.value.length);showTemporaryError('Hours must be 1–12 and minutes 0–59.');return}
   lastValidTime=typedTime.value;
   if(!typedTime.value){timeChosen=false;timeSource='clock';typedTime.removeAttribute('aria-invalid');return}
timeSource='typed';const match=getManualTime();if(match&&!periodExplicit){const typedHour=Number(match[1]);manualPeriod=typedHour===12?'PM':'AM';period=manualPeriod}timeChosen=Boolean(match);typedTime.setAttribute('aria-invalid',String(!match));
    if(match){const candidateHour=Number(match[1]),candidateMinute=Number(match[2]);if(!isSelectableTime(selectedDate,candidateHour,candidateMinute,manualPeriod)){typedTime.value='';lastValidTime='';timeChosen=false;typedTime.setAttribute('aria-invalid','true');opdTimeGuidance.textContent=(isAllowedTime(selectedDate,candidateHour,candidateMinute,manualPeriod)?'That time has already passed. ':'That time is unavailable. ')+allowedTimeText(selectedDate)+' Choose an available time.';return}hour=candidateHour;minute=candidateMinute;period=manualPeriod;part='hour';error.textContent='';updateClock()}
 }); typedTime.addEventListener('blur',()=>{
   const match=getManualTime();
   if(match){const candidateHour=Number(match[1]),candidateMinute=Number(match[2]);if(!isSelectableTime(selectedDate,candidateHour,candidateMinute,manualPeriod)){typedTime.value='';lastValidTime='';timeChosen=false;typedTime.setAttribute('aria-invalid','true');opdTimeGuidance.textContent=(isAllowedTime(selectedDate,candidateHour,candidateMinute,manualPeriod)?'That time has already passed. ':'That time is unavailable. ')+allowedTimeText(selectedDate);return}typedTime.value=`${String(candidateHour).padStart(2,'0')}:${String(candidateMinute).padStart(2,'0')}`;lastValidTime=typedTime.value;typedTime.removeAttribute('aria-invalid');hour=candidateHour;minute=candidateMinute;period=manualPeriod;timeSource='typed';timeChosen=true;part='hour';updateClock()}
   else if(typedTime.value){typedTime.setAttribute('aria-invalid','true');showTemporaryError('Hours must be 1–12 and minutes 0–59.')}
 }); function setFromPointer(event){
   const rect=face.getBoundingClientRect(),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2);
   const degrees=(Math.atan2(dy,dx)*180/Math.PI+360)%360,index=(Math.round((degrees+90)/30)+12)%12;
   if(dragPart==='hour'){
     const radius=Math.hypot(dx,dy),hour24=index+(radius<face.clientWidth/2-45?12:0),candidate=hour24%12||12,candidatePeriod=hour24>=12?'PM':'AM';
     if(!canChooseHour(selectedDate,candidate,candidatePeriod))return;hour=candidate;period=candidatePeriod;manualPeriod=period;periodExplicit=false;
   }else{const candidateMinute=index*5;if(!isSelectableTime(selectedDate,hour,candidateMinute,period))return;minute=candidateMinute}
   const smoothAngle=(degrees+90)%360;hand.style.transform=`rotate(${smoothAngle}deg)`;hourButton.textContent=String(hour).padStart(2,'0');minuteButton.textContent=String(minute).padStart(2,'0');if(timeSource==='clock'){typedTime.value=String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');lastValidTime=typedTime.value;manualPeriod=period;manualAm.setAttribute('aria-pressed',String(manualPeriod==='AM'));manualPm.setAttribute('aria-pressed',String(manualPeriod==='PM'));typedTime.removeAttribute('aria-invalid')}
   face.querySelectorAll('.clock-number').forEach(button=>{const v=Number(button.dataset.clockValue);button.setAttribute('aria-pressed',String(dragPart==='hour'?(v%12||12)===hour&&(v>=12?'PM':'AM')===period:v===minute))});
 }
 hand.addEventListener('pointerdown',event=>{event.preventDefault();useClock();timeChosen=false;dragPart=part;hand.setPointerCapture(event.pointerId);hand.classList.add('is-grabbing');setFromPointer(event)});
 hand.addEventListener('pointermove',event=>{if(dragPart&&hand.hasPointerCapture(event.pointerId))setFromPointer(event)});
 hand.addEventListener('pointerup',event=>{if(!dragPart)return;hand.releasePointerCapture(event.pointerId);hand.classList.remove('is-grabbing');if(dragPart==='hour')part='minute';else timeChosen=isSelectableTime(selectedDate,hour,minute,period);dragPart=null;updateClock()});
 hand.addEventListener('pointercancel',()=>{if(dragPart==='hour')part='minute';else timeChosen=isSelectableTime(selectedDate,hour,minute,period);dragPart=null;hand.classList.remove('is-grabbing');updateClock()});
 const bookingMenu=document.querySelector('.booking-menu');
  const bookingMenuToggle=document.getElementById('booking-menu-toggle');
  const bookingMenuPanel=document.getElementById('booking-menu-panel');
  const closeBookingMenu=()=>{if(bookingMenuPanel){bookingMenuPanel.hidden=true;bookingMenuToggle?.setAttribute('aria-expanded','false')}};
  document.addEventListener('click',event=>{
    const toggle=event.target.closest('#booking-menu-toggle');
    if(toggle){event.preventDefault();const opening=bookingMenuPanel.hidden;bookingMenuPanel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));return;}
    const whatsappChoice=event.target.closest('#whatsapp-booking-option,.whatsapp-float');
    if(whatsappChoice){event.preventDefault();closeBookingMenu();openDialog();return;}
    if(bookingMenu&&!bookingMenu.contains(event.target))closeBookingMenu();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeBookingMenu()});
 dialog.querySelector('.booking-dialog-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.booking-cancel').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 window.addEventListener('resize',()=>{if(dialog.open)updateClock()});
 form.addEventListener('submit',event=>{
   event.preventDefault();error.textContent='';
   if(!childNameInput.value.trim()){error.textContent='Please enter the child’s name.';childNameInput.focus();return}
   if(!childAgeInput.value.trim()||!Number.isFinite(Number(childAgeInput.value))||Number(childAgeInput.value)<0){error.textContent='Please enter the child’s age in years.';childAgeInput.focus();return}
   if(!selectedDate){error.textContent='Please choose a date from the calendar or date field.';document.getElementById('calendar-previous').focus();return}
   if(selectedDate<todayKey||selectedDate>tomorrowKey){error.textContent='Please choose today or tomorrow only.';return}
   if(!timeSlotSelect.value){error.textContent='Please choose a 30-minute appointment slot.';timeSlotSelect.focus();return}
   applySelectedSlot();
   if(timeSource==='typed'){
     const typedMatch=typedTime.value.match(/^(0?[1-9]|1[0-2]):([0-5]?\d)$/);
     if(!typedMatch){error.textContent='Use 1–12 for the hour and 0–59 for the minutes.';typedTime.focus();return}
     hour=Number(typedMatch[1]);minute=Number(typedMatch[2]);period=manualPeriod;
   }
   validateCurrentTime();
   if(!timeChosen){error.textContent=opdTimeGuidance.textContent;hourButton.focus();return}
   let displayHour=hour,displayMinute=minute,displayPeriod=period;
   if(timeSource==='typed'&&typedTime.value){const typedMatch=typedTime.value.match(/^(0?[1-9]|1[0-2]):([0-5]?\d)$/);displayHour=Number(typedMatch[1]);displayMinute=Number(typedMatch[2]);displayPeriod=manualPeriod}
   const [year,month,day]=selectedDate.split('-').map(Number);
   const dateText=`${String(day).padStart(2,"0")}/${String(month).padStart(2,"0")}/${year}`;
   const timeText=timeSource==='typed'&&timeSlotSelect.value?timeSlotSelect.options[timeSlotSelect.selectedIndex].text:`${String(displayHour).padStart(2,'0')}:${String(displayMinute).padStart(2,'0')} ${displayPeriod}`;
   const childName=childNameInput.value.trim(),childAge=childAgeInput.value.trim();
   const message=`Hello, I would like to request an appointment with Dr. Nitin Mohan.

Child: ${childName}
Age: ${childAge} years
Preferred date: ${dateText}
Preferred time: ${timeText}

Please confirm availability.`;
   const waUrl=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
   const popup=window.open(waUrl,'_blank','noopener,noreferrer');if(!popup){window.location.href=waUrl;return}dialog.close();
 });
 drawCalendar();drawClock();
})();
}

/* ===== backtop-time-sync-robustness ===== */
{
(()=>{
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  document.addEventListener('click',event=>{
    const link=event.target.closest('.secondary-page-back-top');
    if(!link)return;
    event.preventDefault();
    const site=document.querySelector('#secondary-site');
    const content=site?.querySelector('#secondary-page-content');
    if(!site||site.hidden||!content)return;
    const header=document.querySelector('.header');
    const offset=(header?.getBoundingClientRect().height||0)+12;
    window.scrollTo({top:Math.max(0,content.getBoundingClientRect().top+window.scrollY-offset),behavior:reduce()});
  },true);
  const time=document.querySelector('#preferred-time');
  if(time){
    const syncClock=()=>{
      const value=time.value.trim();
      const match=value.match(/^(0?[1-9]|1[0-2]):([0-5]?[0-9])$/);
      if(!match)return;
      const hourButton=document.querySelector('#clock-hour');
      const minuteButton=document.querySelector('#clock-minute');
      if(hourButton&&minuteButton){hourButton.textContent=String(Number(match[1])).padStart(2,'0');minuteButton.textContent=String(Number(match[2])).padStart(2,'0');}
    };
    time.addEventListener('change',syncClock);
    time.addEventListener('blur',syncClock);
  }
})();
}

/* ===== footer-share-repair-script ===== */
{
(function(){
 function initFooterShare(){
  var shareButton=document.getElementById('footer-share-button');
  var status=document.getElementById('footer-share-status');
  if(!shareButton || shareButton.dataset.shareReady==='true') return;
  shareButton.dataset.shareReady='true';
  function showMessage(message){ if(status) status.textContent=message; }
  async function copyUrl(url){
   if(navigator.clipboard && window.isSecureContext){
    try{ await navigator.clipboard.writeText(url); return true; }catch(e){}
   }
   var area;
   try{
    area=document.createElement('textarea'); area.value=url; area.setAttribute('readonly','');
    area.style.position='fixed'; area.style.left='-9999px'; area.style.top='0';
    document.body.appendChild(area); area.focus(); area.select(); area.setSelectionRange(0,area.value.length);
    var ok=false; try{ok=document.execCommand('copy');}catch(e){ok=false;}
    return !!ok;
   }catch(e){return false;}
   finally{if(area && area.parentNode) area.parentNode.removeChild(area);}
  }
  shareButton.addEventListener('click', async function(event){
   event.preventDefault();
   var url=window.location.href;
   var data={title:document.title || 'KidsGastro', text:'Visit KidsGastro — Paediatric Gastroenterology', url:url};
   if(typeof navigator.share==='function'){
    try{await navigator.share(data); showMessage(''); return;}
    catch(e){if(e && e.name==='AbortError') return;}
   }
   var copied=await copyUrl(url);
   if(copied) showMessage('Website link copied. You can now paste and share it.');
   else showMessage('Copy the website address from your browser to share it.');
  });
 }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initFooterShare,{once:true}); else initFooterShare();
 document.querySelectorAll('a[href="/socials/"]').forEach(function(link){link.setAttribute('data-secondary-page','socials');});
})();
}

/* ===== pdf-style-search-navigation-script ===== */
{
(function(){
 function init(){
  var form=document.getElementById('site-search'),input=document.getElementById('site-search-input'),status=document.getElementById('search-status');
  if(!form||!input||!status)return;
  var matches=[],cursor=-1,lastQuery='',marked=[],noMatchTimer=null;
  function showNoMatches(){if(noMatchTimer)clearTimeout(noMatchTimer);status.textContent='0/0';var msg=document.createElement('span');msg.className='search-no-match-message';msg.setAttribute('role','status');msg.textContent='No matches found';status.appendChild(document.createTextNode(' — '));status.appendChild(msg);noMatchTimer=setTimeout(function(){if(msg.parentNode){msg.parentNode.removeChild(msg);if(status.textContent.trim()==='0/0 —')status.textContent='0/0';else if(status.textContent.indexOf('0 of 0 —')===0)status.textContent='0/0';}},3000);}
  function clearNoMatches(){if(noMatchTimer){clearTimeout(noMatchTimer);noMatchTimer=null;}var msg=status.querySelector('.search-no-match-message');if(msg){var parent=msg.parentNode;msg.remove();if(parent)parent.normalize();}}
  function norm(v){return String(v||'').replace(/\s+/g,' ').trim().toLocaleLowerCase();}
  function clearMarks(){
   marked.forEach(function(span){if(!span.parentNode)return;var parent=span.parentNode;parent.replaceChild(document.createTextNode(span.textContent),span);parent.normalize();});marked=[];
   document.querySelectorAll('.search-hit,.search-hit-active').forEach(function(el){el.classList.remove('search-hit','search-hit-active');});
  }
  function index(){
   var list=[],sel='h1,h2,h3,h4,p,li,summary,dt,dd,small,strong,figcaption,label';
   var main=document.getElementById('main');
   if(main)main.querySelectorAll(sel).forEach(function(el){if(el.closest('.site-search,.search-status'))return;var t=el.textContent.trim();if(t)list.push({el:el,text:t,page:'home'});});
   var templates=document.getElementById('secondary-templates');
   if(templates&&templates.content)templates.content.querySelectorAll('section[data-page]').forEach(function(section){var page=section.dataset.page;section.querySelectorAll(sel).forEach(function(el){var t=el.textContent.trim();if(t)list.push({el:el,text:t,page:page});});});
   return list;
  }
  function markExactText(target,query,active){
   if(!target)return;
   var walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT,{acceptNode:function(n){return n.nodeValue&&norm(n.nodeValue).includes(query)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}}),nodes=[];
   while(walker.nextNode())nodes.push(walker.currentNode);
   var did=false;
   nodes.forEach(function(node){var raw=node.nodeValue,lower=raw.toLocaleLowerCase(),q=query.toLocaleLowerCase(),from=0,frag=document.createDocumentFragment(),found=false;while(true){var at=lower.indexOf(q,from);if(at<0)break;if(at>from)frag.appendChild(document.createTextNode(raw.slice(from,at)));var span=document.createElement('mark');span.className='search-hit-text'+(active&&!did?' search-hit-text-active':'');span.textContent=raw.slice(at,at+q.length);frag.appendChild(span);marked.push(span);did=true;found=true;from=at+q.length;}if(found){if(from<raw.length)frag.appendChild(document.createTextNode(raw.slice(from)));node.parentNode.replaceChild(frag,node);}});
   if(did){target.classList.add('search-hit');if(active)target.classList.add('search-hit-active');var first=target.querySelector('.search-hit-text-active')||target.querySelector('.search-hit-text');if(first)first.scrollIntoView({behavior:window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});}
  }
  function renderStatus(){status.innerHTML='';if(!matches.length){status.textContent='0/0';return;}var wrap=document.createElement('div');wrap.className='search-nav';var prev=document.createElement('button');prev.type='button';prev.setAttribute('aria-label','Previous search result');prev.title='Previous match';prev.textContent='‹';prev.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();goToMatch(cursor-1)});var count=document.createElement('span');count.className='search-count';count.textContent=(cursor+1)+'/'+matches.length;var next=document.createElement('button');next.type='button';next.setAttribute('aria-label','Next search result');next.title='Next match';next.textContent='›';next.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();goToMatch(cursor+1)});var close=document.createElement('button');close.type='button';close.setAttribute('aria-label','Clear search');close.title='Clear search';close.textContent='×';close.addEventListener('click',function(e){e.preventDefault();clearMarks();matches=[];cursor=-1;lastQuery='';input.value='';status.textContent='';});wrap.append(prev,count,next,close);status.appendChild(wrap);}
  function goToMatch(i){if(!matches.length)return;clearMarks();cursor=(i+matches.length)%matches.length;var m=matches[cursor],query=lastQuery;
   function locate(){var target=null;if(m.page==='home')target=m.el;else{var root=document.getElementById('secondary-page-content');if(root){var els=root.querySelectorAll('h1,h2,h3,h4,p,li,summary,dt,dd,small,strong,figcaption,label');target=Array.prototype.find.call(els,function(el){return norm(el.textContent)===norm(m.text);})||null;}}if(target)markExactText(target,query,true);renderStatus();}
   if(m.page!=='home'){var pageRoutes={profile:'about',hospital:'clinic'};var pagePath='/'+(pageRoutes[m.page]||m.page)+'/';if(location.pathname!==pagePath){location.href=pagePath;return;}setTimeout(locate,180);}else locate();
  }
  form.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();var q=norm(input.value);clearMarks();if(!q){matches=[];cursor=-1;lastQuery='';status.textContent='0/0';return;}if(q!==lastQuery){lastQuery=q;matches=index().filter(function(item){return norm(item.text).includes(q);});cursor=-1;}if(!matches.length){showNoMatches();return;}clearNoMatches();goToMatch(cursor<0?0:cursor+1);},true);
  input.addEventListener('input',function(){clearNoMatches();clearMarks();matches=[];cursor=-1;lastQuery='';status.textContent='';});
  input.addEventListener('keydown',function(e){
   if(e.key==='Escape'){if(status.textContent.trim()){e.preventDefault();clearMarks();matches=[];cursor=-1;lastQuery='';input.value='';status.textContent='';input.blur();}return;}
   if(!matches.length)return;
   if(e.key==='ArrowDown'||e.key==='Enter'&&e.shiftKey===false&&document.activeElement!==input){e.preventDefault();goToMatch(cursor+1);}
   else if(e.key==='ArrowUp'){e.preventDefault();goToMatch(cursor-1);}
  });
  form.addEventListener('keydown',function(e){if(!matches.length)return;if(e.key==='ArrowDown'&&e.target!==input){e.preventDefault();goToMatch(cursor+1)}else if(e.key==='ArrowUp'&&e.target!==input){e.preventDefault();goToMatch(cursor-1)}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}

/* ===== contextual-breadcrumbs ===== */
{
(()=>{
 const pageInfo={
  profile:{group:'About',title:'About Us'},
  treatments:{group:'Treatments',title:'Paediatric Gastroenterology'},
  services:{group:'Services',title:'Services'},
  publications:{group:'Health Library',title:'Research Articles & Publications'},
  hospital:{group:'Contact',title:'Hospital & Location'},
  clinical:{group:'About',title:'Clinical Work'},
  gallery:{group:'Gallery',title:'KidsGastro Photo Gallery'},
  latest:{group:'Health Library',title:'Latest Articles'},
  blog:{group:'Blog',title:'Latest Articles'},
  newsletter:{group:'Health Library',title:'Newsletter'},
  socials:{group:'Connect',title:'Social Profiles'},
  faqs:{group:'Help',title:'FAQs'}
 };
 function addBreadcrumb(){
  const site=document.querySelector('#secondary-site'),content=document.querySelector('#secondary-page-content');
  if(!site||site.hidden||!content)return;
  const slug=location.pathname.split('/').filter(Boolean)[0]||'';const routeToPage={about:'profile',clinic:'hospital'};const id=routeToPage[slug]||slug;
  const info=pageInfo[id];if(!info)return;
  let nav=content.querySelector(':scope > .site-breadcrumbs');
  if(!nav){nav=document.createElement('nav');nav.className='site-breadcrumbs';nav.setAttribute('aria-label','Breadcrumb');content.insertBefore(nav,content.firstChild);}
  nav.replaceChildren();
  const addLink=(label,href)=>{const a=document.createElement('a');a.textContent=label;a.href=href;nav.appendChild(a)};
  const sep=()=>{const span=document.createElement('span');span.className='crumb-separator';span.setAttribute('aria-hidden','true');span.textContent='/';nav.appendChild(span)};
  addLink('Home','/');sep();
  if(info.group!==info.title){addLink(info.group, '/'+(({profile:'about',hospital:'clinic'})[id]||id)+'/');sep();}
  const current=document.createElement('a');current.textContent=info.title;current.href='/'+(({profile:'about',hospital:'clinic'})[id]||id)+'/';current.setAttribute('aria-current','page');current.setAttribute('aria-label',info.title+' (current section)');nav.appendChild(current);
 }
 document.addEventListener('click',e=>{const a=e.target.closest('.site-breadcrumbs a[href="/gallery/" data-kg-scroll-target="top"]');if(a){e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}});
 window.addEventListener('popstate',()=>setTimeout(addBreadcrumb,0));
 document.addEventListener('DOMContentLoaded',()=>setTimeout(addBreadcrumb,0));
 setTimeout(addBreadcrumb,0);
})();
}

/* ===== kids-gastro-custom-scrollbar ===== */
{
(()=> {
 const bar=document.createElement('div');
 bar.id='kg-page-scrollbar';
 bar.setAttribute('role','scrollbar');
 bar.setAttribute('aria-label','Page scroll position');
 bar.setAttribute('aria-controls','main');
 bar.setAttribute('aria-orientation','vertical');
 bar.setAttribute('tabindex','0');
 const thumb=document.createElement('div');thumb.id='kg-page-scrollbar-thumb';
 bar.appendChild(thumb);document.body.appendChild(bar);
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let dragging=false,dragOffset=0,raf=0,trackTarget=null,updateRaf=0;
 const maxScroll=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 function geometry(){
   const track=bar.clientHeight,total=maxScroll();
   const ratio=window.innerHeight/Math.max(document.documentElement.scrollHeight,window.innerHeight);
   const h=Math.max(46,Math.min(track,track*ratio));
   return {track,total,h,maxTop:Math.max(0,track-h)};
 }
 function reveal(){ bar.classList.add('kg-scrollbar-visible'); }
 function update(){
   const g=geometry(),top=g.total?window.scrollY/g.total*g.maxTop:0;
   thumb.style.height=g.h+'px';
   // No CSS transition on the thumb: it follows every actual scroll frame continuously.
   thumb.style.transform=`translate3d(0,${top}px,0)`;
   bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(g.total));
   bar.setAttribute('aria-valuenow',String(Math.round(window.scrollY)));
   bar.style.display=g.total>2?'block':'none';
 }
 function scrollToPointer(y){
   const rect=bar.getBoundingClientRect(),g=geometry();
   const top=clamp(y-rect.top-dragOffset,0,g.maxTop);
   window.scrollTo(0,g.maxTop?top/g.maxTop*g.total:0);
 }
 function easeTrackTo(y){
   const rect=bar.getBoundingClientRect(),g=geometry();
   const top=clamp(y-rect.top-g.h/2,0,g.maxTop);
   const dest=g.maxTop?top/g.maxTop*g.total:0;
   if(reduced()||Math.abs(dest-window.scrollY)<1){window.scrollTo(0,dest);update();return;}
   if(raf)cancelAnimationFrame(raf);
   trackTarget={from:window.scrollY,to:dest,start:performance.now(),duration:Math.min(520,Math.max(220,Math.abs(dest-window.scrollY)*.16))};
   const frame=now=>{
     if(!trackTarget)return;
     const a=trackTarget,t=clamp((now-a.start)/a.duration,0,1);
     const eased=1-Math.pow(1-t,3);
     window.scrollTo(0,a.from+(a.to-a.from)*eased);
     if(t<1)raf=requestAnimationFrame(frame);else{raf=0;trackTarget=null;window.scrollTo(0,dest);update();}
   };
   raf=requestAnimationFrame(frame);
 }
 bar.addEventListener('pointerenter',reveal);
 bar.addEventListener('pointermove',()=>{if(!dragging)reveal();},{passive:true});
 bar.addEventListener('focus',reveal);
 bar.addEventListener('pointerdown',e=>{
   // Start dragging from ANY point on the scrollbar, not just the thumb.
   // When the track itself is grabbed, center the thumb under the pointer.
   const g=geometry(),rect=thumb.getBoundingClientRect();
   dragging=true;bar.classList.add('kg-scrollbar-dragging','kg-scrollbar-visible');

   if(e.target===thumb){
     dragOffset=e.clientY-rect.top;
   }else{
     dragOffset=g.h/2;
     if(raf)cancelAnimationFrame(raf);raf=0;trackTarget=null;
     scrollToPointer(e.clientY);
   }
   try{bar.setPointerCapture(e.pointerId)}catch(_){}
   e.preventDefault();
 });
 bar.addEventListener('pointermove',e=>{if(dragging)scrollToPointer(e.clientY);});
 const stop=()=>{dragging=false;bar.classList.remove('kg-scrollbar-dragging');reveal();};
 bar.addEventListener('pointerup',stop);bar.addEventListener('pointercancel',stop);bar.addEventListener('lostpointercapture',stop);
 bar.addEventListener('keydown',e=>{
   const step=Math.max(80,window.innerHeight*.12);
   const target=e.key==='ArrowDown'?window.scrollY+step:e.key==='ArrowUp'?window.scrollY-step:e.key==='PageDown'?window.scrollY+window.innerHeight*.85:e.key==='PageUp'?window.scrollY-window.innerHeight*.85:e.key==='Home'?0:e.key==='End'?maxScroll():null;
   if(target!==null){e.preventDefault();easeTrackTo(clamp(target,0,maxScroll()));}
 });
 window.addEventListener('scroll',()=>{if(!updateRaf)updateRaf=requestAnimationFrame(()=>{updateRaf=0;update();});},{passive:true});
 window.addEventListener('resize',update);
 if('ResizeObserver' in window){const ro=new ResizeObserver(update);ro.observe(document.documentElement);if(document.body)ro.observe(document.body);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
 setTimeout(update,250);setTimeout(update,1000);
})();
}

/* ===== kg-contextual-outline-icons ===== */
{
(()=>{const paths={
profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
treatments:'<path d="M10 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-4"/><path d="M8 12h8m-4-4v8M14 3h7v7h-7z"/>',
services:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 8v8m-4-4h8"/>',
gallery:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
hospital:'<path d="M3 21V7h12v14M7 7V3h4v4M6 11h2m3 0h2m-7 4h2m3 0h2M18 21V11h3v10M1 21h22"/>',
contact:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 5h6m-5 13h4"/>',
blog:'<path d="M5 3h11l4 4v14H5z"/><path d="M16 3v5h4M8 12h8m-8 4h8"/>',
publications:'<path d="M4 4.5A3.5 3.5 0 0 1 7.5 1H20v18H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 4v18M8 6h8m-8 4h8"/>',
socials:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.5 6.6-4m-6.6 7 6.6 4"/>',
appointment:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 4h6m-3-3v6"/>',
map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/>'
};
function choose(el){const h=(el.getAttribute('href')||'').toLowerCase(),t=(el.innerText||el.textContent||'').toLowerCase();
if(h.includes('profile')||/about us|qualifications/.test(t))return'profile';
if(h.includes('treatment')||/treatments|liver diseases|pancreatology|biliary tract diseases|nutrition and growth/.test(t))return'treatments';
if(h.includes('services')||/services|procedures|investigations|assessment/.test(t))return'services';
if(h.includes('gallery')||h.includes('photo-reel')||/gallery|photos/.test(t))return'gallery';
if(h.includes('hospital')||h.includes('location')||h.includes('map')||/hospital|location|directions|view map/.test(t))return'hospital';
if(h.startsWith('tel:')||h.startsWith('mailto:')||h.includes('wa.me')||/phone|contact|whatsapp|email/.test(t))return'contact';
if(h.includes('blog')||/blog|article/.test(t))return'blog';
if(h.includes('publication')||h.includes('scholar')||h.includes('researchgate')||/publication|researchgate|google scholar/.test(t))return'publications';
if(h.includes('social')||h.includes('instagram')||h.includes('linkedin')||/social|instagram|linkedin/.test(t))return'socials';
if(/appointment|booking|book an appointment/.test(t))return'appointment';
if(/view location|google maps|map/.test(t))return'map';return null}
document.querySelectorAll('.nav-direct-link,.nav-dropdown-menu>a,.booking-menu-panel>a,.secondary-socials>a').forEach(el=>{if(el.querySelector('.kg-menu-icon'))return;const type=choose(el);if(!type)return;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('class','kg-menu-icon');svg.innerHTML=paths[type];el.insertBefore(svg,el.firstChild)});
})();
}

/* ===== kg-sitewide-relevant-icons ===== */
{
(()=> {
 const paths={
  person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  gut:'<path d="M8 3c-3 0-4 3-3 6 1 2 3 2 3 4s-2 2-2 4 2 4 5 4c2 0 3-2 3-4v-4c0-2 1-3 3-3s3-2 3-4-2-4-4-3"/><path d="M8 7c2 0 3 1 3 3m4 4c2 0 3 1 3 3"/>',
  liver:'<path d="M3 13c4-7 10-9 18-7 1 6-2 12-8 14-4 1-7-1-10-3z"/><path d="M12 9c1 3 3 5 7 5"/>',
  medical:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  scope:'<path d="M5 3v5a7 7 0 0 0 14 0V5"/><path d="M16 3h5v4h-5zM12 15v2a4 4 0 0 0 8 0v-1"/><circle cx="20" cy="14" r="2"/>',
  nutrition:'<path d="M12 21c-5-3-8-7-7-12 4-1 7 1 7 5 0-5 3-8 8-8 1 7-2 12-8 15Z"/><path d="M12 21v-7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 4h6m-3-3v6"/>',
  phone:'<path d="M7 3 4 5c-1 1 1 6 5 10s9 6 10 5l2-3-5-4-2 2c-2-1-4-3-5-5l2-2z"/>',
  location:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  book:'<path d="M4 4.5A3.5 3.5 0 0 1 7.5 1H20v18H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 4v18M8 6h8m-8 4h8"/>',
  article:'<path d="M5 3h11l4 4v14H5z"/><path d="M16 3v5h4M8 12h8m-8 4h8"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  growth:'<path d="M4 20V9m0 11h16M8 16l4-5 3 2 5-7"/><path d="M16 6h4v4"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.5 6.6-4m-6.6 7 6.6 4"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  hospital:'<path d="M3 21V7h12v14M7 7V3h4v4M6 11h2m3 0h2m-7 4h2m3 0h2M18 21V11h3v10M1 21h22"/>',
  socials:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.5 6.6-4m-6.6 7 6.6 4"/>'
 };
 const svg=(name,cls='kg-ui-icon')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.medical}</svg>`;
 const detect=(txt,href='')=>{
  const t=(txt||'').toLowerCase(),h=(href||'').toLowerCase();
  if(/liver|hepatology|biliary/.test(t))return'liver';
  if(/nutrition|growth|feeding|diet/.test(t))return'nutrition';
  if(/endoscopy|colonoscopy|procedure|investigation|diagnostic|manometry|scope/.test(t))return'scope';
  if(/gastro|digest|stomach|intestin|bowel|constipation|diarrhoea|vomit|abdominal|pancrea|reflux/.test(t))return'gut';
  if(/appointment|booking|book/.test(t)||h.includes('booking'))return'calendar';
  if(/phone|call|whatsapp|contact|email/.test(t)||h.startsWith('tel:')||h.includes('wa.me'))return'phone';
  if(/hospital|location|map|direction/.test(t)||h.includes('hospital')||h.includes('location'))return'location';
  if(/publication|researchgate|scholar|research/.test(t)||h.includes('scholar')||h.includes('researchgate'))return'book';
  if(/blog|article|news|read more/.test(t)||h.includes('blog'))return'article';
  if(/gallery|photo|image/.test(t)||h.includes('photo'))return'image';
  if(/hours|timing|schedule|monday|sunday|morning|evening/.test(t))return'clock';
  if(/qualification|education|profile|about|doctor/.test(t))return'person';
  if(/social|instagram|linkedin|connect|follow/.test(t)||h.includes('instagram')||h.includes('linkedin'))return'socials';
  if(/growth|development/.test(t))return'growth';
  return'medical';
 };
 // Add small symbols to all treatment/service list items, keeping prose paragraphs uncluttered.
 document.querySelectorAll('.service-card li,.treatment-card li').forEach(li=>{
  if(li.querySelector('.kg-list-icon'))return;
  const name=detect(li.textContent);
  const span=document.createElement('span');span.className='kg-list-icon';span.innerHTML=svg(name);
  li.insertBefore(span,li.firstChild);
 });
 // Add a category icon to each service/treatment card title.
 document.querySelectorAll('.service-card>h2,.treatment-card>h2').forEach(h=>{
  if(h.querySelector('.kg-heading-icon'))return;
  const wrap=document.createElement('span');wrap.className='kg-heading-icon';wrap.innerHTML=svg(detect(h.textContent));
  h.insertBefore(wrap,h.firstChild);
 });
 // Relevant icons for prominent content cards and useful section headings.
 document.querySelectorAll('.latest-card,.credential-card,.blog-article,.publication-card,.opd-day,.contact-lines>*').forEach(card=>{
  if(card.querySelector('.kg-card-icon')||card.classList.contains('credential-card'))return;
  const title=card.querySelector('h2,h3,h4,strong');
  if(!title)return;
  const mark=document.createElement('span');mark.className='kg-card-icon';mark.innerHTML=svg(detect((title.textContent||'')+' '+card.textContent));
  card.insertBefore(mark,card.firstChild);
 });
 document.querySelectorAll('.section-heading h2,.reel-heading h2').forEach(h=>{
  if(h.closest('.opd-hours')||h.closest('.reel-heading'))return;
  if(h.querySelector('.kg-section-icon'))return;
  const wrap=document.createElement('span');wrap.className='kg-section-icon';wrap.innerHTML=svg(detect(h.textContent));h.insertBefore(wrap,h.firstChild);
 });
 // Add contextual icons to buttons and action links that do not already contain an icon.
 document.querySelectorAll('a.btn,button.btn,.actions a,.footer-contact-item a,.nav-dropdown-menu>a').forEach(el=>{
  if(el.querySelector('svg,.kg-ui-icon,.kg-menu-icon,.booking-button-icon'))return;
  const name=detect((el.textContent||'')+' '+(el.getAttribute('href')||''));
  el.insertBefore(document.createRange().createContextualFragment(svg(name)),el.firstChild);
 });
})();
}

/* ===== kg-navigation-dropdown-icons-js ===== */
{
(()=> {
 const paths={
  treatments:'<path d="M10 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-4"/><path d="M8 12h8m-4-4v8M14 3h7v7h-7z"/>',
  services:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 8v8m-4-4h8"/>',
  gallery:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
  library:'<path d="M4 4.5A3.5 3.5 0 0 1 7.5 1H20v18H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 4v18M8 6h8m-8 4h8"/>',
  blog:'<path d="M5 3h11l4 4v14H5z"/><path d="M16 3v5h4M8 12h8m-8 4h8"/>',
  faq:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-1.2 1-1.9 1.4-1.9 3.1M12 17.5h.01"/>',
  contact:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 5h6m-5 13h4"/>',
  person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  phone:'<path d="M7 3 4 5c-1 1 1 6 5 10s9 6 10 5l2-3-5-4-2 2c-2-1-4-3-5-5l2-2z"/>',
  hospital:'<path d="M3 21V7h12v14M7 7V3h4v4M6 11h2m3 0h2m-7 4h2m3 0h2M18 21V11h3v10M1 21h22"/>',
  location:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  newsletter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
 };
 const choose=(text,href='')=>{
  const t=(text||'').toLowerCase(),h=(href||'').toLowerCase();
  if(/treatment|hepatology|pancreatology|biliary|nutrition/.test(t))return'treatments';
  if(/service|procedure|investigation|assessment/.test(t))return'services';
  if(/gallery|photo/.test(t)||h.includes('photo'))return'gallery';
  if(/health library|publication|research|journal|latest from/.test(t)||h.includes('publication'))return'library';
  if(/blog|article/.test(t)||h.includes('/blog'))return'blog';
  if(/faq|question/.test(t))return'faq';
  if(/contact|phone|whatsapp|email/.test(t)||h.startsWith('tel:')||h.includes('wa.me'))return'contact';
  if(/about|profile|doctor/.test(t)||h.includes('profile'))return'person';
  if(/hospital/.test(t)||h.includes('hospital'))return'hospital';
  if(/map|location|direction/.test(t)||h.includes('map'))return'location';
  if(/newsletter|updates/.test(t)||h.includes('newsletter'))return'newsletter';
  return'person';
 };
 const make=(key,cls)=>{
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('class',cls);svg.innerHTML=paths[key]||paths.person;return svg;
 };
 document.querySelectorAll('.nav-dropdown>summary').forEach(summary=>{
  if(summary.querySelector('.kg-nav-icon'))return;
  const key=choose(summary.textContent);
  summary.insertBefore(make(key,'kg-nav-icon'),summary.firstChild);
 });
 document.querySelectorAll('.nav-dropdown-menu>a').forEach(a=>{
  if(a.querySelector('.kg-nav-icon'))return;
  const key=choose(a.textContent,a.getAttribute('href'));
  const b=a.querySelector('b'),small=a.querySelector('small');
  if(b||small){
   const copy=document.createElement('span');copy.className='kg-nav-copy';
   if(b)copy.appendChild(b);
   if(small)copy.appendChild(small);
   a.insertBefore(copy,a.querySelector('.kg-nav-icon')||null);
   a.insertBefore(make(key,'kg-nav-icon'),copy);
  } else a.insertBefore(make(key,'kg-nav-icon'),a.firstChild);
 });
})();
}

/* ===== kg-normalize-dropdown-link-layout ===== */
{
(()=>{document.querySelectorAll('.nav-dropdown-menu>a').forEach(a=>{
 const icon=a.querySelector(':scope > .kg-nav-icon');
 let copy=a.querySelector(':scope > .kg-nav-copy');
 if(!copy){
   copy=document.createElement('span');copy.className='kg-nav-copy';
   const children=[...a.childNodes].filter(n=>n!==icon);
   children.forEach(n=>copy.appendChild(n));
   a.appendChild(copy);
 }
 if(icon){icon.style.gridColumn='1';icon.style.gridRow='1'}
 copy.style.gridColumn='2';copy.style.gridRow='1';
});})();
}

/* ===== abstract-white-watermark-script ===== */
{
(()=>{
 const sections=[...document.querySelectorAll('.footer-contact-band,.newsletter-section,.hospital-map-section,.hero,.photo-reel-section,.latest-section,.opd-hours')];
 sections.forEach(section=>{
   section.classList.add('abstract-watermark-host');
   const mark=document.createElement('span');mark.className='abstract-watermark';mark.setAttribute('aria-hidden','true');
   section.prepend(mark);
 });
})();
}

/* ===== gallery-lightbox-script ===== */
{
(()=>{
const modal=document.getElementById('gallery-lightbox');
if(!modal)return;
const view=modal.querySelector('.gallery-lightbox-image');
const caption=modal.querySelector('.gallery-lightbox-caption');
const count=modal.querySelector('.gallery-lightbox-count');
const zoomButtons=[...modal.querySelectorAll('[data-zoom]')];
const wrap=modal.querySelector('.gallery-lightbox-image-wrap');
let index=0,previousFocus=null,zoom=1,panX=0,panY=0,drag=null;
const excludedAssetNames=/^(?:kids-gastro-logo(?:\.[a-z0-9]+)?|rezept-rx-logo\.[a-z0-9]+|gif(?:-Video)?(?:-[0-9]+)?\.gif)$/i;
function isExcluded(img){
 const rawSrc=img.currentSrc||img.getAttribute('src')||img.getAttribute('data-src')||img.getAttribute('data-lazy-src')||'';
 const src=rawSrc.split(/[?#]/)[0];
 const name=src.split('/').pop()||'';
 return img.matches('[data-no-lightbox],.circular-brand-logo,.rezeptrx-mark,.whatsapp-photo,.whatsapp-icon') ||
   !!img.closest('.whatsapp-float,.whatsapp-photo,.rezeptrx-mark,[data-no-lightbox]') ||
   /rezept\s*rx|whatsapp|kids.?gastro.?logo|brand.?logo/i.test((img.alt||'')+' '+(img.className||'')+' '+(img.getAttribute('data-asset-id')||'')) ||
   /\.gif$/i.test(name) || /^data:image\/gif/i.test(rawSrc) || excludedAssetNames.test(name) ||
   img.closest('.booking-menu-panel .rezept-booking-choice');
}
function eligibleImages(){const main=document.querySelector('main#main');return main?[...main.querySelectorAll('img')].filter(img=>!isExcluded(img)&&img.isConnected&&!!(img.getAttribute('src')||img.getAttribute('data-src')||img.getAttribute('data-lazy-src'))):[];}
function captionFor(img){
 const dataCaption=img.dataset.galleryCaption||'';
 if(dataCaption.trim())return dataCaption.trim();
 const ariaCaption=img.getAttribute('aria-label')||'';
 if(ariaCaption&&!ariaCaption.startsWith('Open photo: '))return ariaCaption;
 const figure=img.closest('figure');
 const figcaption=figure&&figure.querySelector('figcaption');
 if(figcaption&&figcaption.textContent.trim())return figcaption.textContent.trim();
 const card=img.closest('[data-gallery-caption]');
 if(card&&card.dataset.galleryCaption)return card.dataset.galleryCaption.trim();
 return img.alt||'Website photo';
}
function prepareImages(root=document){
 const imgs=[];
 if(root instanceof HTMLImageElement)imgs.push(root);
 if(root.querySelectorAll)imgs.push(...root.querySelectorAll('img'));
 imgs.forEach(img=>{
   if(!img.closest('main#main')||isExcluded(img))return;
   img.classList.add('gallery-lightbox-trigger');
   if(!img.hasAttribute('tabindex'))img.tabIndex=0;
   if(!img.hasAttribute('role'))img.setAttribute('role','button');
   const inferredCaption=captionFor(img);
   if(!img.hasAttribute('aria-label'))img.setAttribute('aria-label','Open photo: '+inferredCaption);
 });
}
function triggers(){return eligibleImages();}
function applyZoom(){
 view.style.transform='translate('+panX+'px,'+panY+'px) scale('+zoom+')';
 view.style.cursor=zoom>1?'grab':'default';
 zoomButtons.forEach(b=>{const a=b.dataset.zoom;b.disabled=(a==='in'&&zoom>=4)||(a==='out'&&zoom<=1);});
}
function setZoom(action){if(action==='in')zoom=Math.min(4,Math.round((zoom+.25)*100)/100);else if(action==='out')zoom=Math.max(1,Math.round((zoom-.25)*100)/100);else{zoom=1;panX=0;panY=0;}if(zoom===1){panX=0;panY=0;}applyZoom();}
function show(i){const items=triggers();if(!items.length)return;index=(i+items.length)%items.length;const t=items[index];const label=captionFor(t);view.src=t.currentSrc||t.src;view.alt=t.alt||label;caption.textContent=label;count.textContent=(index+1)+' / '+items.length;zoom=1;panX=0;panY=0;applyZoom();}
function openFrom(t){if(isExcluded(t))return;const items=triggers();const i=items.indexOf(t);if(i<0)return;previousFocus=t;show(i);modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('gallery-lightbox-active');modal.querySelector('.gallery-lightbox-close').focus();}
function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');view.removeAttribute('src');document.body.classList.remove('gallery-lightbox-active');if(previousFocus&&previousFocus.focus)previousFocus.focus();}
prepareImages();
const mutationObserver=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)prepareImages(n)})));
mutationObserver.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.button!==0)return;const t=e.target.closest&&e.target.closest('main#main img.gallery-lightbox-trigger');if(t&&!isExcluded(t)){openFrom(t);}});
document.addEventListener('keydown',e=>{const t=e.target.closest&&e.target.closest('img.gallery-lightbox-trigger');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openFrom(t);}});
modal.querySelector('.gallery-lightbox-prev').addEventListener('click',()=>show(index-1));modal.querySelector('.gallery-lightbox-next').addEventListener('click',()=>show(index+1));modal.querySelector('.gallery-lightbox-close').addEventListener('click',close);zoomButtons.forEach(b=>b.addEventListener('click',()=>setZoom(b.dataset.zoom)));modal.addEventListener('click',e=>{if(e.target===modal)close()});
if(wrap){wrap.addEventListener('pointerdown',e=>{if(zoom<=1||e.target!==view)return;drag={x:e.clientX,y:e.clientY,px:panX,py:panY,id:e.pointerId};view.setPointerCapture?.(e.pointerId);view.style.cursor='grabbing';});wrap.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;panX=drag.px+e.clientX-drag.x;panY=drag.py+e.clientY-drag.y;applyZoom();view.style.cursor='grabbing';});const endDrag=e=>{if(drag&&drag.id===e.pointerId){drag=null;view.style.cursor=zoom>1?'grab':'default';}};wrap.addEventListener('pointerup',endDrag);wrap.addEventListener('pointercancel',endDrag);wrap.addEventListener('wheel',e=>{if(!modal.classList.contains('is-open'))return;e.preventDefault();setZoom(e.deltaY<0?'in':'out');},{passive:false});}
document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(index-1);else if(e.key==='ArrowRight')show(index+1);else if(e.key==='+'||e.key==='=')setZoom('in');else if(e.key==='-'||e.key==='_')setZoom('out');else if(e.key==='0')setZoom('reset');});
applyZoom();
})();
}

/* ===== kg-asset-deduplication ===== */
{
(function(){
  function hydrate(){
    document.querySelectorAll('img[data-asset-ref]').forEach(function(img){
      var first=document.querySelector('img[data-asset-id="'+img.getAttribute('data-asset-ref')+'"]');
      if(first && first.currentSrc) img.src=first.currentSrc;
      else if(first) img.src=first.src;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hydrate,{once:true}); else hydrate();
})();
}

/* ===== kg-progressive-rendering ===== */
{
(function(){
  function start(){
    var parts=Array.prototype.slice.call(document.querySelectorAll('.kg-progressive-part'));
    if(!parts.length)return;
    // Mark below-the-fold chunks for gentle staged rendering, without hiding content
    // or blocking navigation/anchor links when JavaScript is unavailable.
    var firstViewport=window.innerHeight||800;
    parts.forEach(function(part){
      var r=part.getBoundingClientRect();
      if(r.top>firstViewport+120)part.classList.add('kg-not-entered');
    });
    if(!('IntersectionObserver' in window)){
      parts.forEach(function(p){p.classList.remove('kg-not-entered')});
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.remove('kg-not-entered');
          io.unobserve(entry.target);
          // Decode images only as their section approaches the viewport.
          entry.target.querySelectorAll('img[loading="lazy"]').forEach(function(img){
            if(img.decode && !img.complete) img.decode().catch(function(){});
          });
        }
      });
    },{rootMargin:'300px 0px',threshold:0.01});
    parts.forEach(function(p){io.observe(p)});
    // Prioritize the first screen and let the browser finish its initial paint first.
    if('requestIdleCallback' in window){requestIdleCallback(function(){document.documentElement.classList.add('kg-progressive-ready')},{timeout:900})}
    else{setTimeout(function(){document.documentElement.classList.add('kg-progressive-ready')},250)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
}

/* ===== MAIN: lazy clinic image loader ===== */
{
(function(){function loadClinicPhoto(){var target=document.querySelector("#hospital-location .clinic-entrance-photo");if(!target||target.dataset.loadedClinicPhoto)return;var source=document.querySelector('img[data-asset-id="kgasset6"]')||document.querySelector('img[alt="Hospital entrance and location"]');if(source&&source.src){target.src=source.src;target.dataset.loadedClinicPhoto="true";}}var target=document.querySelector("#hospital-location .clinic-entrance-photo");if(!target)return;if("IntersectionObserver" in window){var observer=new IntersectionObserver(function(entries){if(entries.some(function(entry){return entry.isIntersecting;})){loadClinicPhoto();observer.disconnect();}},{rootMargin:"300px"});observer.observe(target);}else{loadClinicPhoto();}})();
}

/* ===== hero-typewriter-animation-js ===== */
{
(function(){
  function init(){
    var heading=document.querySelector('.hero-typing-headline');
    var target=document.querySelector('.hero-typing-text');
    if(!heading||!target||heading.dataset.kgTypewriterReady==='true')return;
    heading.dataset.kgTypewriterReady='true';
    var phrases=['for children','in Hisar'];
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.textContent='';
    target.classList.add('hero-typing-text-stacked');
    var prefix=document.createElement('span');
    prefix.className='hero-typing-prefix-line';
    prefix.textContent='Best gastro care';
    var phrase=document.createElement('span');
    phrase.className='hero-typing-highlight hero-typing-phrase-line';
    var textNode=document.createTextNode('');
    phrase.appendChild(textNode);
    target.append(prefix,phrase);
    if(reduce){textNode.nodeValue=phrases[0];return;}
    var phraseIndex=0, index=0, deleting=false, timer=null;
    function tick(){
      var current=phrases[phraseIndex];
      if(!deleting){
        index=Math.min(index+1,current.length);
        textNode.nodeValue=current.slice(0,index);
        if(index===current.length){deleting=true;timer=window.setTimeout(tick,1500);return;}
        timer=window.setTimeout(tick,105);
      }else{
        index=Math.max(0,index-1);
        textNode.nodeValue=current.slice(0,index);
        if(index===0){deleting=false;phraseIndex=(phraseIndex+1)%phrases.length;timer=window.setTimeout(tick,320);return;}
        timer=window.setTimeout(tick,48);
      }
    }
    timer=window.setTimeout(tick,350);
    document.addEventListener('visibilitychange',function(){
      if(document.hidden&&timer){window.clearTimeout(timer);timer=null;}
      else if(!document.hidden&&!timer){timer=window.setTimeout(tick,250);}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}

/* ===== continue-booking-click-animation-js ===== */
{
(function(){
 function init(){
  document.querySelectorAll('.booking-dialog-actions .booking-submit').forEach(function(btn){
   btn.addEventListener('click',function(){
    /* User-requested decorative background motion: do not suppress the scene based on OS motion preference. */
    btn.classList.remove('booking-click-shine');
    void btn.offsetWidth;
    btn.classList.add('booking-click-shine');
    window.setTimeout(function(){btn.classList.remove('booking-click-shine')},850);
   });
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}

/* ===== book-appointment-click-animation-js ===== */
{
(function(){
 function init(){
  document.querySelectorAll('.booking-toggle').forEach(function(btn){
   btn.addEventListener('click',function(){
    /* User-requested decorative background motion: do not suppress the scene based on OS motion preference. */
    btn.classList.remove('booking-click-shine');
    void btn.offsetWidth;
    btn.classList.add('booking-click-shine');
    window.setTimeout(function(){btn.classList.remove('booking-click-shine')},850);
   });
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}

/* ===== kg-testimonial-controls-script ===== */
{
(()=>{const track=document.getElementById('kg-testimonial-track');const windowEl=document.getElementById('kg-testimonial-window');const toggle=document.getElementById('kg-testimonial-toggle');const prev=document.getElementById('kg-testimonial-prev');const next=document.getElementById('kg-testimonial-next');if(!track||!toggle||!prev||!next)return;let index=0;let userPaused=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);const cards=Array.from(track.querySelectorAll('.kg-testimonial-card'));const originalCount=Math.floor(cards.length/2)||cards.length;const step=()=>{const card=cards[0];if(!card)return 0;const style=getComputedStyle(track);return card.getBoundingClientRect().width+(parseFloat(style.columnGap||style.gap)||0)};const update=()=>{track.style.animationPlayState=userPaused?'paused':'running';toggle.innerHTML=userPaused?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 4.8 19 12 8 19.2Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>';toggle.setAttribute('aria-pressed',String(userPaused));toggle.setAttribute('aria-label',userPaused?'Resume automatic testimonial movement':'Pause automatic testimonial movement');toggle.title=userPaused?'Play testimonials':'Pause testimonials'};const move=(delta)=>{userPaused=true;track.classList.add('kg-manual-navigation');track.style.animationPlayState='paused';index=(index+delta+originalCount)%originalCount;track.style.setProperty('--kg-manual-offset',(-index*step())+'px');update()};prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));toggle.addEventListener('click',()=>{userPaused=!userPaused;if(!userPaused){track.classList.remove('kg-manual-navigation');track.style.removeProperty('--kg-manual-offset')}update()});if(windowEl){windowEl.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}else if(e.key==='ArrowRight'){e.preventDefault();move(1)}});windowEl.addEventListener('pointerenter',()=>{if(!userPaused)track.style.animationPlayState='paused'});windowEl.addEventListener('pointerleave',()=>{if(!userPaused&&!track.classList.contains('kg-manual-navigation'))track.style.animationPlayState='running'});}if(userPaused){track.classList.add('kg-manual-navigation')}update();})();
}

/* ===== mobile-browser-performance-guard ===== */
{
(function(){
  'use strict';
  // Safari iOS and Chrome Android can throttle costly decorative motion when hidden.
  function updateVisibility(){document.documentElement.classList.toggle('kg-tab-hidden',document.visibilityState==='hidden');}
  document.addEventListener('visibilitychange',updateVisibility,{passive:true});updateVisibility();
  // Avoid duplicate rapid taps on navigation toggles without interfering with native details.
  document.addEventListener('click',function(e){
    var summary=e.target&&e.target.closest?e.target.closest('.header #links summary'):null;
    if(summary){summary.style.webkitTapHighlightColor='transparent';}
  },{passive:true});
  // iOS Safari viewport units fallback for older releases; modern browsers use dvh CSS above.
  try{if(!CSS.supports('height: 100dvh')){document.documentElement.style.setProperty('--kg-legacy-vh',(window.innerHeight*.01)+'px');window.addEventListener('resize',function(){document.documentElement.style.setProperty('--kg-legacy-vh',(window.innerHeight*.01)+'px')},{passive:true});}}catch(_e){}
})();
}

/* ===== main-image-stories-settings-loader ===== */
{
(()=>{
  const slot=document.getElementById('main-uploaded-photo-story');
  const image=document.getElementById('main-uploaded-photo-image');
  const title=document.getElementById('main-uploaded-photo-title');
  const caption=document.getElementById('main-uploaded-photo-caption');
  if(!slot||!image)return;
  // On GitHub Pages, settings.json is published beside index.html by the existing site admin.
  fetch(new URL('/settings.json',document.baseURI).toString(),{cache:'no-cache'})
    .then(r=>{if(!r.ok)throw new Error('No published image settings');return r.json()})
    .then(settings=>{
      const path=typeof settings.photoOfDay==='string'?settings.photoOfDay.trim():'';
      if(!path)return;
      const safePath=path.replace(/^\/+/, '').split('/').filter(part=>part && part!=='.' && part!=='..').join('/');
      if(!new Set(['gastro talk.webp','rezept-rx-logo.png','endo gallery pic.webp','main pic.webp','potrait gallery.jpg','baby pic.webp','hospital pic.webp','gif 1.webm','gif 2.webm','gif 3.webm','endo main pic.webp']).has(safePath))return;
      image.src='/assets/'+safePath;
      const text=(settings.photoCaption||'').trim();
      if(text){title.textContent=text;caption.textContent='A recent moment from KidsGastro.';}
      else {title.textContent='Photo of the day';caption.textContent='A recent moment from KidsGastro.';}
      image.addEventListener('error',()=>{slot.hidden=true},{once:true});
      image.addEventListener('load',()=>{slot.hidden=false},{once:true});
    }).catch(()=>{ /* No uploaded feature image yet; keep the optional slot hidden. */ });
})();
}

/* ===== booking-menu-visibility-repair-js ===== */
{
(function(){
  function initBookingMenu(){
    var toggle=document.getElementById('booking-menu-toggle');
    var panel=document.getElementById('booking-menu-panel');
    if(!toggle||!panel||toggle.dataset.visibilityRepair==='2')return;
    toggle.dataset.visibilityRepair='2';
    // Move the panel to <body> so it can escape hero clipping; size it to match the appointment button.
    if(panel.parentElement!==document.body)document.body.appendChild(panel);
    function placePanel(){
      if(panel.hidden)return;
      var r=toggle.getBoundingClientRect();
      var vw=document.documentElement.clientWidth||window.innerWidth;
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var margin=12;
      var width=Math.min(Math.max(280,r.width),Math.max(0,vw-margin*2));
      panel.style.setProperty('--booking-trigger-width',r.width+'px');
      panel.style.setProperty('position','fixed','important');
      panel.style.setProperty('width',width+'px','important');
      panel.style.setProperty('max-width','calc(100vw - 24px)','important');
      panel.style.setProperty('left',Math.max(margin,Math.min(r.left,vw-width-margin))+'px','important');
      panel.style.setProperty('right','auto','important');
      panel.style.setProperty('z-index','2147483000','important');
      panel.style.setProperty('display','block','important');
      panel.style.setProperty('visibility','visible','important');
      panel.style.setProperty('pointer-events','auto','important');
      panel.style.setProperty('top','0px','important');
      var panelHeight=panel.getBoundingClientRect().height;
      var below=vh-r.bottom-10-margin;
      var top=(panelHeight<=below || below>Math.min(180,panelHeight*.45)) ? r.bottom+10 : Math.max(margin,r.top-panelHeight-10);
      top=Math.min(top,Math.max(margin,vh-panelHeight-margin));
      panel.style.setProperty('top',top+'px','important');
    }
    function setOpen(open){
      panel.hidden=!open;
      toggle.setAttribute('aria-expanded',String(open));
      if(open){placePanel();requestAnimationFrame(placePanel);}
      else {['position','width','max-width','left','right','top','z-index','display','visibility','pointer-events'].forEach(function(k){panel.style.removeProperty(k);});}
    }
    toggle.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();setOpen(panel.hidden);});
    document.addEventListener('click',function(e){if(!panel.contains(e.target)&&!toggle.contains(e.target))setOpen(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){setOpen(false);toggle.focus();}});
    window.addEventListener('resize',placePanel,{passive:true});
    window.addEventListener('scroll',placePanel,{passive:true,capture:true});
    if(window.visualViewport){window.visualViewport.addEventListener('resize',placePanel,{passive:true});window.visualViewport.addEventListener('scroll',placePanel,{passive:true});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBookingMenu,{once:true});else initBookingMenu();
})();
}

/* ===== MAIN: back-to-top and scroll reset ===== */
{
(()=>{
  const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The footer link always targets the document's true top, not a #top anchor that may sit below it.
  document.addEventListener('click',event=>{
    const link=event.target&&event.target.closest?event.target.closest('a.back-top'):null;
    if(!link)return;
    event.preventDefault();
    const behavior=reduced()?'auto':'smooth';
    try{history.replaceState(null,'',location.pathname+location.search);}catch(_){}
    window.scrollTo({top:0,left:0,behavior});
    document.documentElement.scrollTo({top:0,left:0,behavior});
    document.body.scrollTo({top:0,left:0,behavior});
    // Also reset any page-level scrolling element if the layout uses one.
    const scrolling=document.querySelector('#main, #secondary-page-content, .site-main, main');
    if(scrolling && scrolling.scrollHeight>scrolling.clientHeight+2){scrolling.scrollTo({top:0,left:0,behavior});}
  },true);

})();
}

/* Subsite-only canvas cleanup is not part of the main-site bundle. */

/* ===== kg-fast-section-entrance-js ===== */
{
(function(){
  function init(){
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors=[
      '#connect','#kg-photo-of-month-section','#watch-our-content',
      '#hospital-location','#featured-testimonials','.latest-section',
      '.appointment-panel','.newsletter-section','.social-section',
      '.photo-reel-section','.faq-section','.contact'
    ];
    var sections=Array.from(new Set(selectors.flatMap(function(sel){
      return Array.from(document.querySelectorAll(sel));
    }))).filter(function(el){
      return el && !el.hidden && !el.closest('[hidden]');
    });
    if(reduced || !('IntersectionObserver' in window)){
      sections.forEach(function(el){el.classList.add('kg-section-entered');});
      return;
    }
    sections.forEach(function(el){el.classList.add('kg-section-enter');});
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('kg-section-entered');
          observer.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.06});
    sections.forEach(function(el){
      /* Never hide content that is already in the initial viewport. */
      if(el.getBoundingClientRect().top < (window.innerHeight||800)*0.92){
        el.classList.add('kg-section-entered');
      }else{
        observer.observe(el);
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
}

/* ===== kg-clean-path-scroll-navigation ===== */
{
(()=>{
 document.addEventListener('click',event=>{
  const link=event.target&&event.target.closest?event.target.closest('a[data-kg-scroll-target]'):null;
  if(!link)return;
  const targetId=link.dataset.kgScrollTarget;
  const target=targetId==='top'?document.documentElement:document.getElementById(targetId);
  if(!target)return;
  event.preventDefault();
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header=document.querySelector('.header');
  const offset=targetId==='top'?0:((header?header.getBoundingClientRect().height:0)+12);
  const y=targetId==='top'?0:target.getBoundingClientRect().top+window.scrollY-offset;
  window.scrollTo({top:Math.max(0,y),behavior:reduced?'auto':'smooth'});
 });
})();
}

/* ===== remove-mobile-number-optional-label ===== */
{
(()=>{function clean(){const label=document.querySelector('label[for="parent-name"]');if(label)label.textContent=label.textContent.replace(/\s*\(optional\)/ig,'').trim();const field=document.getElementById('parent-name');if(field){field.placeholder=field.placeholder.replace(/\s*\(optional\)/ig,'').trim();field.required=false;}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});else clean();})();
}

/* ===== outstanding-gif-carousel-and-custom-booked-slots ===== */
{
(()=>{
 const track=document.getElementById('kg-watch-content-track');
 if(track){
  const playButton=document.querySelector('.kg-watch-content-play');
  const live=document.getElementById('kg-watch-content-live');
  const back=document.querySelector('[data-gif-direction="back"]');
  const forward=document.querySelector('[data-gif-direction="forward"]');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused=!!(reduce&&reduce.matches),interacting=false,hovering=false,raf=0,last=0,resumeTimer=0,originalSpan=0,clonesMade=false;
  const originals=()=>Array.from(track.querySelectorAll(':scope > .kg-watch-content-gif-link')).filter(a=>a.dataset.carouselClone!=='true');
  const setStatus=()=>{if(live)live.textContent=''};
  const updateButton=()=>{if(!playButton)return;const paused=userPaused||interacting||hovering;playButton.innerHTML=userPaused?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 4.8 19 12 8 19.2Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>';playButton.setAttribute('aria-pressed',String(userPaused));playButton.setAttribute('aria-label',userPaused?'Play automatic video carousel movement':(paused?'Automatic video carousel movement paused':'Pause automatic video carousel movement'));playButton.title=userPaused?'Play':'Pause';};
  const paused=()=>userPaused||interacting||hovering||!!(reduce&&reduce.matches)||document.hidden;
  const stopFrame=()=>{if(raf)cancelAnimationFrame(raf);raf=0;last=0};
  const measure=()=>{const items=originals();if(!items.length)return;const first=items[0],lastItem=items[items.length-1];originalSpan=(lastItem.offsetLeft+lastItem.offsetWidth)-first.offsetLeft;};
  const addClones=()=>{if(clonesMade)return;originals().forEach((item)=>{const clone=item.cloneNode(true);clone.dataset.carouselClone='true';clone.setAttribute('aria-hidden','true');clone.setAttribute('tabindex','-1');clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(el=>el.setAttribute('tabindex','-1'));clone.querySelectorAll('img').forEach(img=>img.setAttribute('aria-hidden','true'));track.appendChild(clone)});clonesMade=true;measure()};
  const tick=(time)=>{raf=0;if(paused()){last=0;updateButton();return}if(!last)last=time;const elapsed=Math.min(50,time-last);last=time;if(originalSpan>0){track.scrollLeft+=elapsed*0.018;if(track.scrollLeft>=originalSpan){track.scrollLeft-=originalSpan}}raf=requestAnimationFrame(tick)};
  const start=()=>{stopFrame();updateButton();if(paused()){setStatus(userPaused?'Automatic movement paused.':'Automatic movement pauses while you interact.');return}setStatus();raf=requestAnimationFrame(tick)};
  const pauseForInteraction=()=>{interacting=true;clearTimeout(resumeTimer);stopFrame();updateButton();setStatus('Paused while you interact.');};
  const resumeAfterInteraction=()=>{clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{interacting=false;updateButton();start()},2600)};
  addClones();
  /* Lazy-load the reel previews only when they approach the viewport.
     The HTML keeps the five WebM URLs in data-src so they do not compete with
     the hero image and first-screen CSS/JS during the initial page load. */
  const reelVideos=()=>Array.from(track.querySelectorAll('video.kg-watch-content-video'));
  const markVideoUnavailable=video=>{
    const card=video.closest('.kg-watch-content-gif-link');
    if(card)card.classList.add('kg-video-unavailable');
  };
  const hydrateVideo=video=>{
    if(!video||video.dataset.kgVideoLoaded==='true')return;
    const source=video.querySelector('source[data-src]');
    if(!source){
      if(!video.querySelector('source[src]'))markVideoUnavailable(video);
      return;
    }
    if(video.canPlayType&&!video.canPlayType(source.type||'video/webm')){
      markVideoUnavailable(video);
      return;
    }
    const url=source.getAttribute('data-src');
    if(!url){markVideoUnavailable(video);return;}
    video.dataset.kgVideoLoaded='true';
    video.muted=true;
    video.defaultMuted=true;
    video.playsInline=true;
    video.loop=true;
    video.preload='auto';
    source.setAttribute('src',url);
    source.removeAttribute('data-src');
    video.load();
  };
  const videoInViewport=video=>{
    const r=video.getBoundingClientRect();
    return r.width>0&&r.height>0&&r.right>0&&r.left<window.innerWidth&&r.bottom>0&&r.top<window.innerHeight;
  };
  const syncVideoPlayback=video=>{
    if(!video)return;
    if(document.hidden||(reduce&&reduce.matches)||!videoInViewport(video)){
      if(!video.paused)video.pause();
      return;
    }
    hydrateVideo(video);
    if(video.dataset.kgVideoLoaded==='true'&&video.paused){
      const result=video.play();
      if(result&&typeof result.catch==='function')result.catch(()=>{});
    }
  };
  let reelLoadObserver=null,reelPlaybackObserver=null;
  reelVideos().forEach(video=>{
    video.addEventListener('error',()=>markVideoUnavailable(video),{once:true});
    video.addEventListener('loadeddata',()=>{
      const card=video.closest('.kg-watch-content-gif-link');
      if(card)card.classList.remove('kg-video-unavailable');
    },{once:true});
  });
  const syncAllReelVideos=()=>reelVideos().forEach(syncVideoPlayback);
  if('IntersectionObserver' in window){
    /* Prefetch just before a card enters view; a second zero-margin observer
       starts/stops playback on actual viewport intersection. */
    reelLoadObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting)hydrateVideo(entry.target);});
    },{root:null,rootMargin:'160px 220px',threshold:0.01});
    reelPlaybackObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting)syncVideoPlayback(entry.target);
        else if(!entry.target.paused)entry.target.pause();
      });
    },{root:null,rootMargin:'0px',threshold:0.08});
    reelVideos().forEach(video=>{
      reelLoadObserver.observe(video);
      reelPlaybackObserver.observe(video);
    });
  }else{
    reelVideos().forEach(video=>{hydrateVideo(video);syncVideoPlayback(video);});
  }
  track.addEventListener('scroll',syncAllReelVideos,{passive:true});
  window.addEventListener('resize',syncAllReelVideos,{passive:true});
  document.addEventListener('visibilitychange',syncAllReelVideos);
  window.addEventListener('pagehide',()=>reelVideos().forEach(video=>video.pause()),{once:true});

  /* Keep the loop continuous in both directions when a visitor uses the arrows. */
  const moveCarousel=direction=>{
    pauseForInteraction();
    if(direction<0&&track.scrollLeft<=2&&originalSpan>0)track.scrollLeft=originalSpan;
    else if(direction>0&&originalSpan>0&&track.scrollLeft>=originalSpan)track.scrollLeft-=originalSpan;
    track.scrollBy({left:direction*Math.max(180,track.clientWidth*.75),behavior:reduce&&reduce.matches?'auto':'smooth'});
    resumeAfterInteraction();
  };
  if(playButton)playButton.addEventListener('click',()=>{userPaused=!userPaused;if(!userPaused){interacting=false;hovering=false}updateButton();start()});
  if(back)back.addEventListener('click',()=>moveCarousel(-1));
  if(forward)forward.addEventListener('click',()=>moveCarousel(1));
  ['pointerdown','touchstart','wheel','keydown','focusin'].forEach(type=>track.addEventListener(type,()=>{pauseForInteraction();resumeAfterInteraction()},{passive:type!=='keydown'}));
  ['pointerup','touchend','touchcancel','pointercancel'].forEach(type=>track.addEventListener(type,()=>{resumeAfterInteraction()},{passive:true}));
  /* Scroll events are also emitted by the automatic animation; user input events above pause it without false-triggering on programmatic scrolls. */
  track.addEventListener('pointerenter',()=>{hovering=true;stopFrame();updateButton()});track.addEventListener('pointerleave',()=>{hovering=false;start()});
  document.addEventListener('visibilitychange',start);
  if(reduce){const onMotionChange=()=>{if(reduce.matches){userPaused=true;stopFrame();updateButton();setStatus('Automatic movement paused for reduced-motion preference.');syncAllReelVideos()}else{start();syncAllReelVideos()}};if(reduce.addEventListener)reduce.addEventListener('change',onMotionChange);else if(reduce.addListener)reduce.addListener(onMotionChange)}
  window.addEventListener('resize',()=>{measure();if(track.scrollLeft>=originalSpan&&originalSpan)track.scrollLeft%=originalSpan;start()},{passive:true});
  updateButton();measure();start();
 }
 /* Custom booked-slot display stays synchronized with the existing select and all existing booking handlers. */
 const select=document.getElementById('time-slot-select');
 if(select){
  const parent=select.parentElement;const wrap=document.createElement('div');wrap.className='kg-slot-picker';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='kg-slot-picker-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.disabled=select.disabled;
  const slotLabel=document.querySelector('label[for="time-slot-select"]');if(slotLabel){if(!slotLabel.id)slotLabel.id='kg-slot-picker-label';trigger.setAttribute('aria-labelledby',slotLabel.id)}
  const selectedText=document.createElement('span');selectedText.className='kg-slot-selected-text';selectedText.textContent=select.options[select.selectedIndex]?.textContent||'Choose a date first';
  const chevron=document.createElement('span');chevron.className='kg-slot-picker-chevron';chevron.setAttribute('aria-hidden','true');chevron.textContent='▾';trigger.append(selectedText,chevron);
  const list=document.createElement('div');list.className='kg-slot-picker-list';list.setAttribute('role','listbox');list.id='kg-slot-picker-list';trigger.setAttribute('aria-controls',list.id);
  wrap.append(trigger,list);select.classList.add('kg-native-slot-source');select.insertAdjacentElement('afterend',wrap);
  let activeIndex=0;
  const close=()=>{wrap.classList.remove('is-open');trigger.setAttribute('aria-expanded','false')};
  const open=()=>{if(trigger.disabled)return;wrap.classList.add('is-open');trigger.setAttribute('aria-expanded','true');const opts=Array.from(list.querySelectorAll('.kg-slot-picker-option'));const selected=opts.findIndex(o=>o.getAttribute('aria-selected')==='true');activeIndex=Math.max(0,selected);opts[activeIndex]?.focus({preventScroll:true})};
  const chooseValue=(value)=>{if(!value||select.disabled)return;const option=Array.from(select.options).find(item=>item.value===value);if(!option||option.disabled)return;select.value=option.value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));if(select.value!==option.value)return;selectedText.textContent=option.textContent;close();render();};
  const choose=(option)=>chooseValue(option&&option.value);
  const render=()=>{const current=select.options[select.selectedIndex];if(current)selectedText.textContent=current.textContent;trigger.disabled=select.disabled;list.replaceChildren();Array.from(select.options).forEach((opt,index)=>{const row=document.createElement('button');row.type='button';row.className='kg-slot-picker-option';row.setAttribute('role','option');row.dataset.value=opt.value;row.dataset.label=opt.textContent;row.disabled=!!opt.disabled;row.setAttribute('aria-selected',String(opt===current));if(!opt.value)row.classList.add('is-placeholder');const time=document.createElement('span');time.className='kg-slot-time';const label=opt.textContent;const marker='·';const split=label.lastIndexOf(marker);const isBooked=opt.disabled&&/slot already booked/i.test(label);time.textContent=isBooked?(split>=0?label.slice(0,split).trim():label):label;if(isBooked){row.classList.add('is-booked');const status=document.createElement('span');status.className='kg-slot-booked-status';status.textContent='Slot already booked';row.append(time,status)}else row.append(time);row.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){e.preventDefault();chooseValue(row.dataset.value)}});row.addEventListener('click',()=>chooseValue(row.dataset.value));row.addEventListener('keydown',e=>{const rows=Array.from(list.querySelectorAll('.kg-slot-picker-option'));if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const dir=e.key==='ArrowDown'?1:-1;let i=index;for(let tries=0;tries<rows.length;tries++){i=(i+dir+rows.length)%rows.length;if(!rows[i].disabled){rows[i].focus();activeIndex=i;break}}}else if(e.key==='Home'||e.key==='End'){e.preventDefault();const candidates=rows.map((r,i)=>({r,i})).filter(x=>!x.r.disabled);const item=e.key==='Home'?candidates[0]:candidates[candidates.length-1];item?.r.focus();if(item)activeIndex=item.i}else if(e.key==='Escape'){e.preventDefault();close();trigger.focus()}else if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(opt)}});list.appendChild(row)});if(select.disabled)close()};
  trigger.addEventListener('click',()=>wrap.classList.contains('is-open')?close():open());
  trigger.addEventListener('keydown',e=>{if(['ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();open()}else if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))close()});
  select.addEventListener('change',render);select.addEventListener('input',render);
  const observer=new MutationObserver(render);observer.observe(select,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','selected','value']});
  render();
 }
})();
}

/* ===== kg-gallery-dropdown-recovery ===== */
{
(()=>{
 function init(){
  const gallery=document.querySelector('#links>.kg-gallery-nav-dropdown');
  if(!gallery||gallery.dataset.kgGalleryRecovery==='true')return;
  gallery.dataset.kgGalleryRecovery='true';
  const summary=gallery.querySelector(':scope > summary');
  if(summary){summary.style.cursor='pointer';summary.setAttribute('aria-label','Gallery menu');}
  gallery.querySelectorAll(':scope > .nav-dropdown-menu a').forEach(a=>a.addEventListener('click',()=>{gallery.removeAttribute('open');}));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
})();
}

/* ===== MAIN-SITE NAVIGATION CONTROLLER ===== */
(() => {
  "use strict";
  if (document.documentElement.dataset.kgSite !== "main") return;

  function initMainNavigation() {
    const header = document.querySelector("header.header");
    const nav = header && header.querySelector("nav.nav");
    const button = nav && nav.querySelector("button.toggle");
    const panel = nav && nav.querySelector("#links");
    if (!header || !nav || !button || !panel || button.dataset.kgMainNav === "1") return;

    button.dataset.kgMainNav = "1";
    button.type = "button";
    button.setAttribute("aria-controls", "links");

    const isOpen = () => panel.classList.contains("open");
    const placePanel = () => {
      if (!isOpen()) return;
      const rect = header.getBoundingClientRect();
      const top = Math.max(8, Math.min(Math.round(rect.bottom + 5), window.innerHeight - 100));
      panel.style.setProperty("--kg-final-menu-top", top + "px");
    };

    function setOpen(open) {
      const compact = window.matchMedia("(max-width: 1100px)").matches;
      const effectiveOpen = compact && Boolean(open);
      panel.classList.toggle("open", effectiveOpen);
      panel.hidden = false;
      panel.setAttribute("aria-hidden", String(compact ? !effectiveOpen : false));
      button.setAttribute("aria-expanded", String(effectiveOpen));
      button.setAttribute("aria-label", effectiveOpen ? "Close navigation" : "Open navigation");
      button.classList.toggle("is-open", effectiveOpen);
      document.body.classList.toggle("kg-final-menu-open", effectiveOpen);

      if (effectiveOpen) {
        placePanel();
        window.requestAnimationFrame(placePanel);
      } else {
        panel.querySelectorAll("details[open]").forEach(item => { item.open = false; });
        panel.style.removeProperty("--kg-final-menu-top");
      }
    }

    // Capture phase ensures a single click produces a single menu state change.
    document.addEventListener("click", event => {
      const hit = event.target && event.target.closest
        ? event.target.closest('header.header button.toggle[aria-controls="links"]')
        : null;
      if (hit !== button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!isOpen());
    }, true);

    document.addEventListener("click", event => {
      if (isOpen() && !panel.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    panel.addEventListener("click", event => {
      if (event.target.closest("a[href]")) setOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        button.focus();
      }
    });
    window.addEventListener("resize", () => setOpen(false), { passive: true });
    window.addEventListener("scroll", placePanel, { passive: true });
    setOpen(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMainNavigation, { once: true });
  } else {
    initMainNavigation();
  }
})();

/* ===== MAIN-SITE WHATSAPP VERTICAL DRAG ===== */
(() => {
  "use strict";
  if (document.documentElement.dataset.kgSite !== "main" || window.KGHomepageWhatsAppDrag) return;
  window.KGHomepageWhatsAppDrag = true;

  const init = () => {
    const button = document.querySelector(".whatsapp-float");
    if (!button || button.dataset.kgVerticalDrag === "1") return;
    button.dataset.kgVerticalDrag = "1";
    button.style.touchAction = "none";
    button.style.cursor = "grab";

    let active = false;
    let moved = false;
    let startY = 0;
    let startTop = 0;
    let pointerId = null;
    const clampTop = value => Math.max(8, Math.min(
      window.innerHeight - button.getBoundingClientRect().height - 8, value
    ));

    button.addEventListener("pointerdown", event => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const rect = button.getBoundingClientRect();
      active = true;
      moved = false;
      pointerId = event.pointerId;
      startY = event.clientY;
      startTop = rect.top;
      button.classList.add("is-dragging");
      button.style.left = "auto";
      button.style.right = "max(16px, env(safe-area-inset-right))";
      button.style.bottom = "auto";
      button.style.top = rect.top + "px";
      try { button.setPointerCapture(pointerId); } catch (_) {}
      event.preventDefault();
    });
    button.addEventListener("pointermove", event => {
      if (!active || event.pointerId !== pointerId) return;
      const delta = event.clientY - startY;
      if (Math.abs(delta) > 3) moved = true;
      button.style.top = clampTop(startTop + delta) + "px";
      event.preventDefault();
    });
    const finish = event => {
      if (!active || event.pointerId !== pointerId) return;
      active = false;
      button.classList.remove("is-dragging");
      button.style.cursor = "grab";
      if (moved) {
        button.dataset.kgDragged = "1";
        window.setTimeout(() => { delete button.dataset.kgDragged; }, 350);
      }
      pointerId = null;
    };
    button.addEventListener("pointerup", finish);
    button.addEventListener("pointercancel", finish);
    button.addEventListener("click", event => {
      if (button.dataset.kgDragged === "1") {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    window.addEventListener("resize", () => {
      if (button.style.top) button.style.top = clampTop(parseFloat(button.style.top) || 0) + "px";
    }, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();


})();

/* Load decorative motion after first paint so it never competes with the hero. */
(()=>{
 'use strict';
 if(document.documentElement.dataset.kgSite!=='main'||window.KGCosmosMotionRequested)return;
 window.KGCosmosMotionRequested=true;
 const load=()=>{
  if(window.KGCosmosSpace||document.querySelector('script[data-kg-homepage-motion]'))return;
  const script=document.createElement('script');
  script.src='/assets/js/kg-homepage-motion.js?v=main-home-20261109-2';
  script.async=true;
  script.dataset.kgHomepageMotion='true';
  if('fetchPriority' in script)script.fetchPriority='low';
  document.head.appendChild(script);
 };
 if('requestIdleCallback' in window)window.requestIdleCallback(load,{timeout:1200});
 else window.setTimeout(load,480);
})();
