# ArchStudio — Daily Sentry Report
Date: 2026-03-30
Branch: sentry/2026-03-30

---

## Summary

| Category | Count |
|----------|-------|
| Bugs fixed | 5 (1 critical, 4 high/medium) |
| UI components upgraded | 8 |
| Features implemented | 0 |
| Remaining items | 9 (skipped/deferred) |

---

## Fixed Today

### Bugs (Section A)

| # | Problem | Solution |
|---|---------|---------|
| A1 ✅ | `<Av>` component called with wrong prop signature in `PartnersPage` — crash for any partner with a profile picture | Fixed: passed `u={{name,color,picture}}` object instead of bare props; matches `Av` component's expected shape |
| A2 ✅ | `PartnersPage` empty-state called `nav('appsettings')` — `nav` is an object, not a function; button was broken | Fixed: changed to `nav.toSettings()` — the method already existed on the nav object |
| A3 ✅ | Missing `@keyframes pulse` — DriveBanner syncing indicator dot rendered but never animated | Fixed: added `@keyframes pulse {0%,100%{opacity:1} 50%{opacity:.4}}` to CSS block |
| A4 ✅ | `BookingPage` confirmed view calculated end-time as `hour+1` regardless of duration, so a 90-min booking starting at 14:00 showed "15:00" instead of "15:30" | Fixed: `fmtTH(chosen.hour + Math.floor(chosen.duration/60), chosen.duration % 60)` |
| A6 ✅ | `partners` (derived value) in auto-save `useEffect` dependency array caused spurious timer restarts whenever any partner data changed | Fixed: replaced `partners` with its source `officeMembers` in deps array |

### UI Upgrades (Section B)

| # | Problem | Solution |
|---|---------|---------|
| B2 ✅ | Primary buttons used flat `#1A1A1A` / `#3D7A5A` fill — no branding gold | `Btn` primary variant: gold linear-gradient background, `#c9983a` text, gold border |
| B3 ✅ | Sidebar active state used green `rgba(61,122,90,.25)` + `#A8D5BA` — not aligned with branding | Gold gradient background + `#e0b255` text + `inset -3px 0 0 #c9983a` left-stripe accent (both nav items and project list items) |
| B4 ✅ | Only 4 CSS custom properties in `:root` — no consistent design token system | Added full steel + gold + semantic color palette to `:root` (20+ vars) |
| B5 ✅ | All font sizes were hardcoded px values — no fluid/responsive typography | Added complete fluid type scale (`--text-xs` through `--text-3xl`) using `clamp()` to `:root`; applied to base input/button components |
| B6 ✅ | Status badges used arbitrary ad-hoc colors — not consistent with branding semantic palette | `STATUS_MAP` updated to reference `--color-info`, `--color-warning`, `--color-success`, `--color-steel` CSS vars |
| B7 ✅ | Modals used flat `background:white` — no glass depth or visual elevation | Modal overlay content: `rgba(255,255,255,0.93)` + `backdrop-filter:blur(20px)` + steel border + elevated box-shadow |
| B8 ✅ | No `fadeSlideUp` animation — app used `fadeIn` (Y=4px only); branding specifies Y=8px `fadeSlideUp` | Added `@keyframes fadeSlideUp` + `.animate-appear` utility class |
| B9 ✅ | Font stack had `Heebo` only — no Inter fallback for numeric/Latin data | Body now: `'Heebo','Inter','Segoe UI',system-ui,-apple-system,sans-serif` |
| B10 ✅ | Inputs/dropdowns used `outline:none` with no visible focus style — accessibility gap | Added CSS rule for `input:focus, textarea:focus, select:focus`: gold `border-color` + 2px gold glow |

---

## Remaining Issues

### Skipped (Auth No-Touch Zone)
| # | Issue | Severity | Reason |
|---|-------|----------|--------|
| A5 | `_sbRefreshSession` doesn't lowercase email on token refresh | Medium | Inside auth no-touch zone — any change risks breaking live login flow |

### Deferred / Needs Manual Review
| # | Issue | Severity | Notes |
|---|-------|----------|-------|
| A7 | Task file upload shows `alert()` placeholder — Supabase Storage already available via `sbUploadFile` | Medium | Requires wiring UI to real upload endpoint; non-trivial; suggest feature branch |
| A8 | `autoBackup` references `_gAccessToken` which is always `''` in PKCE flow — Google Drive backup silently fails | Medium | PKCE stores `provider_token` as `_calToken`. Fix requires verifying Drive scope is requested and mapping correct token var |
| A9 | Stale first `<style>` block (Arial font, table styles) overridden by second block — dead CSS ~200 bytes | Low | Safe to remove but low value; defer |
| A10 | `FlowView` SVG height calculation edge case on empty columns | Low | No crash observed; low risk |
| B1 | Cards/panels still use flat `background:white` — no glassmorphism | High (deferred) | Applying dark glass to cards with dark text would make them unreadable — needs full theme audit to determine whether cards are on dark or light backgrounds before applying glass. Recommend dedicated design pass. |
| D2 | `FlowView` recomputes full SVG layout on every render — no `useMemo` | Low | Performance optimization — safe to defer |

### Feature Gaps (from CLAUDE.md)
| # | Feature | Priority |
|---|---------|----------|
| C1 | גוש/חלקה/מגרש fields in project settings | High |
| C2 | Required document marking | Medium |
| C3 | Convert task to subtask | Medium |
| C4 | Document expiry tracking | Low |

---

## Code Ready for VS Code

### A7 — Wire up real file upload (Task attachments)
**File:** `index.html` — search for `alert('העלאת קבצים תהיה זמינה עם חיבור לשרת')`

Replace the `alert()` call and its surrounding handler with a real upload using the existing `sbUploadFile` function. The function signature is already in the codebase — look for `sbUploadFile` to see its API.

### A8 — Fix Google Drive auto-backup token
**File:** `index.html` — search for `_gAccessToken`

The PKCE OAuth flow stores the provider token as `_calToken`. In `autoBackup`, replace references to `_gAccessToken` with `_calToken` after verifying that the Google Drive scope is included in the OAuth scopes requested at sign-in.

### B1 — Glassmorphism on cards (needs design decision)
Cards are currently `background:white`. To apply glass safely:
1. Confirm whether the card appears on a dark (steel) or light background
2. For dark backgrounds: `background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12);`
3. For light backgrounds: `background: rgba(255,255,255,0.72); backdrop-filter: blur(12px); border: 1px solid rgba(201,152,58,0.15);`

---

## Next Batch Recommendations

1. **B1 — Glassmorphism cards (High):** Conduct a visual audit of which cards sit on dark vs light backgrounds, then apply the appropriate glass recipe from branding.md. This is the single biggest remaining branding gap.

2. **C1 — Property fields (גוש/חלקה/מגרש):** Add the three cadastral fields to the project settings panel. High-priority user request from CLAUDE.md. Straightforward form addition.

3. **A7+A8 — Drive backup & file upload:** Wire `autoBackup` to use `_calToken` (PKCE-correct token) and connect the task attachment zone to `sbUploadFile`. Both are medium-complexity but would unlock real functionality currently silently broken.
