# ArchStudio — QA Progress Report
Generated: 2026-03-30 | Updated: Sentry Run 4

---

## Section A: Bugs

### 🔴 CRITICAL

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A1 ✅ | **`<Av>` component called with wrong prop signature in `PartnersPage`** | `index.html` ~line 2993 | Fixed: `<Av u={{name:p.name,color:p.color,picture:p.picture}} size={44}/>` |

### 🟠 HIGH

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A2 ✅ | **`PartnersPage` empty-state calls `nav('appsettings')` — nav is not a function** | `index.html` ~line 3012 | Fixed: changed to `nav.toSettings()` — method already existed on nav object |
| A3 ✅ | **Missing `@keyframes pulse` — DriveBanner syncing dot doesn't animate** | `index.html` ~line 3992 | Fixed: Added `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}` to CSS |
| A4 ✅ | **`BookingPage` confirmed view shows incorrect end-time for non-60-min durations** | `index.html` ~line 584 | Fixed: `fmtTH(chosen.hour+Math.floor(chosen.duration/60),chosen.duration%60)` — now correctly shows e.g. 15:30 for 90-min from 14:00 |

### 🟡 MEDIUM

| # | Issue | Location | Details |
|---|-------|----------|---------|
| A5 | **`_sbRefreshSession` doesn't lowercase email** | `index.html` ~line 210 | `_sbUserEmail = data.user?.email \|\| ''` — missing `.toLowerCase()`. All other session paths normalize email. Could cause case mismatch if refresh token fires. ⚠️ In auth no-touch zone — skipped. |
| A6 ✅ | **`partners` (derived/computed) in auto-save `useEffect` dependency array** | `index.html` ~line 1220 | Fixed: replaced `partners` with `officeMembers` in deps — avoids spurious timer restarts. |
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
| B1 | **No glassmorphism on cards/panels** — all use flat `background:white` | High | ⬜ Skipped — applying dark glass to white-text-context cards would make text invisible; deferred to Run 4 / theme decision |
| B2 ✅ | **Primary buttons don't use gold glass style** — use `#1A1A1A` or `#3D7A5A` | High | Fixed: `Btn` primary variant → gold linear-gradient + `#c9983a` text + gold border |
| B3 ✅ | **Sidebar active state wrong** — uses green `rgba(61,122,90,.25)` + `#A8D5BA` instead of gold glass + gold-300 text + left gold border | High | Fixed: gold gradient bg + `#e0b255` text + `inset -3px 0 0 #c9983a` stripe (nav + project items) |
| B4 ✅ | **No CSS custom properties defined** — `:root` has only 4 vars | Medium | Fixed: Added full steel + gold + semantic palette to `:root` |
| B5 ✅ | **Hardcoded font sizes** — no `clamp()` fluid typography anywhere | Medium | Fixed: Added full fluid typography scale (`--text-xs` → `--text-3xl`) to `:root`. Applied to base components (I, TA, SE, Btn). |
| B6 ✅ | **Status badges don't use branding semantic colors** — use arbitrary blues/ambers/greens | Medium | Fixed: `STATUS_MAP` updated to use `--color-info/warning/success/steel` values |
| B7 ✅ | **Modals use flat white background** — should use elevated glass card from branding | Medium | Fixed: `rgba(255,255,255,0.93)` + `backdrop-filter:blur(20px)` + steel border + deeper shadow |
| B8 ✅ | **No `fadeSlideUp` animation** — app uses `fadeIn` (Y=4px), branding specifies `fadeSlideUp` (Y=8px) with `.animate-appear` | Low | Fixed: Added `@keyframes fadeSlideUp` + `.animate-appear` to CSS |
| B9 ✅ | **Font stack mismatch** — body uses `Heebo` (good for Hebrew), not `Inter/Segoe UI`. Heebo is appropriate but Inter should be added as fallback for numeric data | Low | Fixed: `body` now `'Heebo','Inter','Segoe UI',system-ui,-apple-system,sans-serif`. |
| B10 ✅ | **Inputs/dropdowns lack gold focus ring** — plain `outline:none` with no focus style | Low | Fixed: Added CSS `input:focus, textarea:focus, select:focus` rule with `border-color:var(--color-gold-400)` + 2px gold glow. |

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
| Run 2 | ✅ Complete | Critical+High fixes — 4 bugs fixed (A1 critical, A2/A3/A4 high) |
| Run 3 | ✅ Complete | UI upgrade — glass/color system (B2,B3,B4,B6,B7,B8 fixed; B1 deferred) |
| Run 4 | ✅ Complete | Typography + polish — fluid type vars, gold focus rings, Btn hover glow, A6 dep fix, B9/B10 resolved |
| Final | ✅ Complete | Daily report generated — DAILY-REPORT.md written |
