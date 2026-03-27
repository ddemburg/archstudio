# ArchStudio — QA Progress Report
**Sentry Run 1 — 2026-03-27**

---

## Section A: Bugs

### Critical

| # | Issue | Location | Notes |
|---|-------|----------|-------|
| A1 | `filteredPartners` is used but never defined in `AllTasksPage` — throws `ReferenceError` when clicking any task row | `index.html:2856` | Should be `db.partners` |
| A2 | `<Av name={p.name} size={44} color={p.color}/>` — `Av` component accepts `u` prop (an object), not separate `name`/`color` props; avatar renders `?` for all partners with no picture | `index.html:2907` | Should be `<Av u={p} size={44}/>` |

### High

| # | Issue | Location | Notes |
|---|-------|----------|-------|
| A3 | Missing `@keyframes spin` CSS — loading spinner in `DriveLoginScreen` is invisible (element exists but doesn't spin) | `index.html:3937` | Need `@keyframes spin{to{transform:rotate(360deg)}}` |
| A4 | Missing `@keyframes pulse` CSS — save-state dot in `DriveBanner` doesn't pulse | `index.html:3906` | Need `@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}` |
| A5 | Tailwind CSS classes on two buttons in `Dashboard` render unstyled — no Tailwind CDN loaded | `index.html:2820,2840` | `"+ פרויקט חדש"` button and `"👁 פורטל לקוח"` button |
| A6 | `autoBackup()` always silently fails — uses `_gAccessToken` which is never populated in the current PKCE flow (only `_calToken` is saved from `provider_token`) | `index.html:1166` | Google Drive backup is dead code; `_gAccessToken` always `''` |

### Medium

| # | Issue | Location | Notes |
|---|-------|----------|-------|
| A7 | `partners` in auto-save `useEffect` dependency array — `partners` is a derived value recalculated each render, causing the auto-save timer to fire on every render even when actual data hasn't changed | `index.html:1202` | Remove `partners` from deps array |
| A8 | `.hc` CSS class used on project cards in `Dashboard` (for hover) but never defined in `<style>` | `index.html:2828` | Cards have no hover elevation effect |
| A9 | Google Calendar already integrated but `AppSettingsPage` still lists it as "בקרוב" (coming soon) in the integrations panel | `index.html:3866` | Misleading UX |
| A10 | `doChangeRole` always resets `assigned_projects` to `[]` when changing a member's role — data loss | `index.html:3796` | Should fetch/preserve existing `assigned_projects` |

### Low

| # | Issue | Location | Notes |
|---|-------|----------|-------|
| A11 | `_generateCodeVerifier()` is awaited unnecessarily — it is a synchronous function | `index.html:87` | Minor code smell; works but misleading |
| A12 | Project status options in sidebar `<select>` are in English (`Planning`, `Permitting`, etc.) while the rest of the UI is Hebrew | `index.html:4072` | Should show Hebrew labels |
| A13 | First `<style>` block (line 11) defines `body{font-family:Arial,sans-serif}` which is immediately overridden by the second `<style>` block; creates confusion and adds dead CSS | `index.html:11` | First style block is legacy, should be cleaned |

---

## Section B: UI Gaps vs branding.md

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| B1 | Cards & panels use flat `white` background — should be glass card style | High | ⬜ |
| B2 | Primary buttons (`Btn v="primary"`) use `#1A1A1A` — should be gold glass style | High | ⬜ |
| B3 | Sidebar background is `#1C1C1E` — should be `--color-steel-900` (`#0f1318`) | Medium | ⬜ |
| B4 | Sidebar active state uses green tint — branding calls for gold glass + left border `gold-400` | High | ⬜ |
| B5 | Modal (`Modal` component) uses flat `white` background — should be elevated glass card | High | ⬜ |
| B6 | Status badges use hardcoded colors not from branding semantic system | Medium | ⬜ |
| B7 | `Heebo` font referenced in CSS but not loaded via Google Fonts `<link>` — falls back to system font | High | ⬜ |
| B8 | `DM Sans` font referenced in sidebar but not loaded | Medium | ⬜ |
| B9 | All font sizes are hardcoded px values — branding requires `clamp()` fluid scale via CSS vars | Medium | ⬜ |
| B10 | CSS `:root` uses old palette vars (`--green`, `--gold`, `--red`) instead of steel/gold system from branding.md | High | ⬜ |
| B11 | No `fadeSlideUp` / `.animate-appear` animation class defined — branding specifies it for panel transitions | Low | ⬜ |
| B12 | Inputs have no gold focus ring — branding specifies `gold focus ring` for inputs/dropdowns | Low | ⬜ |
| B13 | App background is `#F5F4F0` (warm off-white) — branding background is `--color-steel-900` (`#0f1318`) | High | ⬜ |

---

## Section C: Feature Gaps

| # | Feature | Source | Status |
|---|---------|--------|--------|
| C1 | Hebrew status labels in UI (Planning → תכנון etc.) — currently English everywhere except badges | CLAUDE.md | ⬜ |
| C2 | גוש / חלקה / מגרש fields on project | CLAUDE.md | ⬜ |
| C3 | Mandatory document marking (required docs must be uploaded before milestone) | CLAUDE.md | ⬜ |
| C4 | Save indicator more visible — current DriveBanner is minimal | CLAUDE.md | ⬜ |
| C5 | Convert task to subtask | CLAUDE.md | ⬜ |
| C6 | Manual section ordering | CLAUDE.md | ⬜ |

---

## Summary

| Category | Count |
|----------|-------|
| Critical bugs | 2 |
| High bugs | 4 |
| Medium bugs | 4 |
| Low bugs | 3 |
| UI gaps | 13 |
| Feature gaps | 6 |
| **Total** | **32** |

---

*Last updated: Sentry Run 1 — 2026-03-27*
