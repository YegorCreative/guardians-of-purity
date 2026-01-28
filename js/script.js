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
          { n: 1, title: "God’s Design for Your Body", file: "chapter1.html" },
          { n: 2, title: "The Battle for Purity", file: "chapter2.html" },
          { n: 3, title: "Identity in Christ", file: "chapter3.html" },
          // ... generating full 1-42 list dynamically or placeholders where unknown
        ];
        // Populate specific titles where known, else generic
        for (let i = 4; i <= 42; i++) {
          if (!chapters.find(c => c.n === i)) {
            chapters.push({ n: i, title: `Chapter ${i}`, file: `chapter${i}.html` });
          }
        }
        // Update known titles from context if available (optional enhancement)
        chapters[39] = { n: 40, title: "Building a Vision for the Future", file: "chapter40.html" };
        chapters[37] = { n: 38, title: "Healing the Inner Child", file: "chapter38.html" };
        // Add more known titles here as needed
        chapters.sort((a, b) => a.n - b.n);

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
