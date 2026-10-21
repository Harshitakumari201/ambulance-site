import { useState } from "react";
import { api } from "./api";
import { useFetch } from "./hooks";
import Header from "./components/Header";
import RequestForm from "./components/RequestForm";
import Services from "./components/Services";
import Fleet from "./components/Fleet";
import FirstAidGuide from "./components/FirstAidGuide";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";
import {
  EMAIL_ADDRESS,
  ORG_NAME,
  OWNER_NAME,
  PHONE_PRIMARY,
  PHONE_PRIMARY_RAW,
  PHONE_SECONDARY,
  PHONE_SECONDARY_RAW,
  SERVICE_AREA,
  VEHICLE_MODELS,
} from "./config";
import type { ServiceType } from "./types";

export default function App() {
  const { data: services, error } = useFetch(api.services);
  const [selectedService, setSelectedService] = useState<ServiceType>("bls");

  function handleSelectService(s: ServiceType) {
    setSelectedService(s);
    const bookEl = document.getElementById("book");
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      {/* Global Header & Nav */}
      <Header />

      <main id="main">
        {/* Hero Section */}
        <section id="top" className="hero-wrapper">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge-strip">
                <span className="pulse-dot" style={{ background: "#dc2626" }} />
                <span>24/7 Rapid Emergency Response &bull; Out-Station Facility</span>
              </div>

              <h1 className="hero-heading">
                Immediate Medical Care When <span className="highlight">Seconds Count</span>
              </h1>

              <p className="hero-description">
                Fast-track emergency ambulance dispatch with ICU ventilators, oxygen services, and trained paramedics across {SERVICE_AREA}. Managed by {OWNER_NAME}.
              </p>

              {/* Big Emergency Dial Box */}
              <div className="hero-sos-callout">
                <div className="sos-callout-info">
                  <h3>24/7 Astha Emergency Helpline</h3>
                  <div className="sos-dial-huge">
                    <span>🚨</span>
                    <span>{PHONE_PRIMARY_RAW}</span>
                  </div>
                  <div className="sos-dial-subtext">
                    Mob: {PHONE_PRIMARY} / {PHONE_SECONDARY} &bull; Contact: {OWNER_NAME}
                  </div>
                </div>
                <a
                  href={`tel:${PHONE_PRIMARY_RAW}`}
                  className="sos-call-action-btn"
                  aria-label={`Dial Emergency ${PHONE_PRIMARY}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Call {PHONE_PRIMARY_RAW}</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="hero-trust-grid">
                <div className="trust-item">
                  <div className="trust-icon">⏱️</div>
                  <div className="trust-text">
                    <strong>8–12 Min</strong>
                    <span>Average City ETA</span>
                  </div>
                </div>

                <div className="trust-item">
                  <div className="trust-icon">🩺</div>
                  <div className="trust-text">
                    <strong>Certified EMTs</strong>
                    <span>Critical Care Team</span>
                  </div>
                </div>

                <div className="trust-item">
                  <div className="trust-icon">🛰️</div>
                  <div className="trust-text">
                    <strong>Live GPS</strong>
                    <span>Real-time Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Panel */}
            <RequestForm
              services={services}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </div>
        </section>

        {/* Stats Counter Bar */}
        <section className="stats-section" aria-label="Key Performance Metrics">
          <div className="stats-container">
            <div className="stat-box">
              <div className="stat-icon-wrapper" style={{ background: "#fee2e2", color: "#dc2626" }}>
                ⚡
              </div>
              <div>
                <div className="stat-number">&lt; 10 Mins</div>
                <div className="stat-label">Average Response Time</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrapper" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                🚑
              </div>
              <div>
                <div className="stat-number">6+ Active</div>
                <div className="stat-label">Live Staged Vehicles</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrapper" style={{ background: "#d1fae5", color: "#059669" }}>
                🏥
              </div>
              <div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Life Support Ready</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrapper" style={{ background: "#fef3c7", color: "#d97706" }}>
                🛡️
              </div>
              <div>
                <div className="stat-number">15,000+</div>
                <div className="stat-label">Successful Transports</div>
              </div>
            </div>
          </div>
        </section>

        {/* Photorealistic Showcase Strip */}
        <section className="showcase-strip" aria-label="Mobile Critical Care Fleet">
          <div className="showcase-card">
            <img
              src="/ambulance_hero.jpg"
              alt="High-tech LifeLine Emergency Ambulance ready for deployment outside hospital emergency bay"
              className="showcase-img"
            />
            <div className="showcase-overlay">
              <div className="showcase-overlay-content">
                <span className="showcase-tag">Advanced Mobile ICU</span>
                <h2 className="showcase-title">Hospital-Grade Critical Care in Transit</h2>
                <p className="showcase-text">
                  Our advanced life support fleet is engineered with multi-parameter cardiac monitors, portable ICU ventilators, biphasic defibrillators, and temperature-controlled infant incubators.
                </p>
                <div className="showcase-pills">
                  <span className="showcase-pill">✓ ICU Ventilators</span>
                  <span className="showcase-pill">✓ 12-Lead ECG Monitors</span>
                  <span className="showcase-pill">✓ Oxygen Cascades</span>
                  <span className="showcase-pill">✓ Emergency Meds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Fleet Status */}
        <Fleet onSelectService={handleSelectService} />

        {/* Services Comparison */}
        <Services services={services} error={error} onSelectService={handleSelectService} />

        {/* First Aid & Preparation Guide */}
        <FirstAidGuide />

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ */}
        <Faq />
      </main>

      {/* Modern High-Trust Footer with Astha Visiting Card Details */}
      <footer className="main-footer">
        <div className="footer-top">
          {/* Column 1: Organization & Visiting Card Badge */}
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: "1rem" }}>
              <div className="logo-icon-badge" style={{ width: "36px", height: "36px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <span className="brand-title" style={{ color: "#ffffff", fontSize: "1.2rem" }}>
                {ORG_NAME}
              </span>
            </div>

            <div className="footer-visiting-card">
              <div className="visiting-card-owner">
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                    Incharge / Contact Person
                  </div>
                  <div className="visiting-card-name">{OWNER_NAME}</div>
                </div>
                <span className="visiting-card-tag">24x7 Facility</span>
              </div>

              <div style={{ fontSize: "0.825rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                <strong style={{ color: "#fef08a" }}>Key Facilities on Board:</strong>
                <ul style={{ paddingLeft: "1.2rem", margin: "0.4rem 0", color: "#cbd5e1" }}>
                  <li>24x7 Hour Facilities &amp; Oxygen Available</li>
                  <li>Out - Station Facility also Available</li>
                  <li>Ventilator ICU &amp; Deep Freezer Ambulance</li>
                  <li>Mukti Vahan (Hearse Service)</li>
                </ul>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                  Available Fleet Models:
                </div>
                <div className="footer-chips-grid">
                  {VEHICLE_MODELS.map((m) => (
                    <span key={m} className="footer-chip highlight">
                      🚑 {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul className="footer-links">
              <li><a href="#book">🚨 Instant Dispatch Form</a></li>
              <li><a href="#fleet">🛰️ Live Fleet Status</a></li>
              <li><a href="#services">🩺 Medical Service Tiers</a></li>
              <li><a href="#guide">📋 First-Aid Waiting Guide</a></li>
              <li><a href="#how">⚡ How Dispatch Works</a></li>
              <li><a href="#faq">❓ Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address Details from Card */}
          <div className="footer-col">
            <h4>Contact &amp; Office Desk</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-row">
                <div className="footer-contact-icon">👤</div>
                <div className="footer-contact-text">
                  <strong>Proprietor / Incharge</strong>
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>{OWNER_NAME}</span>
                </div>
              </div>

              <div className="footer-contact-row">
                <div className="footer-contact-icon">📞</div>
                <div className="footer-contact-text">
                  <strong>Mobile Number 1</strong>
                  <a href={`tel:${PHONE_PRIMARY_RAW}`}>{PHONE_PRIMARY}</a>
                </div>
              </div>

              <div className="footer-contact-row">
                <div className="footer-contact-icon">📱</div>
                <div className="footer-contact-text">
                  <strong>Mobile Number 2</strong>
                  <a href={`tel:${PHONE_SECONDARY_RAW}`}>{PHONE_SECONDARY}</a>
                </div>
              </div>

              <div className="footer-contact-row">
                <div className="footer-contact-icon">✉️</div>
                <div className="footer-contact-text">
                  <strong>Official Email</strong>
                  <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
                </div>
              </div>

              <div className="footer-contact-row">
                <div className="footer-contact-icon">📍</div>
                <div className="footer-contact-text">
                  <strong>Coverage &amp; Address</strong>
                  <span style={{ color: "#cbd5e1" }}>
                    {SERVICE_AREA} (Local City &amp; Long-Distance Out-Station)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: 24/7 Direct Emergency Helpline & One-Click Dial */}
          <div className="footer-col">
            <h4>24/7 Control Room</h4>
            <div className="footer-emergency-pill">
              <div className="call-now-label">
                <span className="pulse-dot" style={{ background: "#ef4444" }} />
                <span>Instant Dial Helpline</span>
              </div>

              <a href={`tel:${PHONE_PRIMARY_RAW}`} className="footer-call-btn">
                <span>📞 {PHONE_PRIMARY_RAW}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>Main</span>
              </a>

              <a href={`tel:${PHONE_SECONDARY_RAW}`} className="footer-call-btn alt">
                <span>📱 {PHONE_SECONDARY_RAW}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Alt</span>
              </a>

              <div className="footer-email-box">
                <span style={{ fontSize: "1rem" }}>✉️</span>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                    Official Email
                  </div>
                  <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
                National Toll-Free Emergency: <a href="tel:108" style={{ color: "#f87171", fontWeight: 700 }}>108</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="disclaimer-note">
            <strong>{ORG_NAME}</strong>: 24x7 Emergency ICU Ambulance with ventilator support, Oxygen facilities, Deep Freezer, and Mukti Vahan. Providing fast response across local and out-station destinations. Managed by {OWNER_NAME}.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a href={`mailto:${EMAIL_ADDRESS}`} style={{ color: "#38bdf8", textDecoration: "none" }}>
              ✉️ {EMAIL_ADDRESS}
            </a>
            <span>&bull;</span>
            <span>
              &copy; {new Date().getFullYear()} {ORG_NAME}. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
