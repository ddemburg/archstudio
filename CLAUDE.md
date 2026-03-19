# ArchStudio — הקשר מלא ל-Claude

> **קרא את זה לפני כל דבר אחר.**

---

## פרטי פרויקט

- **Live:** https://ddemburg.github.io/archstudio/index.html
- **GitHub:** github.com/ddemburg/archstudio — branch: `multi-user`
- **קובץ מקומי:** `C:\Users\User\archstudio\index.html`
- **Git config:** email=dima@do-bonim.com, name=Dima
- **משתמש ראשי:** dima@do-bonim.com (admin, office_id=1)

---

## ארכיטקטורה

קובץ HTML בודד. אין שרת. אין build. אין bundler.

```
<body>
  <div id="root"></div>   ← חייב לפני script!
  <script type="text/babel">
    const {useState,useEffect,useRef,useCallback,useMemo}=React;
    /* כל ה-JS + JSX */
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
  </script>
</body>
```

**3 כללי מוות:**
1. `<script type="text/babel">` — חובה
2. `<div id="root">` לפני script
3. `const {useState,...}=React;` — לא import

---

## Stack

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | React 18 + Babel (browser) |
| Auth | Supabase Auth + Google OAuth (implicit flow) |
| Database | Supabase REST API |
| Files | Supabase Storage (bucket: project-docs) |
| Deploy | GitHub Pages (branch: multi-user) |

---

## Supabase

```javascript
const SUPABASE_URL  = 'https://uueriunjafzjpfptjdof.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### טבלאות
- **offices** — `id, name, created_at`
- **office_members** — `id, office_id, email, name, picture, role, assigned_projects[], active, joined_at`
- **office_data** — `id, office_id, data (JSONB), updated_at`
- **Storage bucket:** `project-docs` (private, RLS)

### RLS — מצב נוכחי ✅
כל הטבלאות מוגנות עם `authenticated` policy + `SECURITY DEFINER` function:
```sql
-- function:
CREATE OR REPLACE FUNCTION get_my_office_id()
RETURNS int LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT office_id FROM office_members
  WHERE email = auth.jwt()->>'email' AND active = true LIMIT 1
$$;

-- policy על office_members ו-office_data:
office_id = get_my_office_id()

-- policy על offices:
id = get_my_office_id()
```

### Supabase Auth — Google OAuth (implicit flow)
- Redirect URL: `https://ddemburg.github.io/archstudio/index.html`
- Token מגיע ב-hash: `#access_token=...`
- `gSignIn()` מפנה ל-`index.html` במפורש (חשוב! אחרת GitHub Pages מוחק את ה-hash)
- Google Client ID: `1049993992567-ek0ndfka0sd6opuron6n2j3ieknrs3fo.apps.googleusercontent.com`

---

## Auth Flow

```
1. gSignIn() → redirect לאתר של Supabase עם provider=google
2. Google → Supabase callback → redirect ל-index.html עם #access_token=...
3. gTrySilentSignIn() → קורא hash → שומר ב-sessionStorage('arch_session')
4. _sbSession מאותחל → sbHeaders() מחזיר Bearer token
5. apiLoad() טוען נתונים
```

### משתנים גלובליים
```javascript
let _sbSession   = null;   // {access_token, refresh_token, expires_at, user}
let _sbUserEmail = '';
```

---

## API Functions

```javascript
// Auth
async function gSignIn()              // redirect לגוגל
async function gTrySilentSignIn()     // קורא hash/sessionStorage
async function _sbRefreshSession(rt)
async function gSignOut()
function gIsSignedIn()
function sbHeaders(extra)
async function sbQuery(path, opts)

// Members
async function sbGetMember(email)
async function sbEnsureMember(email, name, picture)
async function apiLoad()
async function apiSave(data)
async function apiGetMembers()
async function apiAddMember(email, name, role, assignedProjects=[])
async function apiUpdateMember(email, role, assignedProjects=[])
async function apiRemoveMember(email)

// Storage
async function sbUploadFile(officeId, projectId, file)
async function sbGetSignedUrl(path)
async function sbDeleteFile(path)
```

---

## useApp Return Object

```javascript
{
  driveReady, driveSyncing, driveLastSave, driveError,
  projects, tasks, docs, reqs, approvs, committees, partners,
  templates, crm, leads, officeMembers,
  driveLoad, driveSave,
  manualBackup, autoBackup,
  addLog:(pid,entry),
  batchUpdTasks:(ids,ch),
  addProject, updProject, delProject,
  addTask, updTask, delTask, renameSection,
  addDoc, updDoc, delDoc, addReq, updReq, delReq,
  addApp, updApp, delApp,
  addCommittee, updCommittee, delCommittee,
  addPartner, updPartner, delPartner,
  addCRM, updCRM, delCRM,
  addLead, updLead, delLead,
  addLeadTask, updLeadTask, delLeadTask,
  saveTpl, delTpl,
}
```

