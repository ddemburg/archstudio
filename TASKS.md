# ArchStudio — Open Tasks

_Last updated by Sentry Run 5 (Final) — 2026-03-28_

---

## Carry-over from Sentry Batch 2026-03-28

### Medium Priority

| ID | Task | Context |
|----|------|---------|
| C1 / A7 | **Wire real file upload in ClientPortal** | `simulateUpload` is a placeholder (setTimeout + fake status). `sbUploadFile` exists but is not called. Requires a Supabase storage bucket `client-files` with RLS policies set up. Ready-to-use code snippet in DAILY-REPORT.md § "Code Ready for VS Code". |
| B8 | **Fix RTL arrow direction in ClientPortal upload CTA** | `← לחץ להעלאה` uses left-arrow in an RTL context where the gesture is visually ambiguous. Replace with `↑` or remove the arrow. |

### Low Priority

| ID | Task | Context |
|----|------|---------|
| A9 | **Debounce `copy()` in MeetingScheduler** | Rapid clicks fire multiple `clipboard.writeText` calls. Add `useRef` guard — code snippet in DAILY-REPORT.md. |
| A10 | **Cleanup `setSaved` timer on unmount in TaskModal** | `setTimeout(() => setSaved(false), 2000)` has no cleanup; fires on unmounted component. Code snippet in DAILY-REPORT.md. |

---

## Next Batch Suggestions (from Sentry)

1. Wire real Supabase file upload in ClientPortal (unblocks clients, highest user impact)
2. Style inputs & dropdowns with glass background + gold focus ring (completes branding.md item #7)
3. Timer cleanup for A9 + A10 (prevents React unmount warnings)
