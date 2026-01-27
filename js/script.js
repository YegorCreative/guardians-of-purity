try {
  // Navbar toggle
  const hamburger = document.getElementById("hamburger-icon");
  const navLinks = document.getElementById("main-nav");
  hamburger.addEventListener("click", () => {
    const isExpanded = navLinks.classList.toggle("responsive");
    hamburger.setAttribute("aria-expanded", isExpanded);
    document.body.style.overflow = isExpanded ? "hidden" : "auto";
  });

  // Testimonial carousel
  const testimonials = document.querySelectorAll(".testimonial");
  let currentIndex = 0;

  function showTestimonial(index) {
    testimonials.forEach((t) => t.classList.remove("active"));
    testimonials[index].classList.add("active");
  }

  // CTA form validation
  const ctaForm = document.getElementById("cta-form");
  const ctaEmail = document.getElementById("cta-email");
  ctaForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (ctaEmail.value.trim() === "" || !ctaEmail.value.includes("@")) {
      alert("Please enter a valid email address.");
    } else {
      alert("Thank you! Guide download link sent to " + ctaEmail.value);
      ctaEmail.value = "";
    }
  });

  // Start index section 1 JS

  const isResponsive = window.innerWidth < 767;

  // Only respect system preference
  const effectiveReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isAboutPage = /(?:^|\/)about\.html(?:$|\?)/.test(location.pathname);
  const hasParallax = document.querySelector("[data-parallax-layers]") !== null;

  if (!isResponsive && !effectiveReducedMotion && !isAboutPage && hasParallax) {
    let lenis;
    let lenisTicker;
    window.addEventListener("load", () => {
      if (
        typeof Lenis !== "function" ||
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
      ) {
        return;
      }

      // Force scroll to top on page load
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      // Wait for layout to settle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            // Register GSAP plugin
            gsap.registerPlugin(ScrollTrigger);

            // Initialize Lenis
            lenis = new Lenis();
            lenis.on("scroll", ScrollTrigger.update);

            lenisTicker = (time) => {
              if (lenis) lenis.raf(time * 1000);
            };
            gsap.ticker.add(lenisTicker);
            gsap.ticker.lagSmoothing(0);

            // Setup parallax
            document
              .querySelectorAll("[data-parallax-layers]")
              .forEach((triggerElement) => {
                let tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: triggerElement,
                    start: "0% 0%",
                    end: "100% 0%",
                    scrub: true, // smoother
                  },
                });
                const layers = [
                  { layer: "1", yPercent: 70 },
                  { layer: "2", yPercent: 55 },
                  { layer: "3", yPercent: 40 },
                  { layer: "4", yPercent: 10 },
                ];
                layers.forEach((layerObj, idx) => {
                  tl.to(
                    triggerElement.querySelectorAll(
                      `[data-parallax-layer="${layerObj.layer}"]`
                    ),
                    {
                      yPercent: layerObj.yPercent,
                      ease: "none",
                    },
                    idx === 0 ? undefined : "<"
                  );
                });
              });

            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 100);
          } catch (e) {
            console.error("Error initializing parallax:", e);
          }
        });
      });
      const observer = new MutationObserver(() => {
        if (lenis) {
          gsap.ticker.add(lenisTicker);
        }
      });
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });
  }

  // End index section 1 JS

  // Scroll to top button
  const scrollBtn = document.getElementById("scrollToTopButton");

  // Show button when scrolled down
  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  };

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: effectiveReducedMotion ? "auto" : "smooth",
    });
  });
} catch (error) {
  console.error("Error in script:", error);
}
// Placeholder for future interactivity
// You can add scroll animations, section trackers, or reminders here
console.log("31 Days of Prayer - Intro Section Loaded");

// do this now reflection

// Save and load journaling text
document.addEventListener("DOMContentLoaded", () => {
  if (window.AppStorage && typeof window.AppStorage.bindTextareas === "function") {
    window.AppStorage.bindTextareas('textarea[id^="journal"]');
  } else {
    document.querySelectorAll('textarea[id^="journal"]').forEach((ta) => {
      const key = ta.id;
      const saved = localStorage.getItem(key);
      if (saved) ta.value = saved;
      ta.addEventListener("input", () => localStorage.setItem(key, ta.value));
    });
  }
});

function exportReflection() {
  const titleEl = document.querySelector(".chapterOne-title");
  const chapterTitle = titleEl?.textContent?.trim() || "Chapter Reflections";

  const textareas = Array.from(
    document.querySelectorAll('textarea[id^="journal"]')
  );

  const entries = textareas.map((ta) => {
    const key = ta.id;
    const value = localStorage.getItem(key) || ta.value || "";
    return { key, value };
  });

  let content = `${chapterTitle} — Reflections\n\n`;
  if (entries.length === 0) {
    content += "[No journaling entries found on this page.]\n";
  } else {
    entries.forEach((e, idx) => {
      content += `${idx + 1}. ${e.key}:\n${e.value}\n\n`;
    });
  }

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${chapterTitle.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "chapter"}_Reflections.txt`;
  link.click();
}
