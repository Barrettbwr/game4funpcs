(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const D=document.getElementById("bg"),E=D.getContext("2d"),te=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let T=0,I=0,U=1,ye=[74,222,128],we=[],j=[],Se=.5;function me(){U=Math.min(window.devicePixelRatio||1,2),T=window.innerWidth,I=window.innerHeight,D.width=T*U,D.height=I*U,D.style.width=T+"px",D.style.height=I+"px",E.setTransform(U,0,0,U,0,0)}function he(){const e=te?26:Math.min(70,Math.round(T*I/22e3));we=Array.from({length:e},()=>({x:Math.random()*T,y:Math.random()*I,r:.6+Math.random()*1.7,vy:-(.08+Math.random()*.3),vx:(Math.random()-.5)*.08,a:.08+Math.random()*.3,depth:.3+Math.random()*.7,tw:Math.random()*Math.PI*2}))}function Re(e){const t=e.replace("#","");ye=[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]}function Q(e,t,a=60){for(let n=0;n<a;n++){const s=Math.random()*Math.PI*2,i=2+Math.random()*7;j.push({x:e,y:t,vx:Math.cos(s)*i,vy:Math.sin(s)*i-2.5,life:1,decay:.008+Math.random()*.015,r:1+Math.random()*2.5})}}function Ee(){E.clearRect(0,0,T,I);const[e,t,a]=ye;for(const n of we){te||(n.x+=n.vx+(Se-.5)*n.depth*.25,n.y+=n.vy*n.depth,n.tw+=.02,n.y<-8&&(n.y=I+8,n.x=Math.random()*T),n.x<-8&&(n.x=T+8),n.x>T+8&&(n.x=-8));const s=n.a*(te?1:.6+.4*Math.sin(n.tw));E.fillStyle=`rgba(${e},${t},${a},${s})`,E.beginPath(),E.arc(n.x,n.y,n.r,0,Math.PI*2),E.fill()}for(let n=j.length-1;n>=0;n--){const s=j[n];if(s.x+=s.vx,s.y+=s.vy,s.vy+=.12,s.vx*=.99,s.life-=s.decay,s.life<=0){j.splice(n,1);continue}E.fillStyle=`rgba(${e},${t},${a},${s.life*.9})`,E.beginPath(),E.arc(s.x,s.y,s.r*s.life,0,Math.PI*2),E.fill()}requestAnimationFrame(Ee)}function Be(){me(),he(),window.addEventListener("resize",()=>{me(),he()}),window.addEventListener("pointermove",e=>{Se=e.clientX/T,e.clientY/I}),requestAnimationFrame(Ee)}class Oe{constructor(){this.ctx=null,this.enabled=localStorage.getItem("g4f-sound")!=="off"}unlock(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx=new t)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setEnabled(t){this.enabled=t,localStorage.setItem("g4f-sound",t?"on":"off")}tone(t,a,{type:n="sine",gain:s=.04,delay:i=0,slide:r=null}={}){if(!this.enabled||!this.ctx||this.ctx.state!=="running")return;const o=this.ctx.currentTime+i,l=this.ctx.createOscillator(),m=this.ctx.createGain();l.type=n,l.frequency.setValueAtTime(t,o),r&&l.frequency.exponentialRampToValueAtTime(r,o+a),m.gain.setValueAtTime(0,o),m.gain.linearRampToValueAtTime(s,o+.008),m.gain.exponentialRampToValueAtTime(1e-4,o+a),l.connect(m).connect(this.ctx.destination),l.start(o),l.stop(o+a+.05)}hover(){this.tone(1900,.03,{gain:.01})}select(){this.tone(520,.07,{type:"square",gain:.025}),this.tone(780,.09,{type:"square",gain:.02,delay:.05})}deselect(){this.tone(420,.06,{type:"square",gain:.02})}advance(){this.tone(300,.18,{type:"sawtooth",gain:.03,slide:900})}back(){this.tone(600,.12,{type:"sawtooth",gain:.02,slide:250})}deny(){this.tone(180,.12,{type:"square",gain:.03})}tick(){this.tone(1400,.02,{type:"square",gain:.012})}stamp(){this.tone(220,.2,{type:"square",gain:.045}),this.tone(440,.25,{delay:.02,gain:.03})}boot(){this.tone(160,.5,{type:"sawtooth",gain:.025,slide:640})}fanfare(){[392,523,659,784].forEach((a,n)=>{this.tone(a,.28,{type:"triangle",gain:.05,delay:n*.11}),this.tone(a*2,.2,{type:"sine",gain:.018,delay:n*.11})})}}const k=new Oe,w={games:[],style:null,display:null,monitor:!1,rig:null,themeTags:[],themeText:"",budgetMin:null,budgetMax:null,otherGames:"",contact:{name:"",email:"",notes:""}};function Ne(){w.games=[],w.style=null,w.display=null,w.monitor=!1,w.rig=null,w.themeTags=[],w.themeText="",w.budgetMin=null,w.budgetMax=null,w.otherGames="",w.contact={name:"",email:"",notes:""}}const $={phone:"(689) 269-0097",phoneHref:"tel:+16892690097",email:"Game4funpcs@gmail.com",warrantyEmail:"Warranty4game4funpcs@gmail.com"},$e=[{name:"FACEBOOK",href:"https://www.facebook.com/p/Game4funpcs-61576901232433/"},{name:"INSTAGRAM",href:"https://www.instagram.com/game4funpcs/"},{name:"YOUTUBE",href:"https://youtube.com/@game4funpcs"},{name:"TIKTOK",href:"https://tiktok.com/@game4funpcs"}],Y={rating:"5.0",count:156},H=[{name:"David Hannigan",source:"Google",text:"Highly recommend this company for all your PC needs. Very knowledgeable in everything that comes with building and services on PCs. He did an amazing job fixing my heating issue on my PC. I also saw firsthand how good he is at building a new one. Very friendly and will answer every question you have. A+"},{name:"S R",source:"Google",text:"Great experience. Customer service outstanding : my custom built PC is a dream come true. He took all of the things that I wanted in a PC and made it possible. These guys are very knowledgeable and very experienced. I am a very satisfied customer and I recommend anybody that wants a custom built workstation PC, gaming PC or any type of PC to get in contact with them and they will deliver a dream machine that is reality. Very thankful for my new PC : thank you Game4Fun PCs."},{name:"Dieneysh Hernandez",source:"Google",text:"I’m very impressed with the overall quality of this PC build. The components were assembled with great care, cable management was clean, and everything feels solid and professional. From the moment I powered it on, the system ran smoothly without any issues."}],Pe=[["CUSTOM GAMING PC BUILDS","Fully personalized systems for gaming, streaming, or content creation : engineered for your budget and your favorite games."],["UPGRADES & REPAIRS","Boost your current PC or bring it back to life. CPUs, GPUs, RAM, SSDs, power supplies, cooling : we swap it all."],["OPTIMIZATION & TUNING","Drivers, software, settings : fine-tuned for smooth, high-FPS performance on the titles you actually play."],["BYOP : BRING YOUR OWN PARTS","Already have components? Send them over. We handle assembly, cable discipline, and full testing."]],xe=[["TELL US HOW YOU PLAY","The 90-second loadout quiz : your games, your settings, your colors. No sign-up, no payment."],["APPROVE THE FREE QUOTE","Honest, transparent pricing : no markups, no gimmicks. Full quote in your inbox, pay nothing until you say go."],["WE BUILD & STRESS-TEST","Hand-built, cable-disciplined, stress-tested and optimized for your games. Typically 7–10 business days."],["UNBOX & DOMINATE","Game-ready out of the box, with post-sale support and a limited warranty behind it. Then you game."]],B=[["How long does a build take?","Typically 7–10 business days to build, test, and optimize. Every rig is hand-built and stress-tested so it’s game-ready out of the box."],["Can I choose my own parts?","Absolutely. Pick every component yourself, or tell us your budget and favorite games and we’ll recommend the best setup. Either way, the build is tailored to your playstyle."],["What games will it run?","Tell us what you play : Warzone, Fortnite, Valorant, Elden Ring : and we’ll make sure your rig handles it. We even optimize settings for your top titles before shipping."],["Is it upgradeable later?","100%. We use future-ready components and open upgrade paths, so you can swap the GPU, RAM, or SSD whenever you’re ready to level up."],["What about support after the sale?","All builds come with personalized post-sale support plus a limited warranty. We also offer remote help if you hit issues or just want game tuning."],["Liquid cooling? Custom RGB?","Yes and yes. Custom air and liquid cooling, plus RGB synced to your palette for that perfect glow. Looks cool : literally."],["I already have parts. Will you build it?","Definitely : that’s our BYOP service. Send us the components and we handle the rest, including cable management and testing."]],Z="/game4funpcs/images/",ge=[["G4F SYSTEMS ONLINE : builder online ","✓"]],Ge=[{label:"RIG DESIGNER",desc:"your colors, zone by zone",go:"designer"},{label:"TESTIMONIALS",desc:"what our clients say : on Google",go:"reviews"},{label:"SERVICES & FAQ",desc:"what we offer + straight answers",go:"intel"},{label:"CONTACT",desc:"humans. reachable.",go:"contact"}];function ze(e,t){e.innerHTML=`
    <div class="wrap menu-wrap">
      <div class="menu-left">
        <div class="boot-log mini" id="bootLog"></div>
        <span class="kicker">Welcome to Game4FunPCs</span>
        <h1 class="menu-title">Custom-Built Gaming PCs.<br>Zero Compromises. All&nbsp;Fun.</h1>
        <p class="menu-tag body-copy">At Game4FunPCs, we hand-build every PC with precision, passion, and performance
        in mind. Whether you're a casual gamer, competitive player, or content creator, we deliver powerful
        PCs designed around your style : and built to last.</p>
        <button class="btn btn-start" id="startBuildBtn">▶ START MY BUILD</button>
        <nav class="game-menu" id="gameMenu" aria-label="Main menu">
          ${Ge.map((c,g)=>`
            <button class="gm-item ${g===0?"sel":""}" data-go="${c.go}" data-i="${g}" style="--d:${g*70}ms">
              <span class="gm-caret">▶</span>
              <span class="gm-num">0${g+1}</span>
              <span class="gm-label">${c.label}</span>
              <span class="gm-desc">${c.desc}</span>
            </button>`).join("")}
        </nav>
        <div class="menu-contact">
          <a href="${$.phoneHref}">${$.phone}</a>
          <span class="dot">·</span>
          <a href="mailto:${$.email}">${$.email}</a>
          <span class="socials">${$e.map(c=>`<a href="${c.href}" target="_blank" rel="noopener">${c.name.slice(0,2)}</a>`).join("")}</span>
        </div>
        <div class="menu-hint step-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>ENTER</kbd> select</div>
        <div class="partners">
          <span class="partners-label">POWERED BY</span>
          ${["nvidia","amd","intel","msi","giga","rog"].map(c=>`<img src="${Z}${c}.png" alt="${c}" loading="lazy">`).join("")}
        </div>
      </div>
      <div class="menu-right">
        <img class="hero-img" src="${Z}img-pc1.png" alt="Purple RGB tower, hand-built by Game4FunPCs">
        <button class="btn-quote" id="quoteBtn">GET FREE QUOTE <span class="circ">→</span></button>
        <button class="mini-reviews" id="miniReviews" title="Read the reviews">
          <div class="mini-head">
            <span class="stars-row">${Array.from({length:5},()=>`<img src="${Z}Symbol.png" alt="">`).join("")}</span>
            <span class="mini-score"><b>${Y.rating}</b> · ${Y.count} Google reviews</span>
          </div>
          <p class="mini-quote">“${H[0].text.slice(0,92)}…”</p>
          <span class="mini-link">READ THEM →</span>
        </button>
      </div>
    </div>`;const a=e.querySelector("#bootLog");let n=0;const s=setInterval(()=>{if(n>=ge.length){clearInterval(s);return}const[c,g]=ge[n++],d=document.createElement("div");d.textContent=c;const p=document.createElement("span");p.className="ok",p.textContent=g,d.appendChild(p),a.appendChild(d)},220),i=[...e.querySelectorAll(".gm-item")];let r=0;function o(c,g=!0){r=(c+i.length)%i.length,i.forEach((d,p)=>d.classList.toggle("sel",p===r)),g&&t.audio.hover()}function l(){const c=i[r].dataset.go;clearInterval(s),t.audio.unlock(),c==="quiz"?t.audio.boot():t.audio.advance(),t.go(c)}i.forEach((c,g)=>{c.addEventListener("mouseenter",()=>o(g)),c.addEventListener("click",()=>{o(g,!1),l()})}),e.querySelector("#miniReviews").addEventListener("click",()=>{clearInterval(s),t.audio.unlock(),t.audio.advance(),t.go("reviews")});const m=()=>{clearInterval(s),t.audio.unlock(),t.audio.boot(),t.go("quiz")};return e.querySelector("#startBuildBtn").addEventListener("click",m),e.querySelector("#quoteBtn").addEventListener("click",m),{onLeave:()=>clearInterval(s),onKey:c=>{c.key==="ArrowDown"?(c.preventDefault(),o(r+1)):c.key==="ArrowUp"?(c.preventDefault(),o(r-1)):c.key==="Enter"&&(c.preventDefault(),l())}}}const Ue=Object.freeze(Object.defineProperty({__proto__:null,render:ze},Symbol.toStringTag,{value:"Module"}));function ke(){return`
  <svg class="rig-svg" viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="glowg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color:var(--z-glow, rgb(var(--accent-rgb)))" stop-opacity="0.22"/>
        <stop offset="1" style="stop-color:var(--z-glow, rgb(var(--accent-rgb)))" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <rect class="glow" x="24" y="20" width="272" height="360" rx="12" fill="url(#glowg)"/>
    <!-- case -->
    <g id="p-case" class="part">
      <rect x="18" y="14" width="284" height="372" rx="14" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="32" y="28" width="256" height="344" rx="8" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 5"/>
      <circle cx="286" cy="32" r="3" fill="rgb(var(--accent-rgb))" opacity="0.9"/>
    </g>
    <!-- front fans -->
    <g id="p-fans" class="part">
      ${[92,172,252].map(e=>`
      <g class="spin">
        <circle cx="66" cy="${e}" r="27" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
        <path d="M66 ${e-20} A20 20 0 0 1 66 ${e}  M${66+17.3} ${e+10} A20 20 0 0 1 66 ${e} M${66-17.3} ${e+10} A20 20 0 0 1 66 ${e}"
          class="fanblade" stroke="var(--z-fans, var(--faint))" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="66" cy="${e}" r="5" fill="var(--line2)"/>
      </g>`).join("")}
    </g>
    <!-- CPU + cooler -->
    <g id="p-cpu" class="part">
      <rect x="150" y="64" width="76" height="76" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <g class="spin">
        <circle cx="188" cy="102" r="26" stroke="var(--z-cpu, var(--faint))" stroke-width="2"/>
        <path d="M188 84 A18 18 0 0 1 188 102 M203.6 111 A18 18 0 0 1 188 102 M172.4 111 A18 18 0 0 1 188 102" class="fanblade" stroke="var(--z-cpu, var(--faint))" stroke-width="2.2" stroke-linecap="round"/>
      </g>
      <text x="188" y="156" text-anchor="middle" font-family="var(--font-m)" font-size="9" letter-spacing="2" fill="var(--faint)">CPU</text>
    </g>
    <!-- RAM -->
    <g id="p-ram" class="part">
      <rect x="244" y="60" width="9" height="88" rx="3" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="262" y="60" width="9" height="88" rx="3" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <rect x="246" y="66" width="5" height="10" rx="1" fill="var(--z-ram, rgb(var(--accent-rgb)))" opacity="0.85"/>
      <rect x="264" y="66" width="5" height="10" rx="1" fill="var(--z-ram, rgb(var(--accent-rgb)))" opacity="0.85"/>
    </g>
    <!-- GPU -->
    <g id="p-gpu" class="part">
      <rect x="118" y="210" width="180" height="48" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2.5"/>
      <rect x="118" y="210" width="180" height="7" rx="3.5" fill="var(--z-gpu, rgb(var(--accent-rgb)))" opacity="0.9"/>
      <circle cx="160" cy="236" r="14" stroke="var(--faint)" stroke-width="2"/>
      <circle cx="210" cy="236" r="14" stroke="var(--faint)" stroke-width="2"/>
      <text x="272" y="240" text-anchor="middle" font-family="var(--font-m)" font-size="9" letter-spacing="1.5" fill="var(--faint)">GPU</text>
    </g>
    <!-- PSU shroud -->
    <g id="p-psu" class="part">
      <rect x="118" y="316" width="180" height="52" rx="8" stroke="var(--p-body, var(--line2))" stroke-width="2"/>
      <text x="208" y="347" text-anchor="middle" font-family="var(--font-m)" font-weight="700" font-size="14" letter-spacing="4" fill="var(--faint)">G4F</text>
    </g>
    <!-- click targets for the designer (inert elsewhere) -->
    <rect class="zone-hit" data-zone="fans" x="32" y="58" width="70" height="226" fill="transparent"/>
    <rect class="zone-hit" data-zone="cpu" x="144" y="58" width="88" height="96" fill="transparent"/>
    <rect class="zone-hit" data-zone="ram" x="238" y="54" width="40" height="100" fill="transparent"/>
    <rect class="zone-hit" data-zone="gpu" x="112" y="204" width="192" height="60" fill="transparent"/>
    <rect class="zone-hit" data-zone="glow" x="112" y="312" width="192" height="62" fill="transparent"/>
  </svg>`}const A=[{id:"fans",name:"Front fans ×3"},{id:"cpu",name:"CPU cooler"},{id:"ram",name:"RAM sticks"},{id:"gpu",name:"GPU accent"},{id:"glow",name:"Case glow"}],P={standard:{label:"STANDARD",blurb:"Stock look : classic dark hardware.",body:"#3c3c42",part:"#5a5a64"},white:{label:"ALL WHITE",blurb:"White case, white fans, white cables. Spotless.",body:"#f2f2f2",part:"#e6e6e6"},black:{label:"ALL BLACK",blurb:"Murdered out : matte black everything.",body:"#26262b",part:"#33333a"}},De={fans:{on:!0,color:"#c100ff"},cpu:{on:!0,color:"#c100ff"},ram:{on:!0,color:"#c100ff"},gpu:{on:!0,color:"#c100ff"},glow:{on:!0,color:"#c100ff"}};function re(){return{paint:"standard",rgb:!0,zones:structuredClone(De)}}function x(e){return!M(e)||e.rgb===!1?[]:A.filter(t=>e.zones[t.id].on)}function M(e){return e&&e.paint&&e.zones}function He(e){if(!M(e))return"SIGNATURE";const t=x(e);if(e.paint!=="standard")return P[e.paint].label+(t.length?" + RGB":"");if(!t.length)return"STEALTH";const a=new Set(t.map(n=>e.zones[n.id].color));return a.size===1&&a.has("#c100ff")?"SIGNATURE":"CUSTOM RGB"}function Te(e,t){if(!e||!M(t))return;const a=P[t.paint],n=new Set(x(t).map(s=>s.id));e.style.setProperty("--p-body",a.body);for(const s of A){const i=s.id==="glow"?"transparent":a.part;e.style.setProperty(`--z-${s.id}`,n.has(s.id)?t.zones[s.id].color:i)}}function _e(e){if(!M(e))return"#c100ff";const t=new Set(x(e).map(a=>a.id));for(const a of["glow","fans","gpu","cpu","ram"])if(t.has(a))return e.zones[a].color;return e.paint==="white"?"#e8eaf0":"#9aa0aa"}function ae(e){return M(e)?P[e.paint].label:"STANDARD"}function Fe(e){if(!M(e))return"standard";const t=x(e);return t.length?t.map(a=>`${a.id} ${e.zones[a.id].color}`).join(" · "):"none : no RGB"}function oe(e,t){M(t.state.rig)||(t.state.rig=re());const a=t.state.rig;a.rgb===void 0&&(a.rgb=A.some(i=>a.zones[i.id].on)),e.innerHTML=`
    <div class="designer">
      <div class="dz-stage">
        <div class="rig-box rig-live">${ke()}</div>
        <p class="dz-hint">Tap a part of the PC to jump to its controls</p>
      </div>
      <div class="dz-panel">
        <span class="dz-sec">PART PAINT : the physical hardware</span>
        <div class="preset-chips">
          ${Object.entries(P).map(([i,r])=>`
            <button class="tier-tab" data-paint="${i}" aria-pressed="${a.paint===i}">${r.label}</button>`).join("")}
        </div>
        <p class="dz-blurb" id="dzBlurb"></p>
        <span class="dz-sec" style="margin-top:20px">LIGHTING : any paint, with or without RGB</span>
        <div class="preset-chips">
          <button class="tier-tab" data-rgb="on" aria-pressed="${a.rgb}">RGB LIGHTING</button>
          <button class="tier-tab" data-rgb="off" aria-pressed="${!a.rgb}">NO RGB</button>
        </div>
        <div class="zone-list" id="zoneWrap" style="margin-top:12px">
          ${A.map(i=>`
            <div class="zone-row" data-row="${i.id}">
              <span class="zone-name">${i.name}</span>
              <label class="zone-toggle"><input type="checkbox" data-on="${i.id}" ${a.zones[i.id].on?"checked":""}> RGB</label>
              <input type="color" class="zone-color" data-color="${i.id}" value="${a.zones[i.id].color}" title="${i.name} color">
            </div>`).join("")}
        </div>
      </div>
    </div>`;const n=e.querySelector(".rig-svg");n.querySelectorAll(".part").forEach(i=>i.classList.add("in")),n.classList.add("powered","lit","designable");function s(){Te(n,a),t.setAccent({accent:_e(a)}),e.querySelectorAll("[data-paint]").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.paint===a.paint))),e.querySelectorAll("[data-rgb]").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.rgb==="on"===a.rgb))),e.querySelector("#zoneWrap").hidden=!a.rgb,e.querySelector("#dzBlurb").textContent=P[a.paint].blurb,A.forEach(i=>{e.querySelector(`[data-on="${i.id}"]`).checked=a.zones[i.id].on,e.querySelector(`[data-color="${i.id}"]`).value=a.zones[i.id].color,e.querySelector(`[data-row="${i.id}"]`).classList.toggle("is-off",!a.zones[i.id].on)})}e.querySelectorAll("[data-paint]").forEach(i=>i.addEventListener("click",()=>{a.paint=i.dataset.paint,t.audio.select(),s()})),e.querySelectorAll("[data-rgb]").forEach(i=>i.addEventListener("click",()=>{a.rgb=i.dataset.rgb==="on",a.rgb&&!A.some(r=>a.zones[r.id].on)&&A.forEach(r=>{a.zones[r.id].on=!0}),t.audio.select(),s()})),A.forEach(i=>{e.querySelector(`[data-on="${i.id}"]`).addEventListener("change",r=>{a.zones[i.id].on=r.target.checked,t.audio.select(),s()}),e.querySelector(`[data-color="${i.id}"]`).addEventListener("input",r=>{a.zones[i.id].color=r.target.value,a.zones[i.id].on=!0,a.rgb=!0,s()})}),n.querySelectorAll(".zone-hit").forEach(i=>i.addEventListener("click",()=>{const r=e.querySelector(`[data-row="${i.dataset.zone}"]`);r&&(r.scrollIntoView({block:"nearest",behavior:"smooth"}),r.classList.remove("pulse"),r.offsetWidth,r.classList.add("pulse"),t.audio.hover())})),s()}function je(e,t){return e.innerHTML=`
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Rig Designer</span>
        <h2 class="step-title">Paint it. Light it. Yours.</h2>
        <p class="sub">Pick the paint : all white, all black, or standard : then decide which parts glow, and in what colors.</p>
      </div>
      <div id="dzMount"></div>
      <div class="sub-cta">
        <button class="btn-quote" id="buildBtn">BUILD THIS RIG <span class="circ">→</span></button>
      </div>
    </div>`,oe(e.querySelector("#dzMount"),t),e.querySelector("#backBtn").addEventListener("click",()=>{t.audio.back(),t.go("home")}),e.querySelector("#buildBtn").addEventListener("click",()=>{t.audio.boot(),t.go("quiz")}),{}}const We=Object.freeze(Object.defineProperty({__proto__:null,mountDesigner:oe,render:je},Symbol.toStringTag,{value:"Module"})),W="/game4funpcs/images/",Ye=Array.from({length:5},()=>`<img src="${W}Symbol.png" alt="">`).join("");function Ve(e,t){e.innerHTML=`
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Testimonials</span>
        <h2 class="step-title">What our respectable<br>clients say</h2>
        <p class="sub">${Y.rating} ★ across ${Y.count} Google reviews. Here are a few of them.</p>
      </div>
      <div class="carousel" id="carousel">
        <button class="car-arrow" id="prevBtn" aria-label="Previous review">‹</button>
        <div class="car-stage">
          <div class="review-card" id="reviewCard">
            <div class="review-top">
              <img class="avatar" src="${W}male.png" alt="">
              <div>
                <span class="review-name" id="revName"></span>
                <div class="stars-row" aria-label="5 out of 5 stars">${Ye}</div>
              </div>
            </div>
            <blockquote class="review-text" id="revText"></blockquote>
            <div class="review-meta">
              <span class="review-src">POSTED ON <b>GOOGLE</b></span>
            </div>
          </div>
        </div>
        <button class="car-arrow" id="nextBtn" aria-label="Next review">›</button>
      </div>
      <div class="proof-strip">
        <img src="${W}build-1493.png" alt="A real customer build by Game4FunPCs" class="proof-img">
        <img src="${W}img-pc1.png" alt="Purple RGB tower hand-built by Game4FunPCs" class="proof-img proof-tall">
        <span class="proof-cap">↑ actual customer builds, not stock renders</span>
      </div>
      <div class="car-dots" id="dots">
        ${H.map((l,m)=>`<button class="dot-btn" data-i="${m}" aria-label="Review ${m+1}"></button>`).join("")}
      </div>
      <div class="sub-cta">
        <button class="btn-quote" id="buildBtn">BECOME THE NEXT REVIEW <span class="circ">→</span></button>
        <span class="step-hint"><kbd>←</kbd><kbd>→</kbd> to browse</span>
      </div>
    </div>`;const a=e.querySelector("#reviewCard"),n=[...e.querySelectorAll(".dot-btn")];let s=0,i=setInterval(()=>r(s+1,!1),9e3);function r(l,m=!0){s=(l+H.length)%H.length;const c=H[s];a.classList.remove("flip"),a.offsetWidth,a.classList.add("flip"),e.querySelector("#revText").textContent=`“${c.text}”`,e.querySelector("#revName").textContent=c.name,n.forEach((g,d)=>g.classList.toggle("on",d===s)),m&&t.audio.select()}function o(l){clearInterval(i),i=setInterval(()=>r(s+1,!1),9e3),r(l)}return r(0,!1),e.querySelector("#prevBtn").addEventListener("click",()=>o(s-1)),e.querySelector("#nextBtn").addEventListener("click",()=>o(s+1)),n.forEach(l=>l.addEventListener("click",()=>o(+l.dataset.i))),e.querySelector("#backBtn").addEventListener("click",()=>{t.audio.back(),t.go("home")}),e.querySelector("#buildBtn").addEventListener("click",()=>{t.audio.boot(),t.go("quiz")}),{onLeave:()=>clearInterval(i),onKey:l=>{l.key==="ArrowRight"?(l.preventDefault(),o(s+1)):l.key==="ArrowLeft"&&(l.preventDefault(),o(s-1))}}}const Ke=Object.freeze(Object.defineProperty({__proto__:null,render:Ve},Symbol.toStringTag,{value:"Module"})),Xe="/game4funpcs/images/",Qe=[{id:"services",label:"SERVICES"},{id:"quest",label:"HOW IT WORKS"},{id:"faq",label:"FAQ"}];function Ze(e,t){let a="services",n=0;e.innerHTML=`
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Our Services</span>
        <h2 class="step-title">Here's what we offer</h2>
      </div>
      <div class="tier-tabs intel-tabs">
        ${Qe.map(r=>`<button class="tier-tab" data-tab="${r.id}" aria-pressed="${r.id===a}">${r.label}</button>`).join("")}
      </div>
      <div class="intel-body" id="intelBody"></div>
    </div>`;const s=e.querySelector("#intelBody");function i(){if(a==="services"){const r=["step-1.png","step-2.png","step-3.png","footer-pc.png"].map(o=>Xe+o);s.innerHTML=`
        <div class="svc-grid">
          ${Pe.map(([o,l],m)=>`
            <div class="info-card" style="--d:${m*60}ms">
              <img class="svc-img" src="${r[m]}" alt="">
              <span class="n">SVC 0${m+1}</span>
              <h3>${o}</h3>
              <p>${l}</p>
            </div>`).join("")}
        </div>
        <p class="intel-note">+ Custom air & liquid cooling · RGB synced to your palette · Honest, transparent pricing : no markups, no gimmicks.</p>`}else if(a==="quest")s.innerHTML=`
        <div class="svc-grid">
          ${xe.map(([r,o],l)=>`
            <div class="info-card" style="--d:${l*60}ms">
              <span class="n">STEP 0${l+1}</span>
              <h3>${r}</h3>
              <p>${o}</p>
            </div>`).join("")}
        </div>`;else{s.innerHTML=`
        <div class="faq-split">
          <div class="faq-list">
            ${B.map(([o],l)=>`
              <button class="faq-q ${l===n?"sel":""}" data-i="${l}">
                <span class="gm-caret">▶</span>${o}
              </button>`).join("")}
          </div>
          <div class="faq-answer panel">
            <span class="kicker" style="font-size:10.5px" id="faqQ"></span>
            <p id="faqA"></p>
          </div>
        </div>`;const r=()=>{s.querySelectorAll(".faq-q").forEach((o,l)=>o.classList.toggle("sel",l===n)),s.querySelector("#faqQ").textContent=B[n][0].toUpperCase(),s.querySelector("#faqA").textContent=B[n][1]};r(),s.querySelectorAll(".faq-q").forEach(o=>{o.addEventListener("click",()=>{n=+o.dataset.i,r(),t.audio.select()}),o.addEventListener("mouseenter",()=>t.audio.hover())})}}return i(),e.querySelectorAll(".intel-tabs .tier-tab").forEach(r=>r.addEventListener("click",()=>{a=r.dataset.tab,e.querySelectorAll(".intel-tabs .tier-tab").forEach(o=>o.setAttribute("aria-pressed",String(o===r))),t.audio.select(),i()})),e.querySelector("#backBtn").addEventListener("click",()=>{t.audio.back(),t.go("home")}),{onKey:r=>{a==="faq"&&(r.key==="ArrowDown"?(r.preventDefault(),n=(n+1)%B.length,i(),t.audio.hover()):r.key==="ArrowUp"&&(r.preventDefault(),n=(n-1+B.length)%B.length,i(),t.audio.hover()))}}}const Je=Object.freeze(Object.defineProperty({__proto__:null,render:Ze},Symbol.toStringTag,{value:"Module"}));function et(e,t){return e.innerHTML=`
    <div class="wrap sub-scene">
      <div class="sub-head">
        <button class="link-btn back-link" id="backBtn">← MENU</button>
        <span class="kicker">Contact</span>
        <h2 class="step-title">Get in touch with us</h2>
        <p class="sub">Have questions, feedback, or need assistance? We're here to help : reach out and let's connect.</p>
      </div>
      <div class="contact-grid">
        <a class="info-card contact-card" href="${$.phoneHref}">
          <span class="n">CALL / TEXT</span>
          <h3>${$.phone}</h3>
          <p>Fastest way to reach a builder.</p>
        </a>
        <a class="info-card contact-card" href="mailto:${$.email}">
          <span class="n">EMAIL</span>
          <h3 class="break">${$.email}</h3>
          <p>Quotes, questions, anything else.</p>
        </a>
        <a class="info-card contact-card" href="mailto:${$.warrantyEmail}">
          <span class="n">WARRANTY & SUPPORT</span>
          <h3 class="break">${$.warrantyEmail}</h3>
          <p>Post-sale support, remote help, warranty claims.</p>
        </a>
        <div class="info-card">
          <span class="n">FOLLOW THE BUILDS</span>
          <div class="social-row">
            ${$e.map(a=>`<a class="btn btn-ghost social-btn" href="${a.href}" target="_blank" rel="noopener">${a.name}</a>`).join("")}
          </div>
        </div>
      </div>
      <div class="sub-cta">
        <button class="btn btn-primary" id="buildBtn">▶ OR JUST START YOUR BUILD</button>
      </div>
    </div>`,e.querySelector("#backBtn").addEventListener("click",()=>{t.audio.back(),t.go("home")}),e.querySelector("#buildBtn").addEventListener("click",()=>{t.audio.boot(),t.go("quiz")}),{}}const tt=Object.freeze(Object.defineProperty({__proto__:null,render:et},Symbol.toStringTag,{value:"Module"})),le=[{id:"fortnite",name:"Fortnite",code:"FN",hue:262,factor:1.6,tag:"Battle Royale"},{id:"valorant",name:"Valorant",code:"VA",hue:350,factor:3.2,tag:"Tac Shooter"},{id:"warzone",name:"Warzone",code:"WZ",hue:88,factor:1.05,tag:"Battle Royale"},{id:"cs2",name:"Counter-Strike 2",code:"CS",hue:35,factor:2.4,tag:"Tac Shooter"},{id:"apex",name:"Apex Legends",code:"AP",hue:8,factor:1.5,tag:"Battle Royale"},{id:"minecraft",name:"Minecraft",code:"MC",hue:120,factor:2.6,tag:"Sandbox"},{id:"roblox",name:"Roblox",code:"RB",hue:0,factor:2.8,tag:"Platform"},{id:"gtav",name:"GTA V",code:"GT",hue:150,factor:1.5,tag:"Open World"},{id:"cyberpunk",name:"Cyberpunk 2077",code:"CP",hue:55,factor:.7,tag:"RPG · Heavy"},{id:"eldenring",name:"Elden Ring",code:"ER",hue:42,factor:1,cap:60,capNote:"engine cap",tag:"Souls"},{id:"league",name:"League of Legends",code:"LG",hue:190,factor:3,tag:"MOBA"},{id:"rocket",name:"Rocket League",code:"RL",hue:210,factor:2.5,tag:"Sports"},{id:"other",name:"Other titles",code:"++",hue:280,factor:1.5,tag:"Tell us what",other:!0}],V=[{id:"competitive",name:"COMPETITIVE",blurb:"Every frame is a weapon. Performance settings, max FPS, tournament-ready.",settings:"Performance settings",factor:1.5,icon:"crosshair"},{id:"balanced",name:"BALANCED",blurb:"High settings, high frames. The way most people should play.",settings:"High settings",factor:1,icon:"diamond",popular:!0},{id:"cinematic",name:"CINEMATIC",blurb:"Ultra everything. Ray tracing on. Screenshots that look like trailers.",settings:"Ultra + ray tracing",factor:.62,icon:"sparkle"}],K=[{id:"p1080",name:"1080p",blurb:"Esports standard · up to 240Hz+",factor:1},{id:"p1440",name:"1440p",blurb:"The sweet spot. Sharp AND fast.",factor:.72,popular:!0},{id:"uw",name:"ULTRAWIDE",blurb:"1440p ultrawide · full immersion",factor:.62},{id:"p4k",name:"4K",blurb:"Maximum fidelity. No compromise.",factor:.42}],Me={floor:800,ceil:6e3,step:100,defMin:1500,defMax:2800};function ce(e,t){const a=(e+t)/2;return a<1900?C.starter:a<3800?C.pro:C.ultra}function N(e,t=!1){return`$${e.toLocaleString("en-US")}${t&&e>=Me.ceil?"+":""}`}const C={starter:{id:"starter",name:"STARTER",power:100,price:"$1,299 – $1,599",gpu:"GeForce RTX 5060",cpu:"AMD Ryzen 5 9600X",ram:"16GB DDR5-5600 (open upgrade path)",ssd:"1TB NVMe Gen4"},pro:{id:"pro",name:"PRO",power:175,price:"$2,499 – $2,899",gpu:"GeForce RTX 5070 Ti",cpu:"AMD Ryzen 7 9800X3D",ram:"32GB DDR5-6000",ssd:"2TB NVMe Gen4"},ultra:{id:"ultra",name:"ULTRA",power:300,price:"$5,299+",gpu:"GeForce RTX 5090",cpu:"AMD Ryzen 7 9800X3D",ram:"64GB DDR5-6000",ssd:"4TB NVMe Gen5"}};function ne(e,t,a,n){const s=K.find(m=>m.id===a),i=V.find(m=>m.id===n);let r=t.power*e.factor*s.factor*i.factor;r=Math.round(r/5)*5;let o=!1;e.cap&&r>=e.cap&&(r=e.cap,o=!0);const l=!o&&r>=240;return l&&(r=240),{fps:r,plus:l,capped:o,capNote:o?e.capNote:null}}function se(e){return e.capped?`${e.fps} FPS`:e.plus?"240+ FPS":`${e.fps} FPS`}const at="https://formspree.io/f/mnpqarzr",nt={crosshair:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>',diamond:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/><path d="M12 7.5 16.5 12 12 16.5 7.5 12Z"/></svg>',sparkle:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c.6 4.8 1.8 6.2 7 7-5.2.8-6.4 2.2-7 7-.6-4.8-1.8-6.2-7-7 5.2-.8 6.4-2.2 7-7Z"/><path d="M19 15.5c.3 2 .8 2.6 3 3-2.2.4-2.7 1-3 3-.3-2-.8-2.6-3-3 2.2-.4 2.7-1 3-3Z"/></svg>'},_=[{id:"games",level:1,title:"PICK YOUR GAMES",sub:"Select everything you play : this tunes your whole build. Grab as many as you want.",valid:e=>e.games.length>0,cta:"LOCK IN",render(e,t){e.innerHTML=`<div class="tile-grid">${le.map(a=>`
        <button class="tile" data-id="${a.id}" style="--h:${a.hue}" aria-pressed="${t.state.games.includes(a.id)}">
          <span class="code">${a.code}</span>
          <span class="g-name">${a.name}</span>
          <span class="g-tag">${a.tag}</span>
          <span class="check">✓</span>
        </button>`).join("")}</div>
        <div class="custom-input" id="otherBox" ${t.state.games.includes("other")?"":"hidden"}>
          <input type="text" id="otherTxt" maxlength="140"
            placeholder="What else do you play? e.g. 'Sims 4, Baldur's Gate 3, flight sims'"
            value="${be(t.state.otherGames)}">
        </div>`,e.querySelectorAll(".tile").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.id,s=t.state.games.includes(n);s?(t.state.games=t.state.games.filter(i=>i!==n),t.audio.deselect()):(t.state.games.push(n),t.audio.select()),a.setAttribute("aria-pressed",String(!s)),n==="other"&&(e.querySelector("#otherBox").hidden=s,s||e.querySelector("#otherTxt").focus()),t.refresh()})}),e.querySelector("#otherTxt").addEventListener("input",a=>{t.state.otherGames=a.target.value})}},{id:"style",level:2,title:"HOW SHOULD IT LOOK?",sub:"Graphics philosophy. There is no wrong answer : only wrong frame rates.",valid:e=>!!e.style,render(e,t){e.innerHTML=`<div class="card-grid">${V.map(a=>`
        <button class="card" data-id="${a.id}" aria-pressed="${t.state.style===a.id}">
          ${a.popular?'<span class="badge">MOST PICKED</span>':""}
          <span class="c-icon">${nt[a.icon]}</span>
          <span class="c-name">${a.name}</span>
          <span class="c-blurb">${a.blurb}</span>
          <span class="radio"></span>
        </button>`).join("")}</div>`,fe(e,t,"style")}},{id:"display",level:3,title:"YOUR BATTLEFIELD",sub:"What screen are we feeding frames to?",valid:e=>!!e.display,render(e,t){e.innerHTML=`
        <div class="card-grid">${K.map(a=>`
          <button class="card" data-id="${a.id}" aria-pressed="${t.state.display===a.id}">
            ${a.popular?'<span class="badge">MOST PICKED</span>':""}
            <span class="c-name">${a.name}</span>
            <span class="c-blurb">${a.blurb}</span>
            <span class="radio"></span>
          </button>`).join("")}</div>
        <label class="toggle-row">
          <input type="checkbox" id="monitorChk" ${t.state.monitor?"checked":""}>
          I NEED A MONITOR TOO : INCLUDE ONE IN MY QUOTE
        </label>`,fe(e,t,"display"),e.querySelector("#monitorChk").addEventListener("change",a=>{t.state.monitor=a.target.checked,t.audio.select()})}},{id:"rig",level:4,title:"DESIGN YOUR RIG",sub:"Pick a preset : or flip zones on and choose your own colors. All white, all black, or full custom RGB.",valid:()=>!0,render(e,t){oe(e,t)}},{id:"theme",level:5,title:"THEME IT AROUND YOU",sub:"Into superheroes? Anime? A favorite game? Tell us and we'll design the whole build around it : figures, decals, color story, the works. (Optional)",valid:()=>!0,render(e,t){const a=["SUPERHEROES","ANIME","GAME WORLDS","SCI-FI","FANTASY","RACING","SPORTS","MUSIC","RETRO","MINIMAL / CLEAN"];e.innerHTML=`
        <div class="theme-chips">
          ${a.map(n=>`<button class="theme-chip" data-tag="${n}" aria-pressed="${t.state.themeTags.includes(n)}">${n}</button>`).join("")}
        </div>
        <div class="custom-input" style="margin-top:20px">
          <input type="text" id="themeTxt" maxlength="180"
            placeholder="Anything specific? e.g. 'green rage monster vibes with a figure holding the GPU', 'clean Miami sunset look'"
            value="${be(t.state.themeText)}">
        </div>`,e.querySelectorAll(".theme-chip").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.tag,i=t.state.themeTags.includes(s);i?(t.state.themeTags=t.state.themeTags.filter(r=>r!==s),t.audio.deselect()):(t.state.themeTags.push(s),t.audio.select()),n.setAttribute("aria-pressed",String(!i))}),n.addEventListener("mouseenter",()=>t.audio.hover())}),e.querySelector("#themeTxt").addEventListener("input",n=>{t.state.themeText=n.target.value})}},{id:"budget",level:6,title:"SET YOUR BUDGET",sub:"Real talk: the AI boom has parts prices inflated : RAM alone costs 3–5× what it did last year, and GPUs took three price hikes in 2026. Right now capable 1080p rigs start around $1,300, high-refresh 1440p runs $2,500–$2,900, and no-limits 4K goes $5,000+. Set your range : we build to it, parts at transparent cost + a flat build fee.",valid:e=>e.budgetMin!=null&&e.budgetMax!=null&&e.budgetMin<e.budgetMax,cta:"BUILD IT ⚡",render(e,t){const a=Me;t.state.budgetMin==null&&(t.state.budgetMin=a.defMin),t.state.budgetMax==null&&(t.state.budgetMax=a.defMax),e.innerHTML=`
        <div class="budget-box">
          <div class="range-row">
            <div class="range-head"><span class="range-label">MIN BUDGET</span><output id="minOut"></output></div>
            <input type="range" id="minR" min="${a.floor}" max="${a.ceil}" step="${a.step}" value="${t.state.budgetMin}">
          </div>
          <div class="range-row">
            <div class="range-head"><span class="range-label">MAX BUDGET</span><output id="maxOut"></output></div>
            <input type="range" id="maxR" min="${a.floor}" max="${a.ceil}" step="${a.step}" value="${t.state.budgetMax}">
          </div>
          <div class="budget-hint" id="budgetHint"></div>
        </div>`;const n=e.querySelector("#minR"),s=e.querySelector("#maxR"),i=r=>{t.state.budgetMin=+n.value,t.state.budgetMax=+s.value,e.querySelector("#minOut").textContent=N(t.state.budgetMin),e.querySelector("#maxOut").textContent=N(t.state.budgetMax,!0);const o=ce(t.state.budgetMin,t.state.budgetMax);e.querySelector("#budgetHint").textContent=`→ that range builds you a ${o.name}-class rig (${o.gpu})`,r&&t.audio.tick(),t.refresh()};n.addEventListener("input",()=>{+n.value>+s.value-a.step&&(s.value=Math.min(a.ceil,+n.value+a.step)),i(!0)}),s.addEventListener("input",()=>{+s.value<+n.value+a.step&&(n.value=Math.max(a.floor,+s.value-a.step)),i(!0)}),i(!1)}}];function fe(e,t,a){e.querySelectorAll(".card").forEach(n=>{n.addEventListener("click",()=>{t.state[a]=n.dataset.id,e.querySelectorAll(".card").forEach(s=>s.setAttribute("aria-pressed",String(s===n))),t.audio.select(),t.refresh()})})}function be(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function st(e,t,a={}){let n=a.step??0;function s(){const o=_[n];t.setProgress(n+1,_.length),e.innerHTML=`
      <div class="wrap">
        <div class="step-head">
          <span class="kicker">LEVEL 0${o.level} / 0${_.length}</span>
          <h2 class="step-title">${o.title}</h2>
          <p class="sub">${o.sub}</p>
        </div>
        <div id="stepBody"></div>
        <div class="step-nav">
          <button class="btn btn-ghost" id="backBtn">${n===0?"← MAIN MENU":"← BACK"}</button>
          <span class="step-hint"><kbd>ENTER</kbd> to continue</span>
          <button class="btn btn-primary" id="nextBtn" disabled>${o.cta||"NEXT →"}</button>
        </div>
      </div>`;const l={...t,refresh:m};o.render(e.querySelector("#stepBody"),l),m(),e.querySelector("#backBtn").addEventListener("click",()=>{t.audio.back(),n===0?t.go("home"):(n--,i())}),e.querySelector("#nextBtn").addEventListener("click",c);function m(){e.querySelector("#nextBtn").disabled=!o.valid(t.state)}function c(){if(!o.valid(t.state)){t.audio.deny();return}t.audio.advance(),n===_.length-1?t.go("assembly"):(n++,i())}return e.querySelectorAll(".tile, .card, .btn").forEach(g=>g.addEventListener("mouseenter",()=>t.audio.hover())),c}function i(){e.firstElementChild.classList.add("scene-exit"),setTimeout(()=>{const l=s();e.firstElementChild.classList.add("scene-enter"),r.onEnter=l},180)}const r={onEnter:s()};return r}const it=_.length,rt=Object.freeze(Object.defineProperty({__proto__:null,STEP_COUNT:it,render:st},Symbol.toStringTag,{value:"Module"})),ot=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function lt(e,t){const a=t.state,n=ce(a.budgetMin,a.budgetMax);M(a.rig)||(a.rig=re());const s=V.find(u=>u.id===a.style),i=K.find(u=>u.id===a.display),r=le.filter(u=>a.games.includes(u.id)),o=[...a.themeTags,a.themeText].filter(Boolean).join(", ");e.innerHTML=`
    <div class="wrap">
      <div class="step-head" style="margin-bottom:24px">
        <span class="kicker">BUILD SEQUENCE INITIATED</span>
        <h2 class="step-title">ASSEMBLING YOUR RIG</h2>
      </div>
      <div class="asm">
        <div class="rig-box">${ke()}</div>
        <div>
          <div class="term" id="term"></div>
          <div class="reveal-list" id="reveals"></div>
          <div id="stampBox"></div>
        </div>
      </div>
    </div>
    <button class="skip-hint" id="skipBtn">CLICK TO FAST-FORWARD ⏩</button>`;const l=e.querySelector("#term"),m=e.querySelector("#reveals"),c=e.querySelector(".rig-svg");let g=ot?6:1,d=!0;e.querySelector("#skipBtn").addEventListener("click",u=>{g=8,u.currentTarget.textContent="FAST-FORWARDING…"});const p=u=>new Promise(f=>setTimeout(f,u/g));async function v(u){const f=document.createElement("div");f.className="ln";const h=document.createElement("span");h.className="caret";const R=document.createElement("span");R.className="p",R.textContent="> ",f.appendChild(R),f.appendChild(h),l.querySelectorAll(".caret").forEach(G=>G.remove()),l.appendChild(f);for(const[G,F]of u){const z=document.createElement("span");F&&(z.className=F),f.insertBefore(z,h);for(const q of G){if(!d)return;z.textContent+=q,Math.random()<.25&&t.audio.tick(),await p(13)}}}function y(u){const f=c.querySelector("#"+u);f&&f.classList.add("in")}async function S(u){if(u.other){const q=document.createElement("div");q.className="reveal-row",q.innerHTML=`
        <span class="rg">Other titles</span>
        <span class="rf">✓</span>
        <span class="rs">tuned & optimized per game before shipping</span>`,m.appendChild(q),t.audio.select();return}const f=ne(u,n,a.display,a.style),h=document.createElement("div");h.className="reveal-row",h.innerHTML=`
      <span class="rg">${u.name}</span>
      <span class="rf">0 FPS</span>
      <span class="rs">@ ${i.name} · ${s.settings}${f.capNote?` · ${f.capNote}`:""}</span>`,m.appendChild(h);const R=h.querySelector(".rf"),G=f.fps,F=620/g,z=performance.now();await new Promise(q=>{const qe=setInterval(()=>{const pe=Math.min(1,(performance.now()-z)/F),Ce=1-Math.pow(1-pe,3);R.textContent=`${Math.round(G*Ce)} FPS`,Math.random()<.4&&t.audio.tick(),(pe>=1||!d)&&(clearInterval(qe),q())},30)}),R.textContent=se(f),t.audio.select()}async function b(){await p(400),await v([["loadout received. parsing…"]]),y("p-case"),await p(500),await v([[`${r.length} game${r.length>1?"s":""} registered · `],[s.name,"hl"],[" profile · "],[i.name,"hl"]]),await p(350),await v([["selecting core : "],[n.cpu,"hl"]]),y("p-cpu"),await p(450),await v([["seating memory : "],[n.ram,"hl"]]),y("p-ram"),await p(400),await v([["mounting graphics : "],[n.gpu,"hl"]]),y("p-gpu"),await p(500),await v([["applying paint : "],[`${ae(a.rig)} FINISH`,"hl"]]),Te(c,a.rig),await p(400);const u=x(a.rig).length;await v([["rgb lighting : "],[u?`${u} zone${u>1?"s":""} lit & synced`:"off : stealth mode","hl"]]),c.classList.add("lit"),y("p-fans"),y("p-psu"),c.classList.add("powered"),t.audio.boot(),await p(600),await v(o?[["theming around : "],[o,"hl"]]:[["final polish : "],["cables combed, glass wiped","hl"]]),await p(450),await v([["cable discipline pass… "],["immaculate","hl"]]),await p(350),await v([["stress test : 24h simulated · "],["max 68°C · whisper quiet","hl"]]),await p(500),await v([["calculating "],["your new life","hl"],["…"]]),await p(500),l.querySelectorAll(".caret").forEach(h=>h.remove());for(const h of r){if(!d)return;await S(h),await p(240)}await p(500);const f=document.createElement("div");f.className="stamp",f.textContent="✓ BUILD COMPLETE",e.querySelector("#stampBox").appendChild(f),t.audio.stamp(),e.querySelector("#skipBtn").remove(),await p(1400),d&&t.go("results")}return b(),{onLeave:()=>{d=!1}}}const ct=Object.freeze(Object.defineProperty({__proto__:null,render:lt},Symbol.toStringTag,{value:"Module"}));function dt(e,t){const a=t.state;M(a.rig)||(a.rig=re());const n=V.find(d=>d.id===a.style),s=K.find(d=>d.id===a.display),i=le.filter(d=>a.games.includes(d.id));let r=ce(a.budgetMin,a.budgetMax).id;const o=He(a.rig),l=[...a.themeTags,a.themeText].filter(Boolean).join(", "),m=x(a.rig).map(d=>a.rig.zones[d.id].color),c=[P[a.rig.paint].body,...m.length?m:["#26262b","#141416"]];e.innerHTML=`
    <div class="wrap">
      <div class="res-head">
        <div>
          <span class="kicker">LOADOUT CONFIRMED</span>
          <h2 class="loadout-name" style="margin-top:10px">THE <span class="accent">${o}</span> : <span id="klassName"></span> CLASS</h2>
          <div class="loadout-sub">${l?`Themed around: ${O(l)}`:"Your lighting. Your spec. Your rig."}</div>
          <div class="swatch-strip">${c.map(d=>`<i style="background:${d}"></i>`).join("")}</div>
        </div>
      </div>
      <div class="res-grid">
        <div>
          <div class="panel">
            <span class="kicker" style="font-size:10.5px">YOUR FRAME RATES : @ ${s.name} · ${n.settings}</span>
            <div class="tier-tabs" id="tierTabs">
              ${Object.values(C).map(d=>`<button class="tier-tab" data-id="${d.id}" aria-pressed="${d.id===r}">${d.name}</button>`).join("")}
            </div>
            <div class="fps-table" id="fpsTable"></div>
            <div class="fps-note" id="fpsNote"></div>
          </div>
        </div>
        <div>
          <div class="panel">
            <span class="kicker" style="font-size:10.5px">EVERY G4F BUILD INCLUDES</span>
            <ul class="included" style="margin-top:12px">
              <li><span class="tick">✓</span><span><b>${ae(a.rig)} paint spec</b> : case, fans, and cables color-matched</span></li>
              <li><span class="tick">✓</span><span><b>RGB set to your spec</b> : ${m.length?"every zone in your exact colors, synced":"lights off, stealth build"}</span></li>
              ${l?`<li><span class="tick">✓</span><span><b>Custom theme design</b> : built around: ${O(l)}</span></li>`:""}
              <li><span class="tick">✓</span><span><b>Hand-assembled + cable discipline</b> : back-panel photo proof</span></li>
              <li><span class="tick">✓</span><span><b>24-hour stress test</b> : thermal + noise report shipped with your rig</span></li>
              <li><span class="tick">✓</span><span><b>Live build log</b> : photos at every stage while we build</span></li>
              <li><span class="tick">✓</span><span><b>Limited warranty + post-sale support</b> : remote help included</span></li>
            </ul>
          </div>
          <div class="panel" style="margin-top:18px">
            <span class="kicker" style="font-size:10.5px">CLAIM THIS BUILD</span>
            <p class="sub" style="font-size:13px; margin-top:10px">Your range: <b style="color:var(--text)">${N(a.budgetMin)} – ${N(a.budgetMax,!0)}</b>.
            No payment now : a real builder emails you a transparent, itemized quote within 24 hours.${a.monitor?" Matching monitor included in the quote.":""}</p>
            <form class="claim-form" id="claimForm" novalidate>
              <div><label for="fName">YOUR NAME</label><input id="fName" name="name" autocomplete="name" value="${O(a.contact.name)}"></div>
              <div><label for="fEmail">EMAIL</label><input id="fEmail" name="email" type="email" autocomplete="email" value="${O(a.contact.email)}"></div>
              <div><label for="fNotes">ANYTHING ELSE? (OPTIONAL)</label><textarea id="fNotes" name="notes" placeholder="Timeline, theme ideas, questions…">${O(a.contact.notes)}</textarea></div>
              <div class="form-err" id="formErr"></div>
              <button class="btn btn-primary" type="submit" id="claimBtn">CLAIM THIS BUILD →</button>
            </form>
          </div>
        </div>
      </div>
      <div class="res-back">
        <button class="link-btn" id="editBtn">← tweak my answers</button>
      </div>
    </div>`;function g(){const d=C[r];e.querySelector("#klassName").textContent=d.name;const p=i.filter(b=>!b.other).map(b=>{const u=ne(b,d,a.display,a.style);return{g:b,r:u}}),v=i.some(b=>b.other)?`<div class="fps-row">
          <span class="fg">Other titles</span>
          ${a.otherGames?`<span class="fn">${O(a.otherGames)}</span>`:""}
          <span class="fv">TUNED ✓</span>
        </div>`:"";e.querySelector("#fpsTable").innerHTML=p.map(({g:b,r:u})=>`
      <div class="fps-row">
        <span class="fg">${b.name}</span>
        ${u.capNote?`<span class="fn">${u.capNote}</span>`:""}
        <span class="fv ${u.fps<45&&!u.capped?"low":""}">${se(u)}</span>
      </div>`).join("")+v;const y=p.filter(({r:b})=>b.fps<45&&!b.capped),S=e.querySelector("#fpsNote");y.length&&r!=="ultra"?(S.className="fps-note warn",S.textContent=`⚠ ${y.map(b=>b.g.name).join(", ")} will struggle at these settings on ${C[r].name} : tap a higher class above, or we'll tune settings for you.`):(S.className="fps-note",S.textContent="Honest estimates for your games at your settings : we benchmark every build and ship the receipts.")}return g(),e.querySelectorAll(".tier-tab").forEach(d=>d.addEventListener("click",()=>{r=d.dataset.id,e.querySelectorAll(".tier-tab").forEach(p=>p.setAttribute("aria-pressed",String(p===d))),t.audio.select(),g()})),e.querySelector("#editBtn").addEventListener("click",()=>{t.audio.back(),t.go("quiz")}),e.querySelector("#claimForm").addEventListener("submit",async d=>{d.preventDefault();const p=e.querySelector("#fName").value.trim(),v=e.querySelector("#fEmail").value.trim(),y=e.querySelector("#fNotes").value.trim(),S=e.querySelector("#formErr");if(!p){S.textContent="! we need a name to put on the build log",t.audio.deny();return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){S.textContent="! that email doesn't look right",t.audio.deny();return}S.textContent="",a.contact={name:p,email:v,notes:y};const b=e.querySelector("#claimBtn");b.disabled=!0,b.textContent="TRANSMITTING…";const u=C[r],f={_subject:`⚡ Build claim : ${o} / ${u.name} : ${p}`,name:p,email:v,notes:y||"none",games:i.filter(h=>!h.other).map(h=>h.name).join(", ")||"none listed",other_titles:a.games.includes("other")?a.otherGames||"yes (unspecified)":"none",graphics_style:`${n.name} (${n.settings})`,display:s.name,needs_monitor:a.monitor?"yes":"no",parts_paint:ae(a.rig),rgb_lighting:Fe(a.rig),theme_interests:l||"none",budget_range:`${N(a.budgetMin)} – ${N(a.budgetMax,!0)}`,tier_viewed_at_claim:`${u.name} : ${u.price} (${u.gpu} / ${u.cpu})`,fps_shown:i.filter(h=>!h.other).map(h=>`${h.name} ${se(ne(h,u,a.display,a.style))}`).join(" · "),submitted_at:new Date().toISOString()};try{const h=JSON.parse(localStorage.getItem("g4f-leads")||"[]");h.push(f),localStorage.setItem("g4f-leads",JSON.stringify(h))}catch{}try{const h=await fetch(at,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(f)});if(!h.ok)throw new Error(`status ${h.status}`)}catch{S.textContent="! transmission failed : check your connection and hit the button again",b.disabled=!1,b.textContent="CLAIM THIS BUILD →",t.audio.deny();return}t.audio.advance(),t.go("done")}),e.querySelectorAll(".btn, .tier-tab").forEach(d=>d.addEventListener("mouseenter",()=>t.audio.hover())),{}}function O(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ut=Object.freeze(Object.defineProperty({__proto__:null,render:dt},Symbol.toStringTag,{value:"Module"}));function pt(e,t){const a=(t.state.contact.name||"friend").split(" ")[0],n="G4F-"+Math.random().toString(36).slice(2,6).toUpperCase();return e.innerHTML=`
    <div class="wrap done">
      <div class="done-badge">✓</div>
      <span class="kicker">QUEST ACCEPTED</span>
      <h1 style="margin-top:14px">WE'RE ON IT,<br>${mt(a).toUpperCase()}.</h1>
      <p class="sub">Your loadout is locked in. A real builder : not a bot : will email you within
      <b style="color:var(--text)">24 hours</b> with a fully itemized quote. You don't pay a cent until you approve it.</p>
      <div class="order-code"><small>BUILD CODE</small>${n}</div>
      <div class="done-steps">
        <div class="done-step"><span class="n">STEP 01</span><p>We email your transparent parts quote : every component priced, nothing hidden.</p></div>
        <div class="done-step"><span class="n">STEP 02</span><p>You approve. We build, and you watch it happen on your live build-log page.</p></div>
        <div class="done-step"><span class="n">STEP 03</span><p>24h stress test, thermal report, foam-packed shipping. Then you game.</p></div>
      </div>
      <div class="boot-cta" style="margin-top:26px">
        <button class="btn btn-ghost" id="againBtn">⌂ BACK TO BASE</button>
      </div>
    </div>`,t.audio.fanfare(),setTimeout(()=>Q(window.innerWidth/2,window.innerHeight*.3,80),200),setTimeout(()=>Q(window.innerWidth*.3,window.innerHeight*.5,40),600),setTimeout(()=>Q(window.innerWidth*.7,window.innerHeight*.5,40),900),e.querySelector("#againBtn").addEventListener("click",()=>{t.resetAll(),t.go("home")}),{}}function mt(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const ht=Object.freeze(Object.defineProperty({__proto__:null,render:pt},Symbol.toStringTag,{value:"Module"})),gt={home:Ue,designer:We,reviews:Ke,intel:Je,contact:tt,quiz:rt,assembly:ct,results:ut,done:ht},J=document.getElementById("scene"),ve=document.getElementById("hudProgress"),ft=document.getElementById("hudLevel"),bt=document.getElementById("hudPips"),ie=document.getElementById("soundBtn"),vt=document.getElementById("logoBtn");let L={},de="",ee=!1;function yt(e){const t=e.replace("#","");return`${parseInt(t.slice(0,2),16)}, ${parseInt(t.slice(2,4),16)}, ${parseInt(t.slice(4,6),16)}`}function wt(e,t){const a=e.replace("#",""),n=o=>Math.round(o+(255-o)*t),[s,i,r]=[0,2,4].map(o=>n(parseInt(a.slice(o,o+2),16)));return`#${[s,i,r].map(o=>o.toString(16).padStart(2,"0")).join("")}`}function ue(e){const t=document.documentElement;t.style.setProperty("--accent",e.accent),t.style.setProperty("--accent-rgb",yt(e.accent)),t.style.setProperty("--accent2",e.accent2||wt(e.accent,.55)),Re(e.accent)}function Ae(e,t){if(!e){ve.hidden=!0;return}ve.hidden=!1,ft.textContent=`LVL 0${e}/0${t}`,bt.innerHTML=Array.from({length:t},(a,n)=>`<i class="${n<e?"on":""}"></i>`).join("")}const St={state:w,audio:k,setAccent:ue,setProgress:Ae,go:X,resetAll:Et};function X(e,t){var s;if(ee)return;ee=!0,(s=L.onLeave)==null||s.call(L);const a=()=>{var i;e!=="quiz"&&Ae(null),de=e,L=gt[e].render(J,St,t)||{},(i=J.firstElementChild)==null||i.classList.add("scene-enter"),window.scrollTo({top:0,behavior:"instant"}),ee=!1},n=J.firstElementChild;n?(n.classList.add("scene-exit"),setTimeout(a,200)):a()}const Le={accent:"#c100ff",accent2:"#ffbe96"};function Et(){Ne(),ue(Le)}function Ie(){ie.textContent=k.enabled?"SOUND: ON":"SOUND: OFF",ie.setAttribute("aria-pressed",String(k.enabled))}ie.addEventListener("click",()=>{k.unlock(),k.setEnabled(!k.enabled),k.enabled&&k.select(),Ie()});vt.addEventListener("click",()=>{de!=="home"&&X("home")});document.addEventListener("keydown",e=>{var t,a;["TEXTAREA","INPUT"].includes((t=document.activeElement)==null?void 0:t.tagName)||L.onKey&&(L.onKey(e),e.defaultPrevented)||(e.key==="Escape"&&["designer","reviews","intel","contact"].includes(de)?(k.back(),X("home")):e.key==="Enter"&&L.onEnter&&!["A","BUTTON"].includes((a=document.activeElement)==null?void 0:a.tagName)&&(e.preventDefault(),L.onEnter()))});document.addEventListener("pointerdown",()=>k.unlock(),{once:!0});Ie();Be();ue(Le);X("home");window.G4F={leads:()=>JSON.parse(localStorage.getItem("g4f-leads")||"[]")};
