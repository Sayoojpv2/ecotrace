# Architecture

## Stack (verified from package.json)

- Next.js 16.1.6 (App Router), React 19.2.3, Tailwind CSS 4, lucide-react icons.
- `@supabase/supabase-js` 2.95: auth, Postgres, Storage and one RPC.
- All pages are **client components** (`'use client'`). There is no server code, no API routes, no
  middleware and no server-side auth checks. Every page creates its own Supabase client from
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Hosting: Vercel was intended (README boilerplate, memory). **[?]** No `.vercel` folder or deployment
  record was found, so it is unknown whether it was ever deployed.

**Consequence:** every access-control decision depends on Supabase Row Level Security (RLS) and storage
policies. Those live only in the Supabase project, which was **not** inspected (per instructions). See
[SECURITY_REVIEW.md](SECURITY_REVIEW.md).

## Routes

| Route | Role | Purpose |
|---|---|---|
| `/` | public | Landing page (two pillars, disclaimer) |
| `/login`, `/signup` | public | Email/password. Signup lets the user choose `institution` or `handler`. |
| `/dashboard` | institution | Stats, recent activity, OTP modal |
| `/dashboard/create` | institution | Broadcast a pickup request (expires in 60 min) and create an OTP |
| `/create-activity` | institution | Older pickup-with-evidence form (still routable) |
| `/dashboard/activities`, `/dashboard/activities/create` | institution | Campus events (`campus_events`) |
| `/dashboard/timeline` | institution | Chronological verified records |
| `/dashboard/documents` | institution | Vault: verified-pickup proofs and a "general" folder |
| `/dashboard/reports` | institution | Monthly report, printed via `window.print()` |
| `/dashboard/credits` | institution | Informational "coming soon" page |
| `/dashboard/profile` | institution | Edit org name, phone, city |
| `/handler/dashboard` | handler | Market, jobs, verification modal, history, reports, documents, credits, profile |
| `/handler/documents`, `/handler/documents/view/[id]` | handler | Older certificate pages (different bucket and columns; see below) |
| `/admin/dashboard` | admin | Stats, master log, delete |

## Data model: INFERRED from code (no schema file existed)

> The real schema, triggers, RLS policies and the `verify_pickup_full` function were never committed.
> The tables below list only the columns the code reads or writes. Verify against the Supabase dashboard
> (Table editor → Definition; Database → Functions; Storage → Policies) before relying on it.

**`profiles`**: `id` (= `auth.users.id`), `role` (`institution` | `handler` | `admin`), `org_name`, `phone`,
`city`, `overall_rating` (read by the handler market), `address` (read by reports; never written, so it may
not exist). **[I]** Rows are probably created by a trigger on `auth.users` that copies
`raw_user_meta_data` (org_name, city, phone, **role**). The client never inserts into `profiles`.

**`activities`**: `id`, `institution_id` → profiles (FK name `activities_institution_id_fkey`), `type`,
`weight`, `description`, `status` (`open` | `accepted` | `collected`; admin page expects `submitted` |
`locked`), `expires_at`, `created_at`, `accepted_by` (handler id), `photo_url` (storage path),
`collected_weight`, `segregation_rating`, plus `date`, `pickup_required` and `evidence_url` (written only by
`/create-activity`).

**`waste_logs`**: `activity_id` (unique, used for upsert), `otp_code` (4 digits, **plain text**), `verified`.

**`campus_events`**: `institution_id`, `title`, `event_date`, `participants`, `description`, `faculty_name`, `image_url`.

**`handler_documents`**: **two incompatible shapes are written**:
- `handler/dashboard`: `{user_id, name, type:'PDF', status:'Verified', file_path}` → bucket `handler_docs`
- `handler/documents`: `{user_id, title, file_url}` → bucket `documents`

**RPC `verify_pickup_full(p_activity_id, p_otp_input, p_rating, p_weight)`** returns a boolean.
**[I]** It checks the OTP against `waste_logs` and sets the activity to `collected` with weight and rating.

**Storage buckets:** `verification_photos`, `handler_docs`, `documents`. All are read with
`getPublicUrl()`, so they **must be public buckets** for the UI to work.

**Unused in the current code:** `institution_documents` (used before the Feb-17 edit).

## Supabase projects

Two different Supabase project URLs were found (compared by hash, values not copied):
- `~/ecotrace-web/.env.local`: the early scaffold (project "A").
- `~/ecotrace/.env.local` = `C:\EcoTrace\.env.local`: the main app (project "B").
The vanilla prototype `logic.js` hard-coded a URL and anon key. They are redacted in `archive/`.

## Archived codebases (not built)

- `archive/ecotrace2-vite-recycler-demo`: React 19 + Vite 7 + TS, react-router, recharts, jsPDF.
  **All data lives in browser localStorage.** Supabase is installed but not used. Useful parts: the
  facility data model (pickups, processing logs, document expiry alerts, reports with jsPDF) and the QR
  customer-pickup flow.
- `archive/marketing-site-vite`: static multi-page site. Contact form is front-end only.
- `archive/prototype-vanilla-js-2026-02-05`, `archive/ecotrace-web-scaffold-2026-02-04`,
  `archive/codesandbox-react-2025-12-02`: early prototypes.
