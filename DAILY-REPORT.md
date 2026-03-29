# ArchStudio — Daily Sentry Report
**Date:** 2026-03-29
**Branch:** sentry/2026-03-29 → multi-user
**Runs completed:** 5 (1 Audit · 2 Fixes · 3 UI · 4 Polish · 5 Report)

---

## Summary

| Metric | Count |
|--------|-------|
| Bugs fixed | 13 |
| UI components upgraded | 9 |
| Features implemented | 0 |
| Remaining items | 11 |

---

## Fixed Today

### Critical (1/1)

| ID | Problem | Solution |
|----|---------|----------|
| C1 | `logDelTask` called itself recursively — stack overflow crash on any task deletion | Changed recursive `logDelTask(id)` call to `db.delTask(id)` |

### High (5/5)

| ID | Problem | Solution |
|----|---------|----------|
| H1 | `TaskRow` defined as inner component inside `TasksTab` — caused remount + focus/state loss on every re-render | Moved `TaskRow` to module scope with `ctx` object pattern for dependencies |
| H2 | `<TaskModal>` in `FlowTab` missing `db` prop — TypeError crash when accessing `db.officeMembers` | Added `db={db}` prop to `<TaskModal>` in FlowTab |
| H3 | "New Project" button used Tailwind classes (`bg-accent-500`) that aren't loaded — rendered unstyled | Replaced with inline styles |
| H4 | "Client Portal" button used Tailwind classes (`w-full h-8 bg-white`) — rendered unstyled | Replaced with inline styles |
| H5 | `<Av>` called with `name`/`color` props but signature is `{u, size}` — all Partners page avatars showed "?" | Changed to `<Av u={p}/>` |

### Medium (6/8)

| ID | Problem | Solution |
|----|---------|----------|
| M1 | SettingsTab validation iterated `form.clients` which doesn't exist — client email/phone/ID validation never ran | Changed to `form.client_ids \|\| []` |
| M2 | `openNewWithTpl(tid)` set `preTpl` state but `<NewProjectModal>` never received it — template auto-selection broken | Added `preTpl` prop to `NewProjectModal`; useEffect auto-selects template on modal open |
| M4 | `var(--border)`, `var(--border2)`, `var(--shadow)` used throughout reports but never defined — borders/shadows fell back to `initial` | All CSS variables declared in `:root` in Run 3 |
| M5 | `STATUS_MAP` (project statuses) misused for task status labels in LogTab — task log showed raw English strings instead of Hebrew | Added `TASK_STATUS_HEB` map for task-specific status labels |
| M7 | Literal `'` characters in CRMPage JSX (`'איש קשר חדש'`, `'הוסף'`) — rendered as visible quote artifacts in UI | Removed stray quote characters |
| M8 | Dashboard manager "אני" check hardcoded `db.partners[0].id` — incorrectly treated first partner as current user | Changed to `currentUser?.id`; Dashboard now receives `currentUser` prop |

### Low (1/4)

| ID | Problem | Solution |
|----|---------|----------|
| L1 | `partners` included in auto-save useEffect deps — it's derived from `officeMembers`, caused extra unnecessary saves | Removed `partners` from deps array |

### UI (9/13)

| ID | Problem | Solution |
|----|---------|----------|
| U3 | Primary buttons used flat `#1A1A1A` — not matching branding gold glass spec | Btn primary → gold glass gradient + `#c9983a` text + gold border + hover glow |
| U6 | Font stack used `Heebo`/`Arial` only — branding specifies Inter-first stack | Updated to `'Inter','Heebo','Segoe UI',system-ui,-apple-system,sans-serif` |
| U7 | All font sizes hardcoded in `px` — branding specifies `clamp()` fluid scale | Added `--text-xs` through `--text-3xl` fluid type CSS vars to `:root` |
| U8 | All branding CSS variables (`--color-steel-*`, `--color-gold-*`, etc.) absent from `:root` | Full branding palette declared in `:root` |
| U9 | `.hc` class referenced widely (Docs, Leads, Kanban, CRM) but undefined — no hover state on cards | `.hc:hover` defined with box-shadow |
| U10 | `@keyframes pulse` and `@keyframes spin` missing — DriveBanner/login spinner never animated | Both keyframes added to `<style>` block |
| U11 | `.trow` class used in ReportsPage tables but undefined | `.trow` defined with hover background |
| U12 | `.card` class used in LeadsPage but undefined — panels had no background/border | `.card` defined with white bg, border, shadow |
| U13 | Sidebar active state used `rgba(61,122,90,.25)` (green tint) — branding specifies gold accent | Active state → gold gradient bg + `#e0b255` text + gold right-border |

---

## UI Changes

