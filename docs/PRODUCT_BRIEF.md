# Product brief

Sources: `research/2025-12_problem-statement/EcoTrace.pdf`, `research/2026-02_strategy/*`, the app code,
and the archived marketing site. See [PROJECT_HISTORY.md](PROJECT_HISTORY.md) for dates.
Statements are marked **[V]** verified in files, **[I]** inference, **[?]** unknown.

## One line

**[V]** A record-keeping and verification platform that helps institutions prove their environmental
practices (starting with waste disposal) with time-stamped, third-party-confirmed evidence. The records are
kept so they could later support accreditation, inspections and environmental-credit applications.

## The two pillars, as you remembered them

| Pillar | What the documents claimed | What the code actually does |
|---|---|---|
| 1. Compliance & Evidence | Auto-generated compliance reports, time-stamped timelines, a secure document vault, inspection-ready files. Aligned to NAAC, NIRF, NABH, ISO and ESG. | Pickup requests with OTP handshake verification by a handler, a photo, a weight and a segregation rating. Campus-event logging with a photo. Timeline. A vault folder of verified-pickup proofs. A printable monthly report (`window.print`). **No** regulator-specific formats, **no** NAAC criterion mapping, **no** expiry alerts in this app. |
| 2. Environmental Credit Enablement | "Credit-ready data". Later: EPR credit workflows, carbon MRV baselines, and a credit marketplace taking a trading commission. | An informational page plus a "Notify me" button that only changes local state and saves nothing. **No** credit calculation, issuance, registry link or marketplace. The landing-page disclaimer correctly says EcoTrace does not issue credits. |

## Problem it set out to solve [V]

Institutions do environmental work (waste segregation, recycling, solar, composting, events), but their
evidence is scattered across paper, WhatsApp and Excel. Paperwork is compiled in a rush before NAAC or
other audits and inspections. Waste handover to recyclers is often undocumented. Separately, the founder
believed EPR and carbon credit markets would reward organisations that held multi-year verified data.

## Intended users and customers [V], with inferred payers [I]

- **Primary users:** institution admins and staff (the college IQAC or sustainability coordinator, estate
  office, security staff for pickups), and **waste handlers** or recyclers who confirm pickups.
- **Intended paying customers:** colleges and universities first (NAAC and NIRF were the hooks), then
  schools, hospitals (NABH and biomedical waste) and corporates (ESG).
- **Second segment (Feb 22–24 pivot experiment):** recycling facilities and dismantlers, plus PROs and
  compliance consultants. See `archive/marketing-site-vite` and `archive/ecotrace2-vite-recycler-demo`.
- **[?]** No evidence of any customer conversation, pilot, letter of intent or revenue was found.

## Intended workflow [V] (from `platform-spec-summary.txt` and the code)

1. The institution signs up and its profile is created with a role.
2. The institution logs an activity or a pickup request (category, weight, description). An OTP is generated.
3. Handlers see open, unexpired requests, accept one, travel to the site, and enter the OTP, weight,
   rating and photo. The `verify_pickup_full` RPC marks the pickup verified.
4. The verified record appears in the institution's timeline, vault and monthly report.
5. An admin oversees everything and is meant to be read-only. **The code actually lets the admin delete records.**

The spec described a stricter lifecycle (`draft → submitted → locked`). **The implemented lifecycle is
`open → accepted → collected`**, and the admin page still queries the old `submitted` and `locked` statuses.

## Business model (original plan) [V]

From `EcoTrace.pdf`: SaaS subscriptions for institutions and operators, certification and verification
fees, EPR credit-generation commissions, carbon-issuance facilitation fees, and marketplace trading fees.
From `ecotrace_institution_stages_long.pdf`: a service-led model, with a paid assessment and gap report
first, then a monthly operations subscription, then inspection support, then accreditation documentation,
then credits in year 2 and beyond.

**[I]** The service-led staged version from Feb 2026 is the more realistic of the two. See [FEASIBILITY.md](FEASIBILITY.md).

## What EcoTrace is not

It is not a regulator, an accreditation body, a credit registry, an approved verifier or a marketplace.
It holds no government approval. Any future public copy must say so.
