# ArchStudio QA Progress Report
**Sentry Batch 3 — Run 3 (UI Upgrade — Glass & Colors)**
**Date:** 2026-03-28
**Branch:** sentry/2026-03-28

---

## Section A: Bugs

### 🔴 Critical (2)

| ID | Location | Description | Status |
|----|----------|-------------|--------|
| C1 | `TasksTab` ~line 1856 | **`logDelTask` infinite recursion** — function was calling itself instead of `db.delTask(id)` | ✅ Fixed (Batch 1, Run 2) |
| C2 | `AllTasksPage` ~line 2883 | **`filteredPartners` undefined** — `TaskModal` referenced `filteredPartners` which only exists inside `ProjectDetail`, not `AllTasksPage`. `ReferenceError` on opening any task from All Tasks page. | ✅ Fixed (Batch 2, Final) — replaced with `db.partners` |

---

### 🟠 High (6)

| ID | Location | Description | Status |
|----|----------|-------------|--------|
| H1 | `FlowTab` ~line 2704 | **`TaskModal` missing `db` prop** — FlowTab was not passing `db` to `TaskModal` | ✅ Fixed (Batch 1, Run 2) |
| H2 | `LogTab` ~line 2621 | **STATUS_MAP values rendered as `[object Object]`** — `STATUS_MAP[e.from]` returned an object; should use `.heb` | ✅ Fixed (Batch 2, Final) — using `?.heb` optional chaining |
| H3 | `PartnersPage` ~line 2934 | **`Av` called with wrong props** — `<Av name={p.name} size={44} color={p.color}/>` but `Av` expects `u` object prop | ✅ Fixed (Batch 2, Final) — changed to `<Av u={p} size={44}/>` |
| H4 | `PartnersPage` ~line 2953 | **`nav('appsettings')` called as function** — `nav` is an object; should be `nav.toSettings()` | ✅ Fixed (Batch 2, Final) — changed to `nav.toSettings()` |
| H5 | `autoBackup` ~line 1158 | **Google Drive auto-backup silently broken** — `_gAccessToken` never populated from auth flow | ⏳ Carry-over — requires OAuth flow re-design |
| H6 | `sbUploadFile` ~line 376 | **File upload uses wrong auth token** — uses `SUPABASE_ANON` constant as Bearer token; should use session token | ✅ Fixed (Batch 3, Run 2) — now uses `_sbSession?.access_token \|\| SUPABASE_ANON` |

---

### 🟡 Medium (6)

| ID | Location | Description | Status |
|----|----------|-------------|--------|
| M1 | `TasksTab` ~line 1861 | **`TaskRow` defined inside render function** — causes remount on every re-render | ✅ Fixed (Batch 1, Run 2) — extracted to top-level `function TaskRow` |
| M2 | `TaskModal` | **`FR` sub-component inside `TaskModal` render** — same violation | ✅ Fixed (Batch 1, Run 2) — deleted dead component |
| M3 | `<head>` | **Duplicate `<style>` blocks with conflicting CSS** | ✅ Fixed (Batch 3, Run 2) — removed redundant first style block (print template has its own inline CSS) |
| M4 | CRM form | **Literal single quotes in Hebrew UI strings** | ✅ Fixed (Batch 3, Run 2) — removed wrapping `'` from form title and submit button |
| M5 | Dashboard | **Unmapped Tailwind class names on buttons** | ✅ Fixed (Batch 3, Run 2) — replaced with Btn component / inline styles |
| M6 | `TaskModal` | **File upload is a stub (alert placeholder)** | ⏳ Carry-over — blocked on backend |

---

## Section B: UI Gaps vs branding.md

| ID | Gap | Status |
|----|-----|--------|
| U1 | No glassmorphism | ✅ Fixed (Batch 1, Run 3) |
| U2 | CSS variables not declared | ✅ Fixed (Batch 1, Run 3) |
| U3 | Status badges hardcoded colors | ✅ Fixed (Batch 1, Run 3) |
| U4 | Primary buttons wrong style | ✅ Fixed (Batch 1, Run 3) |
| U5 | Sidebar active state green instead of gold | ✅ Fixed (Batch 1, Run 3) |
| U6 | No fluid typography | ✅ Fixed (Batch 1, Run 4) |
| U7 | No transition animations | ✅ Fixed (Batch 1, Run 4) |
| U8 | Login footer says "Google Drive" (should be Supabase) | ✅ Fixed (Batch 3, Run 2) — now reads "הנתונים מאובטחים ב-Supabase" |

---

## Section C: Feature Gaps

| ID | Gap | Status |
|----|-----|--------|
| F1 | Task statuses in English | ✅ Partially fixed — STATUS_MAP `.heb` now used via SBadge; LogTab H2 fix completes this |
| F2 | `partners` / `office_members` not unified | ⏳ Carry-over — architectural refactor |
| F3 | Supabase Storage file upload incomplete | ⏳ Carry-over — blocked on backend |

---

## Summary

| Severity | Total | Fixed | Remaining |
|----------|-------|-------|-----------|
| 🔴 Critical | 2 | 2 | 0 |
| 🟠 High | 6 | 5 | 1 |
| 🟡 Medium | 6 | 5 | 1 |
| 🔵 UI Gaps | 8 | 8 | 0 |
| ⬜ Feature Gaps | 3 | 1 | 2 |
| **Misc (A9, A10, B8)** | 3 | 3 | 0 |
| **Total** | **28** | **24** | **4** |

---

## Run Schedule

| Run | Status | Description |
|-----|--------|-------------|
| Batch 1 — Run 1 | ✅ Complete | QA Audit — 28 issues catalogued |
| Batch 1 — Run 2 | ✅ Complete | Critical+High fixes — 6 bugs fixed |
| Batch 1 — Run 3 | ✅ Complete | UI upgrade — glass/color system (12 items) |
| Batch 1 — Run 4 | ✅ Complete | Typography + polish — 9 items |
| Batch 1 — Final | ✅ Complete | Daily report + TASKS.md |
| Batch 2 — Run 1 | ✅ Complete | Re-audit — 25 issues (overlap with Batch 1) |
| Batch 2 — Final | ✅ Complete | 4 remaining High bugs fixed + report |
| Batch 3 — Run 1 | ✅ Complete | Re-audit — catalogued 9 remaining items |
| Batch 3 — Run 2 | ✅ Complete | 8 fixes: H6, M3, M4, M5, B8, U8, A9, A10 |
| Batch 3 — Run 3 | ✅ Complete | UI upgrade — glass inputs, dark project cards, dark list rows (10 areas) |
