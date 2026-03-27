# ArchStudio — Outstanding Tasks
*Last updated: Sentry Final Run 2026-03-27*

---

## Low Severity Bugs

| # | Issue | File / Location |
|---|-------|-----------------|
| A11 | `_generateCodeVerifier()` awaited unnecessarily (synchronous function) | `index.html` ~line 87 |
| A12 | Sidebar `<select>` status options are in English, not Hebrew | `index.html` — search for `Planning` option |
| A13 | First `<style>` block (`body{font-family:Arial}`) is dead CSS, overridden by second block | `index.html` line 11 |

---

## Feature Requests (from CLAUDE.md)

| # | Feature | Priority |
|---|---------|----------|
| C1 | Hebrew status labels throughout UI (Planning → תכנון, etc.) | High |
| C2 | גוש / חלקה / מגרש fields on project form | High |
| C3 | Mandatory document marking (block milestone completion if required docs missing) | Medium |
| C4 | More visible save indicator | Low |
| C5 | Convert task to subtask | Low |
| C6 | Manual section ordering | Low |

---

## Next Sentry Batch Recommendations

1. Hebrew status labels (A12 + C1 combined fix)
2. Add גוש / חלקה / מגרש project fields (C2)
3. Mandatory document marking (C3)
