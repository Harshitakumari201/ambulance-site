const STEPS = [
  {
    num: "1",
    icon: "📱",
    title: "Request or Call 108",
    desc: "Submit patient coordinates via our online dispatch system or call the 24/7 helpline. No paperwork required up front.",
  },
  {
    num: "2",
    icon: "🛰️",
    title: "Automated GPS Allocation",
    desc: "Our dispatch engine calculates live traffic and auto-assigns the closest equipped vehicle from the nearest depot hub.",
  },
  {
    num: "3",
    icon: "🚑",
    title: "Paramedic Call & Transit",
    desc: "The paramedic team verifies patient vitals by phone while in transit and guides attendants with immediate stabilizing actions.",
  },
  {
    num: "4",
    icon: "🏥",
    title: "Hospital Bed Pre-Alert",
    desc: "We alert destination hospital trauma teams before arrival so critical beds and emergency physicians are primed instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="content-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Emergency Dispatch Workflow</span>
          <h2 className="section-title">How Our Emergency Response Operates</h2>
          <p className="section-subtitle">
            An engineered four-phase emergency pipeline designed to minimize dispatch latency and maximize clinical survival rates.
          </p>
        </div>

        <div className="workflow-steps-grid">
          {STEPS.map((s) => (
            <div key={s.num} className="workflow-card">
              <div className="workflow-num">{s.num}</div>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
