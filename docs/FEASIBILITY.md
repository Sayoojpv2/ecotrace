# Feasibility: India, with Kerala first (assessed 6 Nov 2026)

Research was limited to a handful of web searches. Many sources are secondary (news, consultancy blogs).
**Every regulatory point below must be checked against the official notification before you rely on it.**
No market-size figures are given here. The numbers in the Dec 2025 deck were not verified.

## Verdict: **worth exploring only with a major repositioning**

The core problem still exists, and in 2026 it gained new regulatory teeth. But the original framing,
"institutions will earn environmental credits", is not realistic. In Kerala, the pickup-verification
feature overlaps with a state-run system. The viable version is narrower: **compliance evidence for
institutional bulk waste generators**, sold service-first, with credits dropped from the pitch.

## 1. Does the problem still exist?

Yes, and the obligations got sharper:

- **Solid Waste Management Rules, 2026** replaced the 2016 rules and took effect on **1 April 2026**,
  according to several secondary sources. **Bulk waste generators** are buildings of 20,000 m² or more,
  sites using 40,000 L/day of water, or generators of 100 kg/day of waste or more. They explicitly include
  **educational institutions** and government departments. They must process wet waste on site, or
  obtain an **Extended Bulk Waste Generator Responsibility (EBWGR) certificate**. A central online portal
  will track generation, collection and disposal. Pollution control boards can levy environmental
  compensation. (Drishti, Vision IAS, South Goa district, India CSR. The issuing authority for the
  certificate varies between sources.)
- **E-Waste (Management) Rules, 2022** (in force April 2023): bulk consumers must hand e-waste only to
  registered producers, refurbishers or recyclers. Several analyses say the older record-keeping and
  annual-return duty for bulk consumers was **dropped**. So proof of handover is the institution's own
  defence, not a filing.
- **EPR data integrity is a real, documented problem.** CPCB and state boards found hundreds of
  thousands of fake plastic EPR certificates (reports range from 6 to 7 lakh). Audits and penalties
  followed, according to CPCB filings to the NGT. But this pain sits with **producers (PIBOs) and
  recyclers on the CPCB portal**, not with colleges.
- **NAAC is mid-reform:** binary accreditation followed by Maturity-Based Graded Levels. Its status and
  manuals are inconsistently reported. Do **not** build NAAC-specific scoring until the new manuals are
  confirmed.

## 2. Who genuinely needs it, and who would pay? (hypotheses to test)

| Segment | Need | Who pays | Confidence |
|---|---|---|---|
| Colleges/universities that qualify as bulk generators (large Kerala campuses) | Show SWM-2026 compliance: on-site composting logs, handover receipts, e-waste to registered recyclers, consents and agreements in one place. Reuse the same evidence for accreditation | Management or IQAC budget | **Medium.** The need is plausible, but willingness to pay is untested |
| Hostels, hotels, malls, hospitals (bulk generators) | Same compliance evidence | Facility managers | Medium–low. Hospitals already work with biomedical-waste (CBWTF) systems |
| Recyclers/dismantlers (the Feb 2026 pivot) | CPCB portal records, stock registers, licence expiry | Recycler owners | Medium need, but dominated by incumbents (below) |
| Institutions wanting "credits" | — | — | **Low.** See section 4 |

**No customer conversation, pilot or letter of intent was found in your files.** Every row above is a hypothesis.

## 3. Alternatives and competitors (examples found, not exhaustive)

- **Haritha Mithram (Kerala government, built by Keltron)**: QR codes on houses **and institutions**.
  Haritha Karma Sena workers scan them and log each collection. It has GPS vehicle tracking and complaints.
  It is run by Haritha Keralam Mission with Suchitwa Mission, Clean Kerala Company and LSGD. **This
  directly overlaps EcoTrace's OTP pickup handshake for non-biodegradable waste in Kerala.** Position
  EcoTrace as the institution's own evidence binder that records Haritha Mithram / HKS handovers,
  not as a rival collection system.
- **Recykal** (EPR fulfilment for 650+ brands, by its own claim, with recycler network and
  traceability) and **ReCircle** (EPR programme, ClimaOne software): strong on the producer/recycler side.
- **Green Worms** (Kozhikode): a waste-collection and recycling operator in Kerala that works with
  Kudumbashree groups. It could be a **partner** (the handler side) rather than a competitor.
- **Green-audit and NAAC consultants**: what colleges currently pay for. They are the real substitute.
- **Excel, WhatsApp and paper files**: the default, and free.

## 4. Is environmental-credit enablement realistic for an early-stage startup?

**Not as originally pitched.**
- **Carbon:** India's CCTS offset mechanism has a detailed procedure and a small set of approved
  methodologies (PIB, March 2025: renewable energy, green hydrogen, industrial energy efficiency,
  landfill methane recovery, mangrove afforestation and reforestation). Campus segregation and recycling do
  not obviously fit any of them. Projects need validation and verification by accredited bodies, which is
  costly at institution scale. Whether offset credits can be used for compliance was still unclear in the
  sources found.
- **EPR:** certificates are generated by **registered recyclers/processors on the CPCB portal** and bought
  by obligated producers. A college or waste generator does not earn EPR credits.
- A realistic long-term role is **data infrastructure** (clean, auditable records) that *could* support
  an accredited project developer later. It is not a revenue line for the next 2–3 years.

## 5. Risks

