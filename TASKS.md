# ArchStudio — Task Backlog
Last updated: 2026-03-30 (Sentry Final Run)

---

## High Priority

- [ ] **B1 — Glassmorphism cards/panels**
  Cards and panels still use `background:white`. Branding requires glass treatment.
  Blocker: need to confirm dark vs light background context per card before applying.
  Recipe: dark bg → `rgba(255,255,255,0.08) + blur(12px)`; light bg → `rgba(255,255,255,0.72) + blur(12px)`.

- [ ] **C1 — גוש/חלקה/מגרש fields in project settings**
  Three cadastral property fields requested in CLAUDE.md. Add to project settings form panel.

---

## Medium Priority

- [ ] **A7 — Wire real file upload in task attachments**
  Currently shows `alert()` placeholder. `sbUploadFile` already exists in codebase.
  Search: `alert('העלאת קבצים תהיה זמינה עם חיבור לשרת')` — replace with real upload handler.

- [ ] **A8 — Fix Google Drive auto-backup token**
  `autoBackup` references `_gAccessToken` which is always `''` in PKCE flow.
  Fix: use `_calToken` instead (where provider token is stored). Verify Drive scope is included.

- [ ] **C2 — Required document marking**
  Allow marking certain documents as required on a project.

- [ ] **C3 — Convert task to subtask**
  Allow converting a standalone task into a subtask of another task.

---

## Low Priority

- [ ] **A5 — Email not lowercased on `_sbRefreshSession`**
  ⚠️ Auth no-touch zone — handle with extreme care. Consider adding `.toLowerCase()` on `data.user?.email`.

- [ ] **A9 — Remove stale first `<style>` block**
  Dead CSS (~200 bytes): Arial font + table styles overridden by second style block.

- [ ] **A10 — FlowView empty-column edge case**
  SVG height calculation on empty columns may clip layout. Low crash risk.

- [ ] **C4 — Document expiry tracking**
  Track expiry dates on project documents.

- [ ] **D2 — Memoize FlowView SVG layout**
  `FlowView` recomputes full SVG layout on every render. Wrap in `useMemo`.
