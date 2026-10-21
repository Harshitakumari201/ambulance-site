import { useState } from "react";
import {
  EMERGENCY_NUMBER,
  ORG_NAME,
  PHONE_PRIMARY,
  PHONE_PRIMARY_RAW,
  PHONE_SECONDARY,
  PHONE_SECONDARY_RAW,
  SERVICE_AREA,
} from "../config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Emergency Ribbon */}
      <div className="emergency-top-bar">
        <div className="top-bar-inner">
          <div className="live-indicator">
            <span className="pulse-dot" aria-hidden="true" />
            <span>24/7 Astha Emergency Dispatch &bull; {SERVICE_AREA}</span>
          </div>
          <div className="top-hotline-links">
            <a href={`tel:${PHONE_PRIMARY_RAW}`} className="top-hotline-link">
              <span>Mob 1:</span>
              <strong>{PHONE_PRIMARY}</strong>
            </a>
            <span style={{ opacity: 0.5 }}>|</span>
            <a href={`tel:${PHONE_SECONDARY_RAW}`} className="top-hotline-link">
              <span>Mob 2:</span>
              <strong>{PHONE_SECONDARY}</strong>
            </a>
            <span style={{ opacity: 0.5 }}>|</span>
            <a href={`tel:${EMERGENCY_NUMBER}`} className="top-hotline-link">
              <span>National Toll-Free:</span>
              <strong>{EMERGENCY_NUMBER}</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="main-header">
        <div className="header-container">
          <a href="#top" className="brand-logo" aria-label={`${ORG_NAME} home`}>
            <div className="logo-icon-badge" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <div className="logo-text-group">
              <span className="brand-title">{ORG_NAME}</span>
              <span className="brand-tagline">Rapid Emergency Medical Care</span>
            </div>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#book">Book Ambulance</a></li>
              <li><a href="#fleet">Live Fleet</a></li>
              <li><a href="#services">Medical Services</a></li>
              <li><a href="#guide">First-Aid Guide</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>

          <div className="nav-cta-group">
            <a href={`tel:${PHONE_PRIMARY_RAW}`} className="btn-sos" aria-label={`Call Astha Helpline ${PHONE_PRIMARY}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call {PHONE_PRIMARY_RAW}</span>
            </a>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{
            background: "#ffffff",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            <a href="#book" onClick={() => setMobileMenuOpen(false)}>Book Ambulance</a>
            <a href="#fleet" onClick={() => setMobileMenuOpen(false)}>Live Fleet</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Medical Services</a>
            <a href="#guide" onClick={() => setMobileMenuOpen(false)}>First-Aid Guide</a>
            <a href="#how" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <a
              href={`tel:${PHONE_PRIMARY_RAW}`}
              style={{
                color: "var(--emergency-red)",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              🚨 Call Astha: {PHONE_PRIMARY}
            </a>
            <a
              href={`tel:${PHONE_SECONDARY_RAW}`}
              style={{
                color: "var(--primary-blue)",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              📞 Alternate: {PHONE_SECONDARY}
            </a>
          </div>
        )}
      </header>
    </>
  );
}
