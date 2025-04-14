// Version: v1.2.2 | Changelog: Added hero carousel with auto-play
try {
    // Navbar toggle
    const hamburger = document.getElementById('hamburger-icon');
    const navLinks = document.getElementById('nav-links');
    hamburger.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('responsive');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });
  
    // Hero carousel
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.getElementById('hero-prev');
    const heroNext = document.getElementById('hero-next');
    let heroIndex = 0;
    const autoPlayInterval = 5000; // 5 seconds
  
    function showHeroSlide(index) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroSlides[index].classList.add('active');
    }
  
    function startAutoPlay() {
      return setInterval(() => {
        heroIndex = (heroIndex + 1) % heroSlides.length;
        showHeroSlide(heroIndex);
      }, autoPlayInterval);
    }
  
    let autoPlay = startAutoPlay();
  
    heroPrev.addEventListener('click', () => {
      clearInterval(autoPlay);
      heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
      showHeroSlide(heroIndex);
      autoPlay = startAutoPlay();
    });
  
    heroNext.addEventListener('click', () => {
      clearInterval(autoPlay);
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
      autoPlay = startAutoPlay();
    });
  
    // Pillars tabs
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        panels.forEach(p => p.classList.remove('active'));
        const panelId = tab.getAttribute('aria-controls');
        document.getElementById(panelId).classList.add('active');
      });
    });
  
    // Testimonial carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentIndex = 0;
  
    function showTestimonial(index) {
      testimonials.forEach(t => t.classList.remove('active'));
      testimonials[index].classList.add('active');
    }
  
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? testimonials.length - 1 : currentIndex - 1;
      showTestimonial(currentIndex);
    });
  
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
      showTestimonial(currentIndex);
    });
  
    // CTA form validation
    const ctaForm = document.getElementById('cta-form');
    const ctaEmail = document.getElementById('cta-email');
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (ctaEmail.value.trim() === '' || !ctaEmail.value.includes('@')) {
        alert('Please enter a valid email address.');
      } else {
        alert('Thank you! Guide download link sent to ' + ctaEmail.value);
        ctaEmail.value = '';
      }
    });
  } catch (error) {
    console.error('Error in script:', error);
  }