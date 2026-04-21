/* ===== Journey Page — Dedicated Parallax ===== */
(function () {
  "use strict";

  if (window.__journeyParallaxInit) return;
  window.__journeyParallaxInit = true;

  var isJourneyPage = /(?:^|\/)journey\.html(?:$|\?)/.test(window.location.pathname);
  if (!isJourneyPage) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  window.addEventListener("load", function () {
    var triggerElement = document.querySelector("[data-parallax-layers]");
    if (!triggerElement) return;

    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.innerWidth < 768;
    var layers = isMobile
      ? [
          { layer: "1", yPercent: 18 },
          { layer: "2", yPercent: 14 },
          { layer: "3", yPercent: 10 },
          { layer: "4", yPercent: 5 },
        ]
      : [
          { layer: "1", yPercent: 46 },
          { layer: "2", yPercent: 34 },
          { layer: "3", yPercent: 22 },
          { layer: "4", yPercent: 10 },
        ];

    var timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: "bottom top",
        scrub: isMobile ? 1.05 : 0.6,
      },
    });

    layers.forEach(function (layerObj, idx) {
      var elements = triggerElement.querySelectorAll('[data-parallax-layer="' + layerObj.layer + '"]');
      if (!elements.length) return;

      timeline.to(
        elements,
        {
          yPercent: layerObj.yPercent,
          ease: "none",
          force3D: true,
        },
        idx === 0 ? 0 : "<"
      );
    });

    ScrollTrigger.refresh();
  });
})();
