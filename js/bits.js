// Vanilla replacements for framer-motion bits (CountUp + SplitText reveal).
// Plus: proof filter chips, scroll progress, cursor glow. No dependencies.
export function initFilter(chipSel = ".chip", cardSel = "#work-grid .work-card") {
  const chips = document.querySelectorAll(chipSel);
  const cards = document.querySelectorAll(cardSel);
  if (!chips.length || !cards.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      const f = chip.dataset.filter || "all";
      cards.forEach((card) => {
        card.hidden = f !== "all" && card.dataset.cat !== f;
      });
    });
  });
}
export function initProgress(sel = ".scroll-progress") {
  const bar = document.querySelector(sel);
  if (!bar) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { bar.style.display = "none"; return; }
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
export function initGlow(sel = ".cursor-glow") {
  const glow = document.querySelector(sel);
  if (!glow || matchMedia("(hover: none)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let x = 0, y = 0, tx = 0, ty = 0, on = false;
  addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!on) { on = true; glow.style.opacity = "1"; }
  }, { passive: true });
  (function follow() {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    glow.style.left = x + "px"; glow.style.top = y + "px";
    requestAnimationFrame(follow);
  })();
}
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
export function initTheme(btnSel = "#theme-toggle", key = "yoro-theme") {
  const btn = document.querySelector(btnSel);
  const root = document.documentElement;
  const readStored = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeStored = (theme) => {
    try { localStorage.setItem(key, theme); } catch { /* private mode: theme still applies */ }
  };
  const syncBtn = (isLight) => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  };
  const apply = (theme, persist) => {
    const isLight = theme === "light";
    if (isLight) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    syncBtn(isLight);
    if (persist) writeStored(theme);
  };
  const stored = readStored();
  const initial = stored === "light" || stored === "dark"
    ? stored
    : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  apply(initial, false);
  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next, true);
    });
  }
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