- **Regulatory:** rules are in flux (SWM 2026 rollout, NAAC reform, EPR portal changes). Claims of
  "compliance" or "approval" create legal exposure. Any copy must say EcoTrace is a record-keeping tool.
- **Commercial:** buyers are budget-constrained, slow to procure, and may see this as a "consultant's job".
  Kerala's government app reduces the need for a separate pickup app.
- **Operational:** verification needs handlers and HKS workers to use EcoTrace too, which is a two-sided
  adoption problem.
- **Technical/security:** see [SECURITY_REVIEW.md](SECURITY_REVIEW.md). The current RLS is unknown,
  evidence buckets are probably public, and role escalation is likely. These must be fixed before any real data.
- **Data protection:** DPDP Rules 2025 were notified in Nov 2025, with most data-fiduciary duties due around
  **May 2027**. Phone numbers, staff names and site photos are personal data.
- **Team:** two contributors appear in git (Sayooj, Muhad). Current team status is unknown.

## 6. Can a small MVP be built and tested? **Yes**, if it is narrow

See [DECISIONS_AND_ROADMAP.md](DECISIONS_AND_ROADMAP.md). About 70% of the plumbing exists (auth, roles,
uploads, timeline, reports). The work is mainly hardening security and re-pointing the data model at
SWM-2026 evidence.

## Biggest unanswered business questions

1. Will a Kerala college pay for this, and how much? Or will it only pay a consultant?
2. Which campuses actually meet the bulk-generator thresholds, and what are local bodies asking them for now?
3. In Kerala, who issues the EBWGR certificate, and what evidence do they accept?
4. Can institutions obtain their own Haritha Mithram collection records (receipts or export)?
5. Would NAAC peer teams or inspectors give any weight to EcoTrace records over a consultant's green-audit report?
6. Is the original Supabase project still alive, and does it contain any real user data?

## Sources (accessed 6 Nov 2026)

- [Drishti IAS: SWM Rules 2026](https://www.drishtiias.com/daily-updates/daily-news-analysis/solid-waste-management-swm-rules-2026)
- [Vision IAS: SWM Rules 2026 effective 1 April 2026](https://visionias.in/current-affairs/news-today/2026-03-31/environment/solid-waste-management-swm-rules-2026-to-come-into-effect-from-1st-april-2026)
- [South Goa district: SWM Rules 2026](https://southgoa.nic.in/solid-waste-management-rules-2026/)
- [India CSR: on-site composting for bulk generators](https://indiacsr.in/solid-waste-management-rules-2026-bulk-waste-generators/)
- [PIB: Offset mechanism procedure and methodologies (Mar 2025)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2116421&reg=3&lang=2)
- [ICAP: CCTS emission-intensity targets](https://icapcarbonaction.com/en/news/india-notifies-emission-intensity-targets-nine-sectors-under-carbon-credit-trading-scheme)
- [Wood Mackenzie: India offset methodologies](https://www.woodmac.com/press-releases/india-carbon-announcement/)
- [Clean India Journal: Haritha Mitram app](https://cleanindiajournal.com/haritha-mitram-app-for-smart-garbage-tracking)
- [Onmanorama: Kerala waste survey with Harithamithram](https://www.onmanorama.com/news/kerala/2024/12/25/kerala-waste-management-survey.html)
- [Down To Earth: CSE report on fake EPR certificates](https://www.downtoearth.org.in/waste/70k-fake-certificates-major-polluters-missing-misuse-of-epr-legislation-worsening-indias-plastic-problem-shows-cse-report)
- [CPCB compliance report to NGT, OA 993/2024](https://www.greentribunal.gov.in/sites/default/files/news_updates/COMPLIANCE%20REPORT%20BY%20CPCB%20IN%20OA%20NO.%20993%20of%202024%20News%20Item%20titled%20PACKAGEWhere%20has%20the%20plastic%20wastedisappeared%20appearing%20in%20TheTImes%20of%20India%20dated%2030-07-2024.pdf)
- [Mondaq: E-Waste Rules 2022](https://www.mondaq.com/india/waste-management/1374872/the-e-waste-management-rules-2022)
- [Lakshmikumaran & Sridharan: E-waste Rules 2022 analysis](https://www.lkslaw.com/insights/articles/e-waste-management-rules-2022-an-analysis)
- [Careers360: NAAC binary and maturity-based accreditation](https://news.careers360.com/naac-revamps-accreditation-process-will-implement-maturity-based-grading-current-grades-until-april-may-2025)
- [Recykal EPR](https://recykal.com/epr) · [ReCircle profile](https://discover.give.do/18RT/recircle/)
- [YourStory: Green Worms](https://yourstory.com/2018/01/120-employees-5-districts-rs-2-5-cr-annual-turnover-kozhikode-based-green-worms-turning-trash-money/) · [Upaya: Green Worms investment](https://www.upayasv.org/blog/2021/9/29/upaya-and-s3idf-invest-in-green-worms)
- [KSUM Innovation Grant](https://sites.google.com/startupmission.in/innovationgrant/home) · [KSUM IEDC Idea Fest](https://sites.google.com/startupmission.in/iedc/schemes/idea-fest)
- [PIB: DPDP Rules 2025](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf) · [AZB & Partners: DPDP phased rollout](https://www.azbpartners.com/bank/indias-digital-personal-data-protection-act-phased-rollout-and-key-compliance-milestones/)
