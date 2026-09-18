import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CaretDown,
  Check,
  CheckCircle,
  HouseLine,
  Key,
  List,
  MagnifyingGlass,
  MapPin,
  Scales,
  Translate,
  UserCircle,
  X,
} from "@phosphor-icons/react";

const CityScene = lazy(() => import("./components/CityScene"));

const services = [
  {
    name: "Interior designer",
    short: "Shape a home that works",
    description: "Plan functional, safe and beautiful spaces with help on layouts, materials and lighting.",
    icon: HouseLine,
    className: "service-interior",
  },
  {
    name: "Housing Broker",
    short: "Move with local context",
    description: "Navigate buying, selling, renting or letting with a professional who knows Budapest.",
    icon: Key,
    className: "service-housing",
  },
  {
    name: "Mortgage Advisor",
    short: "Make the numbers clearer",
    description: "Review your financial position and compare suitable mortgage paths from lenders.",
    icon: Buildings,
    className: "service-mortgage",
  },
  {
    name: "Translator",
    short: "Be understood, precisely",
    description: "Translate written or spoken content while preserving meaning, tone and context.",
    icon: Translate,
    className: "service-translation",
  },
  {
    name: "Real Estate Lawyer",
    short: "Protect every agreement",
    description: "Get specialist support with property contracts, transactions, disputes and title matters.",
    icon: Scales,
    className: "service-legal",
  },
];

const districts = [
  "All Budapest",
  "I. Castle District",
  "V. Belváros-Lipótváros",
  "VI. Terézváros",
  "VII. Erzsébetváros",
  "IX. Ferencváros",
  "XI. Újbuda",
  "XIII. Angyalföld",
  "XIV. Zugló",
];

