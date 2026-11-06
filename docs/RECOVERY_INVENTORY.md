# Recovery inventory (scan of 6 Nov 2026)

**Searched:** `C:\` root folders, `C:\Users\acer` (Desktop, Documents, Downloads, Pictures, Videos,
OneDrive, home-level project folders), `.gemini\antigravity` and `antigravity-backup`. Only drive `C:`
exists. Skipped: Windows and Program Files, AppData caches, `node_modules`, `.next`, and the unrelated
MATLAB, OMNeT++, FPGA and WSN projects.
**Searched for:** filenames and contents matching ecotrace / eco-trace / eco_trace, EPR, carbon credit,
e-waste, compliance, KSPCB/CPCB, BRSR, Haritha, Suchitwa, waste handler, Supabase.
**Nothing original was moved, modified or deleted.** Copies in this repo are listed under "→ repo".

## Code

| Path | Type | Date | What it is | Relevance / status | → repo |
|---|---|---|---|---|---|
| `C:\Users\acer\ecotrace` | Next.js + git (`origin` Sayoojpv2/ecotrace) | 4–17 Feb 2026 | Main app. HEAD `a53ae65` = GitHub, **plus uncommitted edits (12–17 Feb)** | **Foundation.** Newest version | Cloned with history. Uncommitted edits applied as working changes |
| `C:\EcoTrace` | Same repo + extras | 4–17 Feb 2026 (folder copied 10 Aug) | Same app content as above. Extras: vanilla prototype, `summary.txt`, `refernce imgs\` (10 PNG, ~65 MB), `password.txt` ×2 | Duplicate app plus unique extras | Prototype → `archive/prototype-vanilla-js-2026-02-05` (key redacted). Spec → `research/2026-02_strategy/platform-spec-summary.txt`. PNGs **not copied** (size). Password files **not opened or copied** |
| `C:\EcoTrace.zip` | ZIP, 0.83 GB | 23 Feb 2026 | Full backup of `C:\EcoTrace`, including `node_modules`, `.env.local` and password files | Duplicate | — |
| `C:\Users\acer\ecotrace-web` | Next.js scaffold, no git | 4 Feb 2026 | create-next-app plus `/auth` page. Separate Supabase project | Superseded | `archive/ecotrace-web-scaffold-2026-02-04` |
| `C:\Users\acer\et` | React/Vite/TS + git (`origin` Sayoojpv2/Ecotrace2) | 22–24 Feb 2026 | Recycler dashboard demo. localStorage only | Reference. Identical to GitHub | `archive/ecotrace2-vite-recycler-demo` |
| `C:\Users\acer\ecotrace-website` | Vite multi-page static site, no git | 22 Feb 2026 | "Compliance OS for Recyclers" marketing site | Reference / positioning | `archive/marketing-site-vite` |
| `C:\suii\compilance\react-ae6hg672.zip` | CodeSandbox export | 2 Dec 2025 | First UI prototype | Historical | `archive/codesandbox-react-2025-12-02` |
| `C:\Users\acer\Documents\suii\ecompilance.txt` | React source saved as .txt | 2 Dec 2025 | A different variant of the prototype above | Historical | `…/src/App.variant-ecompilance-txt.js` |
| `C:\Users\acer\package.json` and `node_modules` | stray npm install | 5 Feb 2026 | Supabase and lucide installed in the home folder by mistake | Breaks Next.js root detection. Safe to delete **by you** | — |
| GitHub `Sayoojpv2/ecotrace` | public, 1 branch, 6 commits | 6–11 Feb 2026 | — | No secrets in history | — |
| GitHub `Sayoojpv2/Ecotrace2` | 1 branch, 2 commits | 24 Feb 2026 | Retired in Nov 2026: made private and archived (see PRE_COMMIT_AUDIT.md) | Contains a hard-coded demo admin password in history | Full source snapshot in `archive/ecotrace2-vite-recycler-demo` |

## AI-session records (Google Antigravity)

`C:\Users\acer\.gemini\antigravity\brain\<id>\` (also mirrored in `antigravity-backup`). These are the
task, plan and walkthrough files. → `archive/antigravity-session-notes/<id>/`.

| ID | Date | Content |
|---|---|---|
| `f7606641` | 22 Feb | Plan and walkthrough for the React recycler dashboard plus a Supabase schema |
| `020a5fb5` | 22 Feb | Marketing website build (screenshots stay in the original folder) |
| `56cf8d61` | 22 Feb | Website rewrite to "Compliance Operating System" |
| `777af52f` | 23 Feb | Feature expansion (localStorage, uploads, QR customer pickup, admin panel, design overhaul) |

`conversation_summaries.db` and `conversations\*.pb` hold more history in a binary format. They were not decoded.

## Research and documents

| Original path | Date | Type | Purpose | → repo |
|---|---|---|---|---|
| `C:\suii\ewaste*.pdf`, `finalewaste.pdf`, `e_waste_business_guide_v2.pdf`, `e_waste_image_based_small.pdf` | 17–20 Nov 2025 | Chatbot answers exported to PDF | E-waste scanner and credits idea (precursor) | `research/2025-11_ewaste-idea/` |
| `C:\suii\elawyer.pdf`, `elawyerhalf.pdf` | 24 Nov 2025 | Chatbot answers | "Compliance, proof & credit exchange" idea | same |
| `C:\suii\compilance\*.pdf` (7 files) | 25 Nov – 3 Dec 2025 | Chatbot answers and generated reports | Credit and EPR research, action plan, pitch playbook, Kerala funding ecosystem | `research/2025-11_compliance-and-credits/` |
| `C:\suii\compilance\*.csv` (3 files) | 25–26 Nov 2025 | CSV | See [DATA_CATALOG.md](DATA_CATALOG.md) | `…/datasets/` |
| `C:\suii\compilance\pitch desk.pdf` | 3 Dec 2025 | **Blank** KSUM / IEDC Idea Fest pitch template | Not EcoTrace content. Third-party template | not copied |
| `C:\suii\EcoTrace.pdf` | 6 Dec 2025 | Slides/report | First EcoTrace problem statement and business model | `research/2025-12_problem-statement/` |
| `C:\et\ecotrace,half,inst.pdf`, `ecotrace_environmental_management_stages.pdf` | 20 Feb 2026 | PDF | 5-stage institutional model | `research/2026-02_strategy/` (renamed) |
| `C:\et\metrics..txt` | 18 Feb 2026 | Chatbot answer | Verification framework | `research/2026-02_strategy/verification-framework-notes.txt` |
| `C:\EcoTrace\summary.txt` | 5 Feb 2026 | Text | Platform specification | `research/2026-02_strategy/platform-spec-summary.txt` |
| `C:\suii\projects\billboard.pdf` | 27 Nov 2025 | Chatbot answer | Unrelated side idea (air-purifying billboard) | not copied |

## Checked and not related to EcoTrace

`Downloads\swq_physical_parameter_manual_cpcb_ap_2021_2025.csv` (water quality, WSN project);
the `Desktop\LAPTOP_*` reports (these mention EcoTrace only as disk usage and were useful as a pointer);
Feb 2026 screenshots in `Pictures\Screenshots` (Vivado/FPGA); `C:\cat.txt`; `C:\certificates`; `C:\pic`;
`C:\project`; `C:\project papersss`; the `Downloads\Module 1.pdf` BRSR mention (course material).
OneDrive contains only default files.

## Duplicates and versions

- App: `~/ecotrace` ≡ `C:\EcoTrace` (app folder identical) ⊂ `C:\EcoTrace.zip`. GitHub `ecotrace` = HEAD minus the uncommitted edits.
- Vite demo: `~/et` ≡ GitHub `Ecotrace2`.
- Antigravity `brain` ≡ `antigravity-backup/brain` for the 4 EcoTrace sessions.
- `C:\suii\compilance\50-sector-credit-menu.csv` (50 rows) vs `…csv.csv` (99 rows, padded columns). These are two versions.

## Things you may want to clean up yourself (not done)

Delete or secure `C:\EcoTrace\password.txt` and `ecotrace password.txt`. Delete the stray
`C:\Users\acer\package.json`, `package-lock.json` and `node_modules`. After you confirm this repo, decide
whether to keep `C:\EcoTrace.zip` (0.83 GB) and the duplicate `C:\EcoTrace`.
