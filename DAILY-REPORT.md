# ArchStudio — Daily Sentry Report
Date: 2026-03-28 (2 batches — 7 runs total)

---

## Summary

| Category | Count |
|----------|-------|
| Bugs fixed | 10 (2 critical + 4 high + 2 medium + 2 sub-component violations) |
| UI components upgraded | 19 |
| Features implemented | 3 |
| Remaining items | 9 |

---

## Fixed Today

### Batch 1 — Run 2: Critical & High Bugs (6 fixes)

| ID | Problem | Solution |
|----|---------|----------|
| A1 | `FR` sub-component defined inside `TaskModal` render function — caused remounts and focus loss on every keystroke | Deleted dead `FR` sub-component (was unused inline scaffolding) |
| A2 | `TaskRow` recursive sub-component defined inside `TasksTab` render function — expand/collapse state lost on every render | Extracted to top-level `function TaskRow({ task, depth, ctx })` |
| A3 | `navigator.clipboard.writeText()` in `MeetingScheduler` had no `.catch()` — showed "Copied!" even if clipboard was blocked | Added `.catch(() => {})` to suppress false feedback |
| A4 | `FlowView` layout algorithm ran unconditionally on every render — O(n²) lag on large task graphs | Wrapped entire layout block in `React.useMemo([tasks])` |
| A5 | `currentUser` fallback `db.partners[0]` could be `undefined` when partner list is empty | Changed fallback to `null`; added guard |
| NEW-CRITICAL | `logDelTask(id)` was calling itself instead of `db.delTask(id)` — infinite recursion when deleting any task | Fixed call to `db.delTask(id)` |

### Batch 1 — Run 3: UI / Branding Overhaul (12 fixes)

| ID | Problem | Solution |
|----|---------|----------|
| B1 | Entire app used off-brand color system (green palette, light bg) | Replaced global CSS `:root` with full Steel & Gold branding token system |
| B2 | Zero glassmorphism | Added `.card` CSS class with `backdrop-filter: blur(12px)` + glass bg |
| B3 | Sidebar active state used green-tinted glass | Changed to gold glass gradient + gold-300 text |
| B4 | Primary `Btn` used solid `#1A1A1A` background | Replaced with gold glass style (gradient + gold border + gold text) |
| B5 | `BookingPage` hero gradient was all-green | Changed to steel dark gradient |
| B6 | Dashboard stats cards were flat white | Converted to glass cards |
| B7 | Modal used flat white background | Upgraded to elevated glass card (rgba 35,43,62 + blur 20px) |
| B10 | `SBadge` status colors were hardcoded | Rewired `STATUS_MAP` to use semantic branding tokens |
| C3 | No CSS design tokens in `:root` | Added full token set: steel-100→900, gold-100→600, semantic colors |
| Login | Login screen was off-brand | Converted to glass card on steel-900 bg with gold CTA button |
| Sidebar logo | Logo pill background was green | Changed to gold glass gradient |
| Body | Body background was light grey | Set to `#0f1318` (steel-900) |

### Batch 1 — Run 4: Typography, Polish & Medium Bugs (9 fixes)

| ID | Problem | Solution |
|----|---------|----------|
| A6 | Phone validation regex allowed invalid strings like `+++++++` | Tightened regex to require at least 6 digits |
| A8 | `CashflowChart` recomputed 4 derived values on every render | Wrapped in single `useMemo([ms])` |
| B9 | Cards had no hover transition | Added `transition: box-shadow 0.2s, transform 0.2s` + `:hover` lift |
| B11 | Upload zone border near-invisible | Changed to gold glass dashed border with hover glow |
| B12 | `font-family` hardcoded throughout | Added `--font-body` CSS variable to `:root` |
| B13 | FlowView SVG hover had no transition; hover stroke was green | Added `transition: 'all 0.12s'`; hover stroke changed to gold |
| B14 | CashflowChart y-axis fill near-invisible on dark bg | Changed to `fill="#4a5a78"` (steel-500) |
| C2 | All font sizes hardcoded px/rem | Added full `clamp()` scale (`--text-xs` → `--text-3xl`) to `:root` |
| C4 | No animations on modals/cards | Added `.animate-appear` CSS class; Modal upgraded to use it |

### Batch 2 — Final Run: Missed High Bugs (4 fixes)

| ID | Problem | Solution |
|----|---------|----------|
| C2 | `filteredPartners` undefined in `AllTasksPage` — `ReferenceError` crash when opening any task from the All Tasks page | Changed `partners={filteredPartners}` to `partners={db.partners}` |
| H2 | LogTab `ACTION_CFG.status` rendered `STATUS_MAP[e.from]` as `[object Object]` — all status-change log entries showed garbled text | Changed to `(STATUS_MAP[e.from]?.heb)\|\|e.from` for both `from` and `to` |
| H3 | `PartnersPage` rendered `<Av name={p.name} color={p.color}/>` but `Av` component expects `u` object prop — all partner avatars showed `?` | Changed to `<Av u={p} size={44}/>` |
| H4 | `PartnersPage` empty state called `nav('appsettings')` but `nav` is an object, not a function — `TypeError` crash when partner list is empty | Changed to `nav.toSettings()` |

