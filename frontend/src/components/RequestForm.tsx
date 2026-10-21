import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { RequestPayload, RequestRecord, Service, ServiceType } from "../types";
import { EMERGENCY_NUMBER, DISPATCH_NUMBER } from "../config";

const FALLBACK: { id: ServiceType; name: string; summary: string }[] = [
  { id: "bls", name: "Basic Life Support (BLS)", summary: "Oxygen, vital monitoring & EMT" },
  { id: "als", name: "Advanced Life Support (ALS)", summary: "ICU setup, Defibrillator & Paramedic" },
  { id: "transport", name: "Patient Transport", summary: "Non-emergency hospital transfers" },
  { id: "neonatal", name: "Neonatal & Maternity", summary: "Infant incubator & specialized nurse" },
];

const empty: RequestPayload = {
  patient_name: "",
  phone: "",
  pickup_address: "",
  destination: "",
  service: "bls",
  notes: "",
};

const POPULAR_HOSPITALS = [
  "Central Hospital",
  "City Medical College",
  "District Civil Hospital",
  "Apollo Emergency Clinic",
];

interface RequestFormProps {
  services: Service[] | null;
  selectedService?: ServiceType;
  onSelectService?: (s: ServiceType) => void;
}

export default function RequestForm({ services, selectedService, onSelectService }: RequestFormProps) {
  const [activeTab, setActiveTab] = useState<"request" | "track">("request");
  const [form, setForm] = useState<RequestPayload>({
    ...empty,
    service: selectedService || "bls",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RequestRecord | null>(null);
  const [copied, setCopied] = useState(false);

  // Track search state
  const [trackRef, setTrackRef] = useState("");
  const [trackBusy, setTrackBusy] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const options = services ?? FALLBACK;

  const setField = <K extends keyof RequestPayload>(key: K, value: RequestPayload[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "service" && onSelectService) {
      onSelectService(value as ServiceType);
    }
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: RequestPayload = {
        ...form,
        destination: form.destination?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
      };
      const record = await api.createRequest(payload);
      setResult(record);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onTrackSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trackRef.trim()) return;
    setTrackBusy(true);
    setTrackError(null);
    try {
      const data = await api.getRequest(trackRef.trim());
      setResult(data);
      setActiveTab("request");
    } catch (err) {
      setTrackError((err as Error).message);
    } finally {
      setTrackBusy(false);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setField("pickup_address", `Current GPS Location: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`);
      },
      () => {
        setField("pickup_address", "Current GPS Location (Location permission pending)");
      }
    );
  }

  function copyReference(ref: string) {
    navigator.clipboard?.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // --- Confirmation & Live Tracking View ---
  if (result) {
    const isDispatched = result.status === "dispatched";

    return (
      <div className="request-panel" id="book" aria-live="polite">
        <div className="panel-header-accent" />
        <div className="panel-body">
          <div className={`tracking-card-header ${isDispatched ? "" : "queued"}`}>
            <div className="tracking-siren-badge">
              {isDispatched ? "🚑" : "⏳"}
            </div>
            <div>
              <div className="tracking-status-title">
                {isDispatched ? "Ambulance Dispatched & En Route" : "Request Queued & Standby"}
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                {isDispatched
                  ? "A medical response team has been assigned to your location."
                  : "Assigned to the nearest available unit in your zone."}
              </p>
            </div>
          </div>

          <div className="tracking-eta-box">
            <div className="eta-label">Estimated Time of Arrival</div>
            <div className="eta-number-huge">{result.eta_minutes} min</div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Driver team is navigating traffic to reach <strong>{result.pickup_address}</strong>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="dispatch-stepper">
            <div className="step-node completed">
              <div className="step-dot">✓</div>
              <div className="step-label">Received</div>
            </div>
            <div className="step-node completed">
              <div className="step-dot">✓</div>
              <div className="step-label">Unit {result.unit_id}</div>
            </div>
            <div className={`step-node ${isDispatched ? "active" : ""}`}>
              <div className="step-dot">🚨</div>
              <div className="step-label">En Route</div>
            </div>
            <div className="step-node">
              <div className="step-dot">📍</div>
              <div className="step-label">Arrival</div>
            </div>
          </div>

          {/* Details list */}
          <div className="dispatch-details-list">
            <div className="detail-row">
              <dt>Booking Ref:</dt>
              <dd style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{result.reference}</span>
                <button
                  type="button"
                  onClick={() => copyReference(result.reference)}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </dd>
            </div>
            <div className="detail-row">
              <dt>Assigned Vehicle:</dt>
              <dd><strong>{result.unit_id}</strong> ({result.service.toUpperCase()})</dd>
            </div>
            <div className="detail-row">
              <dt>Patient Name:</dt>
              <dd>{result.patient_name}</dd>
            </div>
            <div className="detail-row">
              <dt>Contact Phone:</dt>
              <dd>{result.phone}</dd>
            </div>
            <div className="detail-row">
              <dt>Pickup Address:</dt>
              <dd>{result.pickup_address}</dd>
            </div>
            {result.destination && (
              <div className="detail-row">
                <dt>Destination:</dt>
                <dd>{result.destination}</dd>
              </div>
            )}
          </div>

          <div className="alert-warning" style={{ marginTop: 0, marginBottom: "1.25rem" }}>
            <strong>Important:</strong> Keep <strong>{result.phone}</strong> accessible. The paramedic crew will call right before arriving. For deteriorating condition, call <a href={`tel:${EMERGENCY_NUMBER}`}>{EMERGENCY_NUMBER}</a> immediately.
          </div>

          <div className="tracking-actions">
            <a
              href={`tel:${DISPATCH_NUMBER}`}
              className="btn-track-action"
              style={{ background: "#dc2626", color: "#fff" }}
            >
              📞 Call Control Room
            </a>
            <button
              type="button"
              className="btn-track-action btn-secondary-track"
              onClick={() => {
                setResult(null);
                setForm(empty);
              }}
            >
              + Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Form & Track Tabs ---
  return (
    <div className="request-panel" id="book">
      <div className="panel-header-accent" />
      <div className="panel-body">
        {/* Tab Switcher */}
        <div className="panel-tabs" role="tablist">
          <button
            type="button"
            className={`tab-btn ${activeTab === "request" ? "active" : ""}`}
            onClick={() => setActiveTab("request")}
            role="tab"
            aria-selected={activeTab === "request"}
          >
            <span>🚨</span>
            <span>Request Ambulance</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "track" ? "active" : ""}`}
            onClick={() => setActiveTab("track")}
            role="tab"
            aria-selected={activeTab === "track"}
          >
            <span>🔍</span>
            <span>Track by Reference</span>
          </button>
        </div>

        {activeTab === "track" ? (
          <form onSubmit={onTrackSubmit}>
            <h2 className="panel-title">Track Ambulance Status</h2>
            <p className="panel-subtitle">Enter the reference ID provided during booking (e.g., REQ-0295B258)</p>

            <div className="form-group">
              <label className="form-label" htmlFor="track-ref">
                Reference Number
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🔖</span>
                <input
                  id="track-ref"
                  className="form-input"
                  placeholder="e.g. REQ-ABC12345"
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            {trackError && (
              <div className="alert-error" role="alert">
                <span>⚠️</span>
                <span>{trackError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-submit-request"
              disabled={trackBusy}
              style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)" }}
            >
              {trackBusy ? "Checking Status..." : "Track My Ambulance"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2 className="panel-title">Instant Ambulance Dispatch</h2>
            <p className="panel-subtitle">Average city response time: 8-12 minutes. Zero pre-payment required.</p>

            {/* Service Select Cards */}
            <div className="form-group">
              <label className="form-label">
                <span>Select Service Level</span>
                <span className="optional-tag">Critical equipment choice</span>
              </label>
              <div className="service-cards-selector">
                {options.map((s) => {
                  const isSelected = form.service === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`service-card-choice ${isSelected ? "selected" : ""}`}
                      onClick={() => setField("service", s.id)}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setField("service", s.id);
                        }
                      }}
                    >
                      <span className="choice-badge">{s.id.toUpperCase()}</span>
                      <strong className="choice-name">{s.name.split(" ")[0]}</strong>
                      <span className="choice-desc">{s.summary?.slice(0, 48)}...</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patient Name & Phone */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="patient-name">Patient Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    id="patient-name"
                    required
                    minLength={2}
                    className="form-input"
                    placeholder="Full name"
                    value={form.patient_name}
                    autoComplete="name"
                    onChange={(e) => setField("patient_name", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone-number">Contact Phone</label>
                <div className="input-with-icon">
                  <span className="input-icon">📞</span>
                  <input
                    id="phone-number"
                    required
                    type="tel"
                    inputMode="tel"
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    autoComplete="tel"
                    onChange={(e) => setField("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pickup Address with GPS button */}
            <div className="form-group">
              <label className="form-label" htmlFor="pickup-address">
                <span>Pickup Address</span>
                <span className="optional-tag">Where should we arrive?</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">📍</span>
                <input
                  id="pickup-address"
                  required
                  minLength={5}
                  className="form-input"
                  style={{ paddingRight: "6.5rem" }}
                  placeholder="Building, Street, Landmark, Area"
                  value={form.pickup_address}
                  autoComplete="street-address"
                  onChange={(e) => setField("pickup_address", e.target.value)}
                />
                <button
                  type="button"
                  className="geo-btn"
                  onClick={handleUseLocation}
                  title="Use current GPS location"
                >
                  📡 GPS Auto
                </button>
              </div>
            </div>

            {/* Destination Hospital */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-hosp">
                <span>Destination Hospital</span>
                <span className="optional-tag">Optional</span>
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🏥</span>
                <input
                  id="dest-hosp"
                  className="form-input"
                  placeholder="Nearest emergency hospital or preference"
                  value={form.destination}
                  onChange={(e) => setField("destination", e.target.value)}
                />
              </div>
              <div className="quick-hospitals-list">
                {POPULAR_HOSPITALS.map((hosp) => (
                  <button
                    key={hosp}
                    type="button"
                    className="quick-hosp-pill"
                    onClick={() => setField("destination", hosp)}
                  >
                    + {hosp}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="medical-notes">
                <span>Medical Situation / Symptoms</span>
                <span className="optional-tag">Optional</span>
              </label>
              <textarea
                id="medical-notes"
                className="form-input no-icon"
                rows={2}
                maxLength={500}
                placeholder="e.g. Chest pain, breathlessness, accident, conscious status"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>

            {error && (
              <div className="alert-error" role="alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button className="btn-submit-request" type="submit" disabled={busy}>
              {busy ? (
                <span>Locating & Assigning Unit...</span>
              ) : (
                <>
                  <span>🚨</span>
                  <span>Confirm Emergency Dispatch</span>
                </>
              )}
            </button>

            <div className="alert-warning">
              <strong>Emergency Notice:</strong> For cardiac arrest, severe trauma, or unconscious patients, call <a href={`tel:${EMERGENCY_NUMBER}`}>{EMERGENCY_NUMBER}</a> immediately for real-time telephonic first-aid instructions.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
