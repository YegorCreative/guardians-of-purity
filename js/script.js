try {
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

document.addEventListener("DOMContentLoaded", () => {
  const footerLinkConfigs = [
    {
      selector: ".footer-link",
      matcher: (link) => link.textContent?.trim() === "Blog (Coming Soon)",
      label: "Blog page coming soon",
    },
    {
      selector: ".social-link",
      matcher: (link) => {
        const href = link.getAttribute("href") || "";
        return [
          "https://facebook.com",
          "https://instagram.com",
          "https://youtube.com",
        ].includes(href);
      },
      label: (link) => `${link.textContent?.trim() || "Social"} link coming soon`,
    },
  ];

  footerLinkConfigs.forEach(({ selector, matcher, label }) => {
    document.querySelectorAll(selector).forEach((link) => {
      if (!matcher(link)) return;

      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("tabindex", "-1");
      link.setAttribute(
        "title",
        typeof label === "function" ? label(link) : label
      );
      link.addEventListener("click", (event) => event.preventDefault());
    });
  });
});

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

// Global Chapter Progress Indicator
document.addEventListener("DOMContentLoaded", () => {
  try {
    // 1. Detect if we are on a chapter page
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);

    // Regex to match "chapter" followed by digits, e.g., "chapter1.html" or "chapter42.html"
    const match = filename.match(/chapter(\d+)\.html/i);

    if (match) {
      const currentChapter = parseInt(match[1], 10);
      const totalChapters = 42; // Hardcoded total

      // Calculate percentage
      const percentage = Math.min(100, Math.max(0, (currentChapter / totalChapters) * 100));

      // 2. Locate the injection point (.chapterOne-content)
      const container = document.querySelector(".chapterOne-content");
      const title = document.querySelector(".chapterOne-title"); // Start looking for H1

      if (container && title) {
        // 3. Create the UI elements
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "chapterProgress";
        progressWrapper.setAttribute("role", "group");
        progressWrapper.setAttribute("aria-label", `Chapter ${currentChapter} of ${totalChapters}`);

        progressWrapper.innerHTML = `
          <div class="chapterProgress__text">Chapter ${currentChapter} of ${totalChapters}</div>
          <div class="chapterProgress__bar" aria-hidden="true">
            <div class="chapterProgress__fill" style="width: ${percentage}%"></div>
          </div>
        `;

        // 4. Inject after the title
        title.insertAdjacentElement('afterend', progressWrapper);

        // =========================================
        //       Step 6: Chapter Meta Row
        // =========================================

        // 1. Calculate Word Count
        // Select specific content sections to avoid counting nav/header/footer
        const contentSections = document.querySelectorAll(
          ".chapterOne-parable-section, .chapterOne-teaching-section, .chapterOne-summary-section, .chapterOne-prayer-section"
        );

        let totalText = "";
        contentSections.forEach(section => {
          totalText += section.textContent + " ";
        });

        // Fallback: If no sections found, try main content area but be careful
        if (contentSections.length === 0) {
          const mainContent = document.querySelector(".chapterOne-section")?.nextElementSibling;
          if (mainContent) totalText = mainContent.parentElement.textContent; // Crude fallback
        }

        const wordCount = totalText.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 220)); // Min 1 min

        // 2. Check for Last Updated
        const dateMeta = document.querySelector('meta[name="last-updated"]');
        const lastUpdated = dateMeta ? dateMeta.content : null;

        // 3. Create Meta Row
        const metaWrapper = document.createElement("div");
        metaWrapper.className = "chapterMeta";
        metaWrapper.setAttribute("aria-label", "Chapter details");

        let metaHTML = `<span class="chapterMeta__item">~${readingTime} min read</span>`;

        if (lastUpdated) {
          metaHTML += `
                <span class="chapterMeta__dot" aria-hidden="true">•</span>
                <span class="chapterMeta__item">Updated: ${lastUpdated}</span>
            `;
        }

        metaWrapper.innerHTML = metaHTML;

        // 4. Inject after progress wrapper
        progressWrapper.insertAdjacentElement('afterend', metaWrapper);

        // =========================================
        //       Step 7: Jump to Chapter Modal
        // =========================================

        // 1. Inject Trigger Button
        // We put it next to the progress wrapper for context, or appended to it to keep hero clean
        // Strategy: Create a container for controls if needed, but for now, append to progressWrapper
        const jumpBtn = document.createElement("button");
        jumpBtn.type = "button";
        jumpBtn.className = "chapterJumpBtn";
        jumpBtn.id = "chapterJumpBtn";
        jumpBtn.setAttribute("aria-haspopup", "dialog");
        jumpBtn.setAttribute("aria-controls", "chapterJumpModal");
        jumpBtn.textContent = "Jump to Chapter";

        // Append under meta row
        metaWrapper.insertAdjacentElement('afterend', jumpBtn);

        // 2. Chapter Data (1-42)
        // Hardcoded for reliability as requested
        const chapters = [
          { n: 1, title: "God's Design for Your Body", file: "chapter1.html" },
          { n: 2, title: "What Is Masturbation? Understanding the Act and Its Impact", file: "chapter2.html" },
          { n: 3, title: "Biblical Principles on Purity and Self-Control", file: "chapter3.html" },
          { n: 4, title: "Is Masturbation a Sin?", file: "chapter4.html" },
          { n: 5, title: "How to Handle Temptation", file: "chapter5.html" },
          { n: 6, title: "Developing Healthy Habits", file: "chapter6.html" },
          { n: 7, title: "Overcoming Guilt and Shame", file: "chapter7.html" },
          { n: 8, title: "Honoring God with Your Body", file: "chapter8.html" },
          { n: 9, title: "Practical Steps Toward Purity", file: "chapter9.html" },
          { n: 10, title: "God's Design for Your Body", file: "chapter10.html" },
          { n: 11, title: "The Myth About Losing Hair If You Don't Masturbate", file: "chapter11.html" },
          { n: 12, title: "What to Do When Your Body Is Naturally Erected", file: "chapter12.html" },
          { n: 13, title: "What to Do When You're Touching Your Body Out of Boredom", file: "chapter13.html" },
          { n: 14, title: "How Our Body Naturally Takes Care of Itself", file: "chapter14.html" },
          { n: 15, title: "What Happens with Unused Sperm and How the Body Recycles It", file: "chapter15.html" },
          { n: 16, title: "The Impact of Pornography on Your Brain and Mental Health", file: "chapter16.html" },
          { n: 17, title: "The Month-by-Month Impact of Porn and Masturbation", file: "chapter17.html" },
          { n: 18, title: "A Hypothetical Wish for Control and Purity", file: "chapter18.html" },
          { n: 19, title: "15 Simple Things Parents Can Talk About with Their Children Struggling with Masturbation and Pornography", file: "chapter19.html" },
          { n: 20, title: "4-Week Prayer for Your Freedom", file: "chapter20.html" },
          { n: 21, title: "Is Sleeping Naked Safe?", file: "chapter21.html" },
          { n: 22, title: "Understanding Triggers: Why the Morning Can Be a Battle", file: "chapter22.html" },
          { n: 23, title: "Practical Ways to Stay Strong", file: "chapter23.html" },
          { n: 24, title: "Regrouping After a Fall", file: "chapter24.html" },
          { n: 25, title: "Growing in Holiness", file: "chapter25.html" },
          { n: 26, title: "When You Feel Numb: Overcoming the Absence of Remorse", file: "chapter26.html" },
          { n: 27, title: "Restoring Your Conscience", file: "chapter27.html" },
          { n: 28, title: "Reigniting Your Passion for Holiness", file: "chapter28.html" },
          { n: 29, title: "Understanding Triggers and Developing Guardrails", file: "chapter29.html" },
          { n: 30, title: "The Science of Rewiring Your Brain After Porn", file: "chapter30.html" },
          { n: 31, title: "How to Build a Support System That Lasts", file: "chapter31.html" },
          { n: 32, title: "Overcoming Shame and Guilt Through Grace", file: "chapter32.html" },
          { n: 33, title: "Creating a Life of Discipline", file: "chapter33.html" },
          { n: 34, title: "How Pornography Changes Relationships", file: "chapter34.html" },
          { n: 35, title: "The Role of Fasting in Breaking Addictions", file: "chapter35.html" },
          { n: 36, title: "Reigniting Your Love for God", file: "chapter36.html" },
          { n: 37, title: "Guarding Your Heart in the Digital Age", file: "chapter37.html" },
          { n: 38, title: "How Pornography Warps Your View of Others", file: "chapter38.html" },
          { n: 39, title: "Morning and Evening Battles", file: "chapter39.html" },
          { n: 40, title: "Honoring God with Your Body", file: "chapter40.html" },
          { n: 41, title: "Dressing for Purity", file: "chapter41.html" },
          { n: 42, title: "Running to God, Not From Him", file: "chapter42.html" }
        ];

        // chapters.sort is not strictly needed if the array is already sorted, but good for safety if we ever edit it.
        // However, the previous code had logic to fill in missing chapters which we are removing.
        // We will keep the sort just in case, or remove it if I want to be cleaner.
        // The instruction says "Replace the menu list... Exactly 42 items".
        // The replacement chunk covers lines 311-327.
        // Line 327 is `chapters.sort((a, b) => a.n - b.n);` in the original file. 
        // I'll leave the sort out since the array is already sorted and complete.


        // 3. Inject Modal HTML
        const modalHTML = `
        <div class="chapterModal" id="chapterJumpModal" role="dialog" aria-modal="true" aria-labelledby="chapterJumpTitle" hidden>
          <div class="chapterModal__backdrop" data-close="true"></div>
          <div class="chapterModal__panel" role="document">
            <div class="chapterModal__header">
              <h2 id="chapterJumpTitle">Jump to a Chapter</h2>
              <button type="button" class="chapterModal__close" aria-label="Close" data-close="true">×</button>
            </div>
            
            <label class="chapterModal__searchLabel" for="chapterJumpSearch">Search</label>
            <input id="chapterJumpSearch" class="chapterModal__search" type="search" placeholder="Type chapter number or title..." autocomplete="off" />
            
            <div class="chapterModal__list" id="chapterJumpList" role="listbox" aria-label="Chapters"></div>
          </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 4. Logic & Event Listeners
        const modal = document.getElementById("chapterJumpModal");
        const listContainer = document.getElementById("chapterJumpList");
        const searchInput = document.getElementById("chapterJumpSearch");
        let allItems = []; // Store button elements for filtering

        // Build List
        function buildList(filter = "") {
          listContainer.innerHTML = "";
          const lowerFilter = filter.toLowerCase();

          const filtered = chapters.filter(c =>
            c.n.toString().includes(lowerFilter) ||
            c.title.toLowerCase().includes(lowerFilter)
          );

          if (filtered.length === 0) {
            listContainer.innerHTML = `<div class="chapterModal__empty">No chapters found.</div>`;
            return;
          }

          filtered.forEach(c => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chapterModal__item";
            if (c.n === currentChapter) {
              btn.classList.add("is-current");
              btn.setAttribute("aria-current", "page");
            }
            btn.onclick = () => window.location.href = c.file;

            btn.innerHTML = `
                  <span class="chapterModal__num">Chapter ${c.n}</span>
                  <span class="chapterModal__name">${c.title}</span>
                `;
            listContainer.appendChild(btn);
          });
        }

        // Open Modal
        jumpBtn.addEventListener("click", () => {
          modal.hidden = false;
          document.body.classList.add("chapterModalOpen");
          buildList(); // Reset list
          searchInput.value = "";
          setTimeout(() => searchInput.focus(), 100);
        });

        // Close Modal Function
        function closeModal() {
          modal.hidden = true;
          document.body.classList.remove("chapterModalOpen");
          jumpBtn.focus(); // Return focus
        }

        // Click Listeners (Backdrop + Close Btn)
        modal.addEventListener("click", (e) => {
          if (e.target.dataset.close) closeModal();
        });

        // Search Filter
        searchInput.addEventListener("input", (e) => {
          buildList(e.target.value);
        });

        // Keyboard Support (ESC + Focus Trap is implicitly handled by simple markup but rigorous trap needs more JS, implementing simple version for now)
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && !modal.hidden) closeModal();
        });
      }
    }
  } catch (e) {
    console.warn("Could not inject chapter progress:", e);
  }
});

// 15-Minute Reflection Timer
document.addEventListener("DOMContentLoaded", () => {
  const timerModules = document.querySelectorAll(".reflection-timer-module");

  timerModules.forEach((module) => {
    const display = module.querySelector(".reflection-timer-display");
    const startBtn = module.querySelector(".btn-start");
    const stopBtn = module.querySelector(".btn-stop");
    const restartBtn = module.querySelector(".btn-restart");
    const completionMsg = module.querySelector(".timer-completion-message");

    // Ensure elements exist
    if (!display || !startBtn || !stopBtn || !restartBtn) return;

    // INJECT NEW SVG WAVES (Strict Design Matches Sketch: Override)
    const waveContainer = module.querySelector(".timer-waves");
    if (waveContainer) {
      waveContainer.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="timerWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="50%" stop-color="#a855f7" />
              <stop offset="100%" stop-color="#ec4899" />
            </linearGradient>
          </defs>
          <!-- 
            FORCED GEOMETRY: Start Top-Left (y~30) -> Dip Lower-Center (y~85) -> End Top-Right (y~30).
            Dips behind buttons (lower middle).
          -->
          <g class="wave-group">
            <path class="wave-path" d="M -10,30 C 20,30 35,85 50,85 S 80,30 110,30" stroke="url(#timerWaveGrad)" />
            <path class="wave-path" d="M -10,35 C 25,35 40,90 55,90 S 85,35 110,35" stroke="url(#timerWaveGrad)" />
            <path class="wave-path" d="M -10,25 C 15,25 30,80 45,80 S 75,25 110,25" stroke="url(#timerWaveGrad)" />
            <path class="wave-path" d="M -10,40 C 30,40 45,95 60,95 S 90,40 110,40" stroke="url(#timerWaveGrad)" />
            <path class="wave-path" d="M -10,32 C 22,32 37,88 52,88 S 82,32 110,32" stroke="url(#timerWaveGrad)" />
          </g>

        </svg>
      `;
    }

    let intervalId = null;
    let remainingSeconds = 15 * 60; // 15 minutes

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    function updateDisplay() {
      display.textContent = formatTime(remainingSeconds);
    }

    function startTimer() {
      if (intervalId) return; // Prevent double-start

      // Hide completion message if visible
      if (completionMsg) completionMsg.classList.remove("visible");
      module.classList.add("is-running");

      // UI Updates
      startBtn.hidden = true;
      stopBtn.hidden = false;

      intervalId = setInterval(() => {
        remainingSeconds--;
        updateDisplay();

        if (remainingSeconds <= 0) {
          // Timer finished
          stopTimer(); // Stops interval, resets UI state
          if (completionMsg) {
            completionMsg.classList.add("visible");
          }
        }
      }, 1000);
    }

    function stopTimer() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      module.classList.remove("is-running");

      // UI Updates
      startBtn.hidden = false;
      stopBtn.hidden = true;
      startBtn.textContent = "Start Timer"; // Ensure text is reset if previously 'Resume' (optional, but requirements say fixed labels)
    }

    function resetTimer() {
      stopTimer();
      remainingSeconds = 15 * 60;
      updateDisplay();
      if (completionMsg) completionMsg.classList.remove("visible");
    }

    startBtn.addEventListener("click", startTimer);
    stopBtn.addEventListener("click", stopTimer);
    restartBtn.addEventListener("click", resetTimer);

    // Initialize
    updateDisplay();
    // Ensure initial state
    startBtn.hidden = false;
    stopBtn.hidden = true;
    restartBtn.hidden = false;
  });
});
