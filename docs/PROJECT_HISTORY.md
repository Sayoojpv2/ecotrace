# Project history (reconstructed Nov 2026)

Each entry is tagged:
**[V]** verified from a file, a git commit or a timestamp ·
**[I]** reasonable inference ·
**[?]** unknown.

File dates are filesystem modification times. They can be changed by copying, so treat day-level precision as approximate.

## Phase 0: E-waste hardware idea (mid-Nov 2025)

- **[V]** 17–20 Nov 2025: a set of PDFs in `C:\suii` (`ewaste*.pdf`, `finalewaste.pdf`, `e_waste_business_guide_v2.pdf`). They describe an **AI "Smart E-Waste Scanner"** that identifies devices, checks batteries, sorts items and computes refurbish, recycling, EPR and carbon "credits". The text style shows they are exported chatbot answers ("Here is your…", "If you want, I can…").
- **[I]** This is the precursor idea. The hardware, ML and physical-collection parts were later dropped.

## Phase 1: Compliance + credit-exchange idea (24 Nov – 6 Dec 2025)

- **[V]** 24 Nov: `elawyer.pdf` and `elawyerhalf.pdf`. The idea shifts to "Environmental Compliance, Proof & Credit Exchange Platform": document environmental actions for NAAC, NIRF, NABH, PCB, ISO and ESG, connect institutions to licensed recyclers, calculate and "store" credits, and take brokerage on credit trades.
- **[V]** 25–27 Nov: research in `C:\suii\compilance`. It includes a 50-row "sector credit menu" CSV with INR estimates, a 20-row EPR generator list CSV, carbon-eligibility and EPR-classification PDFs, an action plan (`credits.pdf`), a pitch playbook (`50%.pdf`) and a step plan (`steps.pdf`). The step plan says to **start with colleges in Kochi**, use your own college as a pilot, find 5 authorised recyclers, and run one real pickup before building any platform.
- **[V]** 2 Dec: a CodeSandbox React prototype (`react-ae6hg672.zip`, 1,124-line `App.js`), plus a different variant saved as `Documents\suii\ecompilance.txt`. It contains a marketing site with EPR and carbon pages, NAAC criteria screens and a "Waste Flow Tracker". It is UI only. The prototype is branded **"EcoNexus"**, an earlier name; the name "EcoTrace" first appears on 6 Dec.
- **[V]** 3 Dec: `pitch desk.pdf` is a **blank** KSUM / IEDC "Idea Fest" sample pitch template, and `pitchcompetitions.pdf` is research on the Kerala funding ecosystem (KSUM grants, YIP, IEDC, TiE).
- **[V]** 6 Dec: `C:\suii\EcoTrace.pdf` is the first document named **EcoTrace**. It covers the problem statement, segments, a revenue model (SaaS + verification fees + a credit-marketplace commission) and a "credit boom" market slide that cites a Grand View Research page reached through ChatGPT.
- **[?]** Whether EcoTrace was actually pitched at Idea Fest or elsewhere, and with what result. No evidence was found.

## Phase 2: Next.js + Supabase build (4–17 Feb 2026), the foundation of this repo

- **[V]** 4 Feb: `~/ecotrace-web` Next.js 16 scaffold with Supabase email/password auth (Supabase project "A"). Not a git repo.
- **[V]** 4–5 Feb: `C:\EcoTrace` (the original working copy). It holds a vanilla HTML/JS prototype (`index.html`, `logic.js` with a hard-coded Supabase anon key), 10 reference mockup PNGs (activity, admin, document vault, institution dashboard, login, reports, signup, timeline, waste handler, waste pickup), a written platform spec (`summary.txt`) and two `password.txt` files (**not opened**).
- **[V]** Git history (`Sayoojpv2/ecotrace`, created on GitHub 7 Feb):
  - `4078e0a` 2026-02-06, Sayooj: "Day 3 Complete: Handler App & Docs"
  - `eea42f8` 2026-02-07, Sayooj: "latest change" (admin dashboard, create, documents, reports)
  - `cbcd7ad` 2026-02-07, **Muhad**: "Completed App" (profile page)
  - `9c51c34` 2026-02-07, Muhad: "Fix TypeScript layout error"
  - `2d853e1` 2026-02-11, Sayooj: "Final cleanup for production" (activities, credits, timeline, big handler rewrite)
  - `a53ae65` 2026-02-11, Sayooj: "Final polish: Fixed PDF reports and profile editing". **This is the last pushed commit.**
