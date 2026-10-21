import type { RequestPayload, RequestRecord, Service, Unit } from "./types";

/**
 * In local dev Vite proxies /api → localhost:8000 so BASE_URL is empty.
 * In production (Vercel) set VITE_API_URL to the backend's deployed URL,
 * e.g. https://backend-five-green-95.vercel.app
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // FastAPI returns { detail: string } or { detail: [{ msg }] }
    const detail = body?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d: { msg: string }) => d.msg.replace(/^Value error, /, "")).join(". ")
      : detail ?? "Something went wrong. Call the emergency number if this is urgent.";
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  services: () => http<Service[]>("/api/services"),
  fleet: () => http<Unit[]>("/api/fleet"),
  createRequest: (payload: RequestPayload) =>
    http<RequestRecord>("/api/requests", { method: "POST", body: JSON.stringify(payload) }),
  getRequest: (reference: string) =>
    http<RequestRecord>(`/api/requests/${encodeURIComponent(reference)}`),
};

