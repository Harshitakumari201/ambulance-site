import { EMERGENCY_NUMBER, SERVICE_AREA } from "../config";

const FAQ_ITEMS = [
  {
    q: "When should I call 108 directly instead of using the online booking form?",
    a: `If the patient is unconscious, experiencing acute cardiac chest pain, choking, unresponsive, or experiencing severe bleeding, DIAL ${EMERGENCY_NUMBER} IMMEDIATELY. A telephonic operator can begin emergency CPR triage instructions with you while the siren vehicle is rolling.`,
  },
  {
    q: "What geographic boundaries are covered by our ambulance network?",
    a: `We provide rapid emergency coverage throughout ${SERVICE_AREA}. For inter-city transfers or specialized critical transfers to state medical college hospitals, dispatch coordinates with regional partner stations.`,
  },
  {
    q: "Can I book scheduled non-emergency patient transport in advance?",
    a: "Yes. Select 'Patient Transport' on the booking form and mention your preferred hospital, appointment slot, or routine dialysis schedule in the notes. Our team will confirm the vehicle slot.",
  },
  {
    q: "What happens if all nearest ambulances in my sector are currently on a call?",
    a: "Our dispatch algorithm immediately reroutes the nearest available vehicle from adjacent depot hubs and places your ticket into highest priority queue. The system will display the recalculated ETA transparently.",
  },
  {
    q: "What medical documents or equipment should family members have ready?",
    a: "Please keep the patient's ongoing prescriptions, past discharge summaries, diagnostic reports, and photo ID ready. Our stretcher team will handle all physical patient shifting.",
  },
  {
    q: "Do I need to pay an upfront fee before the ambulance arrives?",
    a: "No. Emergency dispatch begins immediately upon address confirmation. Life preservation is our absolute priority; administrative paperwork and billing are handled after safe patient handover.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="content-section tinted">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Frequently Answered Queries</span>
          <h2 className="section-title">Emergency & Service Questions</h2>
          <p className="section-subtitle">
            Essential information regarding emergency triage, vehicle capabilities, and transport protocols.
          </p>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => (
            <details key={item.q} className="faq-item" open={idx === 0}>
              <summary>{item.q}</summary>
              <div className="faq-content">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
