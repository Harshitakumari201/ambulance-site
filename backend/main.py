"""Ambulance service API.

Run:  uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs

Data is held in memory so the project runs with zero setup.
Swap `UNITS` / `REQUESTS` for a database (PostgreSQL + SQLAlchemy) for production.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from enum import Enum
from threading import Lock
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="Astha Ambulance Service API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Vercel frontend + localhost dev)
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------
class ServiceType(str, Enum):
    bls = "bls"
    als = "als"
    transport = "transport"
    neonatal = "neonatal"


class UnitStatus(str, Enum):
    available = "available"
    en_route = "en_route"
    busy = "busy"


class Service(BaseModel):
    id: ServiceType
    name: str
    summary: str
    crew: str
    typical_use: str


class Unit(BaseModel):
    id: str
    service: ServiceType
    status: UnitStatus
    base: str
    eta_minutes: int


class RequestIn(BaseModel):
    patient_name: str = Field(min_length=2, max_length=80)
    phone: str
    pickup_address: str = Field(min_length=5, max_length=200)
    destination: str | None = Field(default=None, max_length=200)
    service: ServiceType
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = re.sub(r"[\s\-()+]", "", v)
        if not digits.isdigit() or not 8 <= len(digits) <= 15:
            raise ValueError("Enter a valid phone number, 8 to 15 digits")
        return v.strip()


class RequestOut(RequestIn):
    reference: str
    unit_id: str
    eta_minutes: int
    status: str
    created_at: datetime


# ---------- Seed data ----------
SERVICES: list[Service] = [
    Service(
        id=ServiceType.bls,
        name="Basic life support",
        summary="Oxygen, bleeding control, splinting and monitored transfer to the nearest hospital.",
        crew="Driver + trained EMT",
        typical_use="Injuries, fainting, fever, breathing difficulty",
    ),
    Service(
        id=ServiceType.als,
        name="Advanced life support (ICU)",
        summary="Ventilator, cardiac monitor, defibrillator and IV medication on board.",
        crew="Driver + paramedic + EMT",
        typical_use="Chest pain, stroke, severe trauma, unconscious patient",
    ),
    Service(
        id=ServiceType.transport,
        name="Patient transport",
        summary="Scheduled, non-emergency transfers between home, hospitals and dialysis centres.",
        crew="Driver + attendant",
        typical_use="Discharge, check-ups, dialysis, inter-hospital transfer",
    ),
    Service(
        id=ServiceType.neonatal,
        name="Neonatal and maternity",
        summary="Incubator and warm-chain equipment for newborns, plus maternity-ready units.",
        crew="Driver + nurse + EMT",
        typical_use="Labour, premature birth, newborn transfer",
    ),
]

UNITS: list[Unit] = [
    Unit(id="Bolero-BLS-01", service=ServiceType.bls, status=UnitStatus.available, base="Main Station Hub", eta_minutes=7),
    Unit(id="Ecco-BLS-02", service=ServiceType.bls, status=UnitStatus.en_route, base="North City Base", eta_minutes=12),
    Unit(id="Force-ICU-03", service=ServiceType.als, status=UnitStatus.available, base="Central Hospital Depot", eta_minutes=8),
    Unit(id="Ventilator-04", service=ServiceType.als, status=UnitStatus.busy, base="East Station", eta_minutes=20),
    Unit(id="Van-Transport-05", service=ServiceType.transport, status=UnitStatus.available, base="City Health Center", eta_minutes=14),
    Unit(id="Force-Neo-06", service=ServiceType.neonatal, status=UnitStatus.available, base="Maternity Wing Base", eta_minutes=10),
]

REQUESTS: dict[str, RequestOut] = {}
_lock = Lock()


# ---------- Routes ----------
@app.get("/")
def root() -> dict[str, str]:
    """Root health-check for Vercel – confirms the API is live."""
    return {"status": "ok", "service": "Astha Ambulance Service API", "version": "1.0.0"}


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/services", response_model=list[Service])
def list_services() -> list[Service]:
    return SERVICES


@app.get("/api/fleet", response_model=list[Unit])
def fleet() -> list[Unit]:
    return UNITS


@app.post("/api/requests", response_model=RequestOut, status_code=201)
def create_request(payload: RequestIn) -> RequestOut:
    with _lock:
        candidates = sorted(
            (u for u in UNITS if u.service == payload.service and u.status == UnitStatus.available),
            key=lambda u: u.eta_minutes,
        )
        if candidates:
            unit = candidates[0]
            unit.status = UnitStatus.en_route
            eta, status = unit.eta_minutes, "dispatched"
        else:
            # No free unit of that type: queue on the nearest one of that type.
            same_type = sorted((u for u in UNITS if u.service == payload.service), key=lambda u: u.eta_minutes)
            if not same_type:
                raise HTTPException(503, "No unit of this type is in service. Call the emergency number.")
            unit = same_type[0]
            eta, status = unit.eta_minutes + 10, "queued"

        record = RequestOut(
            **payload.model_dump(),
            reference=f"REQ-{uuid4().hex[:8].upper()}",
            unit_id=unit.id,
            eta_minutes=eta,
            status=status,
            created_at=datetime.now(timezone.utc),
        )
        REQUESTS[record.reference] = record
        return record


@app.get("/api/requests/{reference}", response_model=RequestOut)
def get_request(reference: str) -> RequestOut:
    record = REQUESTS.get(reference.upper())
    if not record:
        raise HTTPException(404, "Request not found. Check the reference number.")
    return record
