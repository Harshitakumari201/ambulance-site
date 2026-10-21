export type ServiceType = "bls" | "als" | "transport" | "neonatal";
export type UnitStatus = "available" | "en_route" | "busy";

export interface Service {
  id: ServiceType;
  name: string;
  summary: string;
  crew: string;
  typical_use: string;
}

export interface Unit {
  id: string;
  service: ServiceType;
  status: UnitStatus;
  base: string;
  eta_minutes: number;
}

export interface RequestPayload {
  patient_name: string;
  phone: string;
  pickup_address: string;
  destination?: string;
  service: ServiceType;
  notes?: string;
}

export interface RequestRecord extends RequestPayload {
  reference: string;
  unit_id: string;
  eta_minutes: number;
  status: "dispatched" | "queued";
  created_at: string;
}
