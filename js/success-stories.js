/* ===== Success Stories — Scroll Animations (GSAP + ScrollTrigger) ===== */
/*
 * Intentionally minimal motion.
 * This page should feel safe, honest, mature, emotionally strong.
 * No scale, no blur, no parallax, no flip — just quiet fade-and-rise.
 */
(function () {
  "use strict";

  // Guard: only run once, only when GSAP available
  if (window.__storiesAnimInit) return;
  window.__storiesAnimInit = true;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Respect reduced motion
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  var ease = "power2.out";

  /* ---------- Hero ---------- */
  var heroTitle = document.querySelector(".stories-hero-title");
  var heroSub = document.querySelector(".stories-hero-subtitle");

  if (heroTitle && heroSub) {
    gsap.set([heroTitle, heroSub], { opacity: 0, y: 18 });

    gsap.to(heroTitle, {
      opacity: 1, y: 0,
      duration: 0.8, ease: ease, delay: 0.1
    });
    gsap.to(heroSub, {
      opacity: 0.7, y: 0,
      duration: 0.8, ease: ease, delay: 0.28
    });
  }

  /* ---------- Section Titles ---------- */
  document.querySelectorAll(".stories-section-title").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 16 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: ease });
      }
    });
  });

  /* ---------- Story Cards ---------- */
  document.querySelectorAll(".stories-grid").forEach(function (grid) {
    var cards = grid.querySelectorAll(".story-card");
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: grid,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.55,
          ease: ease,
          stagger: 0.08
        });
      }
    });
  });

  /* ---------- CTA ---------- */
  var ctaTitle = document.querySelector(".stories-cta-title");
  var ctaSub = document.querySelector(".stories-cta-subtitle");
  var ctaBtn = document.querySelector(".stories-cta .main_button");

  if (ctaTitle) {
    gsap.set([ctaTitle, ctaSub, ctaBtn].filter(Boolean), { opacity: 0, y: 16 });

    ScrollTrigger.create({
      trigger: ".stories-cta",
      start: "top 82%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline({ defaults: { ease: ease } });
        if (ctaTitle) tl.to(ctaTitle, { opacity: 1, y: 0, duration: 0.5 });
        if (ctaSub)   tl.to(ctaSub,   { opacity: 0.65, y: 0, duration: 0.45 }, "-=0.3");
        if (ctaBtn)   tl.to(ctaBtn,   { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");
      }
    });
  }
})();
