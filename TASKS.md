# ArchStudio — Open Tasks & Backlog

_Last updated by Sentry 2026-03-29_

---

## High Priority

| ID | Task | Notes |
|----|------|-------|
| NEXT-1 | **Dark-theme migration** — flip body bg to `#0f1318`, update all hardcoded dark text colors to light equivalents | Prerequisite for U1, U2, U4, U5 glass system |
| NEXT-2 | **File upload UI in TaskModal** (F1) — wire existing `sbUploadFile` to an `<input type="file">` in the task modal | Function exists, just needs UI wiring |

## Medium Priority

| ID | Task | Notes |
|----|------|-------|
| M3 | Fix `autoBackup` Drive auth — `_gAccessToken` always empty; use `_sbSession?.access_token` or disable gracefully | Auth-sensitive |
| M6 | Fix `sbUploadFile` auth — replace `SUPABASE_ANON` with `_sbSession?.access_token` | Auth-sensitive |
| L4 | Replace `window.prompt`/`window.confirm` with inline JSX UI — 4 locations in SettingsTab + TemplatesPage | UX + browser-compat |

## Low Priority

| ID | Task | Notes |
|----|------|-------|
| L2 | Sidebar user display name: show placeholder instead of raw email during session init | Minor flicker |
| L3 | BookingPage duration end-time off-by-one for 90-min slots | Edge case |

## Deferred (requires dark-theme migration first)

| ID | Task |
|----|------|
| U1 | Body background → dark steel `#0f1318` |
| U2 | Cards/panels → glassmorphism `rgba(26,32,48,0.75)` + `backdrop-filter:blur(12px)` |
| U4 | Modals → elevated glass card `rgba(35,43,62,0.88)` + `blur(20px)` |
| U5 | `SBadge` → semantic glass-tinted colors (dark bg needed) |
| F2 | Google Drive daily backup — resolve alongside M3 Drive auth fix |