const experts = [
  {
    name: "Anna Kovács",
    role: "Interior designer",
    district: "XI. Újbuda",
    languages: "Hungarian · English",
    experience: "Residential spaces",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=82",
    color: "blue",
  },
  {
    name: "Márk Daniels",
    role: "Housing Broker",
    district: "V. Belváros-Lipótváros",
    languages: "English · Hungarian",
    experience: "Rentals and relocation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=82",
    color: "orange",
  },
  {
    name: "Eszter Farkas",
    role: "Mortgage Advisor",
    district: "All Budapest",
    languages: "Hungarian · German",
    experience: "Home financing",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=82",
    color: "green",
  },
  {
    name: "Dániel Nagy",
    role: "Translator",
    district: "VII. Erzsébetváros",
    languages: "English · Hungarian · French",
    experience: "Legal and live translation",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=82",
    color: "violet",
  },
  {
    name: "Dr. Kata Horváth",
    role: "Real Estate Lawyer",
    district: "VI. Terézváros",
    languages: "Hungarian · English",
    experience: "Property transactions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=82",
    color: "red",
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useDesktopScene() {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 821px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 821px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}

const mobilePinPositions = [
  { top: "42%", left: "64%" },
  { top: "28%", left: "25%" },
  { top: "38%", left: "51%" },
  { top: "24%", left: "61%" },
  { top: "32%", left: "72%" },
  { top: "55%", left: "55%" },
  { top: "67%", left: "48%" },
  { top: "48%", left: "76%" },
  { top: "20%", left: "79%" },
];

function MobileCity({ activeService, activeDistrict }: { activeService: string; activeDistrict: string }) {
  const pinPosition = mobilePinPositions[Math.max(0, districts.indexOf(activeDistrict))];

  return (
    <div className="mobile-city" aria-hidden="true">
      <div className="mobile-city-platform">
        <span className="mobile-river" />
        {Array.from({ length: 10 }, (_, index) => <i key={index} className={`mobile-building building-${index + 1}`} />)}
        <span className="mobile-bridge bridge-one" />
        <span className="mobile-bridge bridge-two" />
        <span className="mobile-map-pin" style={pinPosition}><MapPin size={18} weight="fill" /></span>
      </div>
      <span className="mobile-scene-label">{activeService}</span>
    </div>
  );
}

function App() {
  const [service, setService] = useState("Interior designer");
  const [district, setDistrict] = useState("All Budapest");
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);
  const [notice, setNotice] = useState("");
  const resultsRef = useRef<HTMLElement>(null);
  const requestTriggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const desktopScene = useDesktopScene();

  const visibleExpert = experts.find(
    (expert) => expert.role === service && (district === "All Budapest" || expert.district === "All Budapest" || expert.district === district),
  );

  const runSearch = () => {
    setSearchTouched(true);
    resultsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => resultsRef.current?.focus(), reducedMotion ? 0 : 450);
  };

  const openRequest = () => {
    requestTriggerRef.current = document.activeElement as HTMLElement;
    setRequestOpen(true);
  };

  const closeRequest = () => {
    setRequestOpen(false);
    window.setTimeout(() => requestTriggerRef.current?.focus(), 0);
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  };

  const submitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (!requestOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRequest();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, input, select, textarea, [href]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const background = Array.from(document.querySelectorAll<HTMLElement>("header, main, footer"));
    background.forEach((element) => { element.inert = true; });
    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 0);
    return () => {
      background.forEach((element) => { element.inert = false; });
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [requestOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Budapest Expert Hub home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Budapest<br />Expert Hub</span>
        </a>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#experts" onClick={() => setMenuOpen(false)}>Find an expert</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#for-experts" onClick={() => setMenuOpen(false)}>For experts</a>
        </nav>
        <div className="header-actions">
          <button className="text-button desktop-only" type="button" onClick={() => showNotice("Account access is ready for backend integration.")}>Sign in</button>
          <button className="button button-dark desktop-only" type="button" onClick={openRequest}>
            Request help
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="location-line"><MapPin size={17} weight="fill" /> Local help across Budapest</p>
            <h1>The right expert,<br /><em>right where you are.</em></h1>
            <p className="hero-intro">Find local professionals for the moments that need more than a search result.</p>

            <div className="search-console" role="search" aria-label="Find a Budapest expert">
              <label>
                <span>What do you need?</span>
                <span className="select-wrap">
                  <select value={service} onChange={(event) => setService(event.target.value)}>
                    {services.map((item) => <option key={item.name}>{item.name}</option>)}
                  </select>
                  <CaretDown size={17} weight="bold" aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>Where?</span>
                <span className="select-wrap">
                  <select value={district} onChange={(event) => setDistrict(event.target.value)}>
                    {districts.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <CaretDown size={17} weight="bold" aria-hidden="true" />
                </span>
              </label>
              <button className="search-button" type="button" onClick={runSearch} aria-label="Find an expert">
                <MagnifyingGlass size={22} weight="bold" />
              </button>
            </div>
          </div>

          <div className="hero-visual" role="img" aria-label={`Illustrative Budapest expert network for ${service} in ${district}`}>
            <div className="scene-orbit scene-orbit-one" />
            <div className="scene-orbit scene-orbit-two" />
            {desktopScene ? (
              <Suspense fallback={<div className="scene-loader">Building Budapest…</div>}>
                <CityScene activeService={service} activeDistrict={district} reducedMotion={reducedMotion} />
              </Suspense>
            ) : (
              <MobileCity activeService={service} activeDistrict={district} />
            )}
            <div className="scene-note">
              <span className="live-dot" />
              Illustrative view · <strong>{district}</strong>
            </div>
          </div>
        </section>

        <section className="confidence-strip" aria-label="Marketplace principles">
          <div><CheckCircle size={20} weight="fill" /><span>Profiles designed for easy comparison</span></div>
          <div><CheckCircle size={20} weight="fill" /><span>Local coverage by Budapest district</span></div>
          <div><CheckCircle size={20} weight="fill" /><span>Request details before you commit</span></div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <h2>Whatever Budapest brings, find someone who knows.</h2>
            <p>Start with the situation, not a directory. Each route takes you to specialists with the right local context.</p>
          </div>
          <div className="service-grid">
            {services.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  className={`service-card ${item.className} ${index === 0 ? "service-featured" : ""}`}
                  key={item.name}
                  onClick={() => {
                    setService(item.name);
                    setSearchTouched(true);
                    resultsRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                  }}
                >
                  <span className="service-icon"><Icon size={28} weight="duotone" /></span>
                  <span className="service-content">
                    <span className="service-name">{item.name}</span>
                    <strong>{item.short}</strong>
                    <span>{item.description}</span>
                  </span>
                  <ArrowUpRight size={24} className="service-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="experts-section" id="experts" ref={resultsRef} tabIndex={-1} aria-live="polite">
          <div className="experts-intro">
            <div>
              <span className="sample-label">Sample marketplace preview</span>
              <h2>{searchTouched ? `${service} matches` : "Meet the people behind the expertise."}</h2>
            </div>
            <div className="result-context">
              <MapPin size={19} />
              <span>{district}</span>
            </div>
          </div>

          <div className="expert-layout">
            {visibleExpert ? (
              <article className="expert-feature">
                <div className="expert-photo">
                  <img src={visibleExpert.image} alt={`Sample portrait for ${visibleExpert.name}`} />
                  <span className={`profile-accent ${visibleExpert.color}`} />
                  <span className="sample-chip">Demo profile</span>
                </div>
                <div className="expert-details">
                  <div>
                    <p>{visibleExpert.role}</p>
                    <h3>{visibleExpert.name}</h3>
                  </div>
                  <dl>
                    <div><dt>Coverage</dt><dd>{visibleExpert.district}</dd></div>
                    <div><dt>Languages</dt><dd>{visibleExpert.languages}</dd></div>
                    <div><dt>Focus</dt><dd>{visibleExpert.experience}</dd></div>
                  </dl>
                  <p className="pricing-note">Pricing and availability are shared in the expert’s proposal.</p>
                  <button className="button button-blue" type="button" onClick={openRequest}>
                    Request an introduction <ArrowRight size={18} weight="bold" />
                  </button>
                </div>
              </article>
            ) : (
              <article className="empty-result">
                <span><MapPin size={30} weight="duotone" /></span>
                <h3>No sample match in this district yet.</h3>
                <p>The production inventory can broaden the search nearby or route your request to an available {service.toLowerCase()}.</p>
                <button className="button button-blue" type="button" onClick={openRequest}>Post a request <ArrowRight size={18} weight="bold" /></button>
              </article>
            )}

            <aside className="match-explainer">
              <div className="match-map" aria-hidden="true">
                <span className="map-ring ring-one" />
                <span className="map-ring ring-two" />
                <span className="map-pin-dot"><MapPin size={24} weight="fill" /></span>
              </div>
              <h3>Matched around your life.</h3>
              <p>Choose a district, language and service. The matching layer is ready for real inventory and availability data.</p>
              <ul>
                <li><Check size={16} weight="bold" /> Service relevance</li>
                <li><Check size={16} weight="bold" /> Local coverage</li>
                <li><Check size={16} weight="bold" /> Language fit</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="how-title">
            <h2>From “I need help”<br />to “it’s handled.”</h2>
          </div>
          <div className="steps">
            <article>
              <span>01</span>
              <h3>Tell us the situation</h3>
              <p>Choose a service, district and a few useful details. Posting a request is designed to be quick.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Compare the right people</h3>
              <p>The production marketplace will bring profiles, focus areas, languages, proposals and availability into one place.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Choose with clarity</h3>
              <p>Connect with the expert who fits. Booking and payment are marked as upcoming integration work.</p>
            </article>
          </div>
        </section>

        <section className="request-section">
          <div className="request-copy">
            <div className="request-mark"><UserCircle size={42} weight="duotone" /></div>
            <h2>Not sure which expert you need?</h2>
            <p>Describe the situation in your own words. The request flow will guide it to the right category.</p>
          </div>
          <button className="button button-light" type="button" onClick={openRequest}>
            Start your request <ArrowRight size={18} weight="bold" />
          </button>
        </section>

        <section className="expert-join" id="for-experts">
          <div className="join-visual" aria-hidden="true">
            <div className="join-card join-card-back"><span>Mortgage advisor</span></div>
            <div className="join-card join-card-mid"><span>Translator</span></div>
            <div className="join-card join-card-front"><span>Your expertise</span><strong>belongs on the map.</strong></div>
          </div>
          <div className="join-copy">
            <h2>Built for great experts, too.</h2>
            <p>The expert onboarding flow will let professionals define where and how they work, then receive relevant requests.</p>
            <button className="inline-link" type="button" onClick={() => showNotice("Expert onboarding is ready for backend integration.")}>Join as an expert <ArrowUpRight size={18} /></button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div>
            <a className="brand footer-brand" href="#top">
              <span className="brand-mark" aria-hidden="true"><span /></span>
              <span>Budapest<br />Expert Hub</span>
            </a>
            <p>Local expertise for life in Budapest.</p>
          </div>
          <div className="footer-links">
            <div><strong>Explore</strong><a href="#services">Services</a><a href="#experts">Find an expert</a><a href="#how">How it works</a></div>
            <div><strong>Company</strong><a href="#for-experts">For experts</a><a href="mailto:info@budapestexperts.com">Contact</a></div>
            <div><strong>Visit</strong><span>1065, Westend City Center</span><span>Budapest, Hungary</span><a href="mailto:info@budapestexperts.com">info@budapestexperts.com</a></div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Budapest Expert Hub</span>
          <span>Frontend concept · Legal pages require final business review</span>
        </div>
      </footer>

      {requestOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={closeRequest}>
          <section
            ref={dialogRef}
            className="request-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            aria-describedby="request-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="dialog-close" type="button" onClick={closeRequest} aria-label="Close request form" data-autofocus><X size={22} /></button>
            {submitted ? (
              <div className="success-state" aria-live="polite">
                <span><Check size={32} weight="bold" /></span>
                <h2 id="request-title">Your request is ready.</h2>
                <p id="request-description">This prototype does not send data yet. Connect the form to your backend to start matching customers.</p>
                <button className="button button-dark" type="button" onClick={() => { closeRequest(); setSubmitted(false); }}>Close preview</button>
              </div>
            ) : (
              <form onSubmit={submitRequest}>
                <span className="sample-label">Request preview</span>
                <h2 id="request-title">What can an expert help with?</h2>
                <p id="request-description">Share the essentials. You can discuss private details directly with your chosen expert.</p>
                <div className="form-grid">
                  <label><span>Service</span><select value={service} onChange={(event) => setService(event.target.value)}>{services.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
                  <label><span>District</span><select value={district} onChange={(event) => setDistrict(event.target.value)}>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
                <label><span>Your situation</span><textarea required minLength={20} placeholder="For example: I’m moving to District XI next month and need help reviewing a rental agreement…" /></label>
                <label><span>Email</span><input required type="email" placeholder="you@example.com" /></label>
                <button className="button button-blue submit-button" type="submit">Preview my request <ArrowRight size={18} weight="bold" /></button>
                <small>No data is sent in this frontend demonstration.</small>
              </form>
            )}
          </section>
        </div>
      )}
      {notice && <div className="notice-toast" role="status">{notice}</div>}
    </>
  );
}

export default App;
