# ArchStudio — Daily Sentry Report
Date: 2026-03-27

---

## Summary

| Metric | Count |
|--------|-------|
| Bugs fixed | 10 (2 critical, 4 high, 4 medium) |
| UI components upgraded | 13 |
| Features implemented | 0 |
| Remaining items | 9 (3 low bugs + 6 feature gaps) |

---

## Fixed Today

### Critical Bugs Fixed

| # | Problem → Solution |
|---|-------------------|
| A1 | **`filteredPartners` ReferenceError in `AllTasksPage`** → Changed `filteredPartners` to `db.partners` so task rows render without crashing |
| A2 | **`<Av>` component received wrong props** → Changed `name={p.name} size={44} color={p.color}` to `u={p} size={44}` so avatars render correctly instead of showing `?` |

### High Bugs Fixed

| # | Problem → Solution |
|---|-------------------|
| A3 | **Missing `@keyframes spin`** → Added CSS keyframes to style block; Google Drive loading spinner now animates |
| A4 | **Missing `@keyframes pulse`** → Added CSS keyframes; DriveBanner save-state dot now pulses |
| A5 | **Unstyled buttons in Dashboard (Tailwind classes, no CDN)** → Replaced Tailwind classes with inline styles on both buttons |
| A6 | **`autoBackup()` silently failed** → Changed `_gAccessToken` → `_calToken`; added `drive.appdata` scope to `gSignIn()` so backup actually runs |

### Medium Bugs Fixed

| # | Problem → Solution |
|---|-------------------|
| A7 | **Auto-save timer fired on every render** → Removed `partners` (derived value) from `useEffect` dependency array |
| A8 | **`.hc` hover class undefined** → Defined `.hc:hover` rule in style block; project cards now show hover state |
| A9 | **Google Calendar shown as "Coming Soon" when already integrated** → Changed integration entry to active (`s:'פעיל'`) with green badge; section renamed "אינטגרציות" |
| A10 | **`doChangeRole` wiped `assigned_projects`** → Fixed to read existing member's `assigned_projects` before updating; no more data loss on role change |

---

## UI Changes

All 13 UI gaps from the branding.md audit were resolved across Runs 3 and 4:

| # | Change |
|---|--------|
| B1 | Cards & panels converted to glass backgrounds (`rgba` + backdrop-filter) |
| B2 | Primary buttons styled with gold glass (`--color-gold-500` base, gold border, translucent background) |
| B3 | Sidebar background changed to `--color-steel-900` (`#0f1318`) |
| B4 | Sidebar active state: gold glass background + left `4px` gold border |
| B5 | Modal component uses elevated glass card style |
| B6 | Status badges use semantic color system from branding.md |
| B7 | Heebo font loaded via Google Fonts `<link>` |
| B8 | DM Sans font loaded via Google Fonts `<link>` |
| B9 | All font sizes replaced with `clamp()` fluid scale CSS variables (`--fs-xs` → `--fs-4xl`) |
| B10 | CSS `:root` updated with full steel/gold palette from branding.md |
| B11 | `fadeSlideUp` / `.animate-appear` animation class defined |
| B12 | Gold focus ring added to all inputs and dropdowns via CSS |
| B13 | App background changed to `--color-steel-900` dark theme |

---

## Remaining Issues

### Low Severity Bugs (not yet fixed)

| # | Issue | Notes |
|---|-------|-------|
| A11 | `_generateCodeVerifier()` awaited unnecessarily — synchronous function | Code smell only; safe to fix manually |
| A12 | Project status options in sidebar `<select>` are English (`Planning`, `Permitting`, etc.) | Should display Hebrew labels |
| A13 | First `<style>` block (line 11) defines `body{font-family:Arial,sans-serif}` immediately overridden by second block | Dead CSS; can be removed |

### Feature Gaps (from CLAUDE.md, not yet implemented)

| # | Feature |
|---|---------|
| C1 | Hebrew status labels throughout UI (Planning → תכנון, etc.) |
| C2 | גוש / חלקה / מגרש fields on project |
| C3 | Mandatory document marking (required docs must be uploaded before milestone completion) |
| C4 | More visible save indicator (current DriveBanner is minimal) |
| C5 | Convert task to subtask |
| C6 | Manual section ordering |

---

## Code Ready for VS Code

### Fix A12 — Hebrew status labels in sidebar select

File: `index.html` — find the sidebar `<select>` for project status (search for `Planning`):

```jsx
// Replace:
<option value="Planning">Planning</option>
<option value="Permitting">Permitting</option>
<option value="Active">Active</option>
<option value="OnHold">OnHold</option>
<option value="Done">Done</option>

// With:
<option value="Planning">תכנון</option>
<option value="Permitting">הרשאות</option>
<option value="Active">פעיל</option>
<option value="OnHold">מושהה</option>
<option value="Done">הושלם</option>
```

### Fix A13 — Remove dead first style block

File: `index.html` line 11 — the first `<style>` block (`body{font-family:Arial,sans-serif}`) can be removed entirely as the second style block overrides it.

### Fix A11 — Remove unnecessary `await`

File: `index.html` — find `_generateCodeVerifier`:

```js
// Replace:
const verifier = await _generateCodeVerifier();
// With:
const verifier = _generateCodeVerifier();
```

---

## Next Batch Recommendations

1. **Implement Hebrew status labels (A12 + C1)** — Two related issues that can be solved together. Replace English option values with Hebrew labels in all selects and any display logic that maps status strings to user-visible text.

2. **Add גוש / חלקה / מגרש fields to projects (C2)** — These are Israel-specific land parcel identifiers required for architecture work. Add three text fields to the project creation/edit form and persist them in the Supabase `projects` table.

3. **Mandatory document marking (C3)** — Add a "required" toggle to documents in the project milestone view. Block milestone completion if required documents are missing. This is a medium-complexity feature that improves workflow integrity.

---

*Generated by ArchStudio Batch-Processing Sentry — Final Run 2026-03-27*
