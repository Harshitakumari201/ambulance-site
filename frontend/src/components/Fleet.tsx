import { useState } from "react";
import { api } from "../api";
import { useFetch } from "../hooks";
import type { UnitStatus, ServiceType } from "../types";

const STATUS_MAP: Record<UnitStatus, { label: string; class: string }> = {
  available: { label: "Available for Dispatch", class: "available" },
  en_route: { label: "On Emergency Call", class: "en_route" },
  busy: { label: "In Hospital Handover", class: "busy" },
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  bls: "Basic Life Support",
  als: "Advanced Cardiac / ICU",
  transport: "Patient Transfer",
  neonatal: "Neonatal & Maternity",
};

export default function Fleet({ onSelectService }: { onSelectService?: (s: ServiceType) => void }) {
  const { data, error } = useFetch(api.fleet, 15000);
  const [filter, setFilter] = useState<string>("all");

  const filteredData = data?.filter((u) => {
    if (filter === "all") return true;
    return u.status === filter;
  });

  const availableCount = data?.filter((u) => u.status === "available").length ?? 0;

  return (
    <section id="fleet" className="content-section tinted">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Live Fleet Radar</span>
          <h2 className="section-title">GPS Active Ambulance Fleet</h2>
          <p className="section-subtitle">
            Real-time telemetry updated every 15 seconds. Units are staged across strategic hubs to guarantee minimum transit times.
          </p>
        </div>

        {/* Controls */}
        <div className="fleet-controls">
          <div className="fleet-filter-tabs">
            <button
              type="button"
              className={`fleet-filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Vehicles ({data?.length ?? 6})
            </button>
            <button
              type="button"
              className={`fleet-filter-btn ${filter === "available" ? "active" : ""}`}
              onClick={() => setFilter("available")}
            >
              Available Now ({availableCount})
            </button>
            <button
              type="button"
              className={`fleet-filter-btn ${filter === "en_route" ? "active" : ""}`}
              onClick={() => setFilter("en_route")}
            >
              En Route
            </button>
          </div>

          <div className="fleet-refresh-indicator">
            <span className="pulse-dot" />
            <span>Telemetry synced automatically &bull; 15s interval</span>
          </div>
        </div>

        {error && (
          <div className="alert-error" role="alert">
            <span>⚠️ Could not refresh fleet coordinates: {error}</span>
          </div>
        )}

        {!data && !error && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            Scanning GPS coordinates & fleet telemetry...
          </div>
        )}

        {filteredData && (
          <div className="fleet-grid">
            {filteredData.map((u) => {
              const statusInfo = STATUS_MAP[u.status];
              // max estimated transit 30 mins for bar calculation
              const progressPct = Math.min(100, Math.max(15, (u.eta_minutes / 30) * 100));

              return (
                <div key={u.id} className="fleet-card">
                  <div className="fleet-card-header">
                    <div className="fleet-unit-badge">
                      <span>🚑</span>
                      <span>{u.id}</span>
                    </div>
                    <span className={`fleet-status-pill ${statusInfo.class}`}>
                      <span className="pulse-dot" style={{
                        background: u.status === "available" ? "#10b981" : u.status === "en_route" ? "#f59e0b" : "#ef4444"
                      }} />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="fleet-card-body">
                    <div className="fleet-detail-item">
                      <span className="label">Configuration:</span>
                      <span className="val">{SERVICE_LABELS[u.service] || u.service.toUpperCase()}</span>
                    </div>
                    <div className="fleet-detail-item">
                      <span className="label">Base Depot:</span>
                      <span className="val">{u.base}</span>
                    </div>
                    <div className="fleet-detail-item">
                      <span className="label">Hub Response ETA:</span>
                      <span className="val" style={{ color: "#0284c7" }}>~{u.eta_minutes} mins</span>
                    </div>

                    <div className="fleet-eta-meter">
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
                        <span>Transit Radius</span>
                        <span>{u.eta_minutes} min window</span>
                      </div>
                      <div className="fleet-eta-bar-bg">
                        <div
                          className="fleet-eta-bar-fill"
                          style={{
                            width: `${progressPct}%`,
                            background: u.status === "available"
                              ? "linear-gradient(90deg, #10b981, #0284c7)"
                              : "linear-gradient(90deg, #f59e0b, #ef4444)"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <a
                    href="#book"
                    className="btn-select-service"
                    style={{ textAlign: "center", display: "block" }}
                    onClick={() => {
                      if (onSelectService) {
                        onSelectService(u.service);
                      }
                    }}
                  >
                    {u.status === "available" ? "Request This Unit" : "Standby Queue"}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