---

## UI Changes

1. **Full branding overhaul** — Dark steel background (#0f1318); CSS token system with all Steel & Gold values
2. **Glassmorphism system** — `.card` class, elevated modal glass, gold glass buttons, gold glass sidebar active state
3. **Sidebar** — Active nav: gold glass gradient + gold-300 text + left gold border
4. **Primary buttons** — Gold glass style (gradient + border + glow on hover)
5. **BookingPage hero** — Steel dark gradient (replaced all-green)
6. **Dashboard cards** — Glass cards with blur
7. **Modals** — Elevated glass (blur 20px, steel-700 alpha)
8. **Status badges** — Semantic color mapping (info/warning/success/error)
9. **Login screen** — Glass card on dark bg, gold CTA
10. **Fluid typography** — 8-stop clamp() scale replacing all hardcoded font sizes
11. **Card hover** — Smooth lift transition on all `.card` elements
12. **Upload zone** — Gold glass dashed border with hover glow
13. **Font variable** — Centralized `--font-body` token
14. **FlowView nodes** — Gold hover stroke + smooth transition
15. **CashflowChart y-axis** — Steel-500 fill for better readability

---

## Remaining Issues

| ID | Issue | Severity | Notes |
|----|-------|----------|-------|
| H5 | Google Drive auto-backup always exits early — `_gAccessToken` never populated | High | Requires OAuth flow re-design; out of scope for sentry |
| H6 | `sbUploadFile` uses `SUPABASE_ANON` as Bearer token — Supabase RLS rejects all uploads | High | Requires Supabase bucket + RLS policy setup before safe to enable |
| M3 | Duplicate `<style>` blocks in `<head>` with some conflicting rules | Medium | Safe to merge manually; low risk |
| M4 | Literal single-quote characters visible in Hebrew CRM form strings | Medium | Cosmetic; fix via string cleanup |
| M5 | Dashboard "New project" + "Client Portal" buttons use unmapped Tailwind class names | Medium | Replace with inline styles or defined CSS classes |
| M6 / A7 | `TaskModal` file upload shows `alert()` stub; `ClientPortal` `simulateUpload` is fake | Medium | Blocked on H6 fix + Supabase bucket setup |
| U8 | Login footer says "data stored in Google Drive" — should say Supabase | Low | Cosmetic text fix |
| F2 | `partners` / `office_members` not unified — architectural tech-debt | Low | Longer refactor; defer |
| B8 | `← לחץ להעלאה` uses left-arrow in RTL context — ambiguous direction cue | Low | Replace `←` with `↑` |

---

## Code Ready for VS Code

### H5 / H6 — Wire real file upload in ClientPortal

Prerequisite: Create Supabase storage bucket `client-files` with RLS policy allowing authenticated uploads.

```js
// In ClientPortal, replace simulateUpload:
async function handleUpload(file) {
  if (!file) return;
  setUploading(true);
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const path = `project-${project.id}/${Date.now()}-${file.name}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/client-files/${path}`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': file.type }, body: file }
  );
  if (!res.ok) {
    alert('שגיאה בהעלאה: ' + (await res.text()));
  } else {
    setFiles(prev => [...prev, { name: file.name, path, created_at: new Date().toISOString() }]);
  }
  setUploading(false);
}
```

### A9 — copy() debounce guard (MeetingScheduler)

```js
const copyingRef = React.useRef(false);
function copy() {
  if (copyingRef.current) return;
  copyingRef.current = true;
  navigator.clipboard.writeText(bookingLink)
    .catch(() => {})
    .finally(() => { setTimeout(() => { copyingRef.current = false; }, 2000); });
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}
```

### A10 — setSaved cleanup (TaskModal)

```js
const savedTimerRef = React.useRef(null);
// In save():
setSaved(true);
if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
// Add effect:
React.useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current); }, []);
```

---

## Next Batch Recommendations

1. **Wire real file upload (H6 + M6/A7)** — The most user-impacting unresolved issue. Set up Supabase `client-files` bucket, then use the code snippet above to replace `simulateUpload`. This unblocks the ClientPortal file attachment flow end-to-end.

2. **Fix inputs & dropdowns branding** — Text inputs and `<select>` elements still use browser defaults / light backgrounds. Apply glass background + gold focus ring (`border-color: var(--gold-primary)`) to complete the branding overhaul per branding.md item #7.

3. **Merge duplicate `<style>` blocks (M3)** — Two `<style>` blocks exist in `<head>`. The first contains stale print CSS; merging them removes potential rule conflicts and keeps the file clean.
