# EcoTrace

**Status: recovered student prototype (dormant since Feb 2026). Not production-ready. Not in use by any customer.**

EcoTrace is a web platform prototype for **institutions** (colleges, schools, hospitals, offices) to keep
time-stamped, verifiable records of environmental activities, starting with **waste pickups confirmed by
a waste handler using a one-time code (OTP)**, and to keep those records in a form that could later
support compliance reporting and, eventually, environmental-credit work.

> EcoTrace does **not** issue carbon or EPR credits, is **not** approved or recognised by any regulator,
> and does **not** certify institutions. Earlier drafts said otherwise in places; see
> [docs/FEASIBILITY.md](docs/FEASIBILITY.md).

This repository is the single consolidated home for all recovered EcoTrace work (Nov 2025 – Feb 2026).
See [docs/RECOVERY_INVENTORY.md](docs/RECOVERY_INVENTORY.md) for where everything came from.

## What works today (verified in the Nov 2026 recovery)

- `npm ci` and the webpack production build (`npm run build:webpack`) both succeed: 18 app routes.
- The production server serves every route. The landing, login and signup pages render.
- The admin page now redirects signed-out visitors to `/login`.
- Nothing was tested against a real Supabase database: the schema is not in the repo and the live
  project was not touched. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Roles and main flows (from the code)

| Role | Pages | What they do |
|---|---|---|
| Institution | `/dashboard/*` | Broadcast a waste-pickup request, get a 4-digit OTP, log campus events, view a timeline, a document vault, and print a monthly report. |
| Waste handler | `/handler/*` | See open pickup requests, accept a job, verify it with the institution's OTP plus a photo, weight and segregation rating, and upload own documents. |
| Admin | `/admin/dashboard` | Platform stats, master activity log, delete records. |

"Credit Readiness" (`/dashboard/credits`) is an informational "Coming soon" page. No credit logic exists.

## Setup

Requirements: Node.js ≥ 20.9 (tested with Node 24.22.2 LTS) and a Supabase project.

```bash
npm ci
```

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The original database schema
was never saved in code. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) has a schema **inferred** from the
code. [supabase/proposed/](supabase/proposed/) has a **draft, unapplied** hardening script.

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

**Windows note:** if the project sits in a very deep folder, the default Turbopack build can fail with
"path length … exceeds max length of filesystem". Move the project to a short path such as
`C:\Users\<you>\Projects\EcoTrace`, or use `npm run build:webpack`.

**Lint status:** `npm run lint` currently reports 8 errors and 22 warnings. These are React-compiler
pattern rules and hygiene warnings, not runtime failures. They are listed in [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md#lint).

## Repository layout

```
app/                 Next.js App Router application (the canonical EcoTrace app)
docs/                Product, history, architecture, security, feasibility, roadmap
supabase/proposed/   Draft SQL (NOT applied anywhere) for RLS / role hardening
research/            Recovered research notes and datasets (with provenance and caveats)
archive/             Earlier codebases and prototypes kept for reference (not built)
```

## Documentation

- [Product brief](docs/PRODUCT_BRIEF.md)
- [Project history](docs/PROJECT_HISTORY.md)
- [Architecture & inferred schema](docs/ARCHITECTURE.md)
- [Data catalog](docs/DATA_CATALOG.md)
- [Recovery inventory](docs/RECOVERY_INVENTORY.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Feasibility (India / Kerala, Nov 2026)](docs/FEASIBILITY.md)
- [Decisions & roadmap](docs/DECISIONS_AND_ROADMAP.md)

## Tests

There is no automated test suite yet. Verification so far is lint, production build and a route smoke test
(see [docs/PRE_COMMIT_AUDIT.md](docs/PRE_COMMIT_AUDIT.md)).

## Contributors (from git history)

- Sayooj (`Sayoojpv2`, previously `Sayooj2275`): most commits.
- Muhad: two commits on 2026-02-07 ("Completed App", "Fix TypeScript layout error").
