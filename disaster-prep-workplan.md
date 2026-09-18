# Local Disaster Preparedness System — Workplan

**Stack:** Python (FastAPI) + React | **Scope:** Full build (8 modules) | **Audience:** Local officials + responders

---

## Phase 0 — Foundation (Week 1)

| Task | Deliverable | Notes |
|---|---|---|
| Define requirements & data model | ERD doc | Households, Centers, Resources, Incidents, EvacuationAssignments, Users/Roles |
| Repo setup (monorepo) | `backend/`, `frontend/` folders | Git init, README, .gitignore |
| Backend scaffold | FastAPI app + SQLAlchemy models | PostgreSQL via SQLAlchemy + Alembic migrations |
| Frontend scaffold | Vite + React + TypeScript + Tailwind | React Router, basic layout shell |
| Auth + RBAC | JWT login, roles: admin / responder / viewer | FastAPI OAuth2 password flow; role middleware |
| CI baseline | GitHub Actions workflow | lint + tests on push |

**Exit criteria:** app boots, user can log in, a health endpoint returns 200.

---

## Phase 1 — Core CRUD Modules (Weeks 2–4)

| Module | Backend | Frontend | Key fields |
|---|---|---|---|
| Households | CRUD API, import CSV/GeoJSON | Table + create/edit modal | size, address, lat/lng, vulnerable members (elderly, PWD, children), contact |
| Evacuation Centers | CRUD API | List + detail view | capacity, current occupants, facilities (kitchen, water, power), lat/lng |
| Resources | CRUD API + stock transactions | Dashboard list + adjust stock | type (rice, water, medicine, blankets), unit, qty on hand, threshold, expiry |
| Incidents | CRUD API, status workflow | Create/report + detail page | type (flood, fire, earthquake, landslide), barangay, severity, status, timestamps |

**Shared pieces:** pagination, sorting, search, form validation, toast notifications.

**Exit criteria:** all four entities fully CRUD-able by an admin from the UI.

---

## Phase 2 — Analytics & Map (Weeks 5–6)

| Module | Details |
|---|---|
| Resource dashboard | Aggregate by type; available vs. required (thresholds set per resource); low-stock alerts; simple bar/line charts (Chart.js/Recharts) |
| Map view | Leaflet + OpenStreetMap; layers: households, centers, incident zones (GeoJSON); click-to-detail popups; incident zone polygons colored by severity |
| Role-gated views | Responders see/edit incidents; viewers read-only |

**Exit criteria:** map renders all three layers from live API data; dashboard computes available vs. required correctly.

---

## Phase 3 — Algorithms & Simulation (Weeks 7–8)

| Module | Details |
|---|---|
| Evacuation allocation algorithm | Input: affected households (by barangay/zone). Compute per-center capacity − occupants; assign households to nearest center with room; handle overflow (multiple centers, overflow list). Output: assignments + coverage gaps |
| Allocation API + UI | Endpoint `/api/evacuations/allocate`; UI shows assignment plan, per-center load %, gaps report |
| Scenario simulator | "What if flood affects Barangay X?" — select barangay + estimated affected households → run allocation → show projected center loads, resource shortfalls, suggested extra resource needs |

**Exit criteria:** a scenario run produces a report showing center loads, overflow counts, and resource gaps.

---

## Phase 4 — Hardening & Polish (Weeks 9–10)

- Tests: pytest (API + allocation algorithm), Vitest/React Testing Library (frontend)
- Data seeding script (realistic barangay data) + demo login
- Backups, Alembic migrations for schema changes
- Deployment: Docker Compose (API + Postgres + Nginx serving React build)
- Documentation: README, API reference, deployment guide

**Exit criteria:** full test suite green; `docker compose up` runs the whole system; seed script creates a demo ready to show.

---

## Nice-to-haves (backlog)

- Real-time updates via WebSockets (occupancy changes push to dashboard)
- SMS/email alert notifications for low stock and new incidents
- Offline/mobile-friendly PWA for responders in the field
- Import/export full data dumps; PDF incident reports
- Public read-only portal for residents

---

## Suggested file structure

```
backend/
  app/
    main.py
    core/           # config, security, deps
    models/         # SQLAlchemy models
    schemas/        # Pydantic schemas
    api/            # routers (households, centers, resources, incidents, evacuations, auth)
    services/       # allocation algorithm, simulator, analytics
  tests/
  alembic/
frontend/
  src/
    components/     # shared UI
    features/       # per-module pages + hooks
    api/            # API client
    pages/
  package.json
```

---

## Suggested build order rationale

1. **Foundations first** — auth/RBAC gates everything, so it must exist before feature modules.
2. **CRUD before analytics** — dashboards and map are only as good as the data entry layer.
3. **Allocation after map** — the algorithm consumes geodata/locations, so the data model must be settled.
4. **Hardening last** — tests and deployment wrap a working system rather than blocking it.

---

## Estimated effort

- Full-time solo: ~8–10 weeks
- Two-person team (1 backend, 1 frontend): ~5–6 weeks
- Trimming to MVP (households, centers, incidents, dashboard): ~4 weeks