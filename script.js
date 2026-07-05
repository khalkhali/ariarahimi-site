const revealNodes = document.querySelectorAll(".reveal");
const heroCanvas = document.querySelector(".hero-canvas");
const heroGraphic = document.querySelector(".hero-graphic");
const canvasCallouts = document.querySelectorAll(".canvas-callout");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroSection = document.querySelector(".hero.reveal");

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
