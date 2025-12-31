// year in footer
document.getElementById("year")?.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function morphTo(el, newText, subEl, newSub){
  // animate out
  el.classList.add("morph-out");
  el.classList.remove("morph-in");
  await sleep(240);

  // swap
  el.textContent = newText;
  if (subEl && newSub) subEl.innerHTML = newSub;

  // animate in
  el.classList.remove("morph-out");
  el.classList.add("morph-in");
  await sleep(360);
}

class TextScramble {
  constructor(el, { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-_?=" } = {}) {
    this.el = el;
    this.chars = chars;
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  setText(newText, { minStart = 0, maxStart = 18, minEnd = 16, maxEnd = 44 } = {}) {
    const oldText = this.el.textContent || "";
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = minStart + Math.floor(Math.random() * (maxStart - minStart + 1));
      const end = start + minEnd + Math.floor(Math.random() * (maxEnd - minEnd + 1));
      this.queue.push({ from, to, start, end, char: "" });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;

    return new Promise(resolve => {
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!this.queue[i].char || Math.random() < 0.28) {
          this.queue[i].char = this.randomChar();
        }
        output += `<span class="dud">${this.queue[i].char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

async function runIntroScramble(){
  const intro = document.getElementById("intro");
  const skipBtn = document.getElementById("skipIntro");
  const line1 = document.getElementById("scrambleLine1");
  const line2 = document.getElementById("scrambleLine2");

  // If the overlay isn't present, reveal content immediately.
  if (!intro || !line1 || !line2) {
    document.body.classList.add("loaded");
    return;
  }

  // reduced motion: skip animation
  if (prefersReducedMotion){
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.add("loaded");
    return;
  }

  let done = false;
  let killTimer = null;

  const onKeyDown = (e) => {
    if (e.key === "Escape") finish();
  };

  const finish = () => {
    if (done) return;
    done = true;
    if (killTimer) clearTimeout(killTimer);
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.add("loaded");
    window.removeEventListener("keydown", onKeyDown);
  };

  skipBtn?.addEventListener("click", finish);
  window.addEventListener("keydown", onKeyDown);

  // Safety: never hang on intro.
  killTimer = setTimeout(finish, 8000);

  const scr1 = new TextScramble(line1);
  const scr2 = new TextScramble(line2);

  await sleep(250);
  await scr1.setText("WELCOME TO MY WEBSITE");
  await sleep(200);
  await scr2.setText("MEET TRACY SHARON MORRISON", { minStart: 6, maxStart: 22, minEnd: 18, maxEnd: 52 });
  await sleep(220);

  finish();
}

function startIntro(){
  runIntroScramble();
}

// Run as soon as the DOM exists (don’t wait for full page load).
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startIntro);
} else {
  startIntro();
}


// show more projects
const showMoreBtn = document.getElementById("showMoreBtn");
const hiddenCards = Array.from(document.querySelectorAll(".card.hidden"));

if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    const isHidden = hiddenCards[0]?.classList.contains("hidden");
    hiddenCards.forEach(c => c.classList.toggle("hidden"));
    showMoreBtn.textContent = isHidden ? "Show Less" : "Show More";
  });
}

// experience tabs
const tabs = Array.from(document.querySelectorAll(".tab"));
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