1. **Gold glass primary buttons** — all `Btn v="primary"` now render with `linear-gradient(135deg, #c9983a, #e8c76a)` background, gold text, gold border, glow on hover.
2. **Branding CSS variable system** — `--color-steel-{50–900}`, `--color-gold-{50–700}`, `--text-primary/secondary/tertiary/inverse`, `--border`, `--border2`, `--shadow`, `--transition-fast/normal/slow` all declared in `:root`.
3. **Inter-first font stack** — system falls back gracefully through Heebo → Segoe UI → system-ui.
4. **Fluid typography scale** — `--text-xs` (clamp 0.7rem, 0.75vw, 0.75rem) through `--text-3xl` (clamp 1.7rem, 3vw, 2.25rem); `--leading-*` and `--tracking-*` vars added.
5. **Micro-interactions** — `@keyframes fadeSlideUp` + `.animate-appear` class; `--transition-*` vars for consistent timing.
6. **Sidebar gold active state** — replaces green tint with branding-compliant gold gradient + border accent.
7. **Missing CSS classes** — `.hc:hover`, `.trow`, `.card`, `@keyframes pulse`, `@keyframes spin` all added; prevents layout/animation breakage on Leads, Reports, Drive UI.

---

## Remaining Issues

### Medium (2 pending)

| ID | Severity | Description | Why Deferred |
|----|----------|-------------|--------------|
| M3 | 🟡 Medium | `autoBackup()` uses `_gAccessToken` which is always empty — Drive backup silently fails on every daily run | Auth-sensitive; requires wiring Google OAuth token into the backup flow |
| M6 | 🟡 Medium | `sbUploadFile` uses `SUPABASE_ANON` key instead of user session token — file uploads may fail for auth-required buckets | Auth-sensitive; deferred to avoid breaking existing upload behaviour |

### Low (3 pending)

| ID | Severity | Description |
|----|----------|-------------|
| L2 | 🔵 Low | Sidebar user display name briefly shows raw email before name loads (session init race) |
| L3 | 🔵 Low | BookingPage duration end-time display off-by-one for 90-min slots |
| L4 | 🔵 Low | `window.prompt()` / `window.confirm()` used for add-client, add/delete committee, delete-template UX — blocked in some environments |

### UI (4 pending — deferred by design)

| ID | Description | Blocker |
|----|-------------|---------|
| U1 | Body background light beige `#F5F4F0` → dark steel `#0f1318` | All card/text content uses dark colors; full dark-theme text pass required first |
| U2 | Cards/panels → glassmorphism (`rgba(26,32,48,0.75)` + `backdrop-filter:blur(12px)`) | Needs dark-theme context — glass on light bg is invisible |
| U4 | Modals → elevated glass card (`rgba(35,43,62,0.88)` + `blur(20px)`) | Same: modal children have hardcoded dark text |
| U5 | `SBadge` → semantic glass-tinted colors | Designed for dark backgrounds; would be invisible on current light bg |

### Features (2 pending)

| ID | Description |
|----|-------------|
| F1 | File upload in TaskModal shows `alert()` — `sbUploadFile` function exists but is not wired to any upload UI |
| F2 | Google Drive daily backup silently fails (see M3 above) |

---

## Code Ready for VS Code

### M3 — Fix Drive backup auth (manual apply needed)

The `autoBackup` function at the top of the script uses `_gAccessToken` which is a global never populated in the Supabase auth flow. If Drive backup is desired, the access_token from the Supabase session should be used if Google SSO is the login method, or the backup should be disabled.

**Location:** search for `function autoBackup` in `index.html`

```js
// Current (broken):
'Authorization': 'Bearer ' + _gAccessToken

// Fix option A — use Supabase session token (works if storage bucket accepts it):
'Authorization': 'Bearer ' + (_sbSession?.access_token || '')

// Fix option B — disable silently if no token:
if (!_sbSession?.access_token) return;
```

### L4 — Replace window.prompt/confirm with inline UI (manual apply needed)

**Locations in index.html:**
- `window.prompt('שם הלקוח')` in SettingsTab (~line 2545) — add-client
- `window.prompt('שם הועדה')` in SettingsTab (~line 2751) — add-committee
- `window.confirm(...)` in SettingsTab (~line 3043) — delete-committee
- `window.confirm(...)` in TemplatesPage (~line 3609) — delete-template

Replace each with a small inline state variable + JSX input/confirm row.

---

## Next Batch Recommendations

1. **Dark-theme migration** — Tackle U1 first (body background), then cascade through U2, U4, U5 in one run. This unlocks the full branding glass/dark aesthetic and is the highest-visual-impact remaining item. Requires a careful audit of all text color values before flipping the background.

2. **Replace `window.prompt/confirm` with inline UI** (L4) — Affects 4 places. A small reusable `InlinePrompt` JSX variable pattern (not a sub-component) would clean all four instances and unblock users in strict browser environments.

3. **File upload wiring** (F1) — `sbUploadFile` already exists. Add an `<input type="file">` inside `TaskModal` and wire it to call `sbUploadFile`. Medium effort, high user value for project file management.

---

*Generated by ArchStudio Batch-Processing Sentry — Run 5 (Final)*
