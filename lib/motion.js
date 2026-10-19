/** Parallaxe et curseur : paramètres de la version originale conservés. */
export function initializeMotion(scope) {
  document.documentElement.classList.add('js');
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const header = $('#site-header');
  const hero = $('.hero');
  const heroImage = $('.hero-image');
  const progress = $('.page-progress');
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  const main = $('main');
  const footer = $('.site-footer');
  const cursor = $('.custom-cursor');
  let scrollPending = false;

  // Scroll updates run once per frame, only after an actual scroll or resize.
  function updateScroll() {
    const y = Math.max(0, window.scrollY);
    header.classList.toggle('scrolled', y > 35);
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(y / available, 1) : 0})`;
    if (!motionPreference.matches && y < hero.offsetHeight + 100) {
      const heroProgress = Math.min(y / hero.offsetHeight, 1);
      heroImage.style.transform = `translate3d(0,${y * 0.15}px,0) scale(${1.045 + heroProgress * 0.035})`;
    } else if (motionPreference.matches) {
      heroImage.style.transform = '';
    }
    scrollPending = false;
  }
  function requestScrollUpdate() {
    if (!scrollPending) {
      scrollPending = true;
      scope.frame(updateScroll);
    }
  }
  scope.listen(window, 'scroll', requestScrollUpdate, {
    passive: true,
  });
  scope.listen(window, 'resize', requestScrollUpdate, {
    passive: true,
  });
  scope.listen(motionPreference, 'change', requestScrollUpdate);
  updateScroll();
  const markHeroLoaded = () => heroImage.classList.add('loaded');
  if (heroImage.complete && heroImage.naturalWidth) markHeroLoaded();
  else
    scope.listen(heroImage, 'load', markHeroLoaded, {
      once: true,
    });
  scope.listen(
    heroImage,
    'error',
    () => {
      heroImage.style.opacity = '0';
      hero.style.background = '#202020';
    },
    {
      once: true,
    },
  );
  if ('IntersectionObserver' in window) {
    const revealObserver = scope.observe(
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -30px 0px',
          threshold: 0.05,
        },
      ),
    );
    $$('.reveal').forEach((element) => revealObserver.observe(element));
    const navObserver = scope.observe(
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const link = $(`.desktop-nav a[href="#${entry.target.id}"]`);
            if (link) {
              if (entry.isIntersecting) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            }
          });
        },
        {
          rootMargin: '-20% 0px -50% 0px',
          threshold: 0,
        },
      ),
    );
    ['images', 'studio', 'approche'].forEach((id) => navObserver.observe(document.getElementById(id)));
  } else {
    $$('.reveal').forEach((element) => element.classList.add('visible'));
  }

  // A contextual cursor appears only over images, on precise pointing devices.
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const hideCursor = () => cursor.classList.remove('active');
  scope.listen(
    window,
    'pointermove',
    (event) => {
      if (!finePointer.matches || motionPreference.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) {
        pointerFrame = scope.frame(() => {
          cursor.style.transform = `translate3d(${pointerX - 44}px,${pointerY - 44}px,0)`;
          pointerFrame = 0;
        });
      }
    },
    {
      passive: true,
    },
  );
  $$('.project-image').forEach((image) => {
    scope.listen(image, 'pointerenter', () => {
      if (finePointer.matches && !motionPreference.matches) cursor.classList.add('active');
    });
    scope.listen(image, 'pointerleave', hideCursor);
  });
  scope.listen(document, 'pointerleave', hideCursor);
  scope.listen(window, 'blur', hideCursor);
}
