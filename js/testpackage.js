try {
  // Strart parallax action
  let lenis;
  let lenisTicker;

  window.addEventListener("load", () => {
    // Force scroll to top on page load
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Wait for layout to settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Initialize Lenis
        lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);

        lenisTicker = (time) => {
          if (lenis) lenis.raf(time * 1000);
        };

        gsap.ticker.add(lenisTicker);
        gsap.ticker.lagSmoothing(0);

        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

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

        // 🔁 Force refresh after a short delay
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      });
    });

    // Handle responsive teardown
    const observer = new MutationObserver(() => {
      const updatedResponsive = document.querySelector(".responsive");
      if (updatedResponsive && lenis) {
        gsap.ticker.remove(lenisTicker);
        lenis.destroy();
        lenis = null;
        console.log("Lenis stopped due to responsive mode");
      }
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  });

  // End parallax action

  // Gradient Cards css

  const gradientCards = document.querySelectorAll(
    ".gradient_cards_wrapper .card"
  );
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  gradientCards.forEach((card) => {
    const content = card.querySelector(".gradient_cards_wrapper .card-content");
    const rotationFactor =
      parseFloat(card.getAttribute("data-rotation-factor")) || 2;

    if (!isTouchDevice) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = (rotationFactor * (x - centerX)) / centerX;
        const rotateX = (-rotationFactor * (y - centerY)) / centerY;

        content.style.transform = `
              rotateX(${rotateX}deg) 
              rotateY(${rotateY}deg)
            `;

        card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
      });

      card.addEventListener("mouseleave", () => {
        content.style.transform = "rotateX(0) rotateY(0)";

        content.style.transition = "transform 0.5s ease";
        setTimeout(() => {
          content.style.transition = "";
        }, 500);
      });
    }

    const randomDelay = Math.random() * 2;
    card.style.animation = `cardFloat 4s infinite alternate ease-in-out ${randomDelay}s`;
  });

  const style = document.createElement("style");
  style.textContent = `
        @keyframes cardFloat {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-5px);
          }
        }
        
        @media (min-width: 768px) {
          @keyframes cardFloat {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-8px);
            }
          }
        }
        
        @media (min-width: 1024px) {
          @keyframes cardFloat {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-10px);
            }
          }
        }
      `;
  document.head.appendChild(style);

  const buttons = document.querySelectorAll(
    ".gradient_cards_wrapper .card-button"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      button.appendChild(ripple);

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      ripple.classList.add("active");

      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });

  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
        .gradient_cards_wrapper .card-button {
          position: relative;
          overflow: hidden;
        }
        
        .gradient_cards_wrapper .ripple {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.5s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
  document.head.appendChild(rippleStyle);

  // Start explore tabs

  gsap.registerPlugin(CustomEase, Flip);

  CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");

  gsap.defaults({
    ease: "osmo-ease",
    duration: 0.8,
  });

  function initFlipButtons() {
    let wrappers = document.querySelectorAll('[data-flip-button="wrap"]');

    wrappers.forEach((wrapper) => {
      let buttons = wrapper.querySelectorAll('[data-flip-button="button"]');
      let bg = wrapper.querySelector('[data-flip-button="bg"]');

      buttons.forEach(function (button) {
        // Handle mouse enter
        button.addEventListener("mouseenter", function () {
          const state = Flip.getState(bg);
          this.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });

        // Handle focus for keyboard navigation
        button.addEventListener("focus", function () {
          const state = Flip.getState(bg);
          this.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });

        // Handle mouse leave
        button.addEventListener("mouseleave", function () {
          const state = Flip.getState(bg);
          const activeLink = wrapper.querySelector(".active");
          activeLink.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });

        // Handle blur to reset background for keyboard navigation
        button.addEventListener("blur", function () {
          const state = Flip.getState(bg);
          const activeLink = wrapper.querySelector(".active");
          activeLink.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });
      });
    });
  }

  function initTabSystem() {
    let wrappers = document.querySelectorAll('[data-tabs="wrapper"]');

    wrappers.forEach((wrapper) => {
      let nav = wrapper.querySelector('[data-tabs="nav"]');
      let buttons = nav.querySelectorAll('[data-tabs="button"]');
      let contentWrap = wrapper.querySelector('[data-tabs="content-wrap"]');
      let contentItems = contentWrap.querySelectorAll(
        '[data-tabs="content-item"]'
      );
      let visualWrap = wrapper.querySelector('[data-tabs="visual-wrap"]');
      let visualItems = visualWrap.querySelectorAll(
        '[data-tabs="visual-item"]'
      );

      let activeButton = buttons[0];
      let activeContent = contentItems[0];
      let activeVisual = visualItems[0];
      let isAnimating = false;

      function switchTab(index, initial = false) {
        if (!initial && (isAnimating || buttons[index] === activeButton))
          return; // ignore click if the clicked button is already active
        isAnimating = true; // keep track of whether or not one is moving, to prevent overlap

        const outgoingContent = activeContent;
        const incomingContent = contentItems[index];
        const outgoingVisual = activeVisual;
        const incomingVisual = visualItems[index];

        let outgoingLines =
          outgoingContent.querySelectorAll("[data-tabs-fade]") || [];
        let incomingLines =
          incomingContent.querySelectorAll("[data-tabs-fade]");

        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.inOut",
          },
          onComplete: () => {
            if (!initial) {
              outgoingContent && outgoingContent.classList.remove("active");
              outgoingVisual && outgoingVisual.classList.remove("active");
            }
            activeContent = incomingContent;
            activeVisual = incomingVisual;
            isAnimating = false;
          },
        });

        incomingContent.classList.add("active");
        incomingVisual.classList.add("active");

        timeline
          .to(outgoingLines, { y: "-2em", autoAlpha: 0 }, 0)
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
          .fromTo(
            incomingLines,
            { y: "2em", autoAlpha: 0 },
            { y: "0em", autoAlpha: 1, stagger: 0.075 },
            0.4
          )
          .fromTo(
            incomingVisual,
            { autoAlpha: 0, xPercent: 3 },
            { autoAlpha: 1, xPercent: 0 },
            "<"
          );

        activeButton && activeButton.classList.remove("active");
        buttons[index].classList.add("active");
        activeButton = buttons[index];
      }

      switchTab(0, true); // on page load

      buttons.forEach((button, i) => {
        button.addEventListener("click", () => switchTab(i));
      });

      contentItems[0].classList.add("active");
      visualItems[0].classList.add("active");
      buttons[0].classList.add("active");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabSystem();
    initFlipButtons();
  });

  // End explore tabs

  // Start our team part

  const teamMembers = [
    { name: "Emily Kim", role: "Founder" },
    { name: "Michael Steward", role: "Creative Director" },
    { name: "Emma Rodriguez", role: "Lead Developer" },
    { name: "Julia Gimmel", role: "UX Designer" },
    { name: "Lisa Anderson", role: "Marketing Manager" },
    { name: "James Wilson", role: "Product Manager" },
  ];

  const ourTeampCards = document.querySelectorAll(".our_team_wrapper .card");
  const dots = document.querySelectorAll(".our_team_wrapper .dot");
  const memberName = document.querySelector(".our_team_wrapper .member-name");
  const memberRole = document.querySelector(".our_team_wrapper .member-role");
  const leftArrow = document.querySelector(".our_team_wrapper .nav-arrow.left");
  const rightArrow = document.querySelector(
    ".our_team_wrapper .nav-arrow.right"
  );
  let currentIndex = 0;
  let isAnimating = false;

  function updateCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + ourTeampCards.length) % ourTeampCards.length;

    ourTeampCards.forEach((card, i) => {
      const offset =
        (i - currentIndex + ourTeampCards.length) % ourTeampCards.length;

      card.classList.remove(
        "center",
        "left-1",
        "left-2",
        "right-1",
        "right-2",
        "hidden"
      );

      if (offset === 0) {
        card.classList.add("center");
      } else if (offset === 1) {
        card.classList.add("right-1");
      } else if (offset === 2) {
        card.classList.add("right-2");
      } else if (offset === ourTeampCards.length - 1) {
        card.classList.add("left-1");
      } else if (offset === ourTeampCards.length - 2) {
        card.classList.add("left-2");
      } else {
        card.classList.add("hidden");
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    memberName.style.opacity = "0";
    memberRole.style.opacity = "0";

    setTimeout(() => {
      memberName.textContent = teamMembers[currentIndex].name;
      memberRole.textContent = teamMembers[currentIndex].role;
      memberName.style.opacity = "1";
      memberRole.style.opacity = "1";
    }, 300);

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  leftArrow.addEventListener("click", () => {
    updateCarousel(currentIndex - 1);
  });

  rightArrow.addEventListener("click", () => {
    updateCarousel(currentIndex + 1);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      updateCarousel(i);
    });
  });

  ourTeampCards.forEach((card, i) => {
    card.addEventListener("click", () => {
      updateCarousel(i);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      updateCarousel(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      updateCarousel(currentIndex + 1);
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  }

  updateCarousel(0);

  // End our team part
} catch (error) {
  console.error("Error in script:", error);
}
