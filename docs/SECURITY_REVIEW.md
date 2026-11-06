# Security & code review (Nov 2026 recovery)

Scope: the code in this repo plus the archived codebases. The **live Supabase project, its RLS policies,
its storage policies and any deployment were not inspected or changed** (instruction: no changes to live
services). So every database-side item below is a **risk to verify**, not a confirmed vulnerability,
unless it is marked *confirmed in code*.

Severity: **Critical** · **High** · **Medium** · **Low**.

## Summary of fixes applied in this working copy (uncommitted)

| # | Fix | File |
|---|---|---|
| F1 | Added the missing `CheckCircle` import. The page crashed with a ReferenceError after a file was chosen. | `app/create-activity/page.js` |
| F2 | Restored the `ProfileView` component that the Feb-17 edit deleted. The "Edit Profile" nav item crashed the handler dashboard. The update now sends only `org_name`, `phone`, `city`, never `role`. | `app/handler/dashboard/page.js` |
| F3 | Moved the unused `components/page.js` (a sidebar) and `CreditsView.js` out of the route tree into `archive/nextjs-unused-components/`. `page.js` had turned a component into a public route, and that **broke `next build`** during type-checking. The route now returns 404. | `app/handler/dashboard/components/` |
| F4 | Added a client-side admin gate: redirect unless the user is signed in **and** `profiles.role === 'admin'`. Verified in the browser that a signed-out visitor lands on `/login`. This is a UI guard only. | `app/admin/dashboard/page.js` |
| F5 | Pinned the Next.js project root. A stray `C:\Users\acer\package-lock.json` made Next infer the wrong workspace root. | `next.config.ts` |
| F6 | Excluded `archive/` and `research/` from ESLint and TypeScript. | `eslint.config.mjs`, `tsconfig.json` |
| F7 | `.gitignore`: allows `.env.example`, blocks `*password*.txt` and key files. Added `.env.example`. | |
| F8 | Escaped 10 apostrophes and quotes in JSX text (`react/no-unescaped-entities`). Display is unchanged. | 5 files |
| F9 | Stripped trailing whitespace in changed `app/` files (`git diff --check` is clean outside `archive/` and `research/`). | `app/` |
| F10 | Added `.gitattributes` so PDFs and images are never line-ending-converted on Windows. Two PDFs had been detected as text. | `.gitattributes` |
| F11 | Redacted the hard-coded demo admin password in the archived Ecotrace2 copy. | `archive/ecotrace2-vite-recycler-demo/src/pages/AdminAutoLogin.tsx` |

## Findings that need your decision

### S1. Role self-assignment at signup. **Critical (likely)**
*Confirmed in code:* signup sends `role` inside `options.data` (user metadata), which anyone can set to
any string by calling Supabase Auth directly with the public anon key. *Inferred:* a DB trigger copies
that metadata into `profiles.role`. If the trigger does not allow-list `institution` and `handler`,
anyone can register as **`admin`**.
**Fix (needs DB change):** in the trigger, map only `institution` and `handler`, and default to
`institution`. Assign `admin` manually in SQL only. See `supabase/proposed/001_hardening_DRAFT.sql`.

### S2. Users may be able to change their own role. **Critical (likely)**
`profiles` is updated from the browser (profile pages). If the RLS update policy is "user can update own
row" with no column restriction, a user can `update({role:'admin'})` directly. *Before F2* the handler
profile wrote back the **entire** fetched row. **Fix:** revoke UPDATE on `role` from `authenticated`
(column privileges) or add a trigger that blocks role changes.

### S3. Admin and handler authorisation exist only in the browser. **High**
*Confirmed in code:* no middleware, server components or route handlers check roles. `/handler/*` checks
only that *someone* is signed in, and any institution user can open it. `/admin/dashboard` had **no
check at all** before F4. Real enforcement must come from RLS: for example, only `admin` can delete
`activities` and `waste_logs`, and only `handler` can update `activities.accepted_by`.

### S4. The OTP handshake may be bypassable. **High**
*Confirmed in code:* the institution's browser creates the OTP with `Math.random()` and stores it in
plain text in `waste_logs`. If handlers can `select` from `waste_logs` under RLS, they can read the OTP
and "verify" without visiting the site, which defeats the core trust claim. The client also inserts
`waste_logs` directly, and `/create-activity` inserts without an expiry. **Fix:** generate the OTP in a
`security definer` function, store a hash, allow no direct SELECT, add attempt limits and expiry.

### S5. Private evidence stored in public buckets. **High**
*Confirmed in code:* `verification_photos`, `handler_docs` and `documents` are all read with
`getPublicUrl()`. That only works if those buckets are **public**, which means anyone with or guessing a
URL can download licences, certificates and site photos. Paths are predictable (`<activity_id>_<ms>.jpg`,
`<user_id>/<ms>_<filename>`). `documents` also stores full public URLs in table rows.
**Fix:** make the buckets private, add storage RLS per owner and role, and switch to `createSignedUrl()`.
This needs data migration for stored URLs.

