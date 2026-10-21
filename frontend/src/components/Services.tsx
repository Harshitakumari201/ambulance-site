import type { Service, ServiceType } from "../types";

const SERVICE_ICONS: Record<ServiceType, string> = {
  bls: "🩹",
  als: "⚡",
  transport: "♿",
  neonatal: "🍼",
};

const SERVICE_EQUIPMENT: Record<ServiceType, string[]> = {
  bls: ["Oxygen Inhalation Unit", "Automated Defibrillator (AED)", "Spine Board & Splints", "First-Aid EMT Kit"],
  als: ["12-Lead ECG Monitor", "Biphasic Defibrillator", "Portable Ventilator", "Emergency IV Infusion & Meds"],
  transport: ["Hydraulic Stretcher", "Wheelchair Support", "Comfort Climate Control", "Nurse Attendant"],
  neonatal: ["Transport Incubator", "Pediatric Pulse Oximeter", "Neonatal Resuscitator", "Thermal Wrap System"],
};

interface ServicesProps {
  services: Service[] | null;
  error: string | null;
  onSelectService?: (s: ServiceType) => void;
}

export default function Services({ services, error, onSelectService }: ServicesProps) {
  return (
    <section id="services" className="content-section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Clinical Capabilities</span>
          <h2 className="section-title">Comprehensive Medical Fleet Tiers</h2>
          <p className="section-subtitle">
            From critical cardiac resuscitation to gentle non-emergency hospital transfers, our vehicles are fitted with hospital-grade equipment.
          </p>
        </div>

        {error && (
          <div className="alert-error" role="alert">
            <span>⚠️ Could not fetch services: {error}</span>
          </div>
        )}

        {!services && !error && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
            Loading service tiers...
          </div>
        )}

        <div className="services-grid">
          {services?.map((s) => {
            const icon = SERVICE_ICONS[s.id] || "🚑";
            const equipment = SERVICE_EQUIPMENT[s.id] || [];

            return (
              <div key={s.id} className="service-box">
                <div>
                  <div className="service-box-icon" style={{
                    background: s.id === "als" ? "#fee2e2" : s.id === "neonatal" ? "#fce7f3" : "#e0f2fe",
                    color: s.id === "als" ? "#dc2626" : s.id === "neonatal" ? "#db2777" : "#0284c7"
                  }}>
                    {icon}
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>

                  <div className="service-box-specs">
                    <div className="spec-line">
                      <strong>Crew on board: </strong>
                      <span>{s.crew}</span>
                    </div>
                    <div className="spec-line">
                      <strong>Recommended for: </strong>
                      <span>{s.typical_use}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>
                      On-Board Equipment:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {equipment.map((item) => (
                        <span
                          key={item}
                          style={{
                            background: "#f1f5f9",
                            fontSize: "0.725rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            color: "#334155",
                            fontWeight: 600,
                          }}
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href="#book"
                  className="btn-select-service"
                  style={{ textAlign: "center", display: "block" }}
                  onClick={() => {
                    if (onSelectService) {
                      onSelectService(s.id);
                    }
                  }}
                >
                  Book {s.name.split(" ")[0]} Unit
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
