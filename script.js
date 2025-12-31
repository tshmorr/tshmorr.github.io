console.log("✅ script.js loaded");

document.getElementById("year")?.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WELCOME = "WELCOME TO MY WEBSITE";
const MEET = "MEET TRACY SHARON MORRISON";

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

class TextScrambler {
  constructor(el, { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?" } = {}) {
    this.el = el;
    this.chars = chars;
    this.queue = [];
    this.frame = 0;
    this.frameRequest = 0;
    this.resolve = () => {};
  }
  randomChar(){
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
  update(){
    let output = "";
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];

      if (to === " ") {
        output += " ";
        if (this.frame >= end) complete++;
        continue;
      }

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
      this.el.textContent = this.queue.map(q => q.to).join("");
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => {
        this.frame++;
        this.update();
      });
    }
  }
  stop(){
    cancelAnimationFrame(this.frameRequest);
  }
}

function runIntroScramble(){
  const intro = document.getElementById("intro");
  const skipBtn = document.getElementById("skipIntro");
  const line1 = document.getElementById("scrambleLine1");
  const line2 = document.getElementById("scrambleLine2");

  const finish = () => {
    intro?.classList.add("hidden");
    document.body.classList.add("loaded");
  };

  // If HTML doesn't match what we expect, DO NOT trap the user.
  if (!intro) { document.body.classList.add("loaded"); return; }
  if (!line1 || !line2) { finish(); return; }

  const hardFinish = () => {
    line1.textContent = WELCOME;
    line2.textContent = MEET;
    finish();
  };

  skipBtn?.addEventListener("click", hardFinish);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hardFinish(); });

  if (prefersReducedMotion) { hardFinish(); return; }

  const s1 = new TextScrambler(line1);
  const s2 = new TextScrambler(line2);

  (async () => {
    await sleep(200);
    await s1.setText(WELCOME, { minStart: 0, maxStart: 12, minEnd: 18, maxEnd: 46 });
    await sleep(120);
    await s2.setText(MEET, { minStart: 0, maxStart: 16, minEnd: 18, maxEnd: 54 });
    await sleep(450);
    finish();
  })();
}

document.addEventListener("DOMContentLoaded", runIntroScramble);


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
