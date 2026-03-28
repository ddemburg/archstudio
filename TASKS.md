# ArchStudio — Open Tasks

_Last updated by Sentry Batch 2 Final — 2026-03-28_

---

## High Priority (from Batch 2 re-audit)

| ID | Task | Context |
|----|------|---------|
| H5 | **Fix Google Drive auto-backup auth** | `_gAccessToken` is always empty string; backup silently fails every time. Requires OAuth token refresh flow to be wired into the Google Drive backup path. |
| H6 | **Fix `sbUploadFile` auth token** | Uses `SUPABASE_ANON` constant as Bearer token — Supabase Storage RLS rejects uploads from non-anon users. Must use `supabase.auth.getSession()` access token. Prerequisite for M6/A7. |

---

## Medium Priority

| ID | Task | Context |
|----|------|---------|
| M3 | **Merge duplicate `<style>` blocks** | Two `<style>` blocks in `<head>`; first contains stale print CSS that may conflict. Merge into one block. |
| M4 | **Remove literal single-quotes from Hebrew CRM strings** | CRM form title and submit button render with surrounding `'` characters visible. Strip the wrapping quotes from the string literals. |
| M5 | **Replace unmapped Tailwind class names on Dashboard buttons** | "New project" and "Client Portal" buttons use Tailwind class names not in config. Replace with inline styles matching the branding design system. |
| M6 / A7 | **Wire real file upload in ClientPortal** | `simulateUpload` is a placeholder. Blocked on H6 fix + Supabase `client-files` bucket with RLS. Code snippet in DAILY-REPORT.md § "Code Ready for VS Code". |
| B8 | **Fix RTL arrow direction in ClientPortal upload CTA** | `← לחץ להעלאה` uses left-arrow in RTL context — ambiguous. Replace with `↑` or remove the arrow. |

---

## Low Priority

| ID | Task | Context |
|----|------|---------|
| U8 | **Fix login footer text** | Footer reads "data stored in Google Drive". Should say "data stored in Supabase". Simple text change. |
| F2 | **Unify `partners` and `office_members` data model** | Two overlapping sources of truth for team members. Architectural refactor — plan carefully before touching. |
| A9 | **Debounce `copy()` in MeetingScheduler** | Rapid clicks fire multiple `clipboard.writeText` calls. Add `useRef` guard — code snippet in DAILY-REPORT.md. |
| A10 | **Cleanup `setSaved` timer on unmount in TaskModal** | `setTimeout(() => setSaved(false), 2000)` has no cleanup; fires on unmounted component. Code snippet in DAILY-REPORT.md. |

---

## Next Batch Suggestions (from Sentry)

1. **Wire real file upload (H6 + M6/A7)** — Highest user impact. Set up Supabase `client-files` bucket + RLS, fix `sbUploadFile` auth, then drop in the code snippet from DAILY-REPORT.md.
2. **Style inputs & dropdowns** — Text inputs/selects still use browser defaults. Apply glass bg + gold focus ring to complete branding.md overhaul.
3. **Merge `<style>` blocks (M3) + fix CRM quotes (M4)** — Two quick housekeeping fixes that clean up the file structure.
