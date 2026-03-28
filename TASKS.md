# ArchStudio — Open Tasks

_Last updated by Sentry Batch 3 Final — 2026-03-28_

---

## High Priority

| ID | Task | Context |
|----|------|---------|
| H5 | **Fix Google Drive auto-backup auth** | `_gAccessToken` is always empty string; backup silently fails every time. Requires OAuth token refresh flow to be wired into the Google Drive backup path. |

---

## Medium Priority

| ID | Task | Context |
|----|------|---------|
| M6 / F3 | **Wire real file upload in ClientPortal** | `simulateUpload` is a placeholder. H6 auth token is now fixed. Next step: create `client-files` bucket in Supabase Storage with RLS, then use the `realUpload` snippet in DAILY-REPORT.md. |

---

## Low Priority

| ID | Task | Context |
|----|------|---------|
| F2 | **Unify `partners` and `office_members` data model** | Two overlapping sources of truth for team members. Architectural refactor — plan carefully before touching. |

---

## Fixed in Batch 3 (2026-03-28)

| ID | Fix | Run |
|----|-----|-----|
| H6 | `sbUploadFile` now uses session access token instead of `SUPABASE_ANON` | Run 2 |
| M3 | Removed duplicate `<style>` block from `<head>` | Run 2 |
| M4 | Removed literal single-quotes from Hebrew CRM strings | Run 2 |
| M5 | Replaced unmapped Tailwind class names on Dashboard buttons with inline styles | Run 2 |
| B8 | Fixed RTL arrow direction in ClientPortal upload CTA | Run 2 |
| U8 | Fixed login footer — now reads "Supabase" instead of "Google Drive" | Run 2 |
| A9 | Debounced `copy()` in MeetingScheduler with `useRef` guard | Run 2 |
| A10 | Added `useEffect` cleanup for `setSaved` timer in TaskModal | Run 2 |
| Glass I/TA/SE | Glass inputs, textareas, selects with gold focus rings | Run 3 |
| Dark cards | Project cards, AllTasksPage rows, TaskModal, Milestones, Docs, Reqs, Approvals, LogTab | Run 3 |
| U6/fluid type | `var(--text-*)` applied across 7 component groups | Run 4 |
| U9/@keyframes | Missing `@keyframes spin` definition added — login spinner works | Run 4 |
| U7/micro | `.hc` hover class, sidebar transitions, modal/login button transitions | Run 4 |

---

## Next Batch Suggestions (from Sentry)

1. **Wire real file upload (M6/F3)** — H6 fixed. Set up Supabase `client-files` bucket + RLS policy, then integrate `realUpload` snippet from DAILY-REPORT.md.
2. **Fix Google Drive OAuth (H5)** — Review existing Google auth flow, wire token refresh, store token in `_gAccessToken`.
3. **Unify `partners` / `office_members` (F2)** — Schema + migration plan first; then update PartnersPage, TaskModal, LogTab.