---

## לוגיקת Tasks

### updTask — Cascade DOWN + Recalc UP
1. CASCADE DOWN — כל צאצאים מקבלים אותו סטטוס
2. RECALC UP — allDone→Done, allToDo→ToDo, מעורב→InProgress

### Task object
```javascript
{
  id, project_id, title, section,
  status,           // 'To Do' | 'In Progress' | 'Done' | 'Blocked'
  priority,         // 'High' | 'Medium' | 'Low'
  deadline, assignee_id,
  depends_on: [],   // יכול לכלול גם תת-משימות
  parent_task_id,
  notes: [],
  description,
  _ready,
  _ts_started, _ts_started_by,
  _ts_done, _ts_done_by,
  _ts_reverted, _ts_reverted_by,
}
```

### Project object — שדות נוספים
```javascript
{
  section_order: ['sec1','sec2'],         // סדר קטגוריות (drag & drop)
  task_order: { 'secName': ['id1','id2'] }, // סדר משימות בקטגוריה
  section_deps: { 'secA': ['secB'] },     // תלויות בין קטגוריות
}
```

---

## עץ קומפוננטים

```
App
├── useIsMobile() → MobileApp | DesktopApp
├── DriveLoginScreen
├── DriveBanner
├── ConfirmModal / useConfirm()
│
├── MobileApp (< 768px)
│   ├── MobileProjects
│   ├── MobileProject → MobileTaskRow, MobileTaskSheet, BottomSheet
│   ├── MobileAllTasks
│   ├── MobileSettings
│   └── MobileTabBar
│
└── Desktop (>= 768px)
    ├── Sidebar + FilterEditorModal (task filters)
    ├── Dashboard
    ├── ProjectDetail → TasksTab (drag sections+tasks), FlowTab,
    │                   MilestonesTab, DocsTab (upload), ReqsTab,
    │                   ApprovalsTab, ConsultantsTab, SettingsTab, LogTab
    ├── AllTasksPage (with activeFilter)
    ├── LeadsPage, CRMPage, ReportsPage
    ├── PartnersPage, CommitteesPage, TemplatesPage
    ├── AppSettingsPage, ClientPortal, NewProjectModal
    └── TaskModal (overlay)
```

---

## Roles

| role | הרשאות |
|------|---------|
| admin | הכל |
| manager | הכל חוץ מהגדרות משרד |
| drafter | רק פרויקטים שהוקצו |
| client | פורטל לקוח בלבד |

---

## פיצ'רים קיימים ✅

- Supabase Auth עם Google OAuth (implicit flow, עובד!)
- RLS מאובטח — כל משתמש רואה רק את המשרד שלו
- ניהול משתמשים + הגנה על מנהל אחרון
- כפתור יציאה (סיידבר + הגדרות)
- זיהוי אוטומטי משתמש לפי email
- פילטור אחראים לפי תפקיד + פרויקט
- היררכיית משימות מלאה + cascade
- קטגוריות + תלויות בין קטגוריות
- תלויות בין כל משימות (כולל תת-משימות)
- ⚡ readiness badge
- טיים-סטאמפ על שינוי סטטוס
- לוג פעילות לפרויקט
- CRM עם לקוחות מרובים
- גרירה לשינוי סדר קטגוריות ומשימות (שמור בפרויקט)
- מחיקת משימה עם חלון אישור מותאם (לא browser confirm)
- העלאת קבצים במסמכים (desktop + mobile)
- מובייל: layout נפרד, bottom nav, task sheet, camera
- פילטרי משימות בסיידבר (שמורים ב-localStorage)
- גיבוי ידני

---

## כללי עבודה

### עריכה — Python בלבד
```python
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('OLD', 'NEW')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
```

### Git
```bash
cd C:\Users\User\archstudio
git add index.html
git commit -m "תיאור"
git push origin multi-user
```

### לעולם לא
- Notepad/batch לעריכה (שובר anon key)
- `import` במקום destructure
- script לפני `<div id="root">`

---

## פיצ'רים מתוכננים

**גבוהה:**
- סטטוסים בעברית מותאמים
- שדות גוש/חלקה/מגרש
- סימון מסמכים חובה
- ועדת תכנון בעת יצירת פרויקט חדש

**בינונית:**
- אינדיקטור שמירה ברור
- convert task to subtask
- מובייל: תצוגת flow/kanban

**נמוכה:**
- תפוגת מסמכים
- סידור קטגוריות ב-drag במובייל
