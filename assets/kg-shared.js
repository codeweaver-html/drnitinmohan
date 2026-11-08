/* ===== PAGE SCOPE / ADMIN EXCLUSION ===== */
(()=>{
  const path=(location.pathname||"/").replace(/\\+/g,"/").toLowerCase();
  const leaf=path.split("/").filter(Boolean).pop()||"";
  const excluded=/(^|\/)(admin|updates)(\/|\.html$)/.test(path);
  const home=(path==="/"||path==="/index.html");
  document.documentElement.classList.toggle("kg-shared-excluded",excluded);
  document.documentElement.classList.toggle("kg-shared-home",home&&!excluded);
  document.documentElement.classList.toggle("kg-shared-subsite",!home&&!excluded);
  window.KGSharedExcluded=excluded;
})();

/* KidsGastro shared JavaScript bundle.
   The announcement synchronizer self-disables on the homepage because
   #kg-manual-settings-bridge already owns homepage announcements. It remains
   active on standalone sub-sites without that bridge.
*/

/* ===== COSMIC ANIMATION ENGINE ===== */
/* KidsGastro shared cosmic animation engine.
   Reusable across the homepage and subpages.
   To animate a custom section, add class="kg-space-panel" or
   data-kg-cosmos-panel="true" to that section.
   The engine creates its own fixed canvas if one is not already present. */
