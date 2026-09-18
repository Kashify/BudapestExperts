import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  List,
  MapPin,
  Moon,
  Sun,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { services, experts, negotiations } from "./data";
import {
  useReducedMotion,
  useDesktopScene,
  useScrollMotion,
  useRevealSections,
} from "./hooks";
import { WebGLErrorBoundary } from "./components/WebGLErrorBoundary";
import { MobileCity } from "./components/MobileCity";
import { NegotiationPortal } from "./components/NegotiationPortal";
import { HeroSearch } from "./components/HeroSearch";
import { RequestDialog } from "./components/RequestDialog";
import type { Theme } from "./types";

const CityScene = lazy(() => import("./components/CityScene"));

function App() {
  const [service, setService] = useState("Interior designer");
  const [cityService, setCityService] = useState("Interior designer");
  const [district, setDistrict] = useState("All Budapest");
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);
  const [autoRotatePaused, setAutoRotatePaused] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeThread, setActiveThread] = useState(negotiations[0].id);

  const resultsRef = useRef<HTMLElement>(null);
  const requestTriggerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const reducedMotion = useReducedMotion();
  const desktopScene = useDesktopScene();
  const scrollProgress = useScrollMotion();
  useRevealSections();
  const pageStyle = { "--scroll-progress": scrollProgress } as CSSProperties;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0b1118" : "#f4f5f7");
    }
  }, [theme]);

  useEffect(() => {
    if (reducedMotion || requestOpen || autoRotatePaused) return;
    const rotationTimer = window.setInterval(() => {
      setCityService((currentService) => {
        const currentIndex = services.findIndex((item) => item.name === currentService);
        return services[(currentIndex + 1) % services.length].name;
      });
    }, 2600);
    return () => window.clearInterval(rotationTimer);
  }, [reducedMotion, requestOpen, autoRotatePaused]);

  const handleServiceChange = (nextService: string) => {
    setService(nextService);
    setCityService(nextService);
    setAutoRotatePaused(true);
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    setAutoRotatePaused(true);
  };

  const visibleExpert = experts.find(
    (expert) =>
      expert.role === service &&
      (district === "All Budapest" ||
        expert.district === "All Budapest" ||
        expert.district === district)
  );

  const runSearch = () => {
    setSearchTouched(true);
    resultsRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
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

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Budapest Expert Hub home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Budapest<br />Expert Hub</span>
        </a>
        <nav ref={navRef} className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#experts" onClick={() => setMenuOpen(false)}>Find an expert</a>
          <a href="#negotiation" onClick={() => setMenuOpen(false)}>Negotiation desk</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#for-experts" onClick={() => setMenuOpen(false)}>For experts</a>
          <div className="mobile-nav-actions">
            <button
              className="text-button mobile-nav-signin"
              type="button"
              onClick={() => {
                setMenuOpen(false);
                showNotice("Account access is ready for backend integration.");
              }}
            >
              Sign in
            </button>
            <button
              className="button button-dark mobile-nav-request"
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openRequest();
              }}
            >
              Request help
            </button>
          </div>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="text-button desktop-only"
            type="button"
            onClick={() => showNotice("Account access is ready for backend integration.")}
          >
            Sign in
          </button>
          <button className="button button-dark desktop-only" type="button" onClick={openRequest}>
            Request help
          </button>
          <button
            ref={menuButtonRef}
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

      <main id="main" style={pageStyle}>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="location-line"><MapPin size={17} weight="fill" /> Local help across Budapest</p>
            <h1>The right expert,<br /><em>right where you are.</em></h1>
            <p className="hero-intro">Find local professionals for the moments that need more than a search result.</p>

            <HeroSearch
              service={service}
              onServiceChange={handleServiceChange}
              district={district}
              onDistrictChange={handleDistrictChange}
              onSearch={runSearch}
            />
          </div>

          <div
            className="hero-visual"
            role="img"
            aria-label={`Illustrative Budapest expert network for ${service} in ${district}`}
          >
            <div className="scene-orbit scene-orbit-one" />
            <div className="scene-orbit scene-orbit-two" />
            {desktopScene ? (
              <WebGLErrorBoundary fallback={<MobileCity activeService={cityService} activeDistrict={district} />}>
                <Suspense fallback={<div className="scene-loader">Building Budapest…</div>}>
                  <CityScene
                    activeService={cityService}
                    activeDistrict={district}
                    reducedMotion={reducedMotion}
                    scrollProgress={scrollProgress}
                    theme={theme}
                  />
                </Suspense>
              </WebGLErrorBoundary>
            ) : (
              <MobileCity activeService={cityService} activeDistrict={district} />
            )}
            <div className="scene-note">
              <span className="live-dot" />
              Illustrative view · <strong>{district}</strong>
            </div>
          </div>
        </section>

        <section className="confidence-strip" data-reveal aria-label="Marketplace principles">
          <div><CheckCircle size={20} weight="fill" /><span>Profiles designed for easy comparison</span></div>
          <div><CheckCircle size={20} weight="fill" /><span>Local coverage by Budapest district</span></div>
          <div><CheckCircle size={20} weight="fill" /><span>Request details before you commit</span></div>
        </section>

        <div data-reveal>
          <NegotiationPortal
            activeThread={activeThread}
            setActiveThread={setActiveThread}
            onNotice={showNotice}
          />
        </div>

        <section className="services-section" id="services" data-reveal>
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
                    handleServiceChange(item.name);
                    setSearchTouched(true);
                    resultsRef.current?.scrollIntoView({
                      behavior: reducedMotion ? "auto" : "smooth",
                    });
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

        <section
          className="experts-section"
          id="experts"
          data-reveal
          ref={resultsRef}
          tabIndex={-1}
          aria-live="polite"
        >
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
                  <img
                    src={visibleExpert.image}
                    loading="lazy"
                    alt={`Sample portrait for ${visibleExpert.name}`}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.parentElement?.classList.add("image-fallback");
                    }}
                  />
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
                <button className="button button-blue" type="button" onClick={openRequest}>
                  Post a request <ArrowRight size={18} weight="bold" />
                </button>
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

        <section className="how-section" id="how" data-reveal>
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

        <section className="request-section" data-reveal>
          <div className="request-copy">
            <div className="request-mark"><UserCircle size={42} weight="duotone" /></div>
            <h2>Not sure which expert you need?</h2>
            <p>Describe the situation in your own words. The request flow will guide it to the right category.</p>
          </div>
          <button className="button button-light" type="button" onClick={openRequest}>
            Start your request <ArrowRight size={18} weight="bold" />
          </button>
        </section>

        <section className="expert-join" id="for-experts" data-reveal>
          <div className="join-visual" aria-hidden="true">
            <div className="join-card join-card-back"><span>Mortgage advisor</span></div>
            <div className="join-card join-card-mid"><span>Translator</span></div>
            <div className="join-card join-card-front"><span>Your expertise</span><strong>belongs on the map.</strong></div>
          </div>
          <div className="join-copy">
            <h2>Built for great experts, too.</h2>
            <p>The expert onboarding flow will let professionals define where and how they work, then receive relevant requests.</p>
            <button
              className="inline-link"
              type="button"
              onClick={() => showNotice("Expert onboarding is ready for backend integration.")}
            >
              Join as an expert <ArrowUpRight size={18} />
            </button>
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

      <RequestDialog
        isOpen={requestOpen}
        onClose={closeRequest}
        service={service}
        onServiceChange={handleServiceChange}
        district={district}
        onDistrictChange={handleDistrictChange}
      />

      {notice && <div className="notice-toast" role="status">{notice}</div>}
    </>
  );
}

export default App;
