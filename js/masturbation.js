/* ===== Masturbation Page — Scroll Animations (GSAP + ScrollTrigger) ===== */
/*
 * Intentionally minimal motion.
 * This page should feel safe, honest, mature, emotionally strong.
 * No scale, no blur, no parallax — just quiet fade-and-rise.
 */
(function () {
  "use strict";

  if (window.__mastAnimInit) return;
  window.__mastAnimInit = true;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  var ease = "power2.out";

  /* ---------- Hero ---------- */
  var heroTitle = document.querySelector(".mast-hero-title");
  var heroSub = document.querySelector(".mast-hero-subtitle");

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
  document.querySelectorAll(".mast-section-title").forEach(function (el) {
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

  /* ---------- Info Panel ---------- */
  var infoPanel = document.querySelector(".info-panel");
  if (infoPanel) {
    gsap.set(infoPanel, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: infoPanel,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(infoPanel, { opacity: 1, y: 0, duration: 0.6, ease: ease });
      }
    });
  }

  /* ---------- Reason Cards ---------- */
  var cardGrid = document.querySelector(".card-grid");
  if (cardGrid) {
    var cards = cardGrid.querySelectorAll(".reason-card");
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: cardGrid,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(cards, {
            opacity: 1, y: 0,
            duration: 0.55, ease: ease,
            stagger: 0.08
          });
        }
      });
    }
  }

  /* ---------- Scripture Blocks ---------- */
  document.querySelectorAll(".scripture-block").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 14 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: ease });
      }
    });
  });

  /* ---------- Scripture Compare Columns ---------- */
  document.querySelectorAll(".scripture-compare").forEach(function (el) {
    var cols = el.querySelectorAll(".scripture-col");
    if (!cols.length) return;
    gsap.set(cols, { opacity: 0, y: 16 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(cols, {
          opacity: 1, y: 0,
          duration: 0.5, ease: ease,
          stagger: 0.1
        });
      }
    });
  });

  /* ---------- Myth Cards ---------- */
  var mythGrid = document.querySelector(".myth-grid");
  if (mythGrid) {
    var myths = mythGrid.querySelectorAll(".myth-card");
    if (myths.length) {
      gsap.set(myths, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: mythGrid,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(myths, {
            opacity: 1, y: 0,
            duration: 0.55, ease: ease,
            stagger: 0.08
          });
        }
      });
    }
  }

  /* ---------- Highlight Sections ---------- */
  document.querySelectorAll(".highlight-section").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 16 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: ease });
      }
    });
  });

  /* ---------- Frosted Glass Conclusion ---------- */
  var conclusionGlass = document.querySelector(".mast-conclusion-glass");
  if (conclusionGlass) {
    gsap.set(conclusionGlass, { opacity: 0, y: 18 });
    ScrollTrigger.create({
      trigger: ".mast-conclusion-wrapper",
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(conclusionGlass, { opacity: 1, y: 0, duration: 0.6, ease: ease });
      }
    });
  }

  /* ---------- Checklist ---------- */
  var checklist = document.querySelector(".checklist");
  if (checklist) {
    var items = checklist.querySelectorAll("li");
    if (items.length) {
      gsap.set(items, { opacity: 0, y: 14 });
      ScrollTrigger.create({
        trigger: checklist,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(items, {
            opacity: 1, y: 0,
            duration: 0.45, ease: ease,
            stagger: 0.06
          });
        }
      });
    }
  }

  /* ---------- CTA ---------- */
  var ctaTitle = document.querySelector(".mast-cta-title");
  var ctaSub = document.querySelector(".mast-cta-subtitle");
  var ctaBtn = document.querySelector(".mast-cta .main_button");

  if (ctaTitle) {
    gsap.set([ctaTitle, ctaSub, ctaBtn].filter(Boolean), { opacity: 0, y: 16 });

    ScrollTrigger.create({
      trigger: ".mast-cta",
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
