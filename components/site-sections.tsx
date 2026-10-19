import {
  ExperienceProvider,
  SiteHeader,
  Portfolio,
  Gallery,
  ContactDialog,
  CreditsDialog,
  Motion,
} from '@/components/experience';
export function AccueilSection() {
  return (
    <section className="hero" id="accueil" aria-labelledby="hero-title">
      <div className="hero-image-wrap">
        <img
          className="hero-image"
          src="/assets/hero.webp"
          alt="Portrait cinématographique d’une femme, le visage éclairé par la lumière chaude d’une fenêtre"
          width="1536"
          height="1024"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="hero-frame hero-frame-top" aria-hidden="true">
        <span>Un autre regard sur l’essentiel</span>
        <span>Studio indépendant</span>
      </div>
      <div className="hero-content container">
        <div className="hero-caption">
          <span className="live-dot" aria-hidden="true"></span>
          <span>Photographie &amp; direction artistique</span>
        </div>
        <h1 id="hero-title">
          <span className="line">
            <span>Ce qui passe.</span>
          </span>
          <span className="line">
            <span>
              Ce qui <em>reste.</em>
            </span>
          </span>
        </h1>
        <div className="hero-bottom-content">
          <p>
            Des personnes. Des histoires. Une lumière.
            <br />
            Et cette façon de ne jamais les oublier.
          </p>
          <button
            className="hero-view"
            data-open-project="lumiere"
            aria-label="Découvrir la photographie Lumière intérieure"
          >
            {' '}
            <span className="hero-view-ring">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.2"></path>
              </svg>
            </span>{' '}
            <span>
              <span className="eyebrow">Entrer dans l’image</span>
              <span className="hero-view-caption">Lumière intérieure — Portrait</span>
            </span>{' '}
          </button>
        </div>
      </div>
      <div className="hero-footer container">
        <a className="scroll-prompt" href="#regard">
          <span className="scroll-line" aria-hidden="true"></span>
          <span>Le regard, plus bas</span>
        </a>
        <span className="hero-counter">
          <span>01</span>
          <span className="counter-line"></span>
          <span>06</span>
        </span>
      </div>
    </section>
  );
}
export function RegardSection() {
  return (
    <section className="intro section-space container" id="regard" aria-labelledby="intro-title">
      <div className="section-marker reveal">
        <span className="tiny-cross" aria-hidden="true">
          +
        </span>
        <span className="eyebrow">01 / Notre regard</span>
      </div>
      <div className="intro-copy">
        <h2 className="narrative-heading reveal" id="intro-title">
          Une photographie ne retient pas le temps.
          <br />
          Elle garde ce qu’on a <em>ressenti.</em>
        </h2>
        <div className="intro-description reveal">
          <span className="small-rule" aria-hidden="true"></span>
          <div>
            <p>
              Un geste, une rencontre, une lumière. Nous photographions les personnes et les marques avec la
              même attention : trouver ce qui les rend singulières.
            </p>
            <a className="text-link" href="#studio">
              Rencontrer le studio <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function MarqueeSection() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>Observer.</span>
        <em>Ressentir.</em>
        <span>Se souvenir.</span>
        <span className="marquee-star">✳</span>
        <span>Observer.</span>
        <em>Ressentir.</em>
        <span>Se souvenir.</span>
        <span className="marquee-star">✳</span>
      </div>
    </div>
  );
}
export function StudioSection() {
  return (
    <section className="studio section-space container" id="studio" aria-labelledby="studio-title">
      <div className="studio-visual reveal">
        <div className="studio-photo">
          <img
            src="/assets/atelier.webp"
            srcSet="/assets/atelier-800.webp 800w, /assets/atelier.webp 1600w"
            sizes="(max-width: 760px) calc(100vw - 48px), 540px"
            alt="Appareil photo argentique et tirages posés sur une carte, dans une lumière douce"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1200"
          />
        </div>
        <div className="studio-stamp glass-badge">
          <span className="stamp-mark" aria-hidden="true">
            r.
          </span>
          <span>
            Un regard humain.
            <br />
            Avant tout.
          </span>
        </div>
        <span className="studio-caption eyebrow">Derrière chaque image, une rencontre.</span>
      </div>
      <div className="studio-copy">
        <div className="section-marker reveal">
          <span className="tiny-cross" aria-hidden="true">
            +
          </span>
          <span className="eyebrow">03 / Le studio</span>
        </div>
        <h2 className="section-heading reveal" id="studio-title">
          D’abord,
          <br />
          prendre le temps
          <br />
          de <em>vous voir.</em>
        </h2>
        <p className="reveal">
          Rémanence est un studio de photographie indépendant. Notre point de départ, c’est vous : votre
          histoire, votre énergie, ce que vous avez envie de montrer.
        </p>
        <p className="reveal quiet">
          Nous aimons la lumière naturelle, les échanges simples et les images qui n’ont pas besoin d’en faire
          trop. Du premier échange à la dernière retouche, nous construisons le projet avec vous.
        </p>
        <button className="text-link reveal" data-contact="">
          Faisons connaissance <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}
export function ApprocheSection() {
  return (
    <section className="approach section-space container" id="approche" aria-labelledby="approach-title">
      <div className="section-topline reveal">
        <span className="eyebrow">04 / De l’idée à l’image</span>
        <span className="eyebrow quiet">Un projet, ensemble</span>
      </div>
      <div className="approach-header reveal">
        <h2 className="section-heading" id="approach-title">
          Un regard précis.
          <br />
          Une expérience <em>simple.</em>
        </h2>
        <p>
          Vous n’avez pas besoin de savoir poser.
          <br />
          Vous avez juste besoin d’être vous.
        </p>
      </div>
      <div className="approach-list">
        <details className="approach-item reveal" open={true}>
          <summary>
            <span className="step-index">01</span>
            <span className="step-title">Se rencontrer</span>
            <span className="step-subtitle">Tout commence par une conversation.</span>
            <span className="details-icon" aria-hidden="true"></span>
          </summary>
          <div className="step-content">
            <p>
              On parle de vous, de vos envies et de l’usage des images. Ensemble, on choisit une direction, un
              lieu et une lumière. Vous recevez une proposition adaptée à votre projet.
            </p>
            <span className="eyebrow">Échange · Inspirations · Proposition</span>
          </div>
        </details>
        <details className="approach-item reveal">
          <summary>
            <span className="step-index">02</span>
            <span className="step-title">Créer l’instant</span>
            <span className="step-subtitle">De la place pour le naturel.</span>
            <span className="details-icon" aria-hidden="true"></span>
          </summary>
          <div className="step-content">
            <p>
              Le jour de la séance, nous vous guidons sans vous figer. Les gestes, les silences, les imprévus
              ont leur place. Notre travail : vous mettre à l’aise et saisir ce qui compte.
            </p>
            <span className="eyebrow">Direction · Prise de vue · Liberté</span>
          </div>
        </details>
        <details className="approach-item reveal">
          <summary>
            <span className="step-index">03</span>
            <span className="step-title">Faire durer</span>
            <span className="step-subtitle">Des photographies qui vous ressemblent.</span>
            <span className="details-icon" aria-hidden="true"></span>
          </summary>
          <div className="step-content">
            <p>
              Nous sélectionnons et retouchons les images avec soin, en préservant leur caractère. Les formats
              de livraison et les droits d’utilisation sont définis ensemble avant la séance.
            </p>
            <span className="eyebrow">Sélection · Retouche · Livraison</span>
          </div>
        </details>
      </div>
    </section>
  );
}
export function ContactSection() {
  return (
    <section className="contact-section container section-space" id="contact" aria-labelledby="contact-title">
      <div className="contact-overline reveal">
        <span className="eyebrow">La prochaine histoire pourrait être la vôtre.</span>
        <span className="contact-spark" aria-hidden="true">
          ✳
        </span>
      </div>
      <h2 className="contact-heading reveal" id="contact-title">
        Faisons quelque chose
        <br />
        qui <em>reste.</em>
      </h2>
      <div className="contact-bottom reveal">
        <p>
          Un portrait, une campagne, un moment à garder.
          <br />
          Racontez-nous ce que vous imaginez.
        </p>
        <button className="button button-cream button-large" data-contact="">
          <span>Parlons de votre projet</span>
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}
