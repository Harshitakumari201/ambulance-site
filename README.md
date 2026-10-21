# Ambulance service website

React + TypeScript (Vite) frontend and a FastAPI backend.

## Run the backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. Vite proxies `/api` to port 8000.

## Customise
- Name, phone numbers and area: `frontend/src/config.ts`
- Services and fleet data: `backend/main.py` (`SERVICES`, `UNITS`)
- Colours and fonts: CSS variables at the top of `frontend/src/styles.css`

## Before going live
- Replace the in-memory store with a database (PostgreSQL + SQLAlchemy).
- Add authentication for a dispatcher dashboard and notify staff (SMS, WhatsApp or email) on each new request.
- Add rate limiting and CAPTCHA on `POST /api/requests`.
- Set `allow_origins` in `main.py` to your real domain.
