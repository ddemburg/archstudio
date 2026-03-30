# ArchStudio — QA Progress Report
Generated: 2026-03-30 | Sentry Run 1

---

## Section A: Bugs

### 🔴 CRITICAL

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A1 | **`<Av>` component called with wrong prop signature in `PartnersPage`** | `index.html` ~line 2993 | `<Av name={p.name} size={44} color={p.color}/>` — but `Av` expects `{u, size}` where `u` is the full user object. Renders blank/broken initials for all team members on the Partners page. Fix: `<Av u={{name:p.name, color:p.color}} size={44}/>` |

### 🟠 HIGH

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A2 | **`PartnersPage` empty-state calls `nav('appsettings')` — nav is not a function** | `index.html` ~line 3012 | `nav` is an object `{toProject, toDashboard, ...}` passed as prop, not a function. Clicking "הוסף דרך הגדרות" in empty state throws `TypeError: nav is not a function`. Fix: `nav.toSettings()` (which also needs to be added to nav obj — currently only has `toProject, toDashboard, toReports, toCRM, toTasks, toSettings`) |
| A3 | **Missing `@keyframes pulse` — DriveBanner syncing dot doesn't animate** | `index.html` ~line 3992 | CSS uses `animation:'pulse 1s infinite'` but only `@keyframes fadeIn` and `@keyframes readyPulse` are defined. The syncing dot is visually static. Fix: Add `@keyframes pulse` or reference existing `readyPulse` |
| A4 | **`BookingPage` confirmed view shows incorrect end-time for non-60-min durations** | `index.html` ~line 584 | `fmtTH(chosen.hour+(chosen.duration/60|0))` drops the minutes remainder. For a 90-min meeting starting at 14:00, it shows end as `15:00` instead of `15:30`. Same pattern used in slot list correctly (`fmtTH(h+Math.floor(d/60), d%60)`) but not in the confirmation screen. |

### 🟡 MEDIUM

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A5 | **`_sbRefreshSession` doesn't lowercase email** | `index.html` ~line 210 | `_sbUserEmail = data.user?.email \|\| ''` — missing `.toLowerCase()`. All other session paths normalize email. Could cause case mismatch if refresh token fires. |
| A6 | **`partners` (derived/computed) in auto-save `useEffect` dependency array** | `index.html` ~line 1216 | `partners` is computed from `officeMembers` inside `useApp` on every render — including it in the effect deps causes unnecessary auto-save timer restarts. Should be `officeMembers` instead. |
| A7 | **Task file upload shows misleading `alert()`** | `index.html` ~line 1547 | `alert('העלאת קבצים תהיה זמינה עם חיבור לשרת')` — the app already has Supabase Storage (`sbUploadFile`). This dead code confuses users. Should either wire up the real upload or remove the zone. |
| A8 | **`autoBackup` references unset `_gAccessToken`** | `index.html` ~line 1181 | PKCE flow stores `provider_token` as `_calToken` only. `_gAccessToken` remains `''` permanently. Auto-backup to Google Drive silently fails on every call. (Supabase backup still works.) |

### 🟢 LOW

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A9 | **Stale first `<style>` block with table/Arial styles** | `index.html` line 11 | The first `<style>` tag (`body{font-family:Arial,sans-serif;...}table{...}th{background:#3D7A5A...}`) is overridden by the second `<style>` block. It's dead CSS but adds ~200 bytes and includes a hardcoded green that would override table styles if tables were ever used. |
| A10 | **`FlowView` SVG height calculation edge case** | `index.html` ~line 1672 | `Math.max(...colNodes.map(...))` — if `cols` contains an empty column (tasks removed), `reduce` over empty array returns `PAD`, but the pattern is safe. No crash, but layout could clip. Low risk. |

---

## Section B: UI Gaps vs branding.md

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| B1 | **No glassmorphism on cards/panels** — all use flat `background:white` | High | ⬜ |
| B2 | **Primary buttons don't use gold glass style** — use `#1A1A1A` or `#3D7A5A` | High | ⬜ |
| B3 | **Sidebar active state wrong** — uses green `rgba(61,122,90,.25)` + `#A8D5BA` instead of gold glass + gold-300 text + left gold border | High | ⬜ |
| B4 | **No CSS custom properties defined** — `:root` has only 4 vars (`--green`, `--gold`, `--red`, `--border`, `--text2`); full branding palette not available | Medium | ⬜ |
| B5 | **Hardcoded font sizes** — no `clamp()` fluid typography anywhere | Medium | ⬜ |
| B6 | **Status badges don't use branding semantic colors** — use arbitrary blues/ambers/greens instead of `--color-success`, `--color-info`, etc. | Medium | ⬜ |
| B7 | **Modals use flat white background** — should use elevated glass card from branding | Medium | ⬜ |
| B8 | **No `fadeSlideUp` animation** — app uses `fadeIn` (Y=4px), branding specifies `fadeSlideUp` (Y=8px) with `.animate-appear` | Low | ⬜ |
| B9 | **Font stack mismatch** — body uses `Heebo` (good for Hebrew), not `Inter/Segoe UI`. Heebo is appropriate but Inter should be added as fallback for numeric data | Low | ⬜ |
| B10 | **Inputs/dropdowns lack gold focus ring** — plain `outline:none` with no focus style | Low | ⬜ |

---

## Section C: Feature Gaps (from CLAUDE.md)

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| C1 | **גוש/חלקה/מגרש fields in project settings** | High | ⬜ |
| C2 | **Required document marking** | Medium | ⬜ |
| C3 | **Convert task to subtask** | Medium | ⬜ |
| C4 | **Document expiry tracking** | Low | ⬜ |
| C5 | **Hebrew status names** (internal statuses are English, display is Hebrew — acceptable as-is) | Low | ⬜ |

---

## Section D: Performance

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| D1 | **`partners` in auto-save effect deps** (see A6) — causes extra timer restarts | Medium | ⬜ |
| D2 | **`FlowView` recomputes full layout on every render** — no `useMemo` for SVG layout | Low | ⬜ |

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High     | 4 (incl. 1 UI) |
| Medium   | 9 |
| Low      | 8 |
| **Total** | **22** |

---

## Run Status

| Run | Status | Description |
|-----|--------|-------------|
| Run 1 | ✅ Complete | QA audit — 22 issues catalogued |
| Run 2 | ⬜ Pending | Fix Critical + High bugs |
| Run 3 | ⬜ Pending | UI upgrade — glass/color system |
| Run 4 | ⬜ Pending | Typography + polish |
| Final | ⬜ Pending | Daily report |
