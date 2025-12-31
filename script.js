// year in footer
document.getElementById("year").textContent = new Date().getFullYear();

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
