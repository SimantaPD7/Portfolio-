/* ============================================================
   SPIDYCODEZ // MAIN ENGINE
   1. Firebase config + dual-layer storage
   2. Default seed data
   3. Canvas: spider web pluck physics, crawler, code fragments, action words
   4. Custom cursor + magnetic + 3D tilt
   5. Public site rendering
   6. S.H.I.E.L.D. mainframe CRUD dashboard
   ============================================================ */

/* ---------- 1. FIREBASE CONFIG (paste your credentials here) ---------- */
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let db = null;
let useFirebase = false;
try {
  if (firebaseConfig.projectId && typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    useFirebase = true;
  }
} catch (e) {
  console.warn("[MAINFRAME] Firebase unavailable, falling back to LocalStorage.", e);
  useFirebase = false;
}

const LS = {
  projects: "spidy_projects",
  skills: "spidy_skills",
  socials: "spidy_socials",
  bio: "spidy_bio"
};

/* ---------- 2. SEED DATA ---------- */
const SEED = {
  bio: {
    name: "SPIDYCODEZ",
    role: "PYTHON // VISION // AI",
    img: "profile.jpg",
    site: "https://simantapd7.github.io/port/",
    siteLabel: "VIEW",
    text: "By day a quiet student, by night a builder of machines that see. I train computer-vision models, wire up automation pipelines and ship web systems that feel like comic panels. Every repo is a case file; every bug is a villain with a weakness.",
    code: "class Spidy(Developer):\n    def __init__(self):\n        self.stack = ['python', 'opencv', 'js']\n        self.caffeine = float('inf')\n\n    def scan(self, problem):\n        return self.solve(problem, style='comic')",
    roles: ["Python Developer", "AI Enthusiast", "Computer Vision Creator", "Automation Architect"],
    power: { INTELLIGENCE: 6, STRENGTH: 4, SPEED: 5, CREATIVITY: 7 }
  },
  skills: [
    { id: "s1", name: "PYTHON", badge: "LANGUAGE", level: 92, desc: "Core weapon of choice. Scripting, backends, data pipelines and everything glued together at 3 AM.", code: "import spidy; spidy.deploy()" },
    { id: "s2", name: "COMPUTER VISION", badge: "OPENCV", level: 85, desc: "Object detection, tracking and image pipelines. Teaching cameras to notice what humans miss.", code: "cv2.findContours(mask, ...)" },
    { id: "s3", name: "MACHINE LEARNING", badge: "AI LAB", level: 78, desc: "Model training, evaluation and deployment with PyTorch and scikit-learn.", code: "model.fit(X_train, y_train)" },
    { id: "s4", name: "JAVASCRIPT", badge: "WEB", level: 80, desc: "Vanilla JS, canvas physics and DOM engineering without a framework in sight.", code: "requestAnimationFrame(loop)" },
    { id: "s5", name: "FIREBASE", badge: "CLOUD", level: 72, desc: "Firestore CRUD, auth flows and instant static hosting for side projects.", code: "db.collection('projects')" },
    { id: "s6", name: "AUTOMATION", badge: "OPS", level: 76, desc: "Bots, scrapers and scheduled jobs that quietly do the boring parts.", code: "while Coding: automate()" }
  ],
  projects: [
    { id: "p1", title: "VISION SENTINEL", caseNo: "CASE #001", status: "ACTIVE", tech: ["Python", "OpenCV", "YOLO"], github: "https://github.com/", demo: "#", desc: "Real-time object detection rig that watches a camera feed and flags anomalies with sub-second latency.", code: "def spidy_scan(frame):\n    boxes = model(frame)\n    return [b for b in boxes if b.conf > 0.6]" },
    { id: "p2", title: "WEB-SLINGER BOT", caseNo: "CASE #002", status: "CLASSIFIED", tech: ["Python", "Asyncio", "SQLite"], github: "https://github.com/", demo: "#", desc: "Async scraping swarm that crawls sources, dedupes results and streams them into a local warehouse.", code: "async with Session() as s:\n    await gather(*[fetch(s, u) for u in urls])" },
    { id: "p3", title: "GESTURE MAINFRAME", caseNo: "CASE #003", status: "ACTIVE", tech: ["MediaPipe", "NumPy"], github: "https://github.com/", demo: "#", desc: "Hand-tracking interface that maps finger gestures to system commands. No mouse required.", code: "lm = hands.process(rgb)\nif pinch(lm): trigger('click')" },
    { id: "p4", title: "COMIC PANEL ENGINE", caseNo: "CASE #004", status: "ARCHIVED", tech: ["JavaScript", "Canvas"], github: "https://github.com/", demo: "#", desc: "Canvas renderer that turns plain text scripts into halftone comic panels with speech bubbles.", code: "ctx.setLineDash([6,4]);\ndrawBubble(ctx, text, x, y);" }
  ],
  socials: [
    { id: "c1", platform: "GITHUB", issue: "#01", headline: "THE CODE VAULT", teaser: "Every case file, open sourced and fully documented.", stamp: "MINT", price: "$0.12", icon: "fa-brands fa-github", url: "https://github.com/" },
    { id: "c2", platform: "LINKEDIN", issue: "#02", headline: "CIVILIAN IDENTITY", teaser: "The professional alter ego, minus the mask.", stamp: "VERIFIED", price: "$0.15", icon: "fa-brands fa-linkedin", url: "https://linkedin.com/" },
    { id: "c3", platform: "X", issue: "#03", headline: "LIVE DISPATCHES", teaser: "Build logs, hot takes and occasional bug screams.", stamp: "HOT", price: "$0.10", icon: "fa-brands fa-x-twitter", url: "https://x.com/" },
    { id: "c4", platform: "EMAIL", issue: "#04", headline: "SIGNAL FLARE", teaser: "Direct line for collaborations and rescue missions.", stamp: "URGENT", price: "$0.20", icon: "fa-solid fa-envelope", url: "mailto:hello@spidycodez.dev" }
  ]
};

