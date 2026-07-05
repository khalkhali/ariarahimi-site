const revealNodes = document.querySelectorAll(".reveal");
const heroCanvas = document.querySelector(".hero-canvas");
const heroGraphic = document.querySelector(".hero-graphic");
const canvasCallouts = document.querySelectorAll(".canvas-callout");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroSection = document.querySelector(".hero.reveal");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const mobileNavQuery = window.matchMedia("(max-width: 720px)");

const setNavOpen = (isOpen) => {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
};

if (heroSection) {
  heroSection.classList.add("is-visible");
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.14,
  }
);

for (const node of revealNodes) {
  observer.observe(node);
}

if (siteHeader && navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (mobileNavQuery.matches && event.target instanceof Element && event.target.closest("a")) {
      setNavOpen(false);
    }
  });

  mobileNavQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      setNavOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });
}

if (heroCanvas && heroGraphic && !prefersReducedMotion) {
  heroCanvas.addEventListener("pointermove", (event) => {
    const rect = heroCanvas.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    heroGraphic.style.transform = `translate(${offsetX * 18}px, ${offsetY * 18}px)`;

    for (const [index, callout] of canvasCallouts.entries()) {
      const direction = index === 0 ? 12 : -12;
      callout.style.transform = `translate(${offsetX * direction}px, ${offsetY * direction}px)`;
    }
  });

  heroCanvas.addEventListener("pointerleave", () => {
    heroGraphic.style.transform = "";

    for (const callout of canvasCallouts) {
      callout.style.transform = "";
    }
  });
}
