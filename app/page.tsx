import {
  ExperienceProvider,
  SiteHeader,
  Portfolio,
  Gallery,
  ContactDialog,
  CreditsDialog,
  Motion,
} from '@/components/experience';
import {
  AccueilSection,
  RegardSection,
  MarqueeSection,
  StudioSection,
  ApprocheSection,
  ContactSection,
} from '@/components/site-sections';
export default function Page() {
  return (
    <ExperienceProvider>
      <a className="skip-link" href="#images">
        Aller aux photographies
      </a>
      <div className="page-progress" aria-hidden="true"></div>
      <SiteHeader />
      <main>
        <AccueilSection />
        <RegardSection />
        <Portfolio />
        <MarqueeSection />
        <StudioSection />
        <ApprocheSection />
        <ContactSection />
      </main>
      <footer className="site-footer container">
        <div className="footer-main">
          <a className="wordmark" href="#accueil" aria-label="Rémanence, retour à l’accueil">
            <svg className="brand-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <path
                d="M7 13V7h6M23 7h6v6h-6M29 23v6h-6M13 29H7v-6"
                stroke="currentColor"
                strokeWidth="1.5"
              ></path>
              <circle cx="18" cy="18" r="4.5" stroke="currentColor" strokeWidth="1.5"></circle>
            </svg>
            <span>rémanence.</span>
          </a>
          <p>
            Des images sensibles.
            <br />
            Des histoires singulières.
          </p>
          <a className="back-to-top" href="#accueil">
            Retour en haut <span aria-hidden="true">↑</span>
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © <span data-year="">2026</span> Rémanence
          </span>
          <span>Studio de photographie indépendant</span>
          <button className="understated-link" data-credits="">
            À propos de cette création
          </button>
        </div>
      </footer>
      <div className="custom-cursor" aria-hidden="true">
        <span>
          Voir
          <br />
          l’image
        </span>
      </div>
      <Gallery />
      <ContactDialog />
      <CreditsDialog />
      <div className="toast" id="toast" role="status" aria-live="polite"></div>
      <Motion />
    </ExperienceProvider>
  );
}
