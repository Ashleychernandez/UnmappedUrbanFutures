document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel-container');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dotsContainer = carousel.querySelector('[data-carousel-dots]');
  const dots = [];

  if (slides.length <= 1) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let intervalId = null;

  const showSlide = (nextIndex) => {
    slides[activeIndex].classList.remove('is-active');
    slides[activeIndex].setAttribute('aria-hidden', 'true');
    activeIndex = nextIndex;
    slides[activeIndex].classList.add('is-active');
    slides[activeIndex].setAttribute('aria-hidden', 'false');

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const nextSlide = () => {
    showSlide((activeIndex + 1) % slides.length);
  };

  const startCarousel = () => {
    if (prefersReducedMotion || intervalId !== null) {
      return;
    }

    intervalId = window.setInterval(nextSlide, 4500);
  };

  const stopCarousel = () => {
    if (intervalId === null) {
      return;
    }

    window.clearInterval(intervalId);
    intervalId = null;
  };

  slides.forEach((slide, index) => {
    slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');

    if (!dotsContainer) {
      return;
    }

    const dot = document.createElement('button');
    const isActive = index === activeIndex;

    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-label', `Show slide ${index + 1}`);
    dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    dot.addEventListener('click', () => {
      if (index === activeIndex) {
        return;
      }

      showSlide(index);
      stopCarousel();
      startCarousel();
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  if (!prefersReducedMotion) {
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    startCarousel();
  }
});
