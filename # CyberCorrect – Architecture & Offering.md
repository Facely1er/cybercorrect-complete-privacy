# CyberCorrect – Architecture & Offering Boundaries

This document defines:
- What CyberCorrect actually offers in v1.
- How those offerings map to the three builds in this monorepo.
- What "done" means for a feature before it is marketed as live.

If a feature is not implemented according to this document, it belongs in the roadmap, not in the product claims.

---

## 0. Shared Database Architecture

**Important:** CyberCorrect shares the same Supabase database instance with CyberCaution and CyberSoluce. This shared database architecture requires:

- **Schema Prefixing**: All CyberCorrect tables use the `cc_privacy_` prefix to avoid naming conflicts
  - Example: `cc_privacy_consent_records`, `cc_privacy_dpias`, `cc_privacy_vendor_assessments`
- **Row-Level Security (RLS)**: All tables implement RLS policies for user-based access control and data isolation
- **Shared Authentication**: Uses the same `auth.users` table as other ERMITS products
- **Migration Coordination**: Database migrations must be coordinated to avoid conflicts with other products

**Database Connection:**
- All three apps (framework-compliance, privacy-portal, marketing-site) connect to the same Supabase instance
- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) point to the shared database
- See `ENV_SETUP_GUIDE.md` for connection setup instructions

---

## 1. Monorepo Structure & Responsibilities

We have **three builds**:

- `apps/frameworks` → **Platform / Engine**
- `apps/portal`     → **Self-service CyberCorrect App (product UI)**
- `apps/website`    → **Public marketing site**

### 1.1 `apps/frameworks` – CyberCorrect Platform (Engine)

Responsible for:

- **Tenancy & Org Model**
  - Organizations, users, roles, plans.
  - Row-level security and isolation.

- **Privacy Data Model**
  - `processing_activities` (RoPA)
  - `data_subject_requests` (DSAR)
  - `dpia_assessments`
  - `incidents` / `breach_events`
  - `evidence_records` (notes, attachments, logs)

- **Business Logic & Rules**
  - RoPA CRUD and validation.
  - DSAR lifecycle and SLA/deadline calculation per regulation.
  - DPIA scoring and mitigation tracking.
  - Breach notification decision logic (yes/no and by when).
  - Regulation applicability logic (which rules apply to which org).

- **Exports & Evidence**
  - RoPA export (CSV/PDF).
  - DSAR register export.
  - DPIA report export.
  - Incident/breach log export.
  - Audit/evidence pack assembly.

**Rule:**  
No CyberCorrect “offering” is considered real unless there is a corresponding **data model and service layer** in `apps/frameworks`.

---

### 1.2 `apps/portal` – CyberCorrect Self-Service App

Responsible for **user-facing workflows** built on top of the platform:

- **Authentication & Tenant Context**
  - Login / signup / org selection.
  - Enforcing access only to tenant-specific data exposed by `frameworks`.

- **Feature Workflows**
  - RoPA / Data Mapping UI:
    - List, create, edit, delete processing activities.
    - Use the platform services for all persistence.
    - Trigger exports from the platform.
  - DSAR Manager UI:
    - Intake forms, list views, filters.
    - Status changes (open → in_progress → completed).
    - Deadline and SLA visibility.
  - DPIA UI:
    - Start DPIA from a processing activity.
    - Fill structured questionnaires.
    - Display scores and mitigation status.
  - Incident / Breach UI:
    - Log incidents.
    - Display decision tree outputs (notify / don’t notify, by when).
    - Show evidence timeline and status.

- **Evidence & Exports UX**
  - Buttons and navigation to download RoPA, DSAR registers, DPIA reports, and incident logs.
  - Clear indication that exports come from the platform, not client-side hacks.

**Rule:**  
`apps/portal` owns UX and flow. It **must not** re-implement core business rules that already belong in `apps/frameworks`.

---

### 1.3 `apps/website` – Marketing Site

Responsible for:

- Positioning the product.
- Explaining **what CyberCorrect does** and **for whom**.
- Presenting pricing and plans.
- Routing to the portal:
  - “Log in”
  - “Start free trial”
- Legal pages (Privacy Policy, Terms, etc.).

**Critical Rule:**  
`apps/website` must **only claim as “available now”** what is actually implemented in **both**:
- `apps/frameworks` (data + logic), and
- `apps/portal` (UI + workflows).