(()=>{'use strict';
 if(window.KGSharedExcluded||window.KGCosmosSpace)return;
 // Start only after the DOM body exists; safe for async/defer and head inclusion.
 const boot=()=>{
 if(window.KGCosmosSpace)return;
 // Choose a delivery mode once for this page load. A slow/offline connection
 // starts in saver mode; a later network recovery takes full effect on reload.
 // Safari-compatible proxy network estimate: use same-origin navigation/resource
 // timings when Network Information API is unavailable. These are indirect signals,
 // not a precise bandwidth meter; ignore cached/zero-duration entries.
 const estimateSlowNetwork=()=>{
   if(!navigator.onLine)return true;
   const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
   if(c&&(c.saveData||/^(slow-2g|2g)$/.test(c.effectiveType||'')||
      (Number.isFinite(c.downlink)&&c.downlink>0&&c.downlink<1.2)))return true;
   try{
     const nav=performance.getEntriesByType('navigation')[0];
     if(nav){
       const ttfb=nav.responseStart-nav.requestStart;
       const transfer=nav.responseEnd-nav.responseStart;
       if(ttfb>2200 && transfer>900)return true;
     }
     const entries=performance.getEntriesByType('resource')
       .filter(e=>e.initiatorType==='img'&&e.transferSize!==0&&e.duration>250).slice(-12);
     if(entries.length>=3){
       const slow=entries.filter(e=>e.duration>1400 || (e.transferSize>18000 && e.duration>900)).length;
       if(slow>=Math.ceil(entries.length*.6))return true;
     }
   }catch(_){}
   return false;
 };
 const saverMode=estimateSlowNetwork();
 document.documentElement.dataset.networkMode=saverMode?'saver':'full';
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const coarse=window.matchMedia('(hover:none),(pointer:coarse)').matches;
 const TAU=Math.PI*2,rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 // Relative inertial masses (arbitrary units): larger craft resist deflection more.
 const OBJECT_MASS={iss:1200,starship:900,skyCrane:520,marsRover:190,orion:280,hubble:180,asteroid:160,satellite:90,voyager:70,halley:45,astronaut:12};
 const massOf=id=>OBJECT_MASS[id]||60;
 const CONFIG={maxDpr:1.5,mobileDpr:1.25,opacity:.76,mobileOpacity:.66,reducedOpacity:.72,objectAlpha:.95,issAngularSpeed:.22,voyagerInterval:[10000,17000],starshipInterval:[9000,14500],satelliteInterval:[6500,10500],asteroidInterval:[1800,3600],hubbleInterval:[14000,22000],orionInterval:[10500,16500],halleyInterval:[18000,28000],voyagerInitialDelay:[500,1800],starshipInitialDelay:[400,1300],planetCount:3};
 const canvas=document.getElementById('kg-space')||document.createElement('canvas');canvas.id='kg-space';canvas.setAttribute('aria-hidden','true');if(!canvas.isConnected)document.body.appendChild(canvas);
 const ctx=canvas.getContext('2d',{alpha:true});canvas.style.opacity=String(reduce?CONFIG.reducedOpacity:(coarse?CONFIG.mobileOpacity:CONFIG.opacity));
 const selectors=[
  '[data-kg-cosmos-panel]','.kg-space-panel',
  '[role="banner"]','.header','.site-header','#site-header','.main-header','header',
  'header #links','header .links','.site-header #links','.site-header .links',
  '.hero-grid > div:first-child','.newsletter-section','.social-intro',
  'footer','.footer','#site-footer','.footer-contact-band','.footer-bottom'
 ];
 const panels=[];let panelResizeObserver=null;
 let W=0,H=0,D=1,raf=0,last=0,scrollQueued=false,frameInterval=0,slowFrames=0,fastFrames=0,lastPerfCheck=0;
 function makePanel(el,panelIndex){
  // Give each panel its own launch phase. Identical vehicles are deliberately
  // staggered so the five scenes never begin their launch cycles together.
  const launchStagger=Math.max(0,Number(panelIndex)||0)*4000;
  const repeatStagger=Math.max(0,Number(panelIndex)||0)*1100;
  const baseCount=el.matches('.header')?7:(el.matches('.social-intro')?9:(el.matches('.footer-bottom')?6:7));
  const count=Math.max(1,Math.round(baseCount*(saverMode?.34:.5)));
  const cols=Math.ceil(Math.sqrt(count*1.35)),rows=Math.ceil(count/cols);
  const bodies=Array.from({length:count},(_,i)=>{
   const col=i%cols,row=Math.floor(i/cols);
   // Spread orbital systems across the whole panel instead of stacking every orbit at its centre.
   const edge= Math.random()<.5;
   const anchorX=edge?rand(.035,.965):(Math.random()<.5?rand(.035,.19):rand(.81,.965));
   const anchorY=edge?(Math.random()<.5?rand(.055,.20):rand(.80,.945)):rand(.06,.94);
   return {
    anchorX,anchorY,phase:rand(0,TAU),
    direction:Math.random()<.5?-1:1,speed:rand(.012,.034),
    orbitX:rand(.055,.145),orbitY:rand(.075,.23),
    radius:rand(2.1,3.8),ring:false,rotation:rand(0,TAU),spin:rand(.035,.105),
    moons:i%3===0?3:(i%2===0?2:1),moonPhase:rand(0,TAU),moonSpeed:rand(.12,.34)* (Math.random()<.5?-1:1),
    moonRadius:rand(10,25),orbitTilt:rand(-1.25,1.25),orbitEcc:rand(.58,1.38),
    secondaryTilt:rand(-1.4,1.4),secondaryScale:rand(1.12,1.55)
   };
  });
  const sparks=Array.from({length:46},()=>({x:rand(.025,.975),y:rand(.04,.96),phase:rand(0,TAU),speed:rand(.22,.72),size:rand(.45,1.15),streak:Math.random()<.16?1:0}));
  return {el,panelIndex,launchStagger,repeatStagger,lastActiveAt:performance.now(),bodies,collisionPairs:Object.create(null),collisionEffects:[],blackHole:null,nextBlackHole:performance.now()+rand(9000,18000)+launchStagger,iss:rand(0,TAU),issBody:null,voyager:null,ship:null,skyCrane:null,marsRover:null,nextSkyCrane:performance.now()+rand(6500,10500)+launchStagger,astronaut:null,nextAstronaut:performance.now()+rand(1800,4200),satellite:null,nextSatellite:performance.now()+rand(3500,6500),asteroid:null,nextAsteroid:performance.now()+rand(900,1800),hubble:null,nextHubble:performance.now()+rand(5000,9000),orion:null,nextOrion:performance.now()+rand(4000,7500),halley:null,nextHalley:performance.now()+rand(7000,12000),nextVoyager:performance.now()+rand(...CONFIG.voyagerInitialDelay),nextShip:performance.now()+rand(...CONFIG.starshipInitialDelay)+launchStagger,r:null,blocked:[],safePoints:[],sparks};
 }
 function scan(){
  // Only one simulation host is allowed for any nested visual box. Nested
  // selectors (header links, footer bands, hero children) otherwise duplicate
  // every moving object inside the same parent panel.
  selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{
   if(!el || el.closest('#hospital-location') || el.dataset.kgSpacePanel==='1')return;
   const isOpenMenu=el.matches('header #links.open,header .links.open,.site-header #links.open,.site-header .links.open');
   if(panels.some(p=>p.el===el.parentElement || p.el.contains(el))&&!isOpenMenu)return;
   if(panels.some(p=>el.contains(p.el)))return;
   el.dataset.kgSpacePanel='1';
   el.dataset.kgOriginalPosition=getComputedStyle(el).position;
   el.classList.add('kg-space-panel');
   const panel=makePanel(el,panels.length);panels.push(panel);
   if(panelResizeObserver)panelResizeObserver.observe(el);
  }));
 }
 function measure(){
  const protectedSelectors=[
   // Keep the primary paediatric gastro care message completely clear of space objects.
   '.hero .hero-typing-headline','.hero .hero-typing-headline *',
   '.booking-toggle','.back-top','#site-search','.site-search',
   '.toggle','.hamburger-toggle','.menu-toggle','.navbar-toggler',
   '#hamburger-panel','.hamburger-panel','#mobile-menu','.mobile-menu',
   '.header #links','.header #links.open','.site-header #links',
   '.site-header .nav-links','.main-header .nav-links',
   // Protect common navigation controls and every KidsGastro brand mark.
   'header nav a','header nav button','header nav [role="button"]',
   '.site-header nav a','.site-header nav button',
   '.kg-logo','.circular-brand-logo','.kg-logo-header','.kg-logo-secondary',
   '.kg-logo-newsletter','.header .brand','.site-header .brand',
   '.navbar-brand','.logo-link','.site-logo','.footer-brand','.footer .brand',
   // Keep the newsletter email-entry field and Request updates action clear.
   '#newsletter-email',
   '.newsletter-controls input[type="email"]',
   '.newsletter-controls button[type="submit"]',
   '.newsletter-controls button'
  ].join(',');
  const protectedNodes=[...document.querySelectorAll(protectedSelectors)];
  const menuNodes=[...document.querySelectorAll([
   'header .toggle','header .hamburger-toggle','header .menu-toggle',
   'header .navbar-toggler','header #links.open','header .links.open',
   'header .nav-links.open','header .hamburger-panel:not([hidden])',
   'header .mobile-menu:not([hidden])','header [role="menu"]:not([hidden])',
   'header details[open]','header .dropdown-menu.show',
   '.site-header .toggle','.site-header .menu-toggle',
   '.site-header .nav-links.open','.site-header .hamburger-panel:not([hidden])',
   '.site-header [role="menu"]:not([hidden])',
   '#mobile-menu:not([hidden])','.mobile-menu.is-open',
   '[aria-expanded="true"] + .submenu',
   '[aria-expanded="true"] + .dropdown-menu'
  ].join(','))];
  // Build one union rectangle around the complete hamburger control and every
  // expanded-menu child. A single union avoids XOR gaps where exclusion boxes overlap.
  let menuShield=null;
  menuNodes.forEach(node=>{
   if(!node||!node.isConnected)return;
   const b=node.getBoundingClientRect();if(b.width<1||b.height<1)return;
   const pad=node.matches('.toggle')?12:16;
   const box={left:b.left-pad,top:b.top-pad,right:b.right+pad,bottom:b.bottom+pad};
   if(!menuShield)menuShield={...box};
   else{menuShield.left=Math.min(menuShield.left,box.left);menuShield.top=Math.min(menuShield.top,box.top);menuShield.right=Math.max(menuShield.right,box.right);menuShield.bottom=Math.max(menuShield.bottom,box.bottom);}
  });
  panels.forEach(p=>{
   p.r=p.el.getBoundingClientRect();
   const pr=p.r;if(!pr||pr.width<1||pr.height<1)return;
   p.blocked=[];p.safePoints=[];p.layoutWidth=pr.width;p.layoutHeight=pr.height;
   // Shield menu controls from the global scene, but let the expanded menu
   // host its own canvas so the hamburger expansion has the same cosmic scene.
   const isExpandedMenu=p.el.matches('header #links,header .links,.site-header #links,.site-header .links');
   if(menuShield&&!isExpandedMenu){
    const left=clamp(menuShield.left,0,W),top=clamp(menuShield.top,0,H);
    const right=clamp(menuShield.right,0,W),bottom=clamp(menuShield.bottom,0,H);
    if(right>left&&bottom>top)p.blocked.push({left,top,right,bottom});
   }
   // Protect appointment and search controls independently; menu elements are
   // excluded here because their merged shield above already covers them.
   protectedNodes.forEach(node=>{
    if(!node||!node.isConnected||node.matches('.toggle,.hamburger-toggle,.menu-toggle,.navbar-toggler,#hamburger-panel,#mobile-menu,.hamburger-panel,.mobile-menu,header #links,header #links.open')||node.closest('header #links.open,header .nav-links.open,header .mobile-menu.is-open'))return;
    const b=node.getBoundingClientRect();
    if(b.width<1||b.height<1||b.bottom<0||b.top>H||b.right<0||b.left>W)return;
    const pad=26,left=clamp(b.left-pad,0,W),top=clamp(b.top-pad,0,H);
    const right=clamp(b.right+pad,0,W),bottom=clamp(b.bottom+pad,0,H);
    if(right>left&&bottom>top)p.blocked.push({left,top,right,bottom});
   });
   for(let row=0;row<9;row++)for(let col=0;col<19;col++){const nx=.025+col*.0527,ny=.06+row*.11;if(nx<.19||nx>.81||ny<.20||ny>.80)p.safePoints.push({x:pr.width*nx,y:pr.height*ny});}
  });
 }
  function resize(){D=Math.min(window.devicePixelRatio||1,saverMode?1:(coarse?CONFIG.mobileDpr:CONFIG.maxDpr));W=innerWidth;H=innerHeight;canvas.width=Math.round(W*D);canvas.height=Math.round(H*D);canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(D,0,0,D,0,0);measure();drawStatic();}
 function planet(c,x,y,r,rot,ring){
  // Minimal planet marker: a small, crisp white circle rather than a shaded bubble.
  c.save();c.globalAlpha=.98;c.fillStyle='#fff';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();
 }
  function drawISS(c,x,y,a,size,phase=0){c.save();c.translate(x,y);c.rotate(a);c.scale(size/44,size/44);c.strokeStyle=c.fillStyle='#fff';c.lineWidth=1.2;c.globalAlpha=.98;c.fillRect(-5,-2,10,4);c.fillRect(-21,-7,13,14);c.fillRect(8,-7,13,14);c.strokeRect(-21,-7,13,14);c.strokeRect(8,-7,13,14);c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(0,-8);c.lineTo(0,8);c.stroke();const blink=.35+.65*(.5+.5*Math.sin(phase*2.1));c.globalAlpha=blink;c.fillStyle='#fff';c.beginPath();c.arc(0,-5,1.35,0,TAU);c.fill();c.restore();}
 function drawVoyager(c,x,y,a,phase=0){c.save();c.translate(x,y);c.rotate(a);c.strokeStyle=c.fillStyle='#fff';c.lineWidth=1;c.globalAlpha=.85;c.beginPath();c.arc(-3,0,5,-1.25,1.25);c.stroke();c.fillRect(-1,-1,4,2);c.beginPath();c.moveTo(2,0);c.lineTo(15,0);c.moveTo(5,-2);c.lineTo(10,-7);c.stroke();c.save();c.translate(-3,0);c.rotate(Math.sin(phase*.4)*.09);c.globalAlpha=.65;c.beginPath();c.arc(0,0,7,-1.15,1.15);c.stroke();c.restore();c.restore();}
 function drawStarship(c,x,y,a,phase=0){
  c.save();c.translate(x,y);c.rotate(a);c.scale(1.21875,1.4625);c.globalAlpha=.96;c.fillStyle=c.strokeStyle='#fff';c.lineWidth=.8;
  // Large stainless-steel Starship-inspired profile with nose, flaps and engine plume.
  c.beginPath();c.moveTo(18,0);c.lineTo(10,-2.2);c.lineTo(-17,-2.2);c.lineTo(-21,-1.1);c.lineTo(-21,1.1);c.lineTo(-17,2.2);c.lineTo(10,2.2);c.closePath();c.fill();
  c.beginPath();c.moveTo(-13,-2);c.lineTo(-19,-6);c.lineTo(-17,-2);c.moveTo(-13,2);c.lineTo(-19,6);c.lineTo(-17,2);c.stroke();
  c.globalAlpha=.7;c.strokeStyle='rgba(255,255,255,.8)';c.beginPath();c.moveTo(8,-1.5);c.lineTo(8,1.5);c.moveTo(2,-2);c.lineTo(2,2);c.stroke();
  const flicker=.72+.28*(.5+.5*Math.sin(phase*8));const g=c.createLinearGradient(-22,0,-48-flicker*5,0);g.addColorStop(0,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=.72+.2*flicker;c.strokeStyle=g;c.lineWidth=1.8+flicker*.8;c.beginPath();c.moveTo(-21,0);c.lineTo(-47,0);c.stroke();c.restore();
 }
 function drawHalley(c,x,y,tailAngle,size,spin,sparklePhase){
  c.save();c.translate(x,y);c.rotate(tailAngle);
  const s=size/9;c.scale(s,s);
  // A comet has two distinct tails: a broad, gently curved dust tail and
  // a narrower, straighter ion tail. Both point away from the Sun, not
  // mechanically backwards along the direction of travel.
  const coma=c.createRadialGradient(0,0,1,0,0,12);
  coma.addColorStop(0,'rgba(255,255,255,.32)');
  coma.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=coma;c.beginPath();c.arc(0,0,12,0,TAU);c.fill();

  const ion=c.createLinearGradient(-3,0,-78,0);
  ion.addColorStop(0,'rgba(255,255,255,.88)');
  ion.addColorStop(.18,'rgba(255,255,255,.62)');
  ion.addColorStop(.62,'rgba(255,255,255,.18)');
  ion.addColorStop(1,'rgba(255,255,255,0)');
  c.strokeStyle=ion;c.lineWidth=2.1;c.beginPath();
  c.moveTo(-3,0);c.lineTo(-78,0);c.stroke();

  const dust=c.createLinearGradient(-2,0,-66,0);
  dust.addColorStop(0,'rgba(255,255,255,.76)');
  dust.addColorStop(.22,'rgba(255,255,255,.48)');
  dust.addColorStop(.72,'rgba(255,255,255,.10)');
  dust.addColorStop(1,'rgba(255,255,255,0)');
  c.strokeStyle=dust;c.lineWidth=7.2;c.beginPath();
  c.moveTo(-3,0);c.bezierCurveTo(-20,-5,-42,-11,-66,-7);c.stroke();
  c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1.1;c.beginPath();
  c.moveTo(-4,1);c.quadraticCurveTo(-34,-14,-70,-8);c.stroke();

  // Small irregular icy nucleus with a soft sunlit coma.
  c.save();c.rotate(spin*.12);
  c.fillStyle='#fff';c.beginPath();
  c.moveTo(4.6,-.2);c.lineTo(2.6,-3.5);c.lineTo(-1.1,-4.1);
  c.lineTo(-4.2,-1.7);c.lineTo(-3.5,2.2);c.lineTo(-.4,4.1);
  c.lineTo(3.1,2.8);c.closePath();c.fill();
  c.restore();

  // Sparse dust grains peel gently from the broad tail.
  for(let k=0;k<6;k++){
   const t=k/6,tw=.3+.7*(.5+.5*Math.sin(sparklePhase+k*1.73));
   const sx=-8-t*57,sy=-2-t*5+Math.sin(sparklePhase*.45+k*1.8)*(1+t*5);
   c.globalAlpha=tw*.72;c.fillStyle='#fff';c.beginPath();
   c.arc(sx,sy,k%3===0?.9:.55,0,TAU);c.fill();
  }
  c.restore();
 }
 function drawOrion(c,x,y,a,size,thrusterPhase){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/70,size/70);
  c.globalAlpha=.98;c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=1.15;
  // Short service module behind the conical crew capsule.
  c.fillRect(-24,-7,22,14);c.strokeRect(-24,-7,22,14);
  c.fillRect(-19,-11,7,4);c.fillRect(-19,7,7,4);
  // Blunt conical crew module and broad heat shield: clearly capsule-shaped.
  c.beginPath();c.moveTo(-3,-11);c.lineTo(12,-8);c.lineTo(23,-3);c.lineTo(23,3);c.lineTo(12,8);c.lineTo(-3,11);c.closePath();c.fill();
  c.beginPath();c.ellipse(22,0,3.2,5.2,0,0,TAU);c.stroke();
  // Small windows.
  c.globalAlpha=.65;c.fillStyle='rgba(20,35,55,.9)';c.beginPath();c.arc(8,-2.5,1.6,0,TAU);c.arc(8,2.5,1.6,0,TAU);c.fill();
  // Pulsed white RCS jets, fired from alternating sides as it maneuvers.
  const pulse=.45+.55*(.5+.5*Math.sin(thrusterPhase*2.8));
  c.globalAlpha=pulse;c.strokeStyle='#fff';c.lineWidth=2.1;
  const jet=(x1,y1,x2,y2)=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  if(Math.sin(thrusterPhase)>-.25){jet(-7,-10,-13,-17);jet(15,8,21,15);}
  if(Math.cos(thrusterPhase*1.17)>.1){jet(-7,10,-13,17);jet(15,-8,21,-15);}
  // Tiny exhaust glow streaks, deliberately monochrome.
  c.globalAlpha=.55;c.beginPath();c.moveTo(-25,0);c.lineTo(-34,Math.sin(thrusterPhase)*3);c.stroke();
  c.restore();
 }
 function drawHubble(c,x,y,a,size,antennaAngle){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/100,size/100);
  c.globalAlpha=.96;c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=1.4;
  // Hubble-like observatory: compact cylindrical body with a broad, blunt front rim.
  c.beginPath();c.roundRect(-22,-9,44,18,4);c.fill();
  c.beginPath();c.ellipse(-22,0,4,9,0,0,TAU);c.stroke();
  c.beginPath();c.ellipse(22,0,4,9,0,0,TAU);c.stroke();
  // Distinct wide solar wings make the spacecraft read as a satellite, not a narrow rocket.
  c.fillRect(-12,-27,24,13);c.strokeRect(-12,-27,24,13);
  c.fillRect(-12,14,24,13);c.strokeRect(-12,14,24,13);
  c.globalAlpha=.55;c.beginPath();
  for(let xx=-6;xx<=8;xx+=7){c.moveTo(xx,-27);c.lineTo(xx,-14);c.moveTo(xx,14);c.lineTo(xx,27);}
  c.stroke();
  // Side-mounted antenna boom and rotating dish, offset from the telescope axis.
  c.globalAlpha=.98;c.lineWidth=1.8;c.beginPath();c.moveTo(13,-7);c.lineTo(28,-18);c.stroke();
  c.save();c.translate(29,-19);c.rotate(antennaAngle);
  c.fillStyle='#fff';c.beginPath();c.ellipse(0,0,6.5,3.2,-.25,0,TAU);c.fill();
  c.strokeStyle='rgba(255,255,255,.95)';c.beginPath();c.moveTo(-6.5,0);c.lineTo(6.5,0);c.stroke();c.restore();
  // Small equipment pod opposite the antenna balances the silhouette.
  c.fillRect(-30,-4,7,8);c.strokeRect(-30,-4,7,8);
  c.restore();
 }
 function drawAsteroid(c,x,y,a,size,spin,tailLength){
  c.save();c.translate(x,y);c.rotate(a);c.rotate(spin);
  const s=size/10;c.scale(s,s);
  // Tail points left in local coordinates, opposite the direction of travel.
  const plume=c.createLinearGradient(-10,0,-10-tailLength,0);
  plume.addColorStop(0,'rgba(255,255,255,.58)');
  plume.addColorStop(.35,'rgba(255,255,255,.22)');
  plume.addColorStop(1,'rgba(255,255,255,0)');
  c.strokeStyle=plume;c.lineWidth=2.1;c.beginPath();c.moveTo(-7,0);c.lineTo(-10-tailLength,0);c.stroke();
  c.globalAlpha=.98;c.fillStyle='#fff';c.beginPath();
  c.moveTo(5,-1);c.lineTo(2.5,-4);c.lineTo(-1.5,-3.3);c.lineTo(-4.2,-.5);
  c.lineTo(-2.5,3.2);c.lineTo(1.8,4);c.lineTo(4.5,1.8);c.closePath();c.fill();
  c.restore();
 }
 function drawSatellite(c,x,y,a,size){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/40,size/40);
  c.globalAlpha=.92;c.strokeStyle='rgba(255,255,255,.96)';c.fillStyle='rgba(255,255,255,.72)';c.lineWidth=1;
  c.fillRect(-5,-4,10,8);c.strokeRect(-5,-4,10,8);
  c.fillRect(-19,-6,11,12);c.fillRect(8,-6,11,12);
  c.strokeRect(-19,-6,11,12);c.strokeRect(8,-6,11,12);
  c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(0,-4);c.lineTo(0,-12);c.lineTo(4,-15);c.moveTo(0,4);c.lineTo(0,10);c.stroke();
  c.beginPath();c.arc(0,-16,2,0,TAU);c.stroke();c.restore();
 }

 function drawBlackHole(c,x,y,size,phase,fade){
  // A black hole should read as a dark event horizon with a thin, edge-on
  // accretion disc — never as an eye, eyelid or broad white blob.
  c.save();
  c.translate(x,y);
  c.globalAlpha=fade;
  c.rotate(-.10+Math.sin(phase*.18)*.018);

  // Narrow, flattened disc behind the event horizon. Its elliptical profile
  // stays horizontal and the central sphere hides the middle of the disc.
  c.fillStyle='#fff';
  c.beginPath();
  c.ellipse(0,0,size*1.30,size*.245,-.025,0,TAU);
  c.fill();

  // A fine inner dark lane gives the disc a little depth without a glow.
  c.fillStyle='rgba(0,0,0,.82)';
  c.beginPath();
  c.ellipse(0,0,size*.91,size*.105,-.025,0,TAU);
  c.fill();

  // Event horizon: the dominant feature is a clean, solid black sphere.
  c.fillStyle='#000';
  c.beginPath();
  c.ellipse(0,-size*.012,size*.49,size*.53,-.035,0,TAU);
  c.fill();

  // Subtle narrow highlight on the far side of the disc, broken by the
  // event horizon so the result reads as a lensing ring, not an eye.
  c.strokeStyle='rgba(255,255,255,.72)';
  c.lineWidth=Math.max(.7,size*.018);
  c.beginPath();
  c.ellipse(0,0,size*1.22,size*.205,-.025,Math.PI*1.08,Math.PI*1.92);
  c.stroke();
  c.restore();
 }

 function drawSkyCrane(c,x,y,a,size,phase=0,thrust=0){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/100,size/100);
  c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=2.2;c.lineCap='round';c.lineJoin='round';c.globalAlpha=.97;
  // Compact descent stage with four landing/thrust outriggers.
  c.beginPath();c.roundRect(-27,-12,54,24,7);c.fill();
  c.fillRect(-12,-19,24,7);c.beginPath();c.arc(0,-18,5,0,TAU);c.fill();
  for(const side of [-1,1]){c.beginPath();c.moveTo(side*19,7);c.lineTo(side*34,22);c.lineTo(side*39,22);c.stroke();c.beginPath();c.moveTo(side*25,1);c.lineTo(side*39,-12);c.lineTo(side*44,-12);c.stroke();}
  // Four downward-facing engine bells and flickering landing jets.
  for(const xx of [-22,-8,8,22]){c.beginPath();c.moveTo(xx-4,12);c.lineTo(xx-3,19);c.lineTo(xx+3,19);c.lineTo(xx+4,12);c.closePath();c.fill();if(thrust>.02){const flick=.68+.32*(.5+.5*Math.sin(phase*18+xx*.73));const plume=30+thrust*(10+5*Math.sin(phase*13+xx));c.globalAlpha=thrust*flick;c.beginPath();c.moveTo(xx-3,20);c.lineTo(xx,plume);c.lineTo(xx+3,20);c.closePath();c.fill();c.globalAlpha=.97;}}
  c.restore();
 }
 function drawMarsRover(c,x,y,a,size,drive=0){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/100,size/100);c.fillStyle='#fff';c.strokeStyle='#fff';c.lineWidth=2.2;c.lineJoin='round';c.globalAlpha=.97;
  // Six-wheel rover chassis, articulated suspension, mast and instrument head.
  c.beginPath();c.roundRect(-30,-10,60,19,4);c.fill();
  c.fillRect(-19,-19,38,9);c.fillRect(-8,-29,16,11);c.beginPath();c.arc(0,-34,7,0,TAU);c.fill();
  c.beginPath();c.moveTo(-22,7);c.lineTo(-34,18);c.lineTo(-38,18);c.moveTo(22,7);c.lineTo(34,18);c.lineTo(38,18);c.moveTo(0,7);c.lineTo(0,18);c.stroke();
  // Six clean, solid clipart wheels: three visible on each side, no spoke detail.
  for(const xx of [-29,0,29]){c.beginPath();c.arc(xx,20,8.5,0,TAU);c.fill();}
  c.globalAlpha=.65;c.beginPath();c.moveTo(-24,-5);c.lineTo(-14,-5);c.moveTo(14,-5);c.lineTo(24,-5);c.stroke();
  c.restore();
 }
 function drawAstronaut(c,x,y,a,size,shielding,phase=0,swimming=false,lassoing=false){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/100,size/100);
  // Detailed EVA suit silhouette: compact torso, articulated joints,
  // rectangular PLSS backpack, layered gloves and magnetic boots.
  c.lineCap='round';c.lineJoin='round';
  c.fillStyle='#dce8ef';c.strokeStyle='#fff';c.lineWidth=2.4;
  // Life-support backpack with dark equipment panel and twin fittings.
  c.beginPath();c.roundRect(-21,-13,15,34,5);c.fill();c.stroke();
  c.fillStyle='#8298a7';c.beginPath();c.roundRect(-20,-8,4,22,1.5);c.fill();
  c.fillStyle='#fff';c.beginPath();c.roundRect(-18,-17,9,6,2);c.fill();
  // Main suit torso with shoulder and waist shaping.
  c.fillStyle='#f8fbfd';c.beginPath();c.moveTo(-15,-17);c.quadraticCurveTo(-20,-22,-12,-22);
  c.quadraticCurveTo(0,-25,13,-21);c.quadraticCurveTo(20,-20,15,-13);
  c.lineTo(12,7);c.quadraticCurveTo(10,13,6,17);c.lineTo(5,19);
  c.lineTo(-7,19);c.quadraticCurveTo(-12,15,-14,8);c.closePath();c.fill();c.stroke();
  // Reinforced shoulder caps and broad upper-chest silhouette give the suit an adult, athletic build.
  c.fillStyle='#e5eef4';c.beginPath();c.ellipse(-14,-16,7,5,-.25,0,TAU);c.ellipse(14,-16,7,5,.25,0,TAU);c.fill();c.stroke();
  c.fillStyle='#fff';c.beginPath();c.moveTo(-9,-3);c.quadraticCurveTo(0,1,9,-3);c.lineTo(7,5);c.quadraticCurveTo(0,9,-7,5);c.closePath();c.fill();
  // Chest control panel, harness straps and waist ring.
  c.fillStyle='#91a8b8';c.beginPath();c.roundRect(-5,-11,12,10,2);c.fill();
  c.fillStyle='#fff';c.fillRect(-3,-9,3,2);c.fillRect(2,-9,3,2);
  c.strokeStyle='#9aafbd';c.lineWidth=1.7;c.beginPath();c.moveTo(-9,-14);c.lineTo(8,8);c.moveTo(9,-14);c.lineTo(-7,8);c.stroke();
  c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(-10,14);c.lineTo(11,14);c.stroke();
  // Helmet: broad pressure-shell rim, dark gold-blue reflective visor and glint.
  c.fillStyle='#f8fbfd';c.strokeStyle='#fff';c.lineWidth=2.5;
  c.beginPath();c.ellipse(1,-27,14,14,0,0,TAU);c.fill();c.stroke();
  c.fillStyle='#172b3b';c.beginPath();c.ellipse(3,-27,10.2,10.8,-.12,0,TAU);c.fill();
  c.strokeStyle='#8fc5e4';c.lineWidth=1.6;c.beginPath();c.arc(3,-27,9,-2.35,-.55);c.stroke();
  c.fillStyle='rgba(225,246,255,.8)';c.beginPath();c.ellipse(0,-32,2.4,1.1,-.5,0,TAU);c.fill();c.save();c.globalAlpha=.25+.2*(.5+.5*Math.sin(phase*1.4));c.strokeStyle='#fff';c.lineWidth=1.1;c.beginPath();c.arc(3,-27,8.2,-2.05+Math.sin(phase*.35)*.12,-1.35+Math.sin(phase*.35)*.12);c.stroke();c.restore();
  // Neck seal and helmet side comms.
  c.fillStyle='#8298a7';c.beginPath();c.roundRect(-5,-15,12,4,2);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(14,-27,2.5,0,TAU);c.fill();
  // Articulated arms: broad upper arms, visible elbow bends and compact gloves.
  // Idle motion is restrained; swimming uses alternating strokes rather than mirrored flailing.
  const limb=(pts,width,color)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=color;c.lineWidth=width;c.stroke();};
  const stroke=Math.sin(phase*5.8),kick=Math.sin(phase*5.8+1.1),idle=Math.sin(phase*1.25);
  if(shielding){
   limb([[-12,-15],[-22,-20],[-19,-29],[-12,-35]],8,'#f8fbfd');
   limb([[12,-15],[22,-21],[18,-30],[10,-35]],8,'#f8fbfd');
   limb([[-12,-35],[-6,-39]],5.5,'#dce8ef');limb([[10,-35],[5,-40]],5.5,'#dce8ef');
   c.fillStyle='#fff';c.beginPath();c.ellipse(-5,-40,5,4,-.5,0,TAU);c.ellipse(4,-41,5,4,.5,0,TAU);c.fill();
  }else if(swimming){
   const lReach=stroke*8,rReach=-stroke*8;
   limb([[-13,-15],[-23,-9-lReach*.35],[-31,-16-lReach]],8,'#f8fbfd');
   limb([[13,-15],[23,-9-rReach*.35],[31,-16-rReach]],8,'#f8fbfd');
   c.fillStyle='#fff';c.beginPath();c.ellipse(-33,-17-lReach,5,4,-.5,0,TAU);c.ellipse(33,-17-rReach,5,4,.5,0,TAU);c.fill();
  }else if(lassoing){
   // One-handed lasso throw: shoulder rotates forward, elbow pumps and wrist
   // flicks rhythmically so the tether visibly originates at the glove.
   const wind=Math.sin(phase*10.5),flick=Math.sin(phase*18);
   limb([[-13,-15],[-23,-8-idle*2],[-20,1-idle*3]],8,'#f8fbfd');
   limb([[13,-15],[23,-23-wind*2],[29,-34-wind*3],[35,-39+flick*2]],8.5,'#f8fbfd');
   c.strokeStyle='#9aafbd';c.lineWidth=1.5;c.beginPath();c.arc(23,-23-wind*2,3.2,0,TAU);c.stroke();
   c.fillStyle='#fff';c.beginPath();c.ellipse(36,-40+flick*2,5.2,4.2,-.45,0,TAU);c.fill();
  }else{
   limb([[-13,-15],[-23,-8-idle*2],[-20,1-idle*3]],8,'#f8fbfd');
   limb([[13,-15],[23,-8+idle*2],[20,1+idle*3]],8,'#f8fbfd');
   c.fillStyle='#fff';c.beginPath();c.ellipse(-21,3-idle*3,5,4,-.4,0,TAU);c.ellipse(21,3+idle*3,5,4,.4,0,TAU);c.fill();
  }
  // Elbow joint rings and suit cuffs.
  c.strokeStyle='#8ea5b4';c.lineWidth=1.5;c.beginPath();c.arc(-21,-9,3,0,TAU);c.arc(21,-9,3,0,TAU);c.stroke();
  // Strong, bent legs with independent knee articulation; alternating bicycle kick while evading.
  if(swimming){
   limb([[-5,17],[-13,25+kick*5],[-22,31+kick*8]],8.5,'#f8fbfd');
   limb([[7,17],[15,25-kick*5],[24,31-kick*8]],8.5,'#f8fbfd');
   c.strokeStyle='#9aafbd';c.lineWidth=1.5;c.beginPath();c.arc(-13,25+kick*5,3.4,0,TAU);c.arc(15,25-kick*5,3.4,0,TAU);c.stroke();
   c.fillStyle='#dce8ef';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.roundRect(-29,28+kick*8,13,7,3);c.roundRect(19,28-kick*8,13,7,3);c.fill();c.stroke();
  }else{
   const tuck=shielding?5:0;
   limb([[-5,17],[-13,25+tuck+idle*1.5],[-19,32+tuck+idle*2]],8.5,'#f8fbfd');
   limb([[7,17],[15,25+tuck-idle*1.5],[22,31+tuck-idle*2]],8.5,'#f8fbfd');
   c.strokeStyle='#9aafbd';c.lineWidth=1.5;c.beginPath();c.arc(-13,25+tuck+idle*1.5,3.4,0,TAU);c.arc(15,25+tuck-idle*1.5,3.4,0,TAU);c.stroke();
   c.fillStyle='#dce8ef';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.roundRect(-26,29+tuck+idle*2,13,7,3);c.roundRect(17,28+tuck-idle*2,13,7,3);c.fill();c.stroke();
  }
  // Compact suit seams and wrist cuff details.
  c.strokeStyle='#a5bac7';c.lineWidth=1.1;c.beginPath();c.moveTo(-14,-4);c.lineTo(-9,5);c.moveTo(14,-4);c.lineTo(10,5);c.stroke();
  c.restore();
 }
 function drawPanel(panel,dt,now,animate){
  const r=panel.r;if(!r||r.width<80||r.height<45||r.bottom<0||r.top>H)return;
  const x0=clamp(r.left,0,W),y0=clamp(r.top,0,H),x1=clamp(r.right,0,W),y1=clamp(r.bottom,0,H);if(x1<=x0||y1<=y0)return;
  // Hard boundary: every cosmic effect is clipped to the inside of its own
  // blue panel. A tiny inset prevents antialiased edge pixels from spilling
  // onto the surrounding white page; blocked controls remain cut out.
  const clipInset=1.5,clipLeft=x0+clipInset,clipTop=y0+clipInset;
  const clipRight=x1-clipInset,clipBottom=y1-clipInset;
  if(clipRight<=clipLeft||clipBottom<=clipTop)return;
  ctx.save();
  // First apply an independent, non-negotiable panel clip. This is essential
  // on mobile: protected-control rectangles can extend beyond their panel.
  // If those rectangles are included in one even-odd path, their outside
  // portions can accidentally create visible regions beyond the blue box.
  ctx.beginPath();ctx.rect(clipLeft,clipTop,clipRight-clipLeft,clipBottom-clipTop);ctx.clip();
  // Then cut protected controls out, intersecting every exclusion with this
  // panel. The first clip remains active even if exclusions overlap.
  ctx.beginPath();ctx.rect(clipLeft,clipTop,clipRight-clipLeft,clipBottom-clipTop);
  panel.blocked.forEach(b=>{
   const left=Math.max(clipLeft,b.left),top=Math.max(clipTop,b.top);
   const right=Math.min(clipRight,b.right),bottom=Math.min(clipBottom,b.bottom);
   if(right>left&&bottom>top)ctx.rect(left,top,right-left,bottom-top);
  });
  ctx.clip('evenodd');
  const cx=(x0+x1)/2,cy=(y0+y1)/2,scale=Math.min(r.width,r.height),small=r.height<95;
  // Collect only moving animated bodies; proximity checks happen after their
  // positions are updated so incidental visual intersections can be detected.
  const movingThings=[];
  // Fine moving particles fill the full blue panel, including behind text and buttons.
  panel.sparks.forEach(s=>{const sx=s.x*r.width,sy=s.y*r.height;if(animate){s.phase+=s.speed*dt;s.x+=Math.cos(s.phase*.37)*.000035;s.y+=Math.sin(s.phase*.29)*.000025;if(s.x<.015)s.x=.985;if(s.x>.985)s.x=.015;if(s.y<.02)s.y=.98;if(s.y>.98)s.y=.02;}const pulse=.5+.5*Math.sin(s.phase);ctx.globalAlpha=.24+.48*pulse;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(r.left+sx,r.top+sy,s.size,0,TAU);ctx.fill();if(s.streak&&pulse>.78){ctx.globalAlpha=.36;ctx.strokeStyle='#fff';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(r.left+sx,r.top+sy);ctx.lineTo(r.left+sx-s.size*5,r.top+sy+s.size*1.6);ctx.stroke();}});
  panel.bodies.forEach((b,i)=>{
   if(animate){b.phase+=b.speed*b.direction*dt;b.rotation+=b.spin*b.direction*dt;b.moonPhase+=b.moonSpeed*dt;}
   const bx=x0+r.width*b.anchorX,by=y0+r.height*b.anchorY;
   const rx=r.width*b.orbitX,ry=r.height*b.orbitY*b.orbitEcc;
   const ox=Math.cos(b.phase)*rx,oy=Math.sin(b.phase)*ry;
   const px=bx+ox*Math.cos(b.orbitTilt)-oy*Math.sin(b.orbitTilt),py=by+ox*Math.sin(b.orbitTilt)+oy*Math.cos(b.orbitTilt),pr=small?Math.max(1.8,b.radius*.72):b.radius;
   {
    planet(ctx,px,py,pr,b.rotation,b.ring&&!small);
    if(b.moons){for(let m=0;m<b.moons;m++){const a=b.moonPhase+m*(TAU/b.moons),rad=(small?b.moonRadius*.62:b.moonRadius)+m*(small?2.2:4),mx=px+Math.cos(a)*rad,my=py+Math.sin(a)*rad*.62;ctx.globalAlpha=.28;ctx.lineWidth=.55;ctx.beginPath();ctx.ellipse(px,py,rad,rad*.62,b.orbitTilt,0,TAU);ctx.stroke();ctx.globalAlpha=.95;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mx,my,small?(m===0?1.5:1.05):(m===0?2.2:1.45),0,TAU);ctx.fill();}}
   }
  });
  if(!small||panel.el.matches('.header,.social-intro')){
   const issOrbit=Math.max(4,Math.min(r.width,r.height)*.065);
   const issCx=x0+r.width*.84,issCy=y0+r.height*.19;
   if(!panel.issBody)panel.issBody={x:issCx+Math.cos(panel.iss)*issOrbit,y:issCy+Math.sin(panel.iss)*issOrbit,vx:0,vy:0};
   const iss=panel.issBody;
   if(animate){
    panel.iss+=CONFIG.issAngularSpeed*dt;
    if(iss._kgCaptured){iss.x+=iss.vx*dt;iss.y+=iss.vy*dt;}
    else{iss.x=issCx+Math.cos(panel.iss)*issOrbit;iss.y=issCy+Math.sin(panel.iss)*issOrbit;iss.vx=-Math.sin(panel.iss)*issOrbit*CONFIG.issAngularSpeed;iss.vy=Math.cos(panel.iss)*issOrbit*CONFIG.issAngularSpeed;}
   }
   const issSize=clamp(scale*.105,small?8:11,small?12:17);
   drawISS(ctx,iss.x,iss.y,panel.iss+.35,issSize,now*.001);
   movingThings.push({id:'iss',x:iss.x,y:iss.y,r:small?4.5:6,vx:iss.vx,vy:iss.vy,obj:iss});
   if(animate&&now>=panel.nextVoyager&&!panel.voyager){const dir=Math.random()<.5?1:-1;const lane=panel.safePoints.length?panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]:{y:r.height*.5};panel.voyager=lane?{x:dir>0?x0-18:x1+18,y:y0+lane.y,baseY:y0+lane.y,vx:dir*rand(38,56),vy:rand(-10,10),phase:rand(0,TAU),arc:rand(10,24)*(Math.random()<.5?-1:1)}:null;panel.nextVoyager=now+rand(...CONFIG.voyagerInterval);}
   if(panel.voyager){const v=panel.voyager;if(animate){v.x+=v.vx*dt;v.phase+=dt*.7;v.y+=v.vy*dt;v.y=v.baseY+v.arc*Math.sin(v.phase);}drawVoyager(ctx,v.x,v.y,Math.atan2(v.vy+v.arc*.7*Math.cos(v.phase),v.vx),v.phase);movingThings.push({id:'voyager',x:v.x,y:v.y,r:8,vx:v.vx,vy:v.vy+v.arc*.7*Math.cos(v.phase),obj:v});if(v.x<x0-70||v.x>x1+70)panel.voyager=null;}
   if(animate&&now>=panel.nextHalley&&!panel.halley){
    const dir=Math.random()<.5?1:-1;
    const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.5};
    const startX=dir>0?x0-90:x1+90;
    const endX=dir>0?x1+90:x0-90;
    panel.halley={x:startX,y:y0+lane.y,startX,endX,baseY:y0+lane.y,
     vx:dir*rand(78,112),baseSpeed:rand(78,112),dir,
     phase:rand(0,TAU),arc:rand(16,34)*(Math.random()<.5?-1:1),
     spin:rand(0,TAU),sparkle:rand(0,TAU),sparkleSpeed:rand(2.2,3.8)};
    panel.nextHalley=now+rand(...CONFIG.halleyInterval);
   }
   if(panel.halley){
    const hc=panel.halley;
    if(animate){
     hc.phase+=dt*.22;
     const progress=clamp(Math.abs(hc.x-hc.startX)/Math.max(1,Math.abs(hc.endX-hc.startX)),0,1);
     // Gradual orbital-looking arc with a modest perihelion-style speed-up
     // through the middle of the pass, then a smooth slow-down.
     const speedFactor=.78+.34*Math.sin(progress*Math.PI);
     hc.x+=hc.dir*hc.baseSpeed*speedFactor*dt;
     hc.y=hc.baseY+hc.arc*Math.sin(progress*Math.PI);
     hc.sparkle+=hc.sparkleSpeed*dt;
    }
    // The panel centre acts as the distant Sun reference: both tails remain
    // anti-solar while the comet follows its own gently curved path.
    const tailAngle=Math.atan2(hc.y-(y0+r.height*.5),hc.x-(x0+r.width*.5));
    drawHalley(ctx,hc.x,hc.y,tailAngle,((clamp(scale*.19,small?12:17,small?16:24))*1.5)*.15,hc.spin,hc.sparkle);const cometProgress=clamp(Math.abs(hc.x-hc.startX)/Math.max(1,Math.abs(hc.endX-hc.startX)),0,1);const cometVx=hc.dir*hc.baseSpeed*(.78+.34*Math.sin(cometProgress*Math.PI));const cometVy=hc.arc*Math.PI*Math.cos(cometProgress*Math.PI)*Math.abs(cometVx)/Math.max(1,Math.abs(hc.endX-hc.startX));movingThings.push({id:'halley',x:hc.x,y:hc.y,r:5,vx:cometVx,vy:cometVy,obj:hc});
    if((hc.dir>0&&hc.x>x1+120)||(hc.dir<0&&hc.x<x0-120))panel.halley=null;
   }
   if(animate&&now>=panel.nextOrion&&!panel.orion){
    const dir=Math.random()<.5?1:-1;
    const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.5};
    panel.orion={x:dir>0?x0-70:x1+70,y:y0+lane.y,vx:dir*rand(88,118),vy:rand(-18,18),heading:dir>0?0:Math.PI,turn:rand(.28,.7)*(Math.random()<.5?-1:1),phase:rand(0,TAU),phaseSpeed:rand(2.2,3.4),maneuver:rand(0,TAU)};
    panel.nextOrion=now+rand(...CONFIG.orionInterval);
   }
   if(panel.orion){
    const o=panel.orion;
    if(animate){
     o.phase+=o.phaseSpeed*dt;o.maneuver+=dt;
     // Orion alone predicts nearby object's closest approach and steers away
     // before a collision. Other spacecraft retain their original trajectories.
     let avoidX=0,avoidY=0,avoidStrength=0;
     movingThings.forEach(other=>{
      if(!other||other.id==='orion'||!other.obj)return;
      const rx=o.x-other.x,ry=o.y-other.y;
      const rvx=o.vx-(other.vx||0),rvy=o.vy-(other.vy||0);
      const vv=rvx*rvx+rvy*rvy;
      if(vv<1)return;
      const t=-(rx*rvx+ry*rvy)/vv;
      if(t<=0||t>1.65)return;
      const cx=rx+rvx*t,cy=ry+rvy*t,d=Math.hypot(cx,cy);
      const safe=(other.r||8)+19;
      if(d<safe+35){
       const urgency=clamp((safe+35-d)/35,0,1)*(1-t/1.65);
       const inv=Math.max(1,d);
       avoidX+=(cx/inv)*urgency;avoidY+=(cy/inv)*urgency;
       avoidStrength=Math.max(avoidStrength,urgency);
      }
     });
     const avoidAngle=Math.hypot(avoidX,avoidY)>.01?Math.atan2(-avoidY,-avoidX):o.heading;
     const cruiseAngle=Math.atan2(o.vy+Math.sin(o.maneuver*1.1)*16,o.vx+Math.cos(o.maneuver*.72)*22);
     const desired=avoidStrength>.08
      ?Math.atan2(Math.sin(avoidAngle)*avoidStrength+Math.sin(cruiseAngle)*(1-avoidStrength),Math.cos(avoidAngle)*avoidStrength+Math.cos(cruiseAngle)*(1-avoidStrength))
      :cruiseAngle;
     let delta=Math.atan2(Math.sin(desired-o.heading),Math.cos(desired-o.heading));
     o.heading+=clamp(delta,-o.turn*dt,o.turn*dt);
     const speed=Math.hypot(o.vx,o.vy);
     const thrust=avoidStrength>.08?20:12;
     o.vx+=Math.cos(o.heading)*thrust*dt;o.vy+=Math.sin(o.heading)*thrust*dt;
     const damp=.992;o.vx*=damp;o.vy*=damp;
     const cap=165;if(Math.hypot(o.vx,o.vy)>cap){const k=cap/Math.hypot(o.vx,o.vy);o.vx*=k;o.vy*=k;}
     o.x+=o.vx*dt;o.y+=o.vy*dt;
    }
    drawOrion(ctx,o.x,o.y,o.heading,clamp(scale*.30,small?24:34,small?30:46),o.phase);movingThings.push({id:'orion',x:o.x,y:o.y,r:12,vx:o.vx,vy:o.vy,obj:o});
    if(o.x<x0-130||o.x>x1+130||o.y<y0-110||o.y>y1+110)panel.orion=null;
   }
   if(animate&&now>=panel.nextHubble&&!panel.hubble){
    const dir=Math.random()<.5?1:-1;
    const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.5};
    panel.hubble={x:dir>0?x0-95:x1+95,y:y0+lane.y,baseY:y0+lane.y,vx:dir*rand(8,12),vy:rand(-1.5,1.5),phase:rand(0,TAU),drift:rand(3,6),antenna:rand(0,TAU),antennaSpeed:rand(.28,.52)*(Math.random()<.5?-1:1)};
    panel.nextHubble=now+rand(...CONFIG.hubbleInterval);
   }
   if(panel.hubble){
    const hb=panel.hubble;
    if(animate){hb.x+=hb.vx*dt;hb.phase+=dt*.24;hb.y=hb.baseY+Math.sin(hb.phase)*hb.drift+hb.vy*dt;hb.antenna+=hb.antennaSpeed*dt;}
    drawHubble(ctx,hb.x,hb.y,Math.atan2(hb.vy,hb.vx),clamp(scale*.42,small?38:55,small?48:76)*.5,hb.antenna);movingThings.push({id:'hubble',x:hb.x,y:hb.y,r:14,vx:hb.vx,vy:hb.vy,obj:hb});
    if(hb.x<x0-150||hb.x>x1+150)panel.hubble=null;
   }
   if(animate&&now>=panel.nextAsteroid&&!panel.asteroid){
    const dir=Math.random()<.5?1:-1;
    const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.5};
    const vx=dir*rand(430,650);
    panel.asteroid={x:dir>0?x0-35:x1+35,y:y0+lane.y,vx,vy:rand(-95,95),spin:rand(0,TAU),spinSpeed:rand(3.2,6.5)*(Math.random()<.5?-1:1),wobble:rand(0,TAU),wobbleSpeed:rand(5,9),size:rand(2.4,4.3),tail:rand(8,15)};
    panel.nextAsteroid=now+rand(...CONFIG.asteroidInterval);
   }
   if(panel.asteroid){
    const ast=panel.asteroid;
    if(animate){ast.x+=ast.vx*dt;ast.y+=ast.vy*dt;ast.spin+=ast.spinSpeed*dt;ast.wobble+=ast.wobbleSpeed*dt;}
    const wobble=Math.sin(ast.wobble)*.20;
    drawAsteroid(ctx,ast.x,ast.y,Math.atan2(ast.vy,ast.vx)+wobble,ast.size,ast.spin,ast.tail);movingThings.push({id:'asteroid',x:ast.x,y:ast.y,r:ast.size+3,vx:ast.vx,vy:ast.vy,obj:ast});
    if(ast.x<x0-100||ast.x>x1+100||ast.y<y0-100||ast.y>y1+100)panel.asteroid=null;
   }
   // A small astronaut drifts slowly through the scene. When a fast asteroid
   // approaches, the astronaut raises both arms and gently pushes away.
   if(animate&&now>=panel.nextAstronaut&&!panel.astronaut){
    const dir=Math.random()<.5?1:-1;
    const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.48};
    panel.astronaut={x:dir>0?x0-35:x1+35,y:y0+lane.y,
     vx:dir*rand(9,15),vy:rand(-4,4),phase:rand(0,TAU),evadeUntil:0,
     evadeX:0,evadeY:0,lastThreatReact:0,bodyRoll:0,lasso:null,nextLasso:now+rand(2200,5200)};
    panel.nextAstronaut=now+rand(19000,28000);
   }
   if(panel.astronaut){
    const au=panel.astronaut;
    if(animate){
     // The astronaut no longer performs collision-avoidance manoeuvres.
     // Orion is the sole craft with predictive collision-avoidance behaviour.
     au.phase+=dt*.65;
     au.vx+=(Math.sin(au.phase*.7)*7-au.vx)*Math.min(1,dt*.16);
     au.vy+=(Math.cos(au.phase)*5-au.vy)*Math.min(1,dt*.16);
     au.x+=au.vx*dt;au.y+=au.vy*dt;
     au.bodyRoll+=(clamp(au.vy*.002,-.18,.18)-au.bodyRoll)*Math.min(1,dt*2.2);
     au.y=clamp(au.y,y0+25,y1-25);
    }
    const shielding=now<au.evadeUntil,swimming=!shielding&&now<au.swimUntil;
    const swimAngle=swimming?Math.atan2(au.vy,au.vx):au.bodyRoll+Math.sin(au.phase*.45)*.045;
    drawAstronaut(ctx,au.x,au.y,swimAngle,clamp(scale*.22,small?16:23,small?20:29),shielding,au.phase,swimming,!!au.lasso);
    movingThings.push({id:'astronaut',x:au.x,y:au.y,r:9,vx:au.vx,vy:au.vy,obj:au});
    if(au.x<x0-65||au.x>x1+65){panel.astronaut=null;panel.nextAstronaut=now+rand(9000,15000);}
   }
   if(animate&&now>=panel.nextSatellite&&!panel.satellite){const dir=Math.random()<.5?1:-1;const lane=panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]||{y:r.height*.5};panel.satellite={x:dir>0?x0-30:x1+30,y:y0+lane.y,baseY:y0+lane.y,vx:dir*rand(52,72),vy:rand(-8,8),phase:rand(0,TAU),arc:rand(9,20)*(Math.random()<.5?-1:1),spin:rand(0,TAU)};panel.nextSatellite=now+rand(...CONFIG.satelliteInterval);}
   if(panel.satellite){const sat=panel.satellite;if(animate){sat.x+=sat.vx*dt;sat.phase+=dt*.8;sat.spin+=dt*.32;sat.y=sat.baseY+sat.arc*Math.sin(sat.phase)+sat.vy*dt;}drawSatellite(ctx,sat.x,sat.y,Math.atan2(sat.arc*.8*Math.cos(sat.phase)+sat.vy,sat.vx)+Math.sin(sat.spin)*.06,clamp(scale*.11,small?9:13,small?12:19));movingThings.push({id:'satellite',x:sat.x,y:sat.y,r:9,vx:sat.vx,vy:sat.arc*.8*Math.cos(sat.phase)+sat.vy,obj:sat});if(sat.x<x0-60||sat.x>x1+60)panel.satellite=null;}
   // Mars-style sky-crane: descent stage is protected, rover remains physical;
   // after release the rover free-falls while the crane performs powered escape.
   if(animate&&now>=panel.nextSkyCrane&&!panel.skyCrane&&(!panel.marsRover||panel.marsRover.landed)){
    const sx=clamp(cx+rand(-r.width*.22,r.width*.22),x0+45,x1-45);
    panel.skyCrane={x:sx,y:y0+18,vx:rand(-1,1),vy:0,age:0,phase:rand(0,TAU),stage:1,angle:0};
    panel.marsRover={x:sx,y:y0+45,vx:0,vy:0,age:0,angle:0,landed:false,released:false,roll:0};
    panel.nextSkyCrane=now+rand(19000,28000)+panel.repeatStagger;
   }
   if(panel.skyCrane){
    const crane=panel.skyCrane,rover=panel.marsRover;
    if(animate){
     crane.age+=dt;crane.phase+=dt*2.4;
     if(crane.stage===1){
      const descentSpeed=clamp((y1-y0)*.045,11,17);
      crane.vy+=(descentSpeed+Math.sin(crane.phase*.55)*.65-crane.vy)*Math.min(1,dt*.8);
      crane.x+=Math.sin(crane.phase*.32)*1.3*dt;crane.y+=crane.vy*dt;
      if(rover&&!rover.released){
       rover.age+=dt;rover.vx+=(crane.vx-rover.vx)*Math.min(1,dt*2.5);
       rover.vy=crane.vy;rover.x=crane.x+Math.sin(crane.phase*.42)*1.2;
       rover.y=crane.y+27;
       // Release near the lower quarter; the rover then falls under gravity.
       const releaseY=y0+(y1-y0)*.70;
       if(rover.y>=releaseY){rover.y=releaseY;rover.released=true;rover.vx=crane.vx+rand(-3,3);rover.vy=Math.max(8,crane.vy);crane.stage=2;crane.age=0;crane.vy=-18;crane.vx=rand(-18,18);crane.turn=Math.random()<.5?-1:1;}
      }else{crane.stage=2;crane.age=0;crane.vy=-18;crane.turn=Math.random()<.5?-1:1;}
     }
     if(crane.stage===2){
      const burn=clamp(crane.age/1.1,0,1),turnIn=clamp((crane.age-.45)/1.7,0,1);
      crane.vy-=(62+48*burn)*dt;
      crane.vx+=crane.turn*(8+48*turnIn)*dt+Math.sin(crane.age*1.25)*3*dt;
      crane.vx=clamp(crane.vx,-82,82);crane.y+=crane.vy*dt;crane.x+=crane.vx*dt;
      crane.angle=Math.atan2(-crane.vx,-Math.max(12,-crane.vy));
     }
     if(rover){
      rover.roll+=dt*(rover.landed?.55:1.1);
      if(rover.released&&!rover.landed){rover.vy+=34*dt;rover.x+=rover.vx*dt;rover.y+=rover.vy*dt;rover.vx*=Math.pow(.998,dt*60);}
      // Let the rover fall to the actual panel floor; its wheels touch the
      // bottom edge before it is marked as landed.
      const roverFloorY=y1-clamp(scale*.25,small?19:26,small?24:33)*.29;
      if(rover.released&&!rover.landed&&rover.y>=roverFloorY){rover.y=roverFloorY;rover.vy=0;rover.vx*=.35;rover.landed=true;}
      if(rover.landed){rover.x+=rover.vx*dt;rover.vx*=Math.pow(.94,dt*60);}
     }
    }
    const craneSize=clamp(scale*.22,small?17:24,small?21:29),roverSize=clamp(scale*.25,small?19:26,small?24:33);
    if(rover&&!rover.released&&crane.stage===1){ctx.save();ctx.strokeStyle='rgba(255,255,255,.88)';ctx.lineWidth=1;ctx.setLineDash([3,3]);for(const off of [-13,13]){ctx.beginPath();ctx.moveTo(crane.x+off,crane.y+craneSize*.16);ctx.lineTo(rover.x+off*.72,rover.y-roverSize*.20);ctx.stroke();}ctx.setLineDash([]);ctx.restore();}
    drawSkyCrane(ctx,crane.x,crane.y,crane.angle||0,craneSize,crane.phase,crane.stage===2?1:.72);
    // Descent itself is non-interactable; crane joins collision physics only after detachment.
    if(crane.stage>=2)movingThings.push({id:'skyCrane',x:crane.x,y:crane.y,r:12,vx:crane.vx,vy:crane.vy,obj:crane});
    // Rover is a collision body throughout descent, free-fall, and after touchdown.
    if(rover){drawMarsRover(ctx,rover.x,rover.y,rover.angle,roverSize,rover.roll);movingThings.push({id:'marsRover',x:rover.x,y:rover.y,r:12,vx:rover.vx,vy:rover.vy,obj:rover});if(rover.x<x0-70||rover.x>x1+70||rover.y>y1+100)panel.marsRover=null;}
    if(crane.y<y0-100||crane.x<x0-120||crane.x>x1+120)panel.skyCrane=null;
   }
   if(animate&&now>=panel.nextShip&&!panel.ship){const dir=Math.random()<.5?1:-1;const lane=panel.safePoints.length?panel.safePoints[Math.floor(Math.random()*panel.safePoints.length)]:{y:r.height*.5};panel.ship=lane?{x:dir>0?x0-95:x1+95,y:y0+lane.y,vx:dir*rand(125,155),vy:rand(-10,10),dir,phase:rand(0,TAU),age:0}:null;panel.nextShip=now+rand(...CONFIG.starshipInterval)+panel.repeatStagger;}
   if(panel.ship){const sh=panel.ship;if(animate){sh.age+=dt;sh.phase+=dt*.55;sh.vx+=sh.dir*12*dt;sh.vy+=Math.sin(sh.phase*.7)*2.2*dt;sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;}drawStarship(ctx,sh.x,sh.y,Math.atan2(sh.vy,sh.vx),sh.phase);movingThings.push({id:'starship',x:sh.x,y:sh.y,r:13,vx:sh.vx,vy:sh.vy,obj:sh});if(sh.x<x0-150||sh.x>x1+150)panel.ship=null;}
  }
  // Random astronaut lasso attempts. The loop is a moving physical tether:
  // it can catch a passing craft, then tow the astronaut behind its momentum.
  if(panel.astronaut){
   const au=panel.astronaut;
   if(animate&&!au.lasso&&now>=(au.nextLasso||0)){
    // Prefer a close, fast-moving target with a predictable intercept.
    // The wider acquisition envelope and lower speed threshold create many
    // more viable opportunities without choosing objects the astronaut cannot reach.
    const reach=Math.min(r.width*.56,320);
    const candidates=movingThings
     .filter(m=>m.id!=='astronaut'&&m.id!=='iss'&&m.obj)
     .map(m=>({m,d:Math.hypot(m.x-au.x,m.y-au.y),speed:Math.hypot(m.vx||0,m.vy||0)}))
     .filter(v=>v.d<reach&&v.speed>8)
     .sort((a,b)=>(a.d+a.speed*.16)-(b.d+b.speed*.16));
    if(candidates.length){
     const target=candidates[0].m;
     au.lasso={targetId:target.id,targetObj:target.obj,started:now,phase:'cast',
      fromX:au.x,fromY:au.y,tipX:au.x,tipY:au.y,
      leadX:target.x+(target.vx||0)*.42,leadY:target.y+(target.vy||0)*.42};
    }
    // Retry often enough to catch passing objects, but avoid continuous lasso spam.
    au.nextLasso=now+rand(3200,7200);
   }
   const rope=au.lasso;
   if(rope){
    const target=movingThings.find(m=>m.obj===rope.targetObj&&m.id===rope.targetId);
    if(!target){au.lasso=null;}
    else{
     // World-space position of the raised glove at local suit coordinate (36,-40).
     // Keep the rope anchored to the animated hand, not the astronaut's torso.
     const handScale=clamp(scale*.22,small?16:23,small?20:29)/100;
     const handLX=36*handScale,handLY=-40*handScale;
     const handA=au.bodyRoll+Math.sin(au.phase*.45)*.045;
     const handX=au.x+Math.cos(handA)*handLX-Math.sin(handA)*handLY;
     const handY=au.y+Math.sin(handA)*handLX+Math.cos(handA)*handLY;
     if(animate&&rope.phase==='cast'){
      const progress=clamp((now-rope.started)/620,0,1);
      // Aim slightly ahead of moving targets so the loop meets their path,
      // rather than trailing behind them during the cast.
      const aimX=target.x+(target.vx||0)*.22;
      const aimY=target.y+(target.vy||0)*.22;
      const endX=rope.leadX+(aimX-rope.leadX)*progress;
      const endY=rope.leadY+(aimY-rope.leadY)*progress;
      rope.tipX=handX+(endX-handX)*progress;
      rope.tipY=handY+(endY-handY)*progress;
      if(Math.hypot(target.x-rope.tipX,target.y-rope.tipY)<target.r+16||progress>=1){
       // A generous capture radius makes the astronaut complete most casts.
       rope.phase='tied';rope.tiedAt=now;rope.releaseAt=now+rand(10500,15000);
      }
     }
     if(rope.phase==='tied'){
      const dx=target.x-au.x,dy=target.y-au.y,d=Math.max(1,Math.hypot(dx,dy));
      if(animate){
       // A taut tether exchanges momentum: astronaut accelerates toward the
       // target while the target receives the equal-and-opposite impulse.
       const nx=dx/d,ny=dy/d,relative=(target.vx-au.vx)*nx+(target.vy-au.vy)*ny;
       const stretch=Math.max(0,d-24),force=clamp(stretch*7+relative*9,0,520);
       const ma=massOf('astronaut'),mb=massOf(target.id),impulse=force*dt;
       au.vx+=(nx*impulse)/ma;au.vy+=(ny*impulse)/ma;
       if(target.obj){target.obj.vx=(target.obj.vx||target.vx)-(nx*impulse)/mb;target.obj.vy=(target.obj.vy||target.vy)-(ny*impulse)/mb;}
       const damp=clamp(dt*.16,0,.012);
       au.vx+=(target.vx-au.vx)*damp;au.vy+=(target.vy-au.vy)*damp;
      }
      rope.tipX=target.x;rope.tipY=target.y;
      if(now>rope.releaseAt||d>Math.min(r.width*.36,330)){au.lasso=null;au.nextLasso=now+rand(7000,13000);}
     }
     if(au.lasso){
      // Whip-like slack in the line makes the tether visibly flex in zero gravity.
      const endX=rope.phase==='tied'?target.x:rope.tipX,endY=rope.phase==='tied'?target.y:rope.tipY;
      const midX=(handX+endX)*.5,midY=(handY+endY)*.5+Math.sin(now*.012)*Math.min(18,Math.hypot(endX-handX,endY-handY)*.035);
      ctx.save();ctx.strokeStyle='#fff';ctx.globalAlpha=rope.phase==='tied'?.88:.68;ctx.lineWidth=1.15;
      ctx.beginPath();ctx.moveTo(handX,handY);ctx.quadraticCurveTo(midX+Math.sin(now*.009)*7,midY,endX,endY);ctx.stroke();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(endX,endY,rope.phase==='tied'?2.4:1.7,0,TAU);ctx.fill();ctx.restore();
      const auEntry=movingThings.find(m=>m.id==='astronaut'&&m.obj===au);if(auEntry){auEntry.x=au.x;auEntry.y=au.y;auEntry.vx=au.vx;auEntry.vy=au.vy;}
     }
    }
   }
  }

  // Random black holes are confined to this panel. Nearby objects curve around
  // the lens, spiral inward and disappear at the event horizon.
  if(animate&&now>=panel.nextBlackHole&&!panel.blackHole){
   const margin=Math.min(58,Math.max(24,scale*.18));
   const edge=Math.floor(Math.random()*4);
   const bx=edge<2?rand(x0+margin,x1-margin):(edge===2?x0+margin:x1-margin);
   const by=edge>=2?rand(y0+margin,y1-margin):(edge===0?y0+margin:y1-margin);
   panel.blackHole={x:bx,y:by,age:0,consumed:false,consumedCount:0,fragments:[],
    radius:clamp(scale*.075,small?13:18,small?18:30),phase:rand(0,TAU),
    strength:rand(3.1,3.8),life:5.8};
   panel.nextBlackHole=now+rand(18000,32000)+panel.repeatStagger;
  }
  if(panel.blackHole){
   const bh=panel.blackHole;
   if(animate){bh.age+=dt;bh.phase+=dt*.9;}
   const horizon=bh.radius*.53,reach=bh.radius*8.5;
   // A black hole is a one-object event: after the first successful swallow,
   // it stops pulling in anything else and rapidly fades out.
   if(!bh.consumedCount){
    movingThings.forEach(body=>{
     if(!body.obj||body.obj._kgAbsorbed||bh.consumedCount)return;
     const dx=bh.x-body.x,dy=bh.y-body.y,d=Math.max(1,Math.hypot(dx,dy));
     if((d<reach||body.obj._kgCaptured)&&animate){
      body.obj._kgCaptured=true;
      const falloff=d<reach?Math.max(0,1-d/reach):.08;
      const influence=falloff*falloff*bh.strength,nx=dx/d,ny=dy/d;
      const tangent=Math.min(3.4,influence*3.0),pull=52+influence*225;
      body.obj.vx=(body.obj.vx||body.vx)+(nx*pull-ny*pull*(1.45+influence*1.8))*influence*dt;
      body.obj.vy=(body.obj.vy||body.vy)+(ny*pull+nx*pull*(1.45+influence*1.8))*influence*dt;
      body.obj.x+=(-ny*tangent*31+nx*influence*30)*dt;
      body.obj.y+=( nx*tangent*31+ny*influence*30)*dt;
      body.obj._kgWarp=Math.max(body.obj._kgWarp||0,influence);
      ctx.save();ctx.translate(body.x,body.y);ctx.rotate(Math.atan2(dy,dx));
      ctx.globalAlpha=Math.min(.42,influence*.5);ctx.strokeStyle='#fff';
      ctx.lineWidth=.8+influence*.5;ctx.beginPath();
      ctx.ellipse(0,0,Math.max(5,body.r*(1+influence*1.5)),Math.max(2,body.r*.38),0,-.9,1.9);ctx.stroke();ctx.restore();
      body.x=body.obj.x;body.y=body.obj.y;
      if(d<horizon+Math.max(3,body.r*.55)){
       body.obj._kgAbsorbed=true;bh.consumed=true;bh.consumedCount=1;bh.fadeOut=0;
       // Four elongated fragments briefly show the object being torn apart;
       // no clouds of tiny dots or clustered circular details are drawn.
       const base=body.r||5;
       for(let k=0;k<4;k++){
        const a=TAU*k/4+rand(-.12,.12),speed=rand(22,38);
        bh.fragments.push({x:body.x+Math.cos(a)*base*.25,y:body.y+Math.sin(a)*base*.25,
         vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,angle:a,spin:rand(-4,4),
         size:rand(3.8,5.8),age:0,life:rand(.28,.42)});
       }
       const prop={iss:'issBody',voyager:'voyager',halley:'halley',orion:'orion',hubble:'hubble',
        asteroid:'asteroid',satellite:'satellite',skyCrane:'skyCrane',marsRover:'marsRover',
        starship:'ship',astronaut:'astronaut'}[body.id];
       if(prop&&panel[prop]===body.obj)panel[prop]=null;
      }
     }
    });
   }else if(animate){
    bh.fadeOut=(bh.fadeOut||0)+dt;
   }
   if(animate&&bh.fragments.length){
    bh.fragments.forEach(f=>{
     f.age+=dt;f.vx+=(bh.x-f.x)*1.8*dt;f.vy+=(bh.y-f.y)*1.8*dt;
     f.x+=f.vx*dt;f.y+=f.vy*dt;f.angle+=f.spin*dt;
    });
    bh.fragments=bh.fragments.filter(f=>f.age<f.life);
   }
   const fade=Math.min(1,bh.age/.65)*Math.max(0,Math.min(1,(bh.life-bh.age)/.65));
   drawBlackHole(ctx,bh.x,bh.y,bh.radius,bh.phase,fade);
   bh.fragments.forEach(f=>{
    const opacity=Math.max(0,1-f.age/f.life)*fade;
    ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);ctx.globalAlpha=opacity;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-f.size*1.5,-f.size*.28);
    ctx.lineTo(f.size*1.45,-f.size*.18);ctx.lineTo(f.size*.75,f.size*.3);
    ctx.lineTo(-f.size*.8,f.size*.22);ctx.closePath();ctx.fill();ctx.restore();
   });
   // Disappear after the first object is swallowed, without waiting for
   // unrelated objects or the remaining debris animation to finish.
   if(bh.consumedCount>0&&(bh.fadeOut||0)>=.38){
    panel.blackHole=null;
    panel.nextBlackHole=now+rand(18000,36000)+panel.repeatStagger;
   }
  }
  // Detect first contact. Head-on impacts destroy both craft briefly;
  // glancing impacts impart a small, persistent trajectory deflection.
  if(animate&&movingThings.length>1){
   const touching=Object.create(null);
   for(let i=0;i<movingThings.length;i++)for(let j=i+1;j<movingThings.length;j++){
    const a=movingThings[i],b=movingThings[j];if(a.obj?._kgAbsorbed||b.obj?._kgAbsorbed)continue;const dx=b.x-a.x,dy=b.y-a.y;
    const distance=Math.hypot(dx,dy),limit=a.r+b.r+2,key=[a.id,b.id].sort().join(':');
    if(distance<=limit){
     touching[key]=true;
     if(!panel.collisionPairs[key]){
      panel.collisionPairs[key]=true;
      const nx=dx/Math.max(1,distance),ny=dy/Math.max(1,distance);
      const rvx=(b.vx||0)-(a.vx||0),rvy=(b.vy||0)-(a.vy||0);
      const closing=-(rvx*nx+rvy*ny),relativeSpeed=Math.hypot(rvx,rvy);
      const headOn=closing>0&&closing/Math.max(1,relativeSpeed)>.82;
      panel.collisionEffects.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,age:0,life:headOn?.72:.48,
       strength:clamp((limit-distance)/Math.max(1,limit),.25,1),destroyed:headOn});
      if(headOn){
       [a,b].forEach(hit=>{
        if(hit.id==='iss'){panel.iss+=Math.PI;return;}
        const prop={voyager:'voyager',halley:'halley',orion:'orion',hubble:'nextHubble',asteroid:'asteroid',satellite:'satellite',skyCrane:'skyCrane',marsRover:'marsRover',starship:'ship',astronaut:'astronaut'}[hit.id];
        if(prop==='marsRover'&&panel.marsRover===hit.obj){
         panel.marsRover=null;
         if(panel.skyCrane){panel.skyCrane.stage=2;panel.skyCrane.age=0;panel.skyCrane.vy=-18;panel.skyCrane.turn=Math.random()<.5?-1:1;}
        }else if(prop&&panel[prop]===hit.obj){
         panel[prop]=null;
         const timer={voyager:'nextVoyager',halley:'nextHalley',orion:'nextOrion',hubble:'nextHubble',asteroid:'nextAsteroid',satellite:'nextSatellite',skyCrane:'nextSkyCrane',marsRover:null,ship:'nextShip',astronaut:'nextAstronaut'}[prop];
         if(timer)panel[timer]=now+(prop==='astronaut'?rand(11000,18000):1100);
        }
       });
      }else{
       // Momentum-conserving glancing response with object-specific inertial mass.
       // Restitution is deliberately low so collisions feel soft rather than arcade-like.
       const ma=massOf(a.id),mb=massOf(b.id),invA=a.obj?1/ma:0,invB=b.obj?1/mb:0;
       const invTotal=invA+invB;
       const normalVelocity=rvx*nx+rvy*ny;
       if(invTotal>0&&normalVelocity<0){
        const restitution=.34;
        const impulse=clamp(-(1+restitution)*normalVelocity/invTotal,0,2600);
        const impulseX=impulse*nx,impulseY=impulse*ny;
        if(a.obj){a.obj.vx=(a.obj.vx||a.vx)-impulseX*invA;a.obj.vy=(a.obj.vy||a.vy)-impulseY*invA;}
        if(b.obj){b.obj.vx=(b.obj.vx||b.vx)+impulseX*invB;b.obj.vy=(b.obj.vy||b.vy)+impulseY*invB;}
        // A little tangential friction transfers spin without overpowering the main path.
        const tangentX=-ny,tangentY=nx;
        const tangentVelocity=rvx*tangentX+rvy*tangentY;
        const friction=clamp(-tangentVelocity*.018,-7,7);
        if(a.obj){a.obj.vx-=tangentX*friction*invA*ma*.35;a.obj.vy-=tangentY*friction*invA*ma*.35;}
        if(b.obj){b.obj.vx+=tangentX*friction*invB*mb*.35;b.obj.vy+=tangentY*friction*invB*mb*.35;}
        if(a.obj&&'spin' in a.obj)a.obj.spin=(a.obj.spin||0)+friction*.0015;
        if(b.obj&&'spin' in b.obj)b.obj.spin=(b.obj.spin||0)-friction*.0015;
       }
      }
     }
    }
   }
   Object.keys(panel.collisionPairs).forEach(key=>{if(!touching[key])delete panel.collisionPairs[key];});
  }
  // Tiny flash, expanding shock ring and a few short-lived fragments.
  panel.collisionEffects=panel.collisionEffects.filter(hit=>hit.age<hit.life);
  panel.collisionEffects.forEach(hit=>{
   if(animate)hit.age+=dt;
   const t=clamp(hit.age/hit.life,0,1),fade=1-t;
   ctx.save();ctx.translate(hit.x,hit.y);ctx.globalCompositeOperation='lighter';
   ctx.globalAlpha=fade*(hit.destroyed?.95:.72);ctx.strokeStyle='#fff';ctx.lineWidth=hit.destroyed?1.6:1.15;
   ctx.beginPath();ctx.arc(0,0,2+t*(hit.destroyed?15:8+hit.strength*5),0,TAU);ctx.stroke();
   ctx.globalAlpha=fade*.9;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,1.2+fade*1.5,0,TAU);ctx.fill();
   for(let k=0;k<6;k++){
    const a=k*TAU/6+hit.age*1.8,dist=3+t*(9+hit.strength*5);
    const sx=Math.cos(a)*dist,sy=Math.sin(a)*dist;
    ctx.globalAlpha=fade*.68;ctx.strokeStyle='#fff';ctx.lineWidth=.85;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*2,Math.sin(a)*2);ctx.lineTo(sx,sy);ctx.stroke();
   }
   ctx.restore();
  });
  ctx.restore();ctx.globalAlpha=1;
 }
 function panelOnscreen(p){const r=p.r;return !!(r&&r.bottom>0&&r.top<H&&r.right>0&&r.left<W);}
 function shiftPanelClock(p,gap){['nextVoyager','nextShip','nextSatellite','nextAsteroid','nextHubble','nextOrion','nextHalley','nextSkyCrane','nextAstronaut','nextBlackHole'].forEach(k=>{if(Number.isFinite(p[k]))p[k]+=gap;});}
 function render(now,animate){measure();ctx.clearRect(0,0,W,H);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;panels.forEach(p=>{if(!panelOnscreen(p)){p.wasOnscreen=false;p.lastActiveAt=now;return;}if(!p.wasOnscreen&&p.lastActiveAt){shiftPanelClock(p,Math.max(0,now-p.lastActiveAt));}p.wasOnscreen=true;p.lastActiveAt=now;drawPanel(p,dt,now,animate);});}
 function drawStatic(){if(!ctx)return;render(performance.now(),false);}
 function visible(){return !document.hidden&&panels.some(panelOnscreen);}
 function loop(now){raf=0;if(document.hidden)return;const target=frameInterval||(saverMode?1000/16:(coarse?1000/24:1000/45));if(now-last<target-1){raf=requestAnimationFrame(loop);return;}const started=performance.now();render(now,!reduce);const cost=performance.now()-started;if(now-lastPerfCheck>1800){lastPerfCheck=now;if(cost>19){slowFrames++;fastFrames=0;}else if(cost<11){fastFrames++;slowFrames=0;}if(slowFrames>=2){frameInterval=saverMode?1000/12:(coarse?1000/20:1000/30);slowFrames=0;}else if(fastFrames>=4){frameInterval=saverMode?1000/16:(coarse?1000/24:1000/45);fastFrames=0;}}if(!reduce&&visible())raf=requestAnimationFrame(loop);}
 function wake(){if(reduce){drawStatic();return;}if(!raf&&!document.hidden&&visible()){last=performance.now();raf=requestAnimationFrame(loop);}}
 scan();resize();
 panelResizeObserver=new ResizeObserver(()=>{resize();wake();});
 panels.forEach(p=>panelResizeObserver.observe(p.el));
 // Observe all common navigation variants, not just one site's .header class.
 const navNodes=document.querySelectorAll(
  'header .toggle,header .hamburger-toggle,header .menu-toggle,header .navbar-toggler,'+
  'header .links,header #links,header .nav-links,header .hamburger-panel,header .mobile-menu,'+
  'header details,header .nav-dropdown-menu,header .dropdown-menu,header .submenu,'+
  '.site-header .toggle,.site-header .menu-toggle,.site-header .nav-links,.site-header .hamburger-panel,'+
  '#mobile-menu,.mobile-menu'
 );
 navNodes.forEach(node=>panelResizeObserver.observe(node));
 const navMutationObserver=new MutationObserver(()=>{scan();measure();wake();});
 // Body-level observation also catches subsite menus and dynamically inserted panels.
 navMutationObserver.observe(document.body,{subtree:true,childList:true,attributes:true,
  attributeFilter:['class','open','hidden','aria-expanded','style','data-kg-cosmos-panel']});
 window.addEventListener('resize',()=>{resize();measure();wake();},{passive:true});window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;measure();wake();});}},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else wake();});
 if(!reduce)wake();
 window.KGCosmosSpace={panels,canvas,networkMode:saverMode?'saver':'full',refresh:()=>{scan();resize();wake();}};
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
 else boot();
})();

