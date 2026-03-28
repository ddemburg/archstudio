# ArchStudio QA Progress Report
**Sentry Run 1 — QA Audit**
**Date:** 2026-03-28
**Branch audited:** multi-user
**File audited:** index.html (4132 lines)

---

## Section A: Bugs

### 🔴 Critical (2)

| ID | Location | Description |
|----|----------|-------------|
| C1 | `TasksTab` ~line 1860 | **`logDelTask` infinite recursion** — function calls `logDelTask(id)` instead of `db.delTask(id)`. Any task deletion will cause immediate stack overflow and crash. |
| C2 | `AllTasksPage` ~line 2856 | **`filteredPartners` undefined** — `TaskModal` is opened with `partners={filteredPartners}` but `filteredPartners` is only defined inside `ProjectDetail`, not in `AllTasksPage`. Results in `ReferenceError` whenever a task is opened from the All Tasks page. |

---

### 🟠 High (6)

| ID | Location | Description |
|----|----------|-------------|
| H1 | `FlowTab` ~line 1798 | **`TaskModal` missing `db` prop** — `<TaskModal>` in FlowTab does not pass the `db` prop. Crash when trying to save or interact with a task from Flow view. |
| H2 | `LogTab` ~line 2594 | **STATUS_MAP values rendered as `[object Object]`** — STATUS_MAP entries are objects (`{ heb, color }`), but LogTab renders the value directly as a string. Should use `.heb` to get the Hebrew label. |
| H3 | `PartnersPage` ~line 2907 | **`Av` (avatar) called with wrong props** — renders `<Av name={p.name} size={44} color={p.color}/>` but the `Av` component expects a `u` object prop (`<Av u={p} .../>`). Partner avatars display incorrectly or crash. |
| H4 | `PartnersPage` ~line 2926 | **`nav('appsettings')` called as function** — `nav` is an object (state setter via `setNav`), not a function. The "App Settings" link in the partners empty state will throw `TypeError: nav is not a function`. |
| H5 | `autoBackup` ~line 1158–1184 | **Google Drive auto-backup silently broken** — `_gAccessToken` is always `''` (never populated from auth flow). Backup function exits early every time without backing up or notifying the user. |
| H6 | `sbUploadFile` ~line 376–388 | **File upload uses wrong auth token** — uses `SUPABASE_ANON` constant as Bearer token instead of the current user's session token. Supabase Storage RLS will reject all uploads from non-anonymous users. |

---

### 🟡 Medium (6)

| ID | Location | Description |
|----|----------|-------------|
| M1 | `TasksTab` ~line 1952 | **`TaskRow` defined inside `TasksTab` render** — violates the project's critical rule ("never define sub-components inside render functions"). Causes full remount and state loss of every task row on every parent re-render. |
| M2 | `TaskModal` ~line 1384 | **`FR` (field-row) component defined inside `TaskModal` render** — same violation as M1. Causes unnecessary remounting of field rows on every modal re-render. |
| M3 | `<head>` lines 11–23 | **Duplicate `<style>` blocks with conflicting CSS** — there are two separate `<style>` blocks. The first contains leftover print media CSS (`@media print`) and some stale rules that conflict with the second block. |
| M4 | CRM form ~line 3366 | **Literal single quotes in Hebrew UI strings** — form title and submit button render with surrounding single-quote characters visible to the user (e.g. `'איש קשר חדש'`). |
| M5 | Dashboard ~line 2820 | **Unmapped Tailwind class names** — "New project" button and "Client Portal" button use class names that are not in Tailwind's default config and are not defined in the custom `<style>` blocks. Buttons render unstyled. |
| M6 | `TaskModal` file upload | **Task file upload is a stub** — clicking the file upload button shows a browser `alert()` with a placeholder message. No actual upload logic exists yet (see also F3). |

---

## Section B: UI Gaps vs branding.md

| ID | Gap |
|----|-----|
| U1 | **No glassmorphism applied** — all cards, panels, and modals use flat white/gray backgrounds. `branding.md` specifies `backdrop-filter: blur(20px)` glass cards with `rgba(255,255,255,0.06)` background and `rgba(255,255,255,0.12)` border. |
| U2 | **Branding CSS variables not declared** — `branding.md` defines a complete set of `--steel-*` and `--gold-*` CSS custom properties. None are declared in `:root` in `index.html`. All color references are hardcoded hex values. |
| U3 | **Status badges use hardcoded colors** — badge colors are inline hex values per status. `branding.md` defines a semantic badge system with specific background/border/glow values per status that are not used. |
| U4 | **Primary buttons use wrong style** — buttons use `background: #1A1A1A` (dark flat). `branding.md` specifies gold glass buttons: `background: linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))` with gold border and glow. |
| U5 | **Sidebar active state uses green** — active nav items have a green tint/highlight. `branding.md` specifies gold (`--gold-primary: #D4AF37`) as the active/selected color throughout. |
| U6 | **No fluid typography** — all font sizes use fixed `px` or `rem` values. `branding.md` specifies fluid typography using `clamp()` (e.g. `clamp(1.5rem, 3vw, 2.5rem)` for headings). |
| U7 | **No transition animations** — cards, modals, and sidebar items appear/disappear without transitions. `branding.md` specifies `transition: all 0.3s ease` on cards, `transform` on hover, and fade-in for modals. |
| U8 | **Login screen footer text inaccurate** — footer reads "data stored in Google Drive". Data is actually stored in Supabase (Postgres + Storage). Should be corrected to avoid user confusion. |

---

## Section C: Feature Gaps (from CLAUDE.md roadmap)

| ID | Gap |
|----|-----|
| F1 | **Task statuses in English** — `CLAUDE.md` roadmap plans Hebrew status labels throughout the UI. Currently all statuses display in English: "To Do", "In Progress", "Done". `STATUS_MAP` has `.heb` values defined but they are not used in most views (and LogTab's usage is broken per H2). |
| F2 | **`partners` and `office_members` not unified** — `CLAUDE.md` roadmap plans merging these two data sources into a single people/contacts model. `PartnersPage` currently reads from a legacy structure; avatar rendering is broken as a result (see H3). |
| F3 | **Supabase Storage file upload incomplete** — `CLAUDE.md` notes file upload as a planned feature. `sbUploadFile` exists in the API layer but uses wrong auth (H6), and the `TaskModal` UI is a stub (M6). End-to-end file attachment is non-functional. |

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 6 |
| 🟡 Medium | 6 |
| 🔵 UI Gaps | 8 |
| ⬜ Feature Gaps | 3 |
| **Total** | **25** |

---

## Run Schedule

| Run | Status | Description |
|-----|--------|-------------|
| Run 1 | ✅ Complete | QA Audit — 25 issues catalogued |
| Run 2 | ⏳ Pending | Fix Critical + High bugs (C1, C2, H1–H6) |
| Run 3 | ⏳ Pending | UI upgrade — glassmorphism + branding variables |
| Run 4 | ⏳ Pending | Typography polish + animation pass |
| Run 5 | ⏳ Pending | Daily report + PR to multi-user |
