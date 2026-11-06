# Decisions and roadmap

## Decisions made in the Nov 2026 recovery

| ID | Decision | Why |
|---|---|---|
| D1 | **Foundation = the Next.js app (`Sayoojpv2/ecotrace`) plus its uncommitted Feb 12–17 edits.** | It is the only version with real auth, a database and storage, multi-role flows (institution, handler, admin), and the institution focus of both pillars. It is also the most worked-on (6 commits, 2 contributors). Ecotrace2 is a 2-day, localStorage-only, AI-generated demo with plaintext passwords. Merging it would add a second router, a second CSS system and fake auth. |
| D2 | **Ecotrace2, the marketing site and the prototypes are archived, not merged.** | They are kept for their ideas (recycler data model, document expiry alerts, jsPDF reports, QR customer pickup, marketing copy). Port ideas deliberately later. |
| D3 | Git history of `ecotrace` preserved. Work is on branch `recovery/consolidation-2026-11`. **Nothing committed or pushed.** | Your instruction. |
| D4 | Research copied with provenance. AI-generated numbers are labelled unverified. The blank KSUM template and large mockup PNGs are not copied. | Accuracy, licensing, repo size. |
| D5 | Only straightforward, verified bugs fixed (F1–F7 in SECURITY_REVIEW). Database and security design issues are documented, not changed. | No live-service changes. No redesign before the app is understood. |

| D6 | (6 Nov 2026, your instruction) The single official repo stays **`Sayoojpv2/ecotrace`** (created 7 Feb 2026). The recovery branch is merged into `main` with a non-destructive merge commit, with no force-push or history rewrite. `Ecotrace2` is made private and archived, not deleted. | Preserve the original identity and history. |

## Decisions you still need to make

1. Whether `Sayoojpv2/ecotrace` should stay **public**. It contains no secrets, but it does include research notes.
2. Optionally delete the `recovery/consolidation-2026-11` branch on GitHub after review. It is fully merged.
3. **Supabase:** open the project behind `~/ecotrace/.env.local`. Check whether it still exists or is
   paused, whether it holds real data, and export the schema, RLS and functions into `supabase/` so the
   repo becomes reproducible.
4. **Positioning:** institutions (bulk-generator compliance, recommended) versus recyclers (Feb pivot).
5. **Credits pillar:** remove it from public copy for now (recommended), or keep it as a clearly labelled
   long-term vision.
6. **`handler_documents` shape** and the **pickup lifecycle** (`open/accepted/collected` vs `draft/submitted/locked`).
7. **Local clean-up** of password files, the stray home-folder `package.json`, and duplicate copies (see RECOVERY_INVENTORY).

## Realistic first MVP: "Campus Waste Compliance Binder" (Kerala colleges)

**Customer validation first. No new features until at least 5 college conversations are done.**

Scope (built mostly from what exists):
1. **Waste-stream register:** for each stream (wet, dry, e-waste, hazardous/lab, biomedical if any),
   record who takes it (Haritha Karma Sena, a recycler, on-site composting), the agreement and the
   frequency. *New, small.*
2. **Handover log with evidence:** date, stream, quantity, counterparty, receipt or certificate photo,
   and optionally the counterparty's confirmation by OTP. *Reuses the activities, OTP and photo flows,
   after hardening.*
3. **On-site processing log:** composting and biogas entries. *Reuses campus_events/activities.*
4. **Document vault with expiry reminders:** consents, recycler authorisations, agreements, EBWGR
   certificate if applicable. *Vault exists. Port the expiry-alert logic from the archived Ecotrace2 `store.ts`.*
5. **Annual evidence pack:** a PDF or print export of all of the above for a chosen period. *Reports exist.*

Out of scope: credits, marketplace, NAAC scoring, IoT/meters, recycler ERP.

## Prioritised roadmap

**P0: Make it safe (about 1–2 weeks)**
- Export the live schema into `supabase/migrations`. Apply the ideas in `supabase/proposed/001_hardening_DRAFT.sql`
  on a **new staging project** first. Fix role assignment (S1, S2), RLS per role (S3), server-side OTP (S4),
  private buckets with signed URLs (S5).
- Add `middleware.ts` or server checks for `/admin` and `/handler` routes.
- Add a shared `lib/supabase` client, then fix the 24 lint errors.

**P1: Validate (2–4 weeks, mostly not code)**
- Interview 5–10 Kerala colleges (IQAC coordinator, estate officer) and 1–2 local bodies about SWM-2026 and
  EBWGR in practice. Ask about Haritha Mithram records. Talk to Green Worms or a local recycler as a possible partner.
- Offer a paid or free **manual** "waste compliance gap check" (the Stage 1 idea from your Feb 2026 plan).
- Use your college's IEDC for KSUM Idea Grant eligibility. Confirm the current amounts on the official KSUM site.

**P2: Build the MVP scope above (4–6 weeks)** only if P1 shows real demand.
Clean up the duplicate pickup paths and the `handler_documents` shape. Remove or relabel the credits page.

**P3: Pilot (1 semester)** with 1–3 campuses. Add a privacy notice and consent (DPDP), backups, and an
export. Measure whether records were actually used in an inspection or accreditation.

**Later, only with evidence:** recycler module (from the archive), meter integrations, partnering with an
accredited project developer on carbon.
