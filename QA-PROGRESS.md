# ArchStudio — QA Progress Report
**Sentry Cycle:** 2026-03-29 | **Run 1:** Audit

---

## Section A: Bugs

### Critical

| ID | Severity | Location | Description |
|----|----------|----------|-------------|
| C1 | 🔴 Critical | `TasksTab` line ~1874 | **`logDelTask` infinite recursion** — calls `logDelTask(id)` instead of `db.delTask(id)`. Causes stack overflow crash when user deletes any task. |

---

### High

| ID | Severity | Location | Description |
|----|----------|----------|-------------|
| H1 | 🟠 High | `TasksTab` line ~1966 | **`TaskRow` defined as inner component inside `TasksTab`** — violates CRITICAL RULE "never define sub-components inside render functions." Causes remount + state/focus loss on every parent re-render. |
| H2 | 🟠 High | `FlowTab` line ~1812 | **`TaskModal` missing `db` prop** — FlowTab renders `<TaskModal ... />` without passing `db`. TaskModal accesses `db.officeMembers` (line ~1381) causing a runtime TypeError on note authorship. |
| H3 | 🟠 High | `Dashboard` line ~2834 | **"New Project" button uses Tailwind classes** (`bg-accent-500`, `hover:bg-accent-600`, etc.) — Tailwind is NOT loaded. Button renders without any visual styles. |
| H4 | 🟠 High | `Dashboard` project card line ~2854 | **"Client Portal" button uses Tailwind classes** (`w-full`, `h-8`, `bg-white`, `hover:bg-stone-50`, etc.) — same issue, no visual styles applied. |
| H5 | 🟠 High | `PartnersPage` line ~2993 | **`Av` called with wrong props** — `<Av name={p.name} size={44} color={p.color}/>` but `Av` signature is `({u, size})`. Renders broken "?" avatar for all team members on Partners page. |

---

### Medium

| ID | Severity | Location | Description |
|----|----------|----------|-------------|
| M1 | 🟡 Medium | `SettingsTab` line ~2480 | **`form.clients` doesn't exist** — validation loop iterates `form.clients||[]` but form state uses `client_ids`. Validation for client email/phone/ID never runs. |
| M2 | 🟡 Medium | `App` component line ~4133,4203 | **`preTpl` not passed to `NewProjectModal`** — `openNewWithTpl(tid)` sets `preTpl` state but `<NewProjectModal>` never receives it as a prop. Template auto-selection from Templates page is broken. |
| M3 | 🟡 Medium | `autoBackup` line ~1180 | **`_gAccessToken` always empty** — the daily Google Drive backup uses `_gAccessToken` which is declared but never populated (app uses Supabase auth, not direct Google OAuth). Backup silently fails every time. |
| M4 | 🟡 Medium | `ReportsPage` lines ~3703+ | **Undefined CSS variables** — `var(--border)`, `var(--border2)`, `var(--shadow)` used throughout reports but never defined in `:root`. These fall back to `initial`, breaking borders and shadows in reports. |
| M5 | 🟡 Medium | `LogTab` line ~2608 | **`STATUS_MAP` misused for task status labels** — log entries use `STATUS_MAP[e.from]` which is a project-status map (Planning/Permitting/etc), not task status. Task log shows raw strings ('To Do'→'Done') instead of Hebrew. `STATUS_MAP[e.from]?.heb` would fix it, but since these are task statuses, a separate map is needed. |
| M6 | 🟡 Medium | `sbUploadFile` line ~383 | **File upload uses anon key instead of user token** — `Authorization: 'Bearer ' + SUPABASE_ANON` should be `Bearer + _sbSession?.access_token`. Uploads may fail for authenticated storage buckets. |
| M7 | 🟡 Medium | `CRMPage` lines ~3452, 3491 | **Stray quote characters in UI text** — `'איש קשר חדש'` and `'הוסף'` have literal single-quote characters rendered in the UI (copy/paste artifact). |
| M8 | 🟡 Medium | `Dashboard` project card line ~2853 | **Manager "אני" logic hardcodes `db.partners[0].id`** — `p.manager_id===db.partners[0].id?'אני':m.name` incorrectly assumes current user is always partners[0]. Should use `currentUser?.id`. |

---

### Low