### S6. Handlers self-certify their own documents. **Medium**
*Confirmed in code:* handler uploads insert `status: 'Verified'`. No review step exists. Decide whether
documents should start as `pending` and who verifies them.

### S7. Job-accept race and unrestricted updates. **Medium**
`acceptJob` updates any activity by id with no `accepted_by IS NULL` guard in the query. Two handlers can
both "accept". After verification the client updates `photo_url` directly. Move both into RPCs.

### S8. Admin deletes contradict the "read-only, neutral admin" spec. **Medium**
`platform-spec-summary.txt` says admins cannot edit or alter verification results. The code lets them
hard-delete activities and logs. For an evidence product, prefer soft-delete plus an audit trail.

### S9. Schema inconsistencies (confirmed in code). **Medium**
- **`handler_docs` / `handler_documents`, the issue you remembered.** It still exists, but not as a typo.
  `handler_docs` is a **bucket** and `handler_documents` a **table**. The problem is that two pages write
  `handler_documents` with **different columns and different buckets**: `{name, type, status, file_path}`
  → `handler_docs` versus `{title, file_url}` → `documents`. Rows from one page show blank fields in the
  other. Decide on one shape and retire `/handler/documents` (the dashboard tab replaced it).
- Admin page queries `status` `submitted` and `locked` and orders by `date`. Current flows write
  `open`, `accepted` and `collected`, and only `/create-activity` writes `date`. As a result the admin stats
  for verified weight and pending count are always 0.
- Reports read `profiles.address`, which nothing writes.
- `institution_documents` table is no longer used.
- Two pickup-creation paths exist (`/dashboard/create` and the older `/create-activity`) with different
  fields.

### S10. Secrets and sensitive files on disk. **Medium (local)**
- `C:\EcoTrace\password.txt` and `C:\EcoTrace\ecotrace password.txt` (16 bytes each, **not opened**), also
  inside `C:\EcoTrace.zip`. If these are real passwords, rotate them and delete the files yourself.
- `.env.local` files (anon keys) exist in `~/ecotrace`, `~/ecotrace-web`, `C:\EcoTrace` and the zip.
  **None were ever committed to GitHub** (checked all history of both repos). Anon keys are designed to be
  public, but only if RLS is correct.
- `C:\EcoTrace\logic.js` has a hard-coded URL and anon key. It is untracked and redacted in `archive/`.
- **Public GitHub:** `Sayoojpv2/Ecotrace2` (commit `b8934ec`, `src/pages/AdminAutoLogin.tsx`, line 7) contains a
  hard-coded demo admin password and a "secret" admin URL. In that app it guards only localStorage demo
  data. It was public from 24 Feb 2026, so **treat it as exposed permanently**: making the repo private does
  not undo that. If you ever reused that password anywhere, change it there. It is redacted in this repo's archive.
- **History scan (6 Nov 2026):** no JWTs, Supabase URLs or keys, `service_role` keys, GitHub or AWS tokens
  or private keys in any commit of either repository, and no `.env` file was ever committed.

### S11. Archived Ecotrace2 demo is insecure by design. **Info**
Plaintext passwords in localStorage, client-only auth, an unprotected `/admin-panel` route, files as
base64 in localStorage. Fine as a UI mock-up, but never deploy it as a real product.

### S12. Personal data. **Info**
The app stores names, phone numbers, cities, and photos of sites and possibly people. India's DPDP Rules
2025 phase in, with most data-fiduciary duties due around **May 2027** (see FEASIBILITY.md sources).
Plan consent text, a privacy notice and deletion handling before any real pilot.

## Code-quality issues (not security)

- `ProfileView` and the other views in `handler/dashboard/page.js` are defined inside the component. The
  dashboard refreshes data every 30 s, which remounts them, so **unsaved profile edits can be lost**.
- 13 files each create their own Supabase client. Consolidate into `lib/supabase.js` when refactoring.
- `alert()` is used for all feedback, and there is no error UI.
- The "Notify me when credits open" button saves nothing.

## Lint

`npm run lint` → **8 errors, 22 warnings** (6 Nov 2026, after F1–F3 and F8; baseline for `app/` was 26 errors and 21 warnings).

| Rule | Count | Meaning |
|---|---|---|
| `react-hooks/immutability` | 5 E | Function used in `useEffect` before its declaration. Works at runtime, but flagged by React Compiler rules. |
| `react-hooks/purity` | 3 E | `Math.random()` or `Date.now()` during render (OTP and dates). |
| `no-unused-vars`, `exhaustive-deps`, `no-img-element` | 22 W | Hygiene. |

The remaining 8 errors need small restructuring of data-loading code and were left for the first refactor.
The OTP `Math.random()` ones go away when OTP generation moves server-side (S4).

## Not checked

The live RLS and storage policies, the `verify_pickup_full` function body, the auth settings (email
confirmation, rate limits), and whether any deployment exists. All need access to the Supabase dashboard.