let DATA = { bio: null, skills: [], projects: [], socials: [] };

/* ---------- DUAL-LAYER STORAGE ---------- */
function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch (e) { return structuredClone(fallback); }
}
function writeLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* quota */ }
}

async function initData() {
  if (typeof useFirebase !== "undefined" && useFirebase && db) {
    try {
      const [p, s, c, b] = await Promise.all([
        db.collection("projects").get(),
        db.collection("skills").get(),
        db.collection("socials").get(),
        db.collection("meta").doc("bio").get()
      ]);
      DATA.projects = p.docs.map(d => ({ id: d.id, ...d.data() }));
      DATA.skills = s.docs.map(d => ({ id: d.id, ...d.data() }));
      DATA.socials = c.docs.map(d => ({ id: d.id, ...d.data() }));
      DATA.bio = b.exists ? b.data() : structuredClone(SEED.bio);
      if (!DATA.projects.length) DATA.projects = structuredClone(SEED.projects);
      if (!DATA.skills.length) DATA.skills = structuredClone(SEED.skills);
      if (!DATA.socials.length) DATA.socials = structuredClone(SEED.socials);
      setStorageLabel("FIRESTORE");
      return;
    } catch (e) {
      console.warn("[MAINFRAME] Firestore blocked, using LocalStorage.", e);
      useFirebase = false;
    }
  }
  DATA.projects = readLocal(LS.projects, SEED.projects);
  DATA.skills = readLocal(LS.skills, SEED.skills);
  DATA.socials = readLocal(LS.socials, SEED.socials);
  DATA.bio = readLocal(LS.bio, SEED.bio);
  setStorageLabel("LOCAL");
}

async function commitAll() {
  if (useFirebase && db) {
    try {
      const batchWrite = async (coll, items) => {
        const snap = await db.collection(coll).get();
        const batch = db.batch();
        snap.docs.forEach(d => batch.delete(d.ref));
        items.forEach(it => {
          const { id, ...rest } = it;
          batch.set(db.collection(coll).doc(String(id)), rest);
        });
        await batch.commit();
      };
      await batchWrite("projects", DATA.projects);
      await batchWrite("skills", DATA.skills);
      await batchWrite("socials", DATA.socials);
      await db.collection("meta").doc("bio").set(DATA.bio);
      pushLog("COMMIT OK -> FIRESTORE");
      return "FIRESTORE";
    } catch (e) {
      pushLog("FIRESTORE ERROR -> FALLBACK LOCAL");
    }
  }
  writeLocal(LS.projects, DATA.projects);
  writeLocal(LS.skills, DATA.skills);
  writeLocal(LS.socials, DATA.socials);
  writeLocal(LS.bio, DATA.bio);
  pushLog("COMMIT OK -> LOCALSTORAGE");
  return "LOCAL";
}

function setStorageLabel(mode) {
  const el = document.getElementById("mf-storage");
  if (el) el.textContent = "STORAGE: " + mode;
}

/* ---------- HELPERS ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = str => String(str == null ? "" : str)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const uid = () => "x" + Math.random().toString(36).slice(2, 9);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   3. CANVAS ENGINE
   ============================================================ */
