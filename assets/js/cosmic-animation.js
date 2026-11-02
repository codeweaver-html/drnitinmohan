/* KidsGastro shared cosmic animation engine.
   Reusable across the homepage and subpages.
   To animate a custom section, add class="kg-space-panel" or
   data-kg-cosmos-panel="true" to that section.
   The engine creates its own fixed canvas if one is not already present. */
(()=>{'use strict';
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
 const OBJECT_MASS={iss:1200,starship:900,shuttle:650,skyCrane:520,marsRover:190,shuttleTank:240,shuttleBooster:155,orion:280,hubble:180,asteroid:160,satellite:90,voyager:70,halley:45,astronaut:12};
 const massOf=id=>OBJECT_MASS[id]||60;
 const CONFIG={maxDpr:1.5,mobileDpr:1.25,opacity:.76,mobileOpacity:.66,reducedOpacity:.72,objectAlpha:.95,issAngularSpeed:.22,voyagerInterval:[10000,17000],starshipInterval:[9000,14500],shuttleInterval:[11000,17000],satelliteInterval:[6500,10500],asteroidInterval:[1800,3600],hubbleInterval:[14000,22000],orionInterval:[10500,16500],halleyInterval:[18000,28000],voyagerInitialDelay:[500,1800],starshipInitialDelay:[400,1300],planetCount:3};
 const canvas=document.getElementById('kg-space')||document.createElement('canvas');canvas.id='kg-space';canvas.setAttribute('aria-hidden','true');if(!canvas.isConnected)document.body.appendChild(canvas);
 const ctx=canvas.getContext('2d',{alpha:true});canvas.style.opacity=String(reduce?CONFIG.reducedOpacity:(coarse?CONFIG.mobileOpacity:CONFIG.opacity));
 const selectors=['[data-kg-cosmos-panel]','.kg-space-panel','.header','.hero-grid > div:first-child','.newsletter-section','.social-intro','.footer-contact-band','.footer-bottom'];
 const panels=[];let W=0,H=0,D=1,raf=0,last=0,scrollQueued=false,frameInterval=0,slowFrames=0,fastFrames=0,lastPerfCheck=0;
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
   const anchorX=.10+((col+rand(.18,.82))/cols)*.80;
   const anchorY=.14+((row+rand(.16,.84))/rows)*.72;
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
  return {el,panelIndex,launchStagger,repeatStagger,lastActiveAt:performance.now(),bodies,collisionPairs:Object.create(null),collisionEffects:[],iss:rand(0,TAU),voyager:null,ship:null,shuttle:null,shuttleParts:[],skyCrane:null,marsRover:null,nextSkyCrane:performance.now()+rand(6500,10500)+launchStagger,astronaut:null,nextAstronaut:performance.now()+rand(1800,4200),satellite:null,nextSatellite:performance.now()+rand(3500,6500),asteroid:null,nextAsteroid:performance.now()+rand(900,1800),hubble:null,nextHubble:performance.now()+rand(5000,9000),orion:null,nextOrion:performance.now()+rand(4000,7500),halley:null,nextHalley:performance.now()+rand(7000,12000),nextShuttle:performance.now()+rand(2200,4800)+launchStagger,nextVoyager:performance.now()+rand(...CONFIG.voyagerInitialDelay),nextShip:performance.now()+rand(...CONFIG.starshipInitialDelay)+launchStagger,r:null,blocked:[],safePoints:[],sparks};
 }
 function scan(){
  selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{
   if(el.closest('#hospital-location')||el.dataset.kgSpacePanel==='1')return;
   el.dataset.kgSpacePanel='1';el.classList.add('kg-space-panel');panels.push(makePanel(el,panels.length));
  }));
 }
 function measure(){
  const protectedSelectors=[
   // Keep the primary paediatric gastro care message completely clear of space objects.
   '.hero .hero-typing-headline','.hero .hero-typing-headline *',
   '.booking-toggle','.back-top','#site-search','.site-search',
   '.toggle','#hamburger-panel','.hamburger-panel',
   '.header #links','.header #links.open',
   // Protect every KidsGastro logo/brand mark wherever it appears.
   '.kg-logo','.circular-brand-logo','.kg-logo-header','.kg-logo-secondary',
   '.kg-logo-newsletter','.header .brand','.footer-brand','.footer .brand',
   // Keep the newsletter email-entry field and Request updates action clear.
   '#newsletter-email',
   '.newsletter-controls input[type="email"]',
   '.newsletter-controls button[type="submit"]',
   '.newsletter-controls button'
  ].join(',');
  const protectedNodes=[...document.querySelectorAll(protectedSelectors)];
  const menuNodes=[...document.querySelectorAll([
   '.header .toggle',
   // Only the visible expanded menu surface is shielded. Never shield
   // the parent .nav/header: blue panels underneath must keep animating.
   '.header #links.open',
   '.header .links.open',
   '.header .hamburger-panel:not([hidden])',
   '.header [role="menu"]:not([hidden])'
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
   // Apply the entire menu shield to every panel canvas, even when the menu
   // extends beyond the header panel into the next section.
   if(menuShield){
    const left=clamp(menuShield.left,0,W),top=clamp(menuShield.top,0,H);
    const right=clamp(menuShield.right,0,W),bottom=clamp(menuShield.bottom,0,H);
    if(right>left&&bottom>top)p.blocked.push({left,top,right,bottom});
   }
   // Protect appointment and search controls independently; menu elements are
   // excluded here because their merged shield above already covers them.
   protectedNodes.forEach(node=>{
    if(!node||!node.isConnected||node.matches('.toggle,#hamburger-panel,.hamburger-panel,.header #links,.header #links.open')||node.closest('.header #links.open'))return;
    const b=node.getBoundingClientRect();
    if(b.width<1||b.height<1||b.bottom<0||b.top>H||b.right<0||b.left>W)return;
    const pad=26,left=clamp(b.left-pad,0,W),top=clamp(b.top-pad,0,H);
    const right=clamp(b.right+pad,0,W),bottom=clamp(b.bottom+pad,0,H);
    if(right>left&&bottom>top)p.blocked.push({left,top,right,bottom});
   });
   for(let row=0;row<9;row++)for(let col=0;col<19;col++)p.safePoints.push({x:pr.width*(.025+col*.0527),y:pr.height*(.06+row*.11)});
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
 function drawShuttle(c,x,y,a,size,dir=1,enginePhase=0){
  c.save();
  c.translate(x,y);
  c.rotate(a);
  c.scale((dir<0?-1:1)*size/100,size/100);
  c.globalAlpha=.99;
  c.fillStyle='#fff';
  c.strokeStyle='rgba(255,255,255,.98)';
  c.lineWidth=1.35;
  c.lineJoin='round';
  c.lineCap='round';

  // Orbiter viewed from above: long pointed nose, broad swept delta wings,
  // and a distinct vertical stabilizer at the rear.
  c.beginPath();
  c.moveTo(55,0);
  c.quadraticCurveTo(48,-5,34,-7);
  c.lineTo(-31,-7);
  c.lineTo(-43,-4);
  c.lineTo(-48,0);
  c.lineTo(-43,4);
  c.lineTo(-31,7);
  c.lineTo(34,7);
  c.quadraticCurveTo(48,5,55,0);
  c.closePath();
  c.fill();

  // Broad delta wings with a sharply swept leading edge.
  c.beginPath();
  c.moveTo(15,-5);
  c.lineTo(-28,-32);
  c.lineTo(-49,-29);
  c.lineTo(-35,-4);
  c.lineTo(-35,4);
  c.lineTo(-49,29);
  c.lineTo(-28,32);
  c.lineTo(15,5);
  c.closePath();
  c.fill();

  // Tail fin and rear body fairing.
  c.beginPath();
  c.moveTo(-30,-5);
  c.lineTo(-45,-20);
  c.lineTo(-32,-19);
  c.lineTo(-12,-6);
  c.closePath();
  c.fill();

  // Three separate main engine nozzles at the tail.
  c.fillStyle='#e8f3fa';
  [-4,0,4].forEach(y0=>{
    c.beginPath();
    c.ellipse(-45,y0,4.2,2.0,0,0,TAU);
    c.fill();
  });

  // Blue cockpit glazing and a fine nose highlight.
  c.fillStyle='#9ed5f4';
  c.beginPath();
  c.moveTo(38,-3.8);
  c.lineTo(48,-1.2);
  c.lineTo(43,1.2);
  c.lineTo(36,.8);
  c.closePath();
  c.fill();
  c.strokeStyle='rgba(255,255,255,.75)';
  c.lineWidth=.8;
  c.beginPath();
  c.moveTo(48,-1.2);
  c.lineTo(54,0);
  c.stroke();

  // Restrained pulsing exhaust, visible only behind the engines.
  c.globalAlpha=.42+.38*(.5+.5*Math.sin(enginePhase*9));
  c.strokeStyle='#d8efff';
  c.lineWidth=1.7;
  c.beginPath();
  c.moveTo(-49,0);
  c.lineTo(-58-Math.sin(enginePhase*7)*3,0);
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
 function drawShuttleBooster(c,x,y,a,size,phase=0){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/42,size/42);c.fillStyle='#fff';c.globalAlpha=.96;
  c.beginPath();c.moveTo(0,-23);c.quadraticCurveTo(8,-17,8,-7);c.lineTo(7,17);c.quadraticCurveTo(0,23,-7,17);c.lineTo(-8,-7);c.quadraticCurveTo(-8,-17,0,-23);c.closePath();c.fill();
  c.globalAlpha=.72;c.fillRect(-5,-4,10,2);c.globalAlpha=.35+.35*(.5+.5*Math.sin(phase*13));c.beginPath();c.moveTo(-4,20);c.lineTo(0,30+Math.sin(phase*9)*3);c.lineTo(4,20);c.closePath();c.fill();c.restore();
 }
 function drawShuttleTank(c,x,y,a,size,phase=0){
  c.save();c.translate(x,y);c.rotate(a);c.scale(size/34,size/34);c.fillStyle='#fff';c.globalAlpha=.9;
  c.beginPath();c.moveTo(0,-27);c.quadraticCurveTo(8,-21,8,-10);c.lineTo(7,21);c.quadraticCurveTo(0,29,-7,21);c.lineTo(-8,-10);c.quadraticCurveTo(-8,-21,0,-27);c.closePath();c.fill();
  c.globalAlpha=.5;c.fillRect(-7,-8,14,2);c.fillRect(-7,11,14,2);c.restore();
 }
 function drawLaunchPlume(c,x,y,a,size,phase,intensity=1){
  c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=(.45+.4*(.5+.5*Math.sin(phase*17)))*intensity;c.fillStyle='#fff';
  const len=size*(1.1+.32*Math.sin(phase*11));c.beginPath();c.moveTo(-size*.12,0);c.lineTo(-size*.34,len*.72);c.quadraticCurveTo(0,len*1.18,size*.34,len*.72);c.lineTo(size*.12,0);c.closePath();c.fill();
  c.globalAlpha*=.65;c.beginPath();c.arc(0,size*.13,size*.12,0,TAU);c.fill();c.restore();
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
   if(animate)panel.iss+=CONFIG.issAngularSpeed*dt;const ix=cx+Math.cos(panel.iss)*Math.min(r.width,r.height)*.22,iy=cy+Math.sin(panel.iss)*Math.min(r.width,r.height)*.14;drawISS(ctx,ix,iy,panel.iss+.35,clamp(scale*.19,small?14:26,small?22:44),now*.001);movingThings.push({id:'iss',x:ix,y:iy,r:small?8:11,vx:-Math.sin(panel.iss)*Math.min(r.width,r.height)*.22*CONFIG.issAngularSpeed,vy:Math.cos(panel.iss)*Math.min(r.width,r.height)*.14*CONFIG.issAngularSpeed,obj:null});
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
   // A compact, stylized multi-stage shuttle launch: orbiter, two SRBs and tank
   // separate in sequence, then remain independent physical bodies in the scene.
   if(animate&&now>=panel.nextShuttle&&!panel.shuttle){
    const launchX=clamp(cx+rand(-r.width*.18,r.width*.18),x0+28,x1-28);
    panel.shuttle={x:launchX,y:y1+30,vx:rand(-3,3),vy:-rand(42,55),dir:1,phase:rand(0,TAU),age:0,stage:0,heading:-Math.PI/2,launchX};
    panel.shuttleParts=[];panel.nextShuttle=now+rand(...CONFIG.shuttleInterval)+panel.repeatStagger;
   }
   if(panel.shuttle){
    const st=panel.shuttle;
    if(animate){
     st.age+=dt;st.phase+=dt*1.2;
     // Separation is intentionally front-loaded: the stack clears its launch
     // plume, sheds the two boosters, then drops the external tank early in entry.
     if(st.age<1.05){st.vy-=27*dt;st.vx*=Math.pow(.985,dt*60);}
     else if(st.age<1.95){st.vy-=14*dt;st.vx+=Math.sin(st.phase)*3.5*dt;}
     else {
      // The orbiter lights its own engines after tank separation and smoothly
      // pitches from vertical ascent into a sustained 45-degree climb.
      const pitch=clamp((st.age-1.95)/2.35,0,1);
      const targetHeading=-Math.PI/4;
      const angleDelta=Math.atan2(Math.sin(targetHeading-st.heading),Math.cos(targetHeading-st.heading));
      st.heading+=angleDelta*Math.min(1,dt*.82);
      const thrust=42;
      st.vx+=Math.cos(st.heading)*thrust*dt;
      st.vy+=Math.sin(st.heading)*thrust*dt;
      st.vx*=Math.pow(.999,dt*60);
      st.vy*=Math.pow(.999,dt*60);
     }
     st.x+=st.vx*dt;st.y+=st.vy*dt;
     if(st.stage===0&&st.age>=1.05){st.stage=1;[-1,1].forEach(side=>panel.shuttleParts.push({id:side<0?'shuttleBoosterL':'shuttleBoosterR',kind:'booster',x:st.x+side*13,y:st.y+8,vx:st.vx+side*rand(18,25),vy:st.vy*.42,spin:side*rand(1.8,2.9),angle:side*.12,age:0}));}
     if(st.stage===1&&st.age>=1.95){st.stage=2;panel.shuttleParts.push({id:'shuttleTank',kind:'tank',x:st.x-3,y:st.y+18,vx:st.vx-rand(6,11),vy:st.vy*.38,spin:rand(-1.4,1.4),angle:0,age:0});}
    }
    const shuttleSize=clamp(scale*.34,small?25:42,small?34:58)*.46;
    const launchAngle=st.age<2.35?-Math.PI/2:st.heading;
    if(st.age<1.95)drawLaunchPlume(ctx,st.x,st.y+shuttleSize*.45,0,shuttleSize*.42,st.age,1);
    else drawLaunchPlume(ctx,st.x,st.y,launchAngle,shuttleSize*.34,st.age,1);
    drawShuttle(ctx,st.x,st.y,launchAngle,shuttleSize,1,st.age);
    movingThings.push({id:'shuttle',x:st.x,y:st.y,r:13,vx:st.vx,vy:st.vy,obj:st});
    if(st.y<y0-70||st.x<x0-100||st.x>x1+100)panel.shuttle=null;
   }
   panel.shuttleParts=panel.shuttleParts.filter(part=>part.age<18&&part.x>x0-90&&part.x<x1+90&&part.y>y0-100&&part.y<y1+100);
   panel.shuttleParts.forEach(part=>{
    if(animate){part.age+=dt;part.vy+=part.kind==='booster'?20*dt:11*dt;part.vx*=Math.pow(.999,dt*60);part.x+=part.vx*dt;part.y+=part.vy*dt;part.angle+=part.spin*dt;}
    const partSize=clamp(scale*.16,small?9:14,small?12:19);
    if(part.kind==='booster')drawShuttleBooster(ctx,part.x,part.y,part.angle,partSize,part.age);
    else drawShuttleTank(ctx,part.x,part.y,part.angle,partSize*.9,part.age);
    movingThings.push({id:part.kind==='booster'?'shuttleBooster':'shuttleTank',x:part.x,y:part.y,r:part.kind==='booster'?7:8,vx:part.vx,vy:part.vy,obj:part});
   });
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
  // Detect first contact. Head-on impacts destroy both craft briefly;
  // glancing impacts impart a small, persistent trajectory deflection.
  if(animate&&movingThings.length>1){
   const touching=Object.create(null);
   for(let i=0;i<movingThings.length;i++)for(let j=i+1;j<movingThings.length;j++){
    const a=movingThings[i],b=movingThings[j],dx=b.x-a.x,dy=b.y-a.y;
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
        const prop={voyager:'voyager',halley:'halley',orion:'orion',hubble:'nextHubble',asteroid:'asteroid',satellite:'satellite',shuttle:'shuttle',skyCrane:'skyCrane',marsRover:'marsRover',starship:'ship',astronaut:'astronaut'}[hit.id];
        if(prop==='marsRover'&&panel.marsRover===hit.obj){
         panel.marsRover=null;
         if(panel.skyCrane){panel.skyCrane.stage=2;panel.skyCrane.age=0;panel.skyCrane.vy=-18;panel.skyCrane.turn=Math.random()<.5?-1:1;}
        }else if(prop&&panel[prop]===hit.obj){
         panel[prop]=null;
         const timer={voyager:'nextVoyager',halley:'nextHalley',orion:'nextOrion',hubble:'nextHubble',asteroid:'nextAsteroid',satellite:'nextSatellite',shuttle:'nextShuttle',skyCrane:'nextSkyCrane',marsRover:null,ship:'nextShip',astronaut:'nextAstronaut'}[prop];
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
 function shiftPanelClock(p,gap){['nextVoyager','nextShip','nextShuttle','nextSatellite','nextAsteroid','nextHubble','nextOrion','nextHalley','nextSkyCrane','nextAstronaut'].forEach(k=>{if(Number.isFinite(p[k]))p[k]+=gap;});}
 function render(now,animate){measure();ctx.clearRect(0,0,W,H);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;panels.forEach(p=>{if(!panelOnscreen(p)){p.wasOnscreen=false;p.lastActiveAt=now;return;}if(!p.wasOnscreen&&p.lastActiveAt){shiftPanelClock(p,Math.max(0,now-p.lastActiveAt));}p.wasOnscreen=true;p.lastActiveAt=now;drawPanel(p,dt,now,animate);});}
 function drawStatic(){if(!ctx)return;render(performance.now(),false);}
 function visible(){return !document.hidden&&panels.some(panelOnscreen);}
 function loop(now){raf=0;if(document.hidden)return;const target=frameInterval||(saverMode?1000/16:(coarse?1000/24:1000/45));if(now-last<target-1){raf=requestAnimationFrame(loop);return;}const started=performance.now();render(now,!reduce);const cost=performance.now()-started;if(now-lastPerfCheck>1800){lastPerfCheck=now;if(cost>19){slowFrames++;fastFrames=0;}else if(cost<11){fastFrames++;slowFrames=0;}if(slowFrames>=2){frameInterval=saverMode?1000/12:(coarse?1000/20:1000/30);slowFrames=0;}else if(fastFrames>=4){frameInterval=saverMode?1000/16:(coarse?1000/24:1000/45);fastFrames=0;}}if(!reduce&&visible())raf=requestAnimationFrame(loop);}
 function wake(){if(reduce){drawStatic();return;}if(!raf&&!document.hidden&&visible()){last=performance.now();raf=requestAnimationFrame(loop);}}
 scan();resize();
 const ro=new ResizeObserver(()=>{resize();wake();});panels.forEach(p=>ro.observe(p.el));
 // Watch the real navigation containers too: mobile menu and dropdown panels
 // expand through CSS transitions, so their protection mask must follow every
 // intermediate size rather than only the final open/closed state.
 const navNodes=document.querySelectorAll('.header .toggle,.header .links,.header #links,.header .hamburger-panel,.header details,.header .nav-dropdown-menu,.header .dropdown-menu,.header .submenu');
 navNodes.forEach(node=>ro.observe(node));
 const navMutationObserver=new MutationObserver(()=>{measure();wake();});
 navMutationObserver.observe(document.querySelector('.header')||document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','open','hidden','aria-expanded','style']});
 window.addEventListener('resize',()=>{resize();measure();wake();},{passive:true});window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;measure();wake();});}},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else wake();});
 if(!reduce)wake();
 // Small pointer follower only on precise-pointer desktop devices; no DOM cursor effects on touch.
 if(!coarse&&!reduce){const ring=document.createElement('div'),dot=document.createElement('div');ring.id='kg-cur';dot.id='kg-dot';document.body.append(ring,dot);let mx=-100,my=-100,rx=-100,ry=-100,shown=false,cursorRaf=0;
  const follow=()=>{cursorRaf=0;rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;if(Math.abs(mx-rx)>.15||Math.abs(my-ry)>.15)cursorRaf=requestAnimationFrame(follow);};
  window.addEventListener('pointermove',e=>{const inside=panels.some(p=>{const b=p.r;return b&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;});if(!inside){shown=false;ring.classList.remove('is-visible','is-hover');dot.classList.remove('is-visible');if(cursorRaf){cancelAnimationFrame(cursorRaf);cursorRaf=0;}return;}mx=e.clientX;my=e.clientY;if(!shown){shown=true;ring.classList.add('is-visible');dot.classList.add('is-visible');}dot.style.transform=`translate3d(${mx}px,${my}px,0)`;if(!cursorRaf)cursorRaf=requestAnimationFrame(follow);},{passive:true});
  document.addEventListener('pointerover',e=>ring.classList.toggle('is-hover',!!e.target.closest('.kg-space-panel a,.kg-space-panel button,.kg-space-panel summary,.kg-space-panel input,.kg-space-panel label,.kg-space-panel [role="button"]')));
  addEventListener('pointerdown',()=>ring.classList.add('is-down'));
  addEventListener('pointerup',()=>ring.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave',()=>{ring.classList.remove('is-visible','is-hover','is-down');dot.classList.remove('is-visible');shown=false;if(cursorRaf){cancelAnimationFrame(cursorRaf);cursorRaf=0;}});
 }
 window.KGCosmosSpace={panels,canvas,networkMode:saverMode?'saver':'full',refresh:()=>{scan();resize();wake();}};
})();