Anything not built end-to-end must be labeled as:
- “Coming soon” or
- “Roadmap / Advanced module”.

No exceptions.

---

## 2. CyberCorrect Core Offerings (v1)

CyberCorrect v1 is defined around **four core offerings**. These are the only things that can be sold as “live” in the first release.

1. **RoPA / GDPR Data Mapper**
2. **Privacy Rights (DSAR) Manager**
3. **DPIA Generator & Manager**
4. **Privacy Incident / Breach Manager**
5. *(Optional but recommended)* **Evidence & Audit Pack**

Anything beyond this (consent management, advanced analytics, regulatory intel, etc.) is **Phase 2+**.

---

## 3. Offering → Build Mapping

For each core offering, this table defines which build does what:

| Offering                          | `apps/frameworks` (Platform)                                  | `apps/portal` (Self-service)                                  | `apps/website` (Marketing)                         |
|-----------------------------------|----------------------------------------------------------------|-----------------------------------------------------------------|----------------------------------------------------|
| RoPA / GDPR Data Mapper          | Tables, validation, CRUD services, export logic               | Wizard UI, list views, filters, export buttons                 | Sales copy, feature description, CTA to portal     |
| Privacy Rights (DSAR) Manager    | DSAR model, lifecycle, SLA rules, evidence log, exports       | DSAR intake & management screens, status transitions UI        | High-level DSAR capability explanation             |
| DPIA Generator & Manager         | DPIA model, questions, scoring, mitigation, exports           | DPIA UI (start, answer, review, approve)                       | DPIA feature description and value proposition     |
| Privacy Incident / Breach Manager| Incident model, notification rules, timelines, exports        | Incident log UI, decision tree visualization, evidence view    | Breach readiness explanation                       |
| Evidence & Audit Pack            | Evidence aggregation, export pack builder                     | Download triggers, audit pack download UX                      | “Audit-ready evidence” positioning                 |

---

## 4. Definition of “Done” for CyberCorrect v1

A core feature is **done** only when the following are true:

### 4.1 In `apps/frameworks` (Platform)

- A schema exists for the feature’s primary entities.
- CRUD operations are implemented and tested.
- Business rules are enforced server-side (validation, deadlines, scoring).
- Export(s) are implemented (CSV and/or PDF) and tested on real data.

### 4.2 In `apps/portal` (Self-service)

- There is a usable UI flow that:
  - Creates data via platform services.
  - Lists and fetches existing records.
  - Updates and deletes where applicable.
- Error paths are handled (no unhandled promise rejections or blank screens).
- Export buttons call the platform and successfully download real files.

### 4.3 In `apps/website` (Marketing)

- The feature is described accurately and is not oversold.
- If the implementation is partial, the site labels it as:
  - “Beta”, or
  - “Coming soon”.

If any of the above is missing, the feature is **not done** and must not be marketed as available.

---

## 5. Implementation Guardrails (for future work & automation)

Use these guardrails when adding new features or letting AI tools modify the repo:

1. **No new “offering” without platform + portal coverage**
   - A feature is not allowed to exist only as a UI concept or only as a table.

2. **No business logic in the website**
   - `apps/website` must not call Supabase or other platform services.

3. **Keep business logic out of portal**
   - When in doubt, push rules into `apps/frameworks` and consume them from `apps/portal`.

4. **Exports are mandatory for compliance features**
   - RoPA, DSAR, DPIA, and incidents must all have export paths before being called complete.

5. **Roadmap honesty**
   - Features without full platform + portal coverage must be explicitly tagged as roadmap/beta and not silently treated as finished.

---

## 6. Minimal v1 Ship Checklist

CyberCorrect v1 can be called “Complete Privacy Compliance” only if:

- [ ] RoPA:
  - Platform: storage + rules + export.
  - Portal: full create/edit/list/export flow.
- [ ] DSAR:
  - Platform: DSAR model + SLA + export.
  - Portal: intake, status transitions, evidence notes, export.
- [ ] DPIA:
  - Platform: assessment model + scoring + export.
  - Portal: start, complete, view, export.
- [ ] Incidents:
  - Platform: incident model + notification rules + export.
  - Portal: log, decision UI, status, export.
- [ ] Evidence:
  - Platform: evidence records and audit pack builder.
  - Portal: download path for audit pack.
- [ ] Website:
  - Claims are limited to the features that pass all checks above.

If any box is unchecked, v1 is **not** ready to be marketed as “complete”.

---