const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;
let mouse = { x: -9999, y: -9999 };
const SPOKES = 12;
const RINGS = 7;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* --- floating code fragments --- */
const FRAGMENT_TEXT = [
  "import cv2", "def spidy_scan():", "while Coding:", "model.eval()",
  "np.array(frame)", "async def crawl()", "git push origin main",
  "if conf > 0.6:", "return self.web", "0xFF3C1D", "/* panel_01 */"
];
const fragments = Array.from({ length: 26 }, () => spawnFragment(true));
function spawnFragment(initial) {
  return {
    txt: FRAGMENT_TEXT[(Math.random() * FRAGMENT_TEXT.length) | 0],
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 30,
    size: 9 + Math.random() * 8,
    speed: 0.22 + Math.random() * 0.55,
    alpha: 0.05 + Math.random() * 0.14,
    cross: Math.random() < 0.25
  };
}

/* --- crawling spider state --- */
const crawler = { spoke: 3, t: 0.5, dir: 1, speed: 0.0016, legPhase: 0 };

/* --- action word / spark particles --- */
const ACTION_WORDS = ["POW!", "BAM!", "ZAP!", "BOOM!", "WHAM!", "THWIP!"];
let particles = [];

window.addEventListener("click", e => {
  if (reduceMotion) return;
  particles.push({
    type: "word",
    txt: ACTION_WORDS[(Math.random() * ACTION_WORDS.length) | 0],
    x: e.clientX, y: e.clientY, life: 1, scale: 0.4,
    rot: (Math.random() - 0.5) * 0.5
  });
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 2 + Math.random() * 5;
    particles.push({
      type: "spark", x: e.clientX, y: e.clientY,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, r: 1 + Math.random() * 2.5
    });
  }
});

window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

