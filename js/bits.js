// Vanilla replacements for framer-motion bits (CountUp + SplitText reveal).
// Reduced-motion aware. No dependencies.
export function initCountUp(sel = "[data-count-up]") {
  const els = document.querySelectorAll(sel);
  if (!els.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const to = Number(e.target.dataset.countUp || "0");
      if (reduced) { e.target.textContent = String(to); continue; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        e.target.textContent = String(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}
export function initRise(sel = ".rise") {
  const els = document.querySelectorAll(sel);
  if (!els.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const d = Number(e.target.dataset.delay || "0");
      e.target.style.transitionDelay = `${d}ms`;
      e.target.classList.add("in");
    }
  }, { rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}
