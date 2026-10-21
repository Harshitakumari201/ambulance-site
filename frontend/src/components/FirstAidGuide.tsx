import { EMERGENCY_NUMBER } from "../config";

const GUIDE_STEPS = [
  {
    step: "01",
    icon: "📞",
    title: "Keep Phone Free & Alert",
    desc: "The paramedic team and driver will call you within 2 minutes of dispatch for exact landmark verification and continuous triage.",
  },
  {
    step: "02",
    icon: "🚪",
    title: "Clear Pathway & Elevators",
    desc: "Turn on exterior lighting, unlock main gates, secure pets, and hold elevators on ground floor to ensure the stretcher rolls smoothly without delay.",
  },
  {
    step: "03",
    icon: "📋",
    title: "Gather Records & Meds",
    desc: "Keep the patient's ongoing medications, recent hospital discharge summaries, allergy notes, and government ID readily accessible.",
  },
  {
    step: "04",
    icon: "❤️",
    title: "Basic Life Support Actions",
    desc: "Do not give water or food if choking or unconscious. If severe bleeding, apply firm continuous pressure with clean cloth. Dial 108 if condition rapidly worsens.",
  },
];

export default function FirstAidGuide() {
  return (
    <section id="guide" className="content-section tinted">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Critical Patient Protocol</span>
          <h2 className="section-title">While the Ambulance is En Route</h2>
          <p className="section-subtitle">
            What you do in the first 5 minutes saves lives. Follow these 4 vital guidelines until our paramedics arrive at your doorstep.
          </p>
        </div>

        <div className="guide-grid">
          {GUIDE_STEPS.map((g) => (
            <div key={g.step} className="guide-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div className="guide-step-number">{g.step}</div>
                <div style={{ fontSize: "1.75rem" }}>{g.icon}</div>
              </div>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "2.5rem",
          background: "#ffffff",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem 2rem",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <h4 style={{ color: "var(--primary-navy)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
              Patient has stopped breathing or is unresponsive?
            </h4>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b" }}>
              Begin hands-only CPR (100–120 compressions per minute in the center of the chest) immediately while our crew is on the road.
            </p>
          </div>
          <a
            href={`tel:${EMERGENCY_NUMBER}`}
            className="btn-sos"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            🚨 Emergency Hotline {EMERGENCY_NUMBER}
          </a>
        </div>
      </div>
    </section>
  );
}