/* --- main render loop --- */
let time = 0;
function draw() {
  time += 0.016;
  ctx.clearRect(0, 0, W, H);

  /* web center drifts towards the cursor */
  const baseX = W * 0.5, baseY = H * 0.45;
  const cx = baseX + (mouse.x > -9000 ? (mouse.x - baseX) * 0.06 : 0);
  const cy = baseY + (mouse.y > -9000 ? (mouse.y - baseY) * 0.06 : 0);
  const maxR = Math.hypot(W, H) * 0.62;
  const mouseAngle = Math.atan2(mouse.y - cy, mouse.x - cx);

  /* per-spoke pluck displacement (pluck algorithm) */
  const pluck = [];
  for (let i = 0; i < SPOKES; i++) {
    const angle = (i / SPOKES) * Math.PI * 2;
    let pluckX = 0, pluckY = 0, strength = 0;
    if (mouse.x > -9000 && !reduceMotion) {
      let angleDiff = Math.abs(angle - mouseAngle);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      if (angleDiff < 0.28) {
        strength = (0.28 - angleDiff) / 0.28;
        const wave = Math.sin(time * 35) * 7;
        pluckX = -Math.sin(angle) * wave * strength;
        pluckY = Math.cos(angle) * wave * strength;
      }
    }
    pluck.push({ angle, pluckX, pluckY, strength });
  }

  /* spokes */
  for (const p of pluck) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const steps = 10;
    for (let s = 1; s <= steps; s++) {
      const f = s / steps;
      const bend = Math.sin(f * Math.PI); // max displacement mid-strand
      ctx.lineTo(
        cx + Math.cos(p.angle) * maxR * f + p.pluckX * bend,
        cy + Math.sin(p.angle) * maxR * f + p.pluckY * bend
      );
    }
    ctx.strokeStyle = `rgba(237,29,36,${0.07 + p.strength * 0.35})`;
    ctx.lineWidth = 1 + p.strength * 1.2;
    ctx.stroke();
  }

  /* rings connecting the spokes */
  for (let r = 1; r <= RINGS; r++) {
    const rad = (r / RINGS) * maxR;
    const f = rad / maxR;
    const bend = Math.sin(f * Math.PI);
    ctx.beginPath();
    for (let i = 0; i <= SPOKES; i++) {
      const p = pluck[i % SPOKES];
      const x = cx + Math.cos(p.angle) * rad + p.pluckX * bend;
      const y = cy + Math.sin(p.angle) * rad + p.pluckY * bend;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(237,29,36,0.055)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  /* crawling spider along a spoke */
  if (!reduceMotion) {
    crawler.t += crawler.speed * crawler.dir;
    if (crawler.t > 0.92) { crawler.dir = -1; }
    if (crawler.t < 0.08) {
      crawler.dir = 1;
      if (Math.random() < 0.6) crawler.spoke = (Math.random() * SPOKES) | 0;
    }
    crawler.legPhase += 0.28;
  }
  const cp = pluck[crawler.spoke];
  const cbend = Math.sin(crawler.t * Math.PI);
  const sx = cx + Math.cos(cp.angle) * maxR * crawler.t + cp.pluckX * cbend;
  const sy = cy + Math.sin(cp.angle) * maxR * crawler.t + cp.pluckY * cbend;
  drawSpider(sx, sy, cp.angle);

  /* floating code fragments */
  ctx.textAlign = "left";
  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    if (!reduceMotion) f.y -= f.speed;
    if (f.y < -30) fragments[i] = spawnFragment(false);
    ctx.font = `${f.size}px 'Share Tech Mono', monospace`;
    ctx.fillStyle = `rgba(237,29,36,${f.alpha})`;
    ctx.fillText(f.txt, f.x, f.y);
    if (f.cross) {
      ctx.strokeStyle = `rgba(255,235,59,${f.alpha * 0.8})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(f.x - 16, f.y - 4); ctx.lineTo(f.x - 6, f.y - 4);
      ctx.moveTo(f.x - 11, f.y - 9); ctx.lineTo(f.x - 11, f.y + 1);
      ctx.stroke();
    }
  }

  /* particles */
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    if (p.type === "word") {
      p.life -= 0.022; p.scale += 0.075; p.y -= 0.9;
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(p.scale, p.scale);
      ctx.textAlign = "center";
      ctx.font = "52px 'Bangers', Impact, sans-serif";
      ctx.fillStyle = "#000";
      ctx.fillText(p.txt, 5, 5);
      ctx.fillStyle = "#FFEB3B";
      ctx.fillText(p.txt, 0, 0);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ED1D24";
      ctx.strokeText(p.txt, 0, 0);
      ctx.restore();
    } else {
      p.life -= 0.03; p.x += p.vx; p.y += p.vy; p.vy += 0.14;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = "#FF003C";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

function drawSpider(x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.strokeStyle = "rgba(237,29,36,0.85)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const wig = Math.sin(crawler.legPhase + i) * 3;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -2 + i * 2.6);
      ctx.lineTo(dir * 7, -5 + i * 2.6 + wig);
      ctx.lineTo(dir * 11, 1 + i * 2.6 + wig);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#ED1D24";
  ctx.beginPath(); ctx.ellipse(0, 4, 3.4, 4.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -2.4, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
draw();

/* ============================================================
   4. CURSOR / MAGNETIC / TILT
   ============================================================ */
const dot = $("#cursor-dot"), ring = $("#cursor-ring");
let rx = 0, ry = 0;
document.addEventListener("mousemove", e => {
  dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
});
(function ringLoop() {
  rx += (mouse.x - rx) * 0.18;
  ry += (mouse.y - ry) * 0.18;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(ringLoop);
})();
document.addEventListener("mouseover", e => {
  const hit = e.target.closest("a, button, .comic-card, input, textarea, select, i");
  ring.classList.toggle("grow", !!hit);
});

/* magnetic pull */
function bindMagnetic(el) {
  el.addEventListener("mousemove", e => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px) skewX(-9deg)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
}
$$(".magnetic").forEach(bindMagnetic);

/* hanging spider scroll physics */
const hanging = $("#hanging-spider");
let spTarget = 0, spCur = 0;
window.addEventListener("scroll", () => {
  spTarget = Math.min(window.scrollY * 0.18, 260);
});
(function spiderLoop() {
  spCur += (spTarget - spCur) * 0.07;
  const swing = Math.sin(Date.now() / 900) * 5;
  hanging.style.transform = `translateY(${spCur}px) rotate(${swing}deg)`;
  requestAnimationFrame(spiderLoop);
})();

/* 3D tilt */
function bindTilt(card) {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const xVal = (x / rect.width) - 0.5;
    const yVal = (y / rect.height) - 0.5;
    const maxRotate = 14;
    card.style.transform =
      `perspective(1000px) rotateX(${-yVal * maxRotate}deg) rotateY(${xVal * maxRotate}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
}

/* nav burger */
$("#burger").addEventListener("click", () => {
  $("#burger").classList.toggle("open");
  $("#nav-links").classList.toggle("open");
});
$$("#nav-links a").forEach(a => a.addEventListener("click", () => {
  $("#burger").classList.remove("open");
  $("#nav-links").classList.remove("open");
}));

/* ============================================================
   5. PUBLIC SITE RENDERING
   ============================================================ */
let typeTimer = null;
function startTypewriter(roles) {
  const el = $("#typewriter");
  let ri = 0, ci = 0, deleting = false;
  clearTimeout(typeTimer);
  (function tick() {
    const word = roles[ri % roles.length];
    el.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) ci++;
    else if (!deleting) { deleting = true; typeTimer = setTimeout(tick, 1400); return; }
    else if (ci > 0) ci--;
    else { deleting = false; ri++; }
    typeTimer = setTimeout(tick, deleting ? 40 : 85);
  })();
}

function renderBio() {
  const b = DATA.bio;
  $("#bio-name").textContent = b.name;
  $("#bio-role").textContent = b.role;
  $("#bio-text").textContent = b.text;
  $("#bio-code").textContent = b.code;

  /* live site / domain link -> hidden automatically when no URL is set */
  const url = (b.site || "").trim();
  const label = (b.siteLabel || "VIEW").trim() || "VIEW";
  const heroBtn = $("#site-btn"), cardBtn = $("#tc-site");
  if (url) {
    heroBtn.href = url; cardBtn.href = url;
    heroBtn.textContent = label + " SITE";
    $("#tc-site-label").textContent = label;
    heroBtn.hidden = false; cardBtn.hidden = false;
  } else {
    heroBtn.hidden = true; cardBtn.hidden = true;
  }
  const img = $("#profile-img");
  img.src = b.img;
  img.onerror = () => {
    img.onerror = null;
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='#0b0b0b'/><circle cx='200' cy='160' r='62' fill='none' stroke='#ED1D24' stroke-width='8'/><path d='M92 330c18-66 62-96 108-96s90 30 108 96' fill='none' stroke='#ED1D24' stroke-width='8'/></svg>`);
  };

  const rows = $("#power-rows");
  rows.innerHTML = Object.entries(b.power).map(([k, v]) => `
    <div class="pg-row" data-val="${v}">
      <span class="pg-label">${esc(k)}</span>
      <span class="pg-bar">${Array.from({ length: 7 }, () => '<i class="pg-cell"></i>').join("")}</span>
      <span class="pg-num">${v}/7</span>
    </div>`).join("");
  observePowerGrid();
  startTypewriter(b.roles && b.roles.length ? b.roles : SEED.bio.roles);
}

function observePowerGrid() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const val = +en.target.dataset.val;
      en.target.querySelectorAll(".pg-cell").forEach((c, i) => {
        setTimeout(() => c.classList.toggle("on", i < val), reduceMotion ? 0 : i * 110);
      });
      io.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  $$(".pg-row").forEach(r => io.observe(r));
}

function renderSkills() {
  $("#skills-grid").innerHTML = DATA.skills.map(s => `
    <article class="skill-card comic-card">
      <span class="sk-badge">${esc(s.badge)}</span>
      <div class="sk-top">
        <div class="sk-ring" style="--v:${+s.level}"><span>${+s.level}%</span></div>
        <h3 class="sk-name">${esc(s.name)}</h3>
      </div>
      <p class="sk-desc">${esc(s.desc)}</p>
      <div class="sk-tip">&gt; ${esc(s.code)}</div>
    </article>`).join("");
}

function renderProjects() {
  $("#projects-grid").innerHTML = DATA.projects.map(p => `
    <article class="project-card comic-card" data-id="${esc(p.id)}">
      <div class="pj-top">
        <span class="pj-case">${esc(p.caseNo)}</span>
        <span class="pj-status">${esc(p.status)}</span>
      </div>
      <h3 class="pj-title">${esc(p.title)}</h3>
      <p class="pj-desc">${esc(p.desc)}</p>
      <div class="tag-row">${(p.tech || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <button class="pj-action" data-open="${esc(p.id)}">VIEW SCHEMATICS &rarr;</button>
    </article>`).join("");
  $$(".project-card").forEach(c => {
    bindTilt(c);
    c.addEventListener("click", () => openSchematic(c.dataset.id));
  });
}

function renderSocials() {
  $("#connect-grid").innerHTML = DATA.socials.map(c => `
    <article class="cover-card comic-card">
      <div class="cv-head">
        <span class="cv-plat">${esc(c.platform)}</span>
        <span class="cv-price">${esc(c.price)}</span>
      </div>
      <div class="cv-body">
        <i class="cv-icon ${esc(c.icon)}" aria-hidden="true"></i>
        <span class="cv-issue">ISSUE ${esc(c.issue)}</span>
        <h3 class="cv-headline">${esc(c.headline)}</h3>
        <p class="cv-teaser">${esc(c.teaser)}</p>
        <span class="cv-stamp">${esc(c.stamp)}</span>
      </div>
      <div class="cv-foot">
        <span class="mini-bars">${Array.from({ length: 16 }, () =>
          `<i style="height:${4 + Math.random() * 12}px"></i>`).join("")}</span>
        <a href="${esc(c.url)}" target="_blank" rel="noopener">OPEN &rarr;</a>
      </div>
    </article>`).join("");
}

/* ---------- SCHEMATIC MODAL ---------- */
function blueprintSVG(seed) {
  const n = (seed.length % 4) + 3;
  let out = `<g stroke="#5AC8FF" fill="none" stroke-width="1.6">`;
  out += `<rect x="20" y="20" width="260" height="180" stroke-dasharray="6 5"/>`;
  for (let i = 0; i < n; i++) {
    const x = 45 + i * (200 / n), y = 60 + (i % 2) * 60;
    out += `<rect x="${x}" y="${y}" width="52" height="38"/>`;
    out += `<line x1="${x + 52}" y1="${y + 19}" x2="${x + 200 / n}" y2="${y + 19}"/>`;
    out += `<circle cx="${x + 26}" cy="${y + 19}" r="7" stroke="#FFEB3B"/>`;
  }
  out += `<path d="M40 170 L100 140 L160 170 L220 140" stroke="#ED1D24"/></g>`;
  out += `<text x="24" y="212" fill="#5AC8FF" font-family="monospace" font-size="9">SCHEMATIC REV.${n}.0</text>`;
  return out;
}

function openSchematic(id) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p) return;
  $("#m-case").textContent = p.caseNo;
  $("#m-title").textContent = p.title;
  $("#m-desc").textContent = p.desc;
  $("#m-code").textContent = p.code || "# no diagnostic snippet on file";
  $("#m-tags").innerHTML =
    `<span class="tag">STATUS: ${esc(p.status)}</span>` +
    (p.tech || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  $("#m-github").href = p.github || "#";
  $("#m-demo").href = p.demo || "#";
  $("#bp-svg").innerHTML = blueprintSVG(p.title);
  $("#schematic-modal").classList.add("open");
}
$("#modal-close").addEventListener("click", () => $("#schematic-modal").classList.remove("open"));
$("#schematic-modal").addEventListener("click", e => {
  if (e.target.id === "schematic-modal") e.currentTarget.classList.remove("open");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $$(".modal.open").forEach(m => m.classList.remove("open"));
});

function renderAll() {
  renderBio(); renderSkills(); renderProjects(); renderSocials();
}

/* ============================================================
   6. S.H.I.E.L.D. MAINFRAME
   ============================================================ */
$("#mainframe-link").addEventListener("click", e => {
  e.preventDefault();
  $("#login-modal").classList.add("open");
  setTimeout(() => $("#user-in").focus(), 60);
});
$("#login-cancel").addEventListener("click", () => $("#login-modal").classList.remove("open"));

$("#login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const u = $("#user-in").value.trim(), p = $("#pass-in").value;
  const err = $("#login-err");
  if (useFirebase && firebase.auth) {
    try {
      await firebase.auth().signInWithEmailAndPassword(u, p);
      return enterMainframe();
    } catch (ex) { /* fall through to local check */ }
  }
  if (u === "spidycodez" && p === "spidy") { err.textContent = ""; enterMainframe(); }
  else err.textContent = "ACCESS DENIED :: INVALID CLEARANCE KEY";
});

function enterMainframe() {
  $("#login-modal").classList.remove("open");
  $("#login-form").reset();
  $("#public-site").hidden = true;
  $("#nav").hidden = true;
  $("#hanging-spider").hidden = true;
  $("#mainframe").hidden = false;
  window.scrollTo(0, 0);
  renderAdmin();
  startDiagnostics();
  pushLog("OPERATIVE AUTHENTICATED :: WELCOME BACK");
}

$("#logout").addEventListener("click", () => {
  $("#mainframe").hidden = true;
  $("#public-site").hidden = false;
  $("#nav").hidden = false;
  $("#hanging-spider").hidden = false;
  stopDiagnostics();
});

$$(".mf-tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".mf-tab").forEach(t => t.classList.remove("active"));
  $$(".mf-pane").forEach(p => p.classList.remove("active"));
  tab.classList.add("active");
  $("#tab-" + tab.dataset.tab).classList.add("active");
}));

$$("[data-reset]").forEach(b => b.addEventListener("click", () => {
  document.getElementById(b.dataset.reset).reset();
  const hidden = document.getElementById(b.dataset.reset).querySelector('input[type="hidden"]');
  if (hidden) hidden.value = "";
}));

/* --- diagnostics --- */
const GAUGES = [
  { key: "cpu", label: "CPU LOAD", unit: "%" },
  { key: "mem", label: "MEMORY USAGE", unit: "%" },
  { key: "lat", label: "DB LATENCY", unit: "ms", max: 400 },
  { key: "vis", label: "VISIT COUNTER", unit: "", raw: true }
];
let diagTimer = null;
let visits = (+localStorage.getItem("spidy_visits") || 0);

function renderGauges() {
  $("#gauges").innerHTML = GAUGES.map(g => `
    <div class="gauge">
      <h5>${g.label}</h5>
      <div class="val" id="g-${g.key}">--</div>
      <div class="track"><div class="fill" id="f-${g.key}" style="width:0%"></div></div>
    </div>`).join("");
}

const LOG_EVENTS = [
  "web-node sync OK", "packet intercepted :: 0xFF3C", "vision model warm",
  "firestore heartbeat", "cache flushed", "crawler thread respawned",
  "auth token refreshed", "halftone shader compiled"
];
function pushLog(msg) {
  const box = $("#log-lines");
  if (!box) return;
  const t = new Date().toLocaleTimeString("en-GB");
  const line = document.createElement("div");
  line.textContent = `[${t}] ${msg}`;
  box.appendChild(line);
  while (box.children.length > 40) box.removeChild(box.firstChild);
  box.parentElement.scrollTop = box.parentElement.scrollHeight;
}

function startDiagnostics() {
  renderGauges();
  visits++; localStorage.setItem("spidy_visits", visits);
  const tick = () => {
    const vals = {
      cpu: 18 + Math.random() * 55,
      mem: 34 + Math.random() * 40,
      lat: 40 + Math.random() * 180,
      vis: visits
    };
    GAUGES.forEach(g => {
      const v = vals[g.key];
      const el = $("#g-" + g.key), fill = $("#f-" + g.key);
      if (!el) return;
      el.textContent = g.raw ? v : Math.round(v) + g.unit;
      const pct = g.raw ? Math.min(v, 100) : (g.max ? (v / g.max) * 100 : v);
      fill.style.width = Math.min(pct, 100) + "%";
    });
    if (Math.random() < 0.55) pushLog(LOG_EVENTS[(Math.random() * LOG_EVENTS.length) | 0]);
  };
  tick();
  diagTimer = setInterval(tick, 1800);
}
function stopDiagnostics() { clearInterval(diagTimer); diagTimer = null; }

/* --- CRUD --- */
function renderAdmin() {
  renderList("proj-list", DATA.projects, p => `<strong>${esc(p.title)}</strong><small>${esc(p.caseNo)} &bull; ${esc(p.status)}</small>`, "proj");
  renderList("skill-list", DATA.skills, s => `<strong>${esc(s.name)}</strong><small>${esc(s.badge)} &bull; ${+s.level}%</small>`, "skill");
  renderList("conn-list", DATA.socials, c => `<strong>${esc(c.platform)}</strong><small>${esc(c.headline)}</small>`, "conn");
  fillBioForm();
}

function renderList(elId, items, tpl, kind) {
  const box = document.getElementById(elId);
  box.innerHTML = items.map(it => `
    <div class="mf-item">
      <div>${tpl(it)}</div>
      <div class="row-actions">
        <button class="mini-btn" data-edit="${kind}" data-id="${esc(it.id)}">EDIT</button>
        <button class="mini-btn danger" data-del="${kind}" data-id="${esc(it.id)}">DELETE</button>
      </div>
    </div>`).join("") || `<p style="color:#6f9b7e">NO RECORDS ON FILE.</p>`;
}

document.addEventListener("click", e => {
  const del = e.target.closest("[data-del]");
  const edit = e.target.closest("[data-edit]");
  if (del) {
    const map = { proj: "projects", skill: "skills", conn: "socials" }[del.dataset.del];
    DATA[map] = DATA[map].filter(x => x.id !== del.dataset.id);
    pushLog(`RECORD DELETED :: ${del.dataset.id}`);
    renderAdmin(); renderAll();
  }
  if (edit) loadIntoForm(edit.dataset.edit, edit.dataset.id);
});

function loadIntoForm(kind, id) {
  if (kind === "proj") {
    const p = DATA.projects.find(x => x.id === id); if (!p) return;
    $("#p-id").value = p.id; $("#p-title").value = p.title; $("#p-case").value = p.caseNo;
    $("#p-status").value = p.status; $("#p-tech").value = (p.tech || []).join(", ");
    $("#p-github").value = p.github || ""; $("#p-demo").value = p.demo || "";
    $("#p-desc").value = p.desc || ""; $("#p-code").value = p.code || "";
  } else if (kind === "skill") {
    const s = DATA.skills.find(x => x.id === id); if (!s) return;
    $("#s-id").value = s.id; $("#s-name").value = s.name; $("#s-badge").value = s.badge;
    $("#s-level").value = s.level; $("#s-desc").value = s.desc || ""; $("#s-code").value = s.code || "";
  } else {
    const c = DATA.socials.find(x => x.id === id); if (!c) return;
    $("#c-id").value = c.id; $("#c-platform").value = c.platform; $("#c-issue").value = c.issue;
    $("#c-headline").value = c.headline; $("#c-teaser").value = c.teaser; $("#c-stamp").value = c.stamp;
    $("#c-price").value = c.price; $("#c-icon").value = c.icon; $("#c-url").value = c.url;
  }
}

function upsert(list, obj) {
  const i = list.findIndex(x => x.id === obj.id);
  i > -1 ? list[i] = obj : list.push(obj);
}

$("#proj-form").addEventListener("submit", e => {
  e.preventDefault();
  upsert(DATA.projects, {
    id: $("#p-id").value || uid(),
    title: $("#p-title").value, caseNo: $("#p-case").value || "CASE #000",
    status: $("#p-status").value,
    tech: $("#p-tech").value.split(",").map(s => s.trim()).filter(Boolean),
    github: $("#p-github").value, demo: $("#p-demo").value,
    desc: $("#p-desc").value, code: $("#p-code").value
  });
  e.target.reset(); $("#p-id").value = "";
  pushLog("PROJECT RECORD COMMITTED"); renderAdmin(); renderAll();
});

$("#skill-form").addEventListener("submit", e => {
  e.preventDefault();
  upsert(DATA.skills, {
    id: $("#s-id").value || uid(),
    name: $("#s-name").value, badge: $("#s-badge").value || "SKILL",
    level: Math.max(0, Math.min(100, +$("#s-level").value || 0)),
    desc: $("#s-desc").value, code: $("#s-code").value
  });
  e.target.reset(); $("#s-id").value = "";
  pushLog("SKILL RECORD COMMITTED"); renderAdmin(); renderAll();
});

$("#conn-form").addEventListener("submit", e => {
  e.preventDefault();
  upsert(DATA.socials, {
    id: $("#c-id").value || uid(),
    platform: $("#c-platform").value, issue: $("#c-issue").value || "#00",
    headline: $("#c-headline").value, teaser: $("#c-teaser").value,
    stamp: $("#c-stamp").value || "MINT", price: $("#c-price").value || "$0.12",
    icon: $("#c-icon").value || "fa-solid fa-link", url: $("#c-url").value || "#"
  });
  e.target.reset(); $("#c-id").value = "";
  pushLog("SOCIAL RECORD COMMITTED"); renderAdmin(); renderAll();
});

function fillBioForm() {
  const b = DATA.bio;
  $("#b-name").value = b.name; $("#b-role").value = b.role; $("#b-img").value = b.img;
  $("#b-site").value = b.site || "";
  $("#b-text").value = b.text; $("#b-code").value = b.code;
  $("#b-roles").value = (b.roles || []).join(", ");
  $("#power-inputs").innerHTML = Object.entries(b.power).map(([k, v]) => `
    <label>${esc(k)} (0-7)<input type="number" min="0" max="7" value="${v}" data-pw="${esc(k)}" /></label>`).join("");
}

$("#bio-form").addEventListener("submit", e => {
  e.preventDefault();
  const power = {};
  $$("[data-pw]").forEach(i => power[i.dataset.pw] = Math.max(0, Math.min(7, +i.value || 0)));
  DATA.bio = {
    name: $("#b-name").value, role: $("#b-role").value, img: $("#b-img").value,
    site: $("#b-site").value.trim(), siteLabel: DATA.bio.siteLabel || "VIEW",
    text: $("#b-text").value, code: $("#b-code").value,
    roles: $("#b-roles").value.split(",").map(s => s.trim()).filter(Boolean),
    power
  };
  pushLog("BIO RECORD COMMITTED"); renderAll(); fillBioForm();
});

$("#save-all").addEventListener("click", async () => {
  const btn = $("#save-all");
  btn.textContent = "COMMITTING...";
  const mode = await commitAll();
  setStorageLabel(mode);
  btn.textContent = "SAVE ALL CHANGES";
});

/* ---------- BOOT ---------- */
(async function boot() {
  await initData();
  renderAll();
})();
