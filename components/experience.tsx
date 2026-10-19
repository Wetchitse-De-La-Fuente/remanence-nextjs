'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { projects, type PhotoProject } from '@/data/projects';
import { siteConfig } from '@/data/site-config';
import { createAnimationScope } from '@/lib/animation-scope';
import { initializeMotion } from '@/lib/motion';

type Experience = {
  category: string;
  setCategory: (value: string) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  galleryItems: readonly PhotoProject[];
  galleryIndex: number;
  setGalleryIndex: React.Dispatch<React.SetStateAction<number>>;
  galleryOpen: boolean;
  closeGallery: () => void;
  contactOpen: boolean;
  setContactOpen: (value: boolean) => void;
  creditsOpen: boolean;
  setCreditsOpen: (value: boolean) => void;
};
const Context = createContext<Experience | null>(null);
function useExperience() {
  const value = useContext(Context);
  if (!value) throw new Error('ExperienceProvider manquant');
  return value;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<readonly PhotoProject[]>(projects);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const closeGallery = useCallback(() => setGalleryOpen(false), []);
  useEffect(() => {
    const click = (event: globalThis.MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-contact],[data-open-project],[data-credits]')
          : null;
      if (!target) return;
      setMenuOpen(false);
      document.querySelector('.custom-cursor')?.classList.remove('active');
      if (target.hasAttribute('data-contact')) setContactOpen(true);
      if (target.hasAttribute('data-credits')) setCreditsOpen(true);
      if (target.dataset.openProject) {
        let items: readonly PhotoProject[] =
          category === 'all' ? projects : projects.filter((item) => item.category === category);
        if (!items.some((item) => item.id === target.dataset.openProject)) items = projects;
        setGalleryItems(items);
        setGalleryIndex(
          Math.max(
            0,
            items.findIndex((item) => item.id === target.dataset.openProject),
          ),
        );
        setGalleryOpen(true);
      }
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [category]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    document.querySelector('main')?.toggleAttribute('inert', menuOpen);
    document.querySelector('.site-footer')?.toggleAttribute('inert', menuOpen);
    return () => {
      document.body.classList.remove('menu-open');
      document.querySelector('main')?.removeAttribute('inert');
      document.querySelector('.site-footer')?.removeAttribute('inert');
    };
  }, [menuOpen]);
  useEffect(() => {
    document.body.classList.toggle('modal-open', galleryOpen || contactOpen || creditsOpen);
    return () => document.body.classList.remove('modal-open');
  }, [galleryOpen, contactOpen, creditsOpen]);
  return (
    <Context.Provider
      value={{
        category,
        setCategory,
        menuOpen,
        setMenuOpen,
        galleryItems,
        galleryIndex,
        setGalleryIndex,
        galleryOpen,
        closeGallery,
        contactOpen,
        setContactOpen,
        creditsOpen,
        setCreditsOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function SiteHeader() {
  const { menuOpen, setMenuOpen } = useExperience();
  useEffect(() => {
    if (menuOpen) document.querySelector<HTMLAnchorElement>('#mobile-nav a')?.focus();
    const resize = () => {
      if (innerWidth > 760) setMenuOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      const button = document.querySelector<HTMLButtonElement>('.menu-toggle');
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        button?.focus();
      }
      if (event.key === 'Tab') {
        const items = [
          button,
          ...document.querySelectorAll<HTMLElement>('#mobile-nav a,#mobile-nav button'),
        ].filter(Boolean) as HTMLElement[];
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('keydown', key);
    };
  }, [menuOpen, setMenuOpen]);
  return (
    <>
      <header className="site-header" id="site-header">
        <a className="wordmark" href="#accueil" aria-label="Rémanence, accueil">
          {' '}
          <svg className="brand-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M7 13V7h6M23 7h6v6M29 23v6h-6M13 29H7v-6" stroke="currentColor" strokeWidth="1.5"></path>
            <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="1.5"></circle>
          </svg>{' '}
          <span>
            rémanence<span className="wordmark-period">.</span>
          </span>{' '}
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#images">Les images</a>
          <a href="#studio">Le studio</a>
          <a href="#approche">L’approche</a>
        </nav>
        <div className="header-actions">
          <button className="button button-cream header-cta" data-contact="">
            <span>Parlons de vous</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </button>
          <button
            className="menu-toggle"
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <nav
        id="mobile-nav"
        aria-label="Navigation mobile"
        className={'mobile-nav' + (menuOpen ? ' open' : '')}
        inert={!menuOpen}
      >
        <span className="eyebrow">Le regard Rémanence</span>
        <a href="#images" onClick={() => setMenuOpen(false)}>
          Les <em>images.</em>
          <span>01</span>
        </a>
        <a href="#studio" onClick={() => setMenuOpen(false)}>
          Le <em>studio.</em>
          <span>02</span>
        </a>
        <a href="#approche" onClick={() => setMenuOpen(false)}>
          Notre <em>approche.</em>
          <span>03</span>
        </a>
        <button className="button button-cream" data-contact="">
          Parlons de votre projet <span aria-hidden="true">↗</span>
        </button>
        <span className="eyebrow mobile-nav-bottom">Portraits · Éditorial · Instants de vie</span>
      </nav>
    </>
  );
}

export function Portfolio() {
  const { category, setCategory } = useExperience();
  const previous = useRef(category);
  const visibleCount = projects.filter((item) => category === 'all' || item.category === category).length;
  useEffect(() => {
    if (previous.current === category) return;
    previous.current = category;
    const cards = document.querySelectorAll<HTMLElement>('.project-card:not([hidden])');
    cards.forEach((card, index) => {
      card.classList.add('visible');
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
        card.animate(
          [
            { opacity: 0, translate: '0 18px' },
            { opacity: 1, translate: '0 0' },
          ],
          { duration: 600, delay: index * 65, easing: 'cubic-bezier(.625,.05,0,1)' },
        );
    });
    window.dispatchEvent(new Event('resize'));
  }, [category]);
  return (
    <section className="portfolio container" id="images" aria-labelledby="portfolio-title">
      <div className="section-topline reveal">
        <span className="eyebrow">02 / Travaux choisis</span>
        <span className="eyebrow quiet">Une sélection de regards</span>
      </div>
      <div className="portfolio-heading reveal">
        <h2 className="section-heading" id="portfolio-title">
          À chaque histoire,
          <br />
          sa <em>lumière.</em>
        </h2>
        <p>
          Des visages aux lieux.
          <br />
          De l’intime à l’inattendu.
        </p>
      </div>
      <div className="filter-row reveal" role="group" aria-label="Filtrer les séries photographiques">
        <button
          data-filter="all"
          onClick={() => setCategory('all')}
          className={'filter' + (category === 'all' ? ' active' : '')}
          aria-pressed={category === 'all'}
        >
          Tout voir <span>06</span>
        </button>
        <button
          data-filter="Portrait"
          onClick={() => setCategory('Portrait')}
          className={'filter' + (category === 'Portrait' ? ' active' : '')}
          aria-pressed={category === 'Portrait'}
        >
          Portrait
        </button>
        <button
          data-filter="Éditorial"
          onClick={() => setCategory('Éditorial')}
          className={'filter' + (category === 'Éditorial' ? ' active' : '')}
          aria-pressed={category === 'Éditorial'}
        >
          Éditorial
        </button>
        <button
          data-filter="Savoir-faire"
          onClick={() => setCategory('Savoir-faire')}
          className={'filter' + (category === 'Savoir-faire' ? ' active' : '')}
          aria-pressed={category === 'Savoir-faire'}
        >
          Savoir-faire
        </button>
        <button
          data-filter="Instants de vie"
          onClick={() => setCategory('Instants de vie')}
          className={'filter' + (category === 'Instants de vie' ? ' active' : '')}
          aria-pressed={category === 'Instants de vie'}
        >
          Instants de vie
        </button>
      </div>
      <p className="sr-only" id="filter-status" role="status" aria-live="polite">
        {visibleCount} {visibleCount > 1 ? 'séries affichées' : 'série affichée'}
      </p>
      <div id="project-grid" className={'project-grid' + (category !== 'all' ? ' filtered' : '')}>
        <button
          className="project-card project-portrait reveal"
          data-category="Portrait"
          data-open-project="lumiere"
          hidden={category !== 'all' && category !== 'Portrait'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/hero.webp"
              loading="lazy"
              decoding="async"
              width="1536"
              height="1024"
              alt="Portrait d’une femme dans une lumière de fin de journée"
              className="portrait-crop"
            />
            <span className="glass-badge">Portrait</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              01 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>Lumière intérieure</h3>
              <p>L’essentiel, sans artifice.</p>
            </div>
            <span className="project-year">Série 01</span>
          </div>{' '}
        </button>
        <button
          className="project-card project-landscape reveal"
          data-category="Éditorial"
          data-open-project="allure"
          hidden={category !== 'all' && category !== 'Éditorial'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/editorial.webp"
              srcSet="/assets/editorial-800.webp 800w, /assets/editorial.webp 1600w"
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 128px) / 2), 584px"
              loading="lazy"
              decoding="async"
              width="1600"
              height="2400"
              alt="Portrait éditorial d’une femme en tenue noire sur un fond sombre"
            />
            <span className="glass-badge">Éditorial</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              02 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>L’allure libre</h3>
              <p>Une présence. Un mouvement.</p>
            </div>
            <span className="project-year">Série 02</span>
          </div>{' '}
        </button>
        <button
          className="project-card project-landscape reveal"
          data-category="Savoir-faire"
          data-open-project="gestes"
          hidden={category !== 'all' && category !== 'Savoir-faire'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/gestes.webp"
              srcSet="/assets/gestes-800.webp 800w, /assets/gestes.webp 1536w"
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 128px) / 2), 584px"
              loading="lazy"
              decoding="async"
              width="1536"
              height="1024"
              alt="Les mains d’un artisan façonnent un bol en argile dans son atelier"
            />
            <span className="glass-badge">Savoir-faire</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              03 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>La beauté du geste</h3>
              <p>Ce que les mains racontent.</p>
            </div>
            <span className="project-year">Série 03</span>
          </div>{' '}
        </button>
        <button
          className="project-card project-portrait reveal"
          data-category="Instants de vie"
          data-open-project="ensemble"
          hidden={category !== 'all' && category !== 'Instants de vie'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/mariage.webp"
              srcSet="/assets/mariage-800.webp 800w, /assets/mariage.webp 1600w"
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 128px) / 2), 584px"
              loading="lazy"
              decoding="async"
              width="1600"
              height="1067"
              alt="Une célébration de mariage dans une lumière douce"
            />
            <span className="glass-badge">Instants de vie</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              04 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>Les jours ensemble</h3>
              <p>Les liens que l’on garde.</p>
            </div>
            <span className="project-year">Série 04</span>
          </div>{' '}
        </button>
        <button
          className="project-card project-portrait reveal"
          data-category="Portrait"
          data-open-project="presences"
          hidden={category !== 'all' && category !== 'Portrait'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/regard.webp"
              srcSet="/assets/regard-800.webp 800w, /assets/regard.webp 1600w"
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 128px) / 2), 584px"
              loading="lazy"
              decoding="async"
              width="1600"
              height="2400"
              alt="Portrait naturel d’un homme, regard face à l’objectif"
            />
            <span className="glass-badge">Portrait</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              05 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>Présences</h3>
              <p>Être soi, simplement.</p>
            </div>
            <span className="project-year">Série 05</span>
          </div>{' '}
        </button>
        <button
          className="project-card project-landscape reveal"
          data-category="Éditorial"
          data-open-project="ailleurs"
          hidden={category !== 'all' && category !== 'Éditorial'}
        >
          {' '}
          <div className="project-image">
            <img
              src="/assets/horizon.webp"
              srcSet="/assets/horizon-800.webp 800w, /assets/horizon.webp 1600w"
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 128px) / 2), 584px"
              loading="lazy"
              decoding="async"
              width="1600"
              height="1067"
              alt="Brume et lumière dorée sur un paysage vallonné"
            />
            <span className="glass-badge">Éditorial</span>
            <span className="project-open" aria-hidden="true">
              ↗
            </span>
            <span className="project-image-number" aria-hidden="true">
              06 / 06
            </span>
          </div>{' '}
          <div className="project-meta">
            <div>
              <h3>Un peu d’ailleurs</h3>
              <p>Le silence a ses images.</p>
            </div>
            <span className="project-year">Série 06</span>
          </div>{' '}
        </button>
      </div>
      <div className="portfolio-footnote">
        <span className="eyebrow">Portfolio de démonstration</span>
        <button className="understated-link" data-credits="">
          Crédits photographiques <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}

function useDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return ref;
}
function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>, close: () => void) {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    close();
}
function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Gallery() {
  const { galleryItems, galleryIndex, setGalleryIndex, galleryOpen, closeGallery } = useExperience();
  const galleryRef = useDialog(galleryOpen);
  const [autoplay, setAutoplay] = useState(false);
  const [displayed, setDisplayed] = useState<PhotoProject>(projects[0]);
  const [changing, setChanging] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const firstOpen = useRef(true);
  const move = useCallback(
    (direction: number, stop = true) => {
      if (stop) setAutoplay(false);
      setGalleryIndex((index) => (index + direction + galleryItems.length) % galleryItems.length);
    },
    [galleryItems, setGalleryIndex],
  );
  useEffect(() => {
    if (!galleryOpen) {
      setAutoplay(false);
      firstOpen.current = true;
      setChanging(false);
      return;
    }
    const item = galleryItems[galleryIndex];
    if (firstOpen.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(item);
      firstOpen.current = false;
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let frame = 0;
    setChanging(true);
    const image = new Image();
    image.onload = () => {
      timer = setTimeout(() => {
        if (cancelled) return;
        setDisplayed(item);
        frame = requestAnimationFrame(() => setChanging(false));
      }, 150);
    };
    image.onerror = () => {
      if (!cancelled) setChanging(false);
    };
    image.src = item.src;
    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      image.onload = null;
      image.onerror = null;
    };
  }, [galleryOpen, galleryIndex, galleryItems]);
  useEffect(() => {
    if (!galleryOpen || !autoplay) return;
    const timer = setInterval(() => move(1, false), 5000);
    return () => clearInterval(timer);
  }, [autoplay, galleryOpen, move]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setAutoplay(false);
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  useEffect(() => {
    if (galleryOpen && galleryItems.length > 1) {
      const image = new Image();
      image.src = galleryItems[(galleryIndex + 1) % galleryItems.length].src;
    }
  }, [galleryItems, galleryIndex, galleryOpen]);
  return (
    <dialog
      className="gallery-dialog"
      id="gallery-dialog"
      aria-labelledby="gallery-title"
      ref={galleryRef}
      onClose={closeGallery}
      onClick={(event) => closeOnBackdrop(event, closeGallery)}
      onKeyDown={(event) => {
        if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          setAutoplay(false);
          if (event.key === 'Home') setGalleryIndex(0);
          else if (event.key === 'End') setGalleryIndex(galleryItems.length - 1);
          else move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div className="gallery-shell">
        <div className="gallery-top">
          <a
            className="wordmark gallery-wordmark"
            href="#images"
            data-close-gallery=""
            onClick={(event) => {
              event.preventDefault();
              closeGallery();
            }}
          >
            <span>rémanence.</span>
          </a>
          <span className="eyebrow gallery-series-label">Les histoires en images</span>
          <button
            className="round-control close-control"
            data-close-gallery=""
            aria-label="Fermer la visionneuse"
            onClick={(event) => {
              event.preventDefault();
              closeGallery();
            }}
          >
            <span className="close-icon" aria-hidden="true"></span>
          </button>
        </div>
        <div
          className="gallery-stage"
          onTouchStart={(event) => {
            if (!(event.target as Element).closest('button'))
              touch.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
          }}
          onTouchEnd={(event) => {
            if (!touch.current) return;
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <img
            id="gallery-image"
            width="1536"
            height="1024"
            src={displayed.src}
            alt={displayed.alt}
            className={changing ? 'changing' : ''}
          />
          <span className="gallery-stage-shade" aria-hidden="true"></span>
          <button
            className="gallery-arrow gallery-prev"
            id="gallery-prev"
            aria-label="Image précédente"
            onClick={() => move(-1)}
            disabled={galleryItems.length < 2}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className="gallery-arrow gallery-next"
            id="gallery-next"
            aria-label="Image suivante"
            onClick={() => move(1)}
            disabled={galleryItems.length < 2}
          >
            <span aria-hidden="true">→</span>
          </button>
          <div className="gallery-image-info">
            <span className="eyebrow" id="gallery-category">
              {displayed.category}
            </span>
            <h2 id="gallery-title">{displayed.title}</h2>
            <p id="gallery-description">{displayed.description}</p>
          </div>
        </div>
        <div className="gallery-controls">
          <div className="gallery-counter">
            <span id="gallery-position">{String(galleryIndex + 1).padStart(2, '0')}</span>
            <span className="quiet">/</span>
            <span id="gallery-total">{String(galleryItems.length).padStart(2, '0')}</span>
          </div>
          <div id="gallery-dots" className="gallery-dots" role="group" aria-label="Choisir une image">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={'gallery-dot' + (index === galleryIndex ? ' active' : '')}
                aria-label={'Voir ' + item.title}
                aria-pressed={index === galleryIndex}
                onClick={() => {
                  setAutoplay(false);
                  setGalleryIndex(index);
                }}
              />
            ))}
          </div>
          <button
            className="gallery-autoplay"
            id="gallery-autoplay"
            hidden={galleryItems.length < 2}
            aria-pressed={autoplay}
            onClick={() => setAutoplay(!autoplay)}
          >
            <span className="play-symbol" aria-hidden="true">
              {autoplay ? 'Ⅱ' : '▶'}
            </span>
            <span>{autoplay ? 'Pause' : 'Diaporama'}</span>
          </button>
        </div>
        <p
          className="sr-only"
          id="gallery-announcement"
          aria-live="polite"
        >{`Image ${galleryIndex + 1} sur ${galleryItems.length} : ${displayed.title}.`}</p>
      </div>
    </dialog>
  );
}

export function ContactDialog() {
  const { contactOpen, setContactOpen } = useExperience();
  const contactRef = useDialog(contactOpen);
  const [brief, setBrief] = useState('');
  const [briefName, setBriefName] = useState('');
  const [resultVisible, setResultVisible] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const canEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.contactEmail);
  useEffect(() => {
    if (resultVisible) {
      const title = contactRef.current?.querySelector<HTMLElement>('#contact-result-view h2');
      title?.setAttribute('tabindex', '-1');
      title?.focus();
      if (contactRef.current) contactRef.current.scrollTop = 0;
    }
  }, [resultVisible, contactRef]);
  function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || message.length < 10) {
      const field = form.elements.namedItem(!name ? 'name' : 'message') as HTMLInputElement;
      field.setCustomValidity(
        !name ? 'Indiquez votre nom.' : 'Ajoutez quelques mots sur votre projet (10 caractères minimum).',
      );
      field.reportValidity();
      return;
    }
    setBriefName(name);
    setBrief(
      [
        'RÉMANENCE — DEMANDE DE PROJET',
        '',
        'Nom : ' + name,
        'E-mail : ' + String(data.get('email')).trim(),
        'Projet : ' + data.get('type'),
        '',
        'MON IDÉE',
        message,
        '',
        'Récapitulatif préparé sur le site Rémanence.',
      ].join('\n'),
    );
    setResultVisible(true);
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setFormStatus('Le texte a été copié. Il est prêt à être partagé.');
    } catch {
      const el = document.querySelector('#brief-preview');
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setFormStatus('Le récapitulatif est sélectionné. Utilisez Copier dans le menu de votre appareil.');
    }
  }
  return (
    <dialog
      className="contact-dialog"
      id="contact-dialog"
      aria-labelledby="contact-dialog-title"
      ref={contactRef}
      onClose={() => setContactOpen(false)}
      onClick={(event) => closeOnBackdrop(event, () => setContactOpen(false))}
    >
      <div className="contact-dialog-inner">
        <div className="dialog-heading">
          <span className="eyebrow">Chaque histoire commence ici.</span>
          <button
            className="round-control"
            data-close-contact=""
            aria-label="Fermer le formulaire"
            onClick={() => setContactOpen(false)}
          >
            <span className="close-icon" aria-hidden="true"></span>
          </button>
        </div>
        <div id="contact-form-view" hidden={resultVisible}>
          <h2 id="contact-dialog-title">
            Et si on parlait
            <br />
            de <em>vous ?</em>
          </h2>
          <p className="contact-dialog-intro">Quelques mots suffisent pour imaginer la suite.</p>
          <form
            id="project-form"
            onSubmit={submitBrief}
            onInput={(event) => {
              const field = event.target;
              if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
                field.setCustomValidity('');
            }}
          >
            <div className="form-grid">
              <label className="field">
                <span>
                  Votre nom <span aria-hidden="true">*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Comment vous appelez-vous ?"
                  required={true}
                  maxLength={100}
                />
              </label>
              <label className="field">
                <span>
                  Votre e-mail <span aria-hidden="true">*</span>
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="vous@exemple.fr"
                  required={true}
                  maxLength={200}
                />
              </label>
            </div>
            <fieldset className="project-type">
              <legend>Qu’avez-vous en tête ?</legend>
              <div className="type-options">
                <label>
                  <input type="radio" name="type" defaultValue="Portrait" defaultChecked={true} />
                  <span>Un portrait</span>
                </label>
                <label>
                  <input type="radio" name="type" defaultValue="Marque / Éditorial" />
                  <span>Une marque</span>
                </label>
                <label>
                  <input type="radio" name="type" defaultValue="Instants de vie" />
                  <span>Un moment de vie</span>
                </label>
                <label>
                  <input type="radio" name="type" defaultValue="Autre projet" />
                  <span>Autre chose</span>
                </label>
              </div>
            </fieldset>
            <label className="field">
              <span>
                Racontez-nous <span aria-hidden="true">*</span>
              </span>
              <textarea
                name="message"
                rows={3}
                placeholder="Votre idée, le lieu, une date si vous en avez une…"
                required={true}
                minLength={10}
                maxLength={3000}
              ></textarea>
            </label>
            <div className="form-bottom">
              <p>
                Vos informations restent dans votre navigateur jusqu’à ce que vous choisissiez de partager
                votre demande.
              </p>
              <button className="button button-cream" type="submit">
                Préparer ma demande <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </div>
        <div id="contact-result-view" hidden={!resultVisible}>
          <span className="result-check" aria-hidden="true">
            ✓
          </span>
          <h2>
            Le début d’une
            <br />
            belle <em>histoire.</em>
          </h2>
          <p>Votre récapitulatif est prêt. Gardez-le ou copiez-le pour le transmettre au studio.</p>
          <pre id="brief-preview">{brief}</pre>
          <div className="result-actions">
            <a
              className="button button-cream"
              id="email-brief"
              hidden={!canEmail}
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Projet photo — ' + briefName)}&body=${encodeURIComponent(brief)}`}
            >
              Envoyer par e-mail <span aria-hidden="true">↗</span>
            </a>
            <button
              id="download-brief"
              className={'button ' + (canEmail ? 'button-ghost' : 'button-cream')}
              onClick={() => {
                downloadText(brief, 'Demande-projet-Remanence.txt');
                setFormStatus('Votre demande a été téléchargée.');
              }}
            >
              Télécharger ma demande <span aria-hidden="true">↓</span>
            </button>
            <button className="button button-ghost" id="copy-brief" onClick={copyBrief}>
              Copier le texte
            </button>
          </div>
          <button
            className="text-link"
            id="edit-brief"
            onClick={() => {
              setResultVisible(false);
              requestAnimationFrame(() =>
                contactRef.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus(),
              );
            }}
          >
            Modifier ma demande <span aria-hidden="true">↗</span>
          </button>
          <p className="form-status" id="form-status" role="status" aria-live="polite">
            {formStatus}
          </p>
        </div>
      </div>
    </dialog>
  );
}
export function CreditsDialog() {
  const { creditsOpen, setCreditsOpen } = useExperience();
  const creditsRef = useDialog(creditsOpen);
  return (
    <dialog
      className="credits-dialog"
      id="credits-dialog"
      aria-labelledby="credits-title"
      ref={creditsRef}
      onClose={() => setCreditsOpen(false)}
      onClick={(event) => closeOnBackdrop(event, () => setCreditsOpen(false))}
    >
      <div className="credits-inner">
        <div className="dialog-heading">
          <span className="eyebrow">En toute transparence</span>
          <button
            className="round-control"
            data-close-credits=""
            aria-label="Fermer les crédits"
            onClick={() => setCreditsOpen(false)}
          >
            <span className="close-icon" aria-hidden="true"></span>
          </button>
        </div>
        <h2 id="credits-title">
          Une étude
          <br />
          de <em>regard.</em>
        </h2>
        <p>
          Rémanence est une identité de démonstration créée pour présenter ce site. Les séries sont des
          compositions éditoriales illustratives, pas des références clients.
        </p>
        <p>
          Les photographies « Lumière intérieure » et « La beauté du geste » ont été créées avec l’IA. Les
          autres photographies proviennent d’Unsplash et sont listées dans les crédits ci-dessous.
        </p>
        <ul className="credit-links">
          <li>
            <a href="https://unsplash.com" id="portrait-credit" target="_blank" rel="noopener noreferrer">
              Banque d’images Unsplash <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href="/assets/credits.txt" target="_blank" rel="noopener noreferrer">
              Voir les crédits et sources <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
        <p className="quiet">
          Le formulaire prépare un récapitulatif à copier ou télécharger. Aucun message n’est envoyé
          automatiquement.
        </p>
      </div>
    </dialog>
  );
}
export function Motion() {
  useEffect(() => {
    const scope = createAnimationScope();
    initializeMotion(scope);
    return () => scope.dispose();
  }, []);
  return null;
}
