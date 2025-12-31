// year in footer (safe)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

class TextScrambler{
  constructor(el, { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?/" } = {}){
    this.el = el;
    this.chars = chars;
    this.queue = [];
    this.frame = 0;
    this.frameReq = 0;
    this.resolve = () => {};
  }
  randomChar(){
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
  setText(newText, { minStart = 0, maxStart = 12, minEnd = 10, maxEnd = 30 } = {}){
    const oldText = this.el.textContent || "";
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++){
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = minStart + Math.floor(Math.random() * (maxStart - minStart + 1));
      const end = start + minEnd + Math.floor(Math.random() * (maxEnd - minEnd + 1));
      this.queue.push({ from, to, start, end, char: "" });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;

    return new Promise(resolve => {
      this.resolve = resolve;
      this.update();
    });
  }
  update(){
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++){
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end){
        complete++;
        output += to;
      } else if (this.frame >= start){
        if (!char || Math.random() < 0.28) char = this.randomChar();
        this.queue[i].char = char;
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length){
      this.resolve();
    } else {
      this.frameReq = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

function runIntroScramble(){
  const intro = document.getElementById("intro");
  const skipBtn = document.getElementById("skipIntro");
  const mainEl = document.getElementById("morphText");
  const subEl = document.getElementById("morphSub");

  // If intro is missing, never block the page
  if (!intro || !mainEl){
    document.body.classList.add("loaded");
    return;
  }

  intro.classList.add("intro-scramble");
  intro.classList.remove("hidden");
  intro.setAttribute("aria-hidden", "false");

  const LINE1 = "Welcome to my website,";
  const LINE2 = "Meet Tracy Sharon Morrison.";

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.add("loaded");
    cleanup();
  };

  const onKey = (e) => {
    if (e.key === "Escape"){
      e.preventDefault();
      finish();
    }
  };

  const cleanup = () => {
    document.removeEventListener("keydown", onKey, true);
    skipBtn?.removeEventListener("click", finish);
  };

  document.addEventListener("keydown", onKey, true);
  skipBtn?.addEventListener("click", finish);

  // failsafe: never get stuck on overlay
  const failsafe = setTimeout(finish, 8000);

  if (prefersReducedMotion){
    mainEl.textContent = LINE1;
    if (subEl) subEl.textContent = LINE2;
    setTimeout(() => { clearTimeout(failsafe); finish(); }, 900);
    return;
  }

  // start blank so old text doesn't flash
  mainEl.textContent = "";
  if (subEl) subEl.textContent = "";

  const s1 = new TextScrambler(mainEl, { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" });
  const s2 = subEl ? new TextScrambler(subEl, { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" }) : null;

  (async () => {
    await sleep(250);
    await s1.setText(LINE1);
    await sleep(160);
    if (s2) await s2.setText(LINE2, { minStart: 0, maxStart: 10, minEnd: 8, maxEnd: 22 });
    await sleep(450);
    clearTimeout(failsafe);
    finish();
  })();
}

document.addEventListener("DOMContentLoaded", runIntroScramble);

document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".panel"));

tabs.forEach(t => {
  t.addEventListener("click", () => {
    const id = t.dataset.tab;

    tabs.forEach(x => {
      x.classList.remove("active");
      x.setAttribute("aria-selected", "false");
    });
    t.classList.add("active");
    t.setAttribute("aria-selected", "true");

    panels.forEach(p => p.classList.remove("active"));
    const panel = document.getElementById(id);
    if (panel) panel.classList.add("active");
  });
});

// mobile menu
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });

  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });
}
