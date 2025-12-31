// year in footer
document.getElementById("year").textContent = new Date().getFullYear();

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

async function runIntroMorph(){
  const intro = document.getElementById("intro");
  const skipBtn = document.getElementById("skipIntro");
  const morphText = document.getElementById("morphText");
  const morphSub = document.getElementById("morphSub");

  if (!intro || !morphText) {
    document.body.classList.add("loaded");
    return;
  }

  // reduced motion: skip animation
  if (prefersReducedMotion){
    intro.classList.add("hidden");
    document.body.classList.add("loaded");
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    intro.classList.add("hidden");
    document.body.classList.add("loaded");
  };

  skipBtn?.addEventListener("click", finish);

  // start visible
  morphText.classList.add("morph-in");

  // Sequence (edit these to match your vibe!)
  await sleep(350);
  await morphTo(
    morphText,
    "T, M",
    morphSub,
    `<span class="mono">T</span>: total • <span class="mono">M</span>: model`
  );

  await morphTo(
    morphText,
    "θ, μ",
    morphSub,
    `<span class="mono">θ</span> (area effects) • <span class="mono">μ</span> (global mean)`
  );

  await morphTo(
    morphText,
    "σ²",
    morphSub,
    `heteroscedasticity: <span class="mono">Var(y|θ)=σ²</span>`
  );

  await morphTo(
    morphText,
    "p(θ | y)",
    morphSub,
    `posterior ready ✓`
  );

  await sleep(300);
  finish();
}

window.addEventListener("load", runIntroMorph);


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