/* ===== ANNOUNCEMENT SYNCHRONIZER ===== */
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
  if (window.KGSharedExcluded || document.getElementById("kg-manual-settings-bridge")) return;

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


/* ===== SITE-WIDE HOME LOGO ROUTING ===== */
(function(){
  "use strict";
  if(window.KGSharedExcluded)return;
  function routeLogos(){
    document.querySelectorAll('a').forEach(function(link){
      if(link.closest('.booking-menu-panel,.booking-option,.booking-choice-logo'))return;
      var img=link.querySelector('img');
      var svg=link.querySelector('svg[aria-label],svg[role="img"]');
      var linkClass=typeof link.className==='string'?link.className:'';
      var childLogo=link.querySelector('.circular-brand-logo,.kg-logo,.site-logo,.brand-logo,[data-embedded-logo]');
      var logoClass=/(circular-brand-logo|kg-logo|site-logo|brand-logo|navbar-brand|footer-brand|secondary-brand)/i.test(linkClass);
      var logoImage=img && (/(logo|brand)/i.test(img.alt||'') || /circular-brand-logo|kg-logo/i.test(img.className||'') || img.hasAttribute('data-embedded-logo'));
      var logoSvg=svg && /logo|brand/i.test(svg.getAttribute('aria-label')||'');
      if(logoClass||childLogo||logoImage||logoSvg){link.setAttribute('href','/');link.removeAttribute('data-kg-scroll-target');}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',routeLogos,{once:true});else routeLogos();
  new MutationObserver(routeLogos).observe(document.documentElement,{childList:true,subtree:true});
})();

/* ===== SHARED NAVIGATION CONTROLLER ===== */
/* KidsGastro shared navigation controller
   Shared by the homepage and standalone sub-sites. Keeps page-specific content/scripts intact. */
(function () {
  "use strict";
  if(window.KGSharedExcluded)return;

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


/* ===== VERTICAL-ONLY WHATSAPP FLOAT DRAG ===== */
(()=>{
 "use strict";
 if(window.KGWhatsAppVerticalDrag)return;
 const init=()=>{
  const button=document.querySelector('.whatsapp-float');
  if(!button||button.dataset.kgVerticalDrag==="1")return;
  button.dataset.kgVerticalDrag="1";
  button.style.touchAction="none";button.style.cursor="grab";
  let active=false,moved=false,startY=0,startTop=0,pointerId=null;
  const clampTop=value=>Math.max(8,Math.min(window.innerHeight-button.getBoundingClientRect().height-8,value));
  button.addEventListener("pointerdown",event=>{
   if(event.pointerType==="mouse"&&event.button!==0)return;
   const rect=button.getBoundingClientRect();
   active=true;moved=false;pointerId=event.pointerId;startY=event.clientY;startTop=rect.top;
   button.classList.add("is-dragging");
   button.style.left="auto";button.style.right="max(16px, env(safe-area-inset-right))";
   button.style.bottom="auto";button.style.top=rect.top+"px";
   try{button.setPointerCapture(pointerId);}catch(_){}
   event.preventDefault();
  });
  button.addEventListener("pointermove",event=>{
   if(!active||event.pointerId!==pointerId)return;
   const delta=event.clientY-startY;if(Math.abs(delta)>3)moved=true;
   button.style.top=clampTop(startTop+delta)+"px";event.preventDefault();
  });
  const finish=event=>{
   if(!active||event.pointerId!==pointerId)return;
   active=false;button.classList.remove("is-dragging");button.style.cursor="grab";
   if(moved){button.dataset.kgDragged="1";window.setTimeout(()=>{delete button.dataset.kgDragged;},350);}
   pointerId=null;
  };
  button.addEventListener("pointerup",finish);button.addEventListener("pointercancel",finish);
  button.addEventListener("click",event=>{
   if(button.dataset.kgDragged==="1"){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  window.addEventListener("resize",()=>{if(button.style.top)button.style.top=clampTop(parseFloat(button.style.top)||0)+"px";},{passive:true});
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