- **[V]** 12–17 Feb: **uncommitted** edits in both `~/ecotrace` and `C:\EcoTrace` (identical content). They include the "two pillars" landing page, vault folders built from verified pickups, handler-dashboard changes and report changes. These edits removed `ProfileView` but kept the code that renders it, which is a bug fixed in this recovery. They are carried into this repo uncommitted.
- **[V]** 18–20 Feb: strategy docs in `C:\et`. `metrics..txt` is a verification framework (4 domains × 5 verification layers, plus a verification-strength score from 1 to 5). The two PDFs describe a **5-stage institutional engagement**: assessment and gap report → monthly monitoring → inspection readiness → certification and accreditation documentation → environmental credits.

## Phase 3: Pivot experiment to "Compliance OS for Recyclers" (22–24 Feb 2026)

- **[V]** 22 Feb, Antigravity session `020a5fb5` / `56cf8d61`: the marketing site `~/ecotrace-website` (Vite multi-page app). It was first built as a dark eco-branded site, then rewritten the same day as an "industrial clean" **Compliance Operating System for Recyclers**. Its pages cover recyclers, PROs/consultants, how it works, features and a knowledge centre. The task list says "Ensure absence of environmental activism keywords". The contact form is front-end only.
- **[V]** 22 Feb, session `f7606641`: a React/Vite/TS **recycler dashboard** in `~/et`. A Supabase schema was written (facilities, pickups, processing_logs, documents with RLS). The walkthrough claims "real authentication" was integrated.
- **[V]** 23 Feb, session `777af52f`: the plan moved all data to **localStorage**. It added document upload as base64, a customer pickup-request portal with a QR code, and an admin panel behind a "secret" URL with a hard-coded admin password. The shipped code says "All dashboard data is persisted here instead of Supabase". Supabase is a dependency but never imported.
- **[V]** 23 Feb 14:42: `C:\EcoTrace.zip` (0.83 GB), a full backup of `C:\EcoTrace`, including `node_modules`, `.env.local` and the password files.
- **[V]** 24 Feb: `Sayoojpv2/Ecotrace2` created on GitHub with 2 commits (`b8934ec` "Initial commit", `a09749b` "fix: resolve TypeScript build errors"). `~/et` is identical to GitHub.
- **[V]** No EcoTrace file is newer than 24 Feb 2026, apart from copies.

## After abandonment

- **[V]** 10 Aug 2026: `C:\EcoTrace`, `C:\et` and `C:\suii` have folder dates of 10 Aug 2026 while their files keep Nov 2025 – Feb 2026 dates. **[I]** They were copied or restored there on that day.
- **[V]** The GitHub account was renamed from `Sayooj2275` to `Sayoojpv2`. Local remotes still use the old name and GitHub redirects them.

## Why there are two codebases

**[V]/[I]** `ecotrace` (Next.js) is the **institution** product: pickups verified by a handler OTP, an evidence vault, and a credit-readiness teaser. `Ecotrace2` (Vite) is a 2-day experiment, generated with Antigravity, that re-targeted EcoTrace at **recycling facilities** (inward/processing/dispatch logs, licence-expiry alerts, inspection files). It was built as a fast front-end demo with browser storage. It was not a rewrite of the Next.js app and shares no code with it. **[?]** Why the pivot was attempted. A plausible reason, given the marketing copy, is that recyclers have hard regulatory pain (EPR portal, CTO renewals) while institutions have softer pain. That is an inference only.
