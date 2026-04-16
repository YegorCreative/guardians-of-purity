/* ===== Masturbation Page — Scroll Animations (GSAP + ScrollTrigger) ===== */
/*
 * Final animation polish.
 * Calm, cinematic, editorial motion. No bounce, no playfulness.
 * Fade-and-rise with subtle scale on cards, slight blur lift on hero.
 * Every animation fires once, respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  if (window.__mastAnimInit) return;
  window.__mastAnimInit = true;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ease = "power2.out";
  var softEase = "power1.out";

  function q(sel)  { return document.querySelector(sel); }
  function qa(sel) { return document.querySelectorAll(sel); }

  /* Helper — scroll-triggered once animation */
  function onReveal(trigger, targets, vars, stOpts) {
    if (!trigger || !targets || !targets.length) return;
    gsap.set(targets, vars.from);
    ScrollTrigger.create(Object.assign({
      trigger: trigger,
      start: "top 86%",
      once: true,
      onEnter: function () {
        gsap.to(targets, Object.assign({}, vars.to, {
          duration: vars.duration || 0.6,
          ease: vars.ease || ease,
          stagger: vars.stagger || 0
        }));
      }
    }, stOpts || {}));
  }

  /* ───────── Hero ───────── */
  var heroTitle = q(".mast-hero-title");
  var heroSub   = q(".mast-hero-subtitle");

  if (heroTitle) {
    if (reduced) {
      /* reduced-motion: instant reveal, no transforms */
      gsap.set(heroTitle, { opacity: 1 });
      if (heroSub) gsap.set(heroSub, { opacity: 0.7 });
    } else {
      gsap.set(heroTitle, { opacity: 0, y: 24, filter: "blur(4px)" });
      gsap.to(heroTitle, {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.9, ease: ease, delay: 0.12
      });

      if (heroSub) {
        gsap.set(heroSub, { opacity: 0, y: 18 });
        gsap.to(heroSub, {
          opacity: 0.7, y: 0,
          duration: 0.8, ease: ease, delay: 0.32
        });
      }
    }
  }

  /* Skip all scroll animations if reduced motion */
  if (reduced) return;

  /* ───────── Section Titles + Intros ───────── */
  qa(".mast-section-title").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: ease });
      }
    });
  });

  qa(".mast-section-intro").forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 14 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: softEase, delay: 0.08 });
      }
    });
  });

  /* ───────── Quick Answer Panel ───────── */
  var infoGlass = q(".info-panel-glass");
  if (infoGlass) {
    onReveal(q(".info-panel-wrapper"), [infoGlass], {
      from: { opacity: 0, y: 22 },
      to:   { opacity: 1, y: 0 },
      duration: 0.7,
      ease: ease
    }, { start: "top 84%" });
  }

  /* ───────── Reason Cards ───────── */
  var cardGrid = q(".card-grid");
  if (cardGrid) {
    var cards = cardGrid.querySelectorAll(".reason-card");
    if (cards.length) {
      onReveal(cardGrid, cards, {
        from:     { opacity: 0, y: 24, scale: 0.985 },
        to:       { opacity: 1, y: 0, scale: 1 },
        duration: 0.6,
        stagger:  0.09,
        ease:     ease
      }, { start: "top 84%" });
    }
  }

  /* ───────── Scripture Blocks ───────── */
  qa(".scripture-block").forEach(function (el) {
    onReveal(el, [el], {
      from:     { opacity: 0, y: 14 },
      to:       { opacity: 1, y: 0 },
      duration: 0.55
    }, { start: "top 88%" });
  });

  /* ───────── Scripture Compare Columns ───────── */
  qa(".scripture-compare").forEach(function (el) {
    var cols = el.querySelectorAll(".scripture-col");
    if (!cols.length) return;
    onReveal(el, cols, {
      from:     { opacity: 0, y: 16 },
      to:       { opacity: 1, y: 0 },
      duration: 0.5,
      stagger:  0.12
    });
  });

  /* ───────── Myth Cards ───────── */
  var mythGrid = q(".myth-grid");
  if (mythGrid) {
    var myths = mythGrid.querySelectorAll(".myth-card");
    if (myths.length) {
      onReveal(mythGrid, myths, {
        from:     { opacity: 0, y: 20, scale: 0.988 },
        to:       { opacity: 1, y: 0, scale: 1 },
        duration: 0.65,
        stagger:  0.11,
        ease:     softEase
      });
    }
  }

  /* ───────── Highlight Sections ───────── */
  qa(".highlight-section").forEach(function (el) {
    onReveal(el, [el], {
      from:     { opacity: 0, y: 16 },
      to:       { opacity: 1, y: 0 },
      duration: 0.6
    });
  });

  /* ───────── Highlight Callouts ───────── */
  qa(".highlight-callout").forEach(function (el) {
    onReveal(el, [el], {
      from:     { opacity: 0, y: 12 },
      to:       { opacity: 1, y: 0 },
      duration: 0.55,
      ease:     softEase
    }, { start: "top 88%" });
  });

  /* ───────── Onan Block ───────── */
  var onan = q(".onan-block");
  if (onan) {
    onReveal(onan, [onan], {
      from:     { opacity: 0, y: 14 },
      to:       { opacity: 1, y: 0 },
      duration: 0.6
    });
  }

  /* ───────── Frosted Glass Conclusion ───────── */
  var conclusionGlass = q(".mast-conclusion-glass");
  if (conclusionGlass) {
    onReveal(q(".mast-conclusion-wrapper"), [conclusionGlass], {
      from:     { opacity: 0, y: 22 },
      to:       { opacity: 1, y: 0 },
      duration: 0.7,
      ease:     ease
    }, { start: "top 84%" });
  }

  /* ───────── Checklist ───────── */
  var checklist = q(".checklist");
  if (checklist) {
    var items = checklist.querySelectorAll("li");
    if (items.length) {
      onReveal(checklist, items, {
        from:     { opacity: 0, y: 12 },
        to:       { opacity: 1, y: 0 },
        duration: 0.4,
        stagger:  0.055,
        ease:     softEase
      });
    }
  }

  /* ───────── CTA ───────── */
  var ctaSection = q(".mast-cta");
  var ctaTitle   = q(".mast-cta-title");
  var ctaSub     = q(".mast-cta-subtitle");
  var ctaBtn     = q(".mast-cta .main_button");

  if (ctaSection && ctaTitle) {
    var ctaEls = [ctaTitle, ctaSub, ctaBtn].filter(Boolean);
    gsap.set(ctaEls, { opacity: 0, y: 18 });

    ScrollTrigger.create({
      trigger: ctaSection,
      start: "top 82%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline({ defaults: { ease: ease } });
        tl.to(ctaTitle, { opacity: 1, y: 0, duration: 0.55 });
        if (ctaSub) tl.to(ctaSub, { opacity: 0.65, y: 0, duration: 0.5 }, "-=0.32");
        if (ctaBtn) tl.to(ctaBtn, { opacity: 1, y: 0, duration: 0.5 }, "-=0.28");
      }
    });
  }

})();