| ID | Severity | Location | Description |
|----|----------|----------|-------------|
| L1 | 🔵 Low | `useApp` line ~1216 | **`partners` in auto-save deps array** — `partners` is derived from `officeMembers` (not independent state), so including it triggers extra saves. Should be removed from the dependency array. |
| L2 | 🔵 Low | Sidebar line ~4178 | **User display name fallback shows email** — `currentUser?.name||loggedEmail||'מנהל'` shows raw email if name not yet loaded. Minor flicker on first load. |
| L3 | 🔵 Low | `BookingPage` line ~584 | **Duration display calculation off-by-one** — `fmtTH(chosen.hour+(chosen.duration/60|0))` can produce wrong end-hour for durations like 90 min (shows 1 instead of 1.5 hours extra). |
| L4 | 🔵 Low | Multiple locations | **`window.prompt()` and `window.confirm()` used for UX** — Lines ~2545 (add client), ~2751 (add committee), ~3043 (delete committee), ~3609 (delete template). These are blocked in some browsers/environments and provide poor UX. |

---

## Section B: UI Gaps vs branding.md

| ID | Priority | Description |
|----|----------|-------------|
| U1 | P1 | **Body/main background** is light beige `#F5F4F0` — branding specifies dark steel `#0f1318`. App feels light while branding guide is dark-themed. |
| U2 | P1 | **Cards & panels** use plain `background:'white'` — should be glassmorphism: `rgba(26,32,48,0.75)` + `backdrop-filter:blur(12px)`. |
| U3 | P1 | **Primary buttons** (`Btn v="primary"`) use `#1A1A1A` — should be gold glass style per branding.md. |
| U4 | P2 | **Modals** use plain `background:'white'` — should be elevated glass card (`rgba(35,43,62,0.88)` + `blur(20px)`). |
| U5 | P2 | **Status badges** (`SBadge`) use hardcoded flat colors — should use semantic glass-tinted colors from branding. |
| U6 | P2 | **Font stack** uses `Heebo`/`Arial` instead of branding's `'Inter', 'Segoe UI', system-ui`. |
| U7 | P3 | **Typography** uses hardcoded px values — should use `clamp()` fluid scale from branding. |
| U8 | P1 | **Branding CSS variables** (`--color-steel-*`, `--color-gold-*`, `--text-*`, etc.) not declared in `:root`. |
| U9 | P2 | **`hc` CSS class** referenced widely (DocsTab, LeadsPage, Kanban, CRM) but NOT defined in `<style>`. Only `.hr` is defined. Cards have no hover state. |
| U10 | P2 | **`@keyframes pulse` and `@keyframes spin`** missing — `DriveBanner` uses `pulse` animation, `DriveLoginScreen` uses `spin`. Spinners don't animate. |
| U11 | P2 | **`trow` CSS class** used in reports table (`className="trow"`) but not defined. |
| U12 | P2 | **`card` CSS class** used in LeadsPage (`className="card fade"`) but not defined. |
| U13 | P3 | **Sidebar active state** uses `rgba(61,122,90,.25)` / `#A8D5BA` instead of gold glass + gold-400 left border per branding.md sidebar spec. |

---

## Section C: Feature Gaps

| ID | Description |
|----|-------------|
| F1 | **File upload in TaskModal shows `alert()`** — `sbUploadFile` exists but is not wired to the task modal UI. Click shows browser alert, not an actual upload dialog. |
| F2 | **Google Drive daily backup silently fails** — `autoBackup()` uses `_gAccessToken` which is always empty in the current Supabase auth flow. |

---

## Summary

| Category | Count |
|----------|-------|
| Critical bugs | 1 |
| High bugs | 5 |
| Medium bugs | 8 |
| Low bugs | 4 |
| UI gaps vs branding | 13 |
| Feature gaps | 2 |
| **Total** | **33** |

---

## Fix Status

| ID | Status |
|----|--------|
| C1 | ⬜ Pending |
| H1 | ⬜ Pending |
| H2 | ⬜ Pending |
| H3 | ⬜ Pending |
| H4 | ⬜ Pending |
| H5 | ⬜ Pending |
| M1–M8 | ⬜ Pending |
| L1–L4 | ⬜ Pending |
| U1–U13 | ⬜ Pending |
| F1–F2 | ⬜ Pending |
