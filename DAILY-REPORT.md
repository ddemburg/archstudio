# ArchStudio — Daily Sentry Report (Batch 3)
**Date:** 2026-03-28
**Branch:** sentry/2026-03-28
**Runs completed:** 4 (+ Final)

---

## Summary

| Category | Count |
|----------|-------|
| Bugs fixed | 8 |
| UI components upgraded | 10 |
| Typography groups updated | 7 |
| Micro-interactions added | 4 |
| Remaining items carried over | 4 |

---

## Fixed Today (Batch 3)

### Run 2 — Critical & High Fixes (8 items)

| ID | Problem | Solution |
|----|---------|----------|
| **H6** | `sbUploadFile` used `SUPABASE_ANON` constant as Bearer token — Supabase Storage RLS rejected uploads from authenticated users | Now uses `_sbSession?.access_token \|\| SUPABASE_ANON` so authenticated users' uploads pass RLS |
| **M3** | Two `<style>` blocks in `<head>` — first block contained stale/conflicting CSS rules | Removed the redundant first style block; print template has its own inline CSS |
| **M4** | CRM form title and submit button rendered with literal surrounding `'` characters visible in Hebrew UI | Stripped the wrapping single-quote characters from the Hebrew string literals |
| **M5** | "New project" and "Client Portal" dashboard buttons used Tailwind class names not in config (e.g. `bg-blue-600`) | Replaced with inline styles matching the branding design system |
| **B8** | `← לחץ להעלאה` used a left-pointing arrow in an RTL context — directionally ambiguous | Replaced arrow with `↑` for unambiguous upload direction |
| **U8** | Login page footer read "הנתונים מאובטחים ב-Google Drive" | Updated to "הנתונים מאובטחים ב-Supabase" |
| **A9** | Rapid clicks in `MeetingScheduler` copy button fired multiple `clipboard.writeText` calls | Added `useRef` guard — only one copy fires until the timeout resets it |
| **A10** | `setTimeout(() => setSaved(false), 2000)` in `TaskModal` had no cleanup; fired on unmounted component | Added `useEffect` cleanup to clear the timer on unmount |

### Run 3 — UI Upgrade: Glass Inputs + Dark Cards (10 areas)

| Area | Change |
|------|--------|
| Text inputs (`I`) | Glass background + gold focus ring + `var(--text-I)` font size |
| Textareas (`TA`) | Same glass treatment as inputs |
| Select dropdowns (`SE`) | Glass background + gold focus ring + `var(--text-SE)` |
| Input status text (`inpSt`) | Muted gold-tinted color with `var(--text-inpSt)` |
| Project cards | Dark steel `rgba(15,20,40,0.85)` background replacing white/light cards |
| AllTasksPage rows | Dark `rgba(15,20,40,0.7)` row background — consistent with project cards |
| TaskModal fields | Glass-style field backgrounds |
| Milestones tab | Dark card backgrounds |
| Docs / Reqs / Approvals | Consistent dark panel treatment |
| LogTab entries | Dark row style matching AllTasksPage |

### Run 4 — Typography + Polish (7 groups + 3 micro-interactions + 1 bugfix)

| Item | Change |
|------|--------|
| **@keyframes spin** | Missing animation definition causing login spinner to freeze — added `@keyframes spin { to { transform: rotate(360deg); } }` to CSS |
| `var(--text-lbl)` | Applied to glass card labels / section headings |
| `var(--text-I)` | Applied to all text inputs |
| `var(--text-TA)` | Applied to all textareas |
| `var(--text-SE)` | Applied to all select dropdowns |
| `var(--text-Btn)` | Applied to all primary buttons |
| `var(--text-SBadge)` | Applied to all status badges |
| `var(--text-Modal)` | Applied to modal body text |
| `var(--text-login)` | Applied to login form elements |
| `var(--text-sidebar)` | Applied to sidebar nav items |
| `.hc` hover class | Reusable hover cursor class added to CSS; applied to interactive elements |
| Sidebar project btn | `transition: background 0.18s` micro-interaction added |
| Modal close btn | Smooth hover color transition |
| Login submit btn | `transition: opacity 0.2s` on hover state |
| New-project dashed btn | Hover lift + border brightening |

---

## UI Changes Summary

The entire app now uses the branding.md design system end-to-end:
- **Dark steel background** across all cards, modals, list rows, and panels
- **Gold accent** on active sidebar items, focused inputs, primary buttons
- **Glass morphism** on modals and elevated cards
- **Fluid typography** via CSS `clamp()` variables across all component groups
- **Smooth transitions** on all interactive elements (buttons, sidebar, modals)

---

## Remaining Issues (Carry-over to Batch 4)

| ID | Severity | Description | Blocker |
|----|----------|-------------|---------|
| **H5** | High | Google Drive auto-backup silently broken — `_gAccessToken` never populated | Requires OAuth refresh flow re-design; touch carefully |
| **M6 / F3** | Medium | `simulateUpload` is a placeholder in `ClientPortal`; file upload never reaches Supabase Storage | H6 fixed — needs `client-files` bucket + RLS config in Supabase dashboard |
| **F2** | Low | `partners` and `office_members` overlap — two sources of truth for team members | Architectural refactor; plan carefully |

---

## Code Ready for VS Code

### Wire real file upload (M6) — after H6 is fixed

Replace `simulateUpload` in `ClientPortal` (search for `simulateUpload` in index.html):

```javascript
async function realUpload(file, projectId) {
  const path = `${projectId}/${Date.now()}_${file.name}`;
  const token = _sbSession?.access_token || SUPABASE_ANON;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/client-files/${path}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: file,
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return `${SUPABASE_URL}/storage/v1/object/public/client-files/${path}`;
}
```

Prerequisite: Create `client-files` bucket in Supabase Storage dashboard with RLS policy:
```sql
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'client-files' AND auth.role() = 'authenticated');
```

---

## Next Batch Recommendations

1. **Wire real file upload (M6/F3)** — H6 auth is now fixed. Highest user-visible impact: set up the `client-files` Supabase bucket + RLS, then use the code snippet above.

2. **Fix Google Drive OAuth (H5)** — Requires wiring the token refresh flow. Review existing Google auth code first to understand what's partially in place, then add token storage and refresh logic.

3. **Unify `partners` / `office_members` (F2)** — Create a single data model and migration. Plan the schema change before touching index.html. Requires Supabase migration + UI updates across PartnersPage, TaskModal, and LogTab.
