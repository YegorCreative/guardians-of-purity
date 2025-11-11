// Enhanced image carousel: autoplay, pause on hover, controls, dots
(function () {
  const INTERVAL_MS = 5000; // 5 seconds
  let index = 0;
  let timer = null;

  function initCarousel() {
    const carousel = document.querySelector('.monthly_prayer_guide_carousel');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('img'));
    if (slides.length <= 1) return; // nothing to rotate

    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    const dotsWrapper = carousel.querySelector('.carousel-dots');

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show image ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i, true));
      dotsWrapper.appendChild(dot);
    });

    function updateDots() {
      const dots = dotsWrapper.querySelectorAll('button');
      dots.forEach((d, i) => {
        if (i === index) {
          d.setAttribute('aria-selected', 'true');
        } else {
          d.removeAttribute('aria-selected');
        }
      });
    }

    function goToSlide(newIndex, userInitiated = false) {
      slides[index].classList.remove('active');
      index = (newIndex + slides.length) % slides.length;
      slides[index].classList.add('active');
      updateDots();
      if (userInitiated) restartTimer();
    }

    function next() { goToSlide(index + 1); }
    function prev() { goToSlide(index - 1); }

    function startTimer() {
      timer = setInterval(next, INTERVAL_MS);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function restartTimer() {
      stopTimer();
      startTimer();
    }

    // Controls
    if (prevBtn) prevBtn.addEventListener('click', () => prev());
    if (nextBtn) nextBtn.addEventListener('click', () => next());

    // Pause on hover / focus within
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    carousel.addEventListener('focusin', stopTimer);
    carousel.addEventListener('focusout', startTimer);

    // Keyboard support (left/right arrows)
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Preload images for smoother transitions
    slides.forEach(img => { const src = img.getAttribute('src'); if (src) { const pre = new Image(); pre.src = src; } });

    // Initialize
    goToSlide(0);
    startTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
