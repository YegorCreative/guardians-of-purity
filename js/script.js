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

  if (window.innerWidth < 768) {
    navLinks.classList.add("hideLenis");
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
  // let lenis;
  // let lenisTicker;

  // window.addEventListener("load", () => {
  //   // Force scroll to top on page load
  //   if ("scrollRestoration" in history) {
  //     history.scrollRestoration = "manual";
  //   }
  //   window.scrollTo(0, 0);

  //   // Wait for layout to settle
  //   requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       // Initialize Lenis
  //       lenis = new Lenis();
  //       lenis.on("scroll", ScrollTrigger.update);

  //       lenisTicker = (time) => {
  //         if (lenis) lenis.raf(time * 1000);
  //       };

  //       gsap.ticker.add(lenisTicker);
  //       gsap.ticker.lagSmoothing(0);

  //       // Register GSAP plugin
  //       gsap.registerPlugin(ScrollTrigger);

  //       // Setup parallax
  //       document
  //         .querySelectorAll("[data-parallax-layers]")
  //         .forEach((triggerElement) => {
  //           let tl = gsap.timeline({
  //             scrollTrigger: {
  //               trigger: triggerElement,
  //               start: "0% 0%",
  //               end: "100% 0%",
  //               scrub: true, // smoother
  //             },
  //           });

  //           const layers = [
  //             { layer: "1", yPercent: 70 },
  //             { layer: "2", yPercent: 55 },
  //             { layer: "3", yPercent: 40 },
  //             { layer: "4", yPercent: 10 },
  //           ];

  //           layers.forEach((layerObj, idx) => {
  //             tl.to(
  //               triggerElement.querySelectorAll(
  //                 `[data-parallax-layer="${layerObj.layer}"]`
  //               ),
  //               {
  //                 yPercent: layerObj.yPercent,
  //                 ease: "none",
  //               },
  //               idx === 0 ? undefined : "<"
  //             );
  //           });
  //         });

  //       setTimeout(() => {
  //         ScrollTrigger.refresh();
  //       }, 100);
  //     });
  //   });

  //   const observer = new MutationObserver(() => {
  //     const isResponsive = document
  //       .querySelector("#main-nav")
  //       ?.classList.contains("responsive");
  //     if (lenis) {
  //       if (isResponsive) {
  //         gsap.ticker.remove(lenisTicker);
  //       } else {
  //         gsap.ticker.add(lenisTicker);
  //       }
  //     }
  //   });

  //   observer.observe(document.body, {
  //     attributes: true,
  //     childList: true,
  //     subtree: true,
  //   });
  // });

  let lenis;
  let lenisTicker;
  let lenisTickerAdded = false;

  window.addEventListener("load", () => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);

        lenisTicker = (time) => {
          if (lenis) lenis.raf(time * 1000);
        };

        const addLenisTicker = () => {
          if (!lenisTickerAdded) {
            gsap.ticker.add(lenisTicker);
            lenisTickerAdded = true;
          }
        };

        const removeLenisTicker = () => {
          if (lenisTickerAdded) {
            gsap.ticker.remove(lenisTicker);
            lenisTickerAdded = false;
          }
        };

        addLenisTicker();
        gsap.ticker.lagSmoothing(0);

        document
          .querySelectorAll("[data-parallax-layers]")
          .forEach((triggerElement) => {
            let tl = gsap.timeline({
              scrollTrigger: {
                trigger: triggerElement,
                start: "0% 0%",
                end: "100% 0%",
                scrub: true,
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

        const observer = new MutationObserver(() => {
          const isResponsive = document
            .querySelector("#main-nav")
            ?.classList.contains("hideLenis");

          if (lenis) {
            isResponsive ? removeLenisTicker() : addLenisTicker();
          }
        });

        observer.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      });
    });
  });

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

  // Scroll to top smoothly
  scrollBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
} catch (error) {
  console.error("Error in script:", error);
}
// Placeholder for future interactivity
// You can add scroll animations, section trackers, or reminders here
console.log("31 Days of Prayer - Intro Section Loaded");
