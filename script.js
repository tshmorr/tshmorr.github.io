// year in footer
document.getElementById("year")?.textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }


function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/**
 * Intro: password-crack / scramble animation.
 * Robust behavior:
 * - Intro overlay is hidden by default; we turn it on only if JS is running.
 * - Esc + Skip always work (capture listener).
 * - Hard timeout prevents "stuck" state.
 */
async function runIntroScramble(){
  const intro = document.getElementById("intro");
  const skipBtn = document.getElementById("skipIntro");
  const line1 = document.getElementById("scrambleLine1");
  const line2 = document.getElementById("scrambleLine2");

  // If markup isn't present, never block the page.
  if (!intro || !line1 || !line2){
    document.body.classList.add("loaded");
    return;
  }

  // Turn on overlay now that JS is confirmed running.
  document.body.classList.add("intro-on");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    intro.classList.add("hidden");
    document.body.classList.remove("intro-on");
    document.body.classList.add("loaded");
    window.removeEventListener("keydown", onKeyDown, true);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") finish();
  };

  // Esc should work even if focus is inside something else.
  window.addEventListener("keydown", onKeyDown, true);
  skipBtn?.addEventListener("click", finish);

  // Absolute failsafe
  const failsafe = window.setTimeout(finish, 6500);

  if (prefersReducedMotion){
    line1.textContent = "Welcome to my website,";
    line2.textContent = "Meet Tracy Sharon Morrison.";
    window.clearTimeout(failsafe);
    await sleep(300);
    finish();
    return;
  }

  const target1 = "Welcome to my website,";
  const target2 = "Meet Tracy Sharon Morrison.";

  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?/\\|~";
  const scrambleText = (el, target, { stepMs = 22, settleMs = 650 } = {}) => {
    return new Promise((resolve) => {
      const len = target.length;
      let frame = 0;
      // Each character settles at a slightly different time for a "password crack" feel.
      const settleAt = Array.from({ length: len }, (_, i) => Math.floor(8 + i * 1.6 + Math.random() * 10));
      const maxFrame = Math.max(...settleAt) + 8;

      const tick = () => {
        let out = "";
        for (let i = 0; i < len; i++){
          const ch = target[i];
          if (ch === " "){
            out += " ";
            continue;
          }
          if (frame >= settleAt[i]){
            out += ch;
          } else {
            out += charset[Math.floor(Math.random() * charset.length)];
          }
        }
        // add a blinking cursor at the end
        el.innerHTML = out + ' <span class="scramble-cursor" aria-hidden="true"></span>';

        frame++;
        if (frame <= maxFrame){
          window.setTimeout(tick, stepMs);
        } else {
          // settle fully (remove cursor)
          el.textContent = target;
          window.setTimeout(resolve, settleMs);
        }
      };

      tick();
    });
  };

  // Run sequence
  line1.textContent = "";
  line2.textContent = "";
  await sleep(220);
  await scrambleText(line1, target1, { stepMs: 18, settleMs: 320 });
  await scrambleText(line2, target2, { stepMs: 16, settleMs: 450 });

  window.clearTimeout(failsafe);
  await sleep(250);
  finish();
}
window.addEventListener("load", runIntroScramble);



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
