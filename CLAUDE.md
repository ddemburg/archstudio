# ArchStudio — הקשר מלא ל-Claude

> **קרא את זה לפני כל דבר אחר.**

---

## פרטי פרויקט

- **Live:** https://do-bonim-manage.netlify.app
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
| Auth | Supabase Auth + Google OAuth |
| Database | Supabase REST API |
| Files | Supabase Storage |
| Deploy | **Netlify** (branch: multi-user) ← שונה מ-GitHub Pages |

---

## Netlify Deploy

### למה עברנו מ-GitHub Pages
GitHub Pages לא תומך ב-redirect rules. אחרי OAuth, Supabase מחזיר `#access_token` ב-URL — על GitHub Pages, רענון הדף נותן 404. Netlify פותר את זה.

### קובץ `_redirects` (חובה בשורש הריפו)
```
/*    /index.html   200
```
קובץ זה חייב להיות קיים ב-branch `multi-user`. בלעדיו — OAuth לא עובד.

### הגדרות Netlify
- **Repo:** github.com/ddemburg/archstudio
- **Branch:** multi-user
- **Build command:** (ריק — אין build)
- **Publish directory:** `.` (שורש)

### Git לאחר שינויים
```bash
cd C:\Users\User\archstudio
git add index.html
git commit -m "תיאור"
git push origin multi-user
```
Netlify מ-deploy אוטומטית עם כל push.

---

## Supabase

```javascript
const SUPABASE_URL  = 'https://uueriunjafzjpfptjdof.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZXJpdW5qYWZ6anBmcHRqZG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTY2ODcsImV4cCI6MjA4ODU3MjY4N30.gfn_L4C7tXjA-7xGmNiY-3QNKsAV-BWiCSPQc7q1hO4';
```

### טבלאות
- **offices** — `id, name, created_at`
- **office_members** — `id, office_id, email, name, picture, role, assigned_projects[], active, joined_at`
- **office_data** — `id, office_id, data (JSONB), updated_at`
- **Storage bucket:** `project-docs` (private, RLS)

### RLS
**מצב נוכחי: `authenticated` policies פעילות** — כל גישה דורשת Bearer token.
Helper functions: `get_my_office_id()`, `get_my_role()` — SECURITY DEFINER, מחזירות ערכים לפי `auth.email()`.

### Supabase Auth — Google OAuth (עודכן ל-Netlify)
- Callback URL: `https://uueriunjafzjpfptjdof.supabase.co/auth/v1/callback`
- **Site URL: `https://do-bonim-manage.netlify.app`** ← עודכן
- **Redirect URL: `https://do-bonim-manage.netlify.app`** ← עודכן
- Google Client ID: `1049993992567-ek0ndfka0sd6opuron6n2j3ieknrs3fo.apps.googleusercontent.com`

### הגדרות Google OAuth Console (עודכן)
- **Authorized redirect URIs:** `https://uueriunjafzjpfptjdof.supabase.co/auth/v1/callback` (לא השתנה)
- **Authorized JavaScript origins:** `https://do-bonim-manage.netlify.app` ← עודכן

---

## Auth Flow (Supabase Auth)

```
1. gSignIn() → redirect: /auth/v1/authorize?provider=google
2. Google → Supabase callback → redirect לאתר עם #access_token
3. gTrySilentSignIn() → קורא hash → שומר ב-sessionStorage('arch_session')
4. _sbSession מאותחל → sbHeaders() מחזיר Bearer token
5. apiLoad() טוען נתונים
```

**הערה:** `redirectTo` בנוי דינמית מ-`window.location.origin + window.location.pathname` — לא צריך לשנות קוד בעת מעבר ל-Netlify.

### משתנים גלובליים
```javascript
let _sbSession   = null;   // {access_token, refresh_token, expires_at, user}
let _sbUserEmail = '';
let _gAccessToken = '';    // לגיבוי Google Drive בלבד
```

---


## API Functions

```javascript
// Auth
async function gSignIn()
async function gTrySilentSignIn()
async function _sbRefreshSession(refreshToken)
async function gSignOut()
function gIsSignedIn()
function sbAuthHeaders(extra)
function sbHeaders(extra)        // alias
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
  depends_on: [],
  parent_task_id,
  notes: [],
  description,
  _ready,
  _ts_started, _ts_started_by,
  _ts_done, _ts_done_by,
  _ts_reverted, _ts_reverted_by,
}
```

### Section Categories
- `section_deps` בפרויקט: `{ 'secA': ['secB'] }`
- עיגול ✓ → מסמן כל המשימות + subtasks
- ⚡ badge כשתלויות הושלמו

---

## עץ קומפוננטים

```
App
├── DriveLoginScreen
├── DriveBanner
└── main
    ├── Dashboard
    ├── ProjectDetail → TasksTab, FlowTab, MilestonesTab,
    │                   DocsTab, ReqsTab, ApprovalsTab,
    │                   ConsultantsTab, SettingsTab, LogTab
    ├── AllTasksPage, LeadsPage, CRMPage, ReportsPage
    ├── PartnersPage, CommitteesPage, TemplatesPage
    ├── AppSettingsPage, ClientPortal, NewProjectModal
    └── TaskModal (overlay)
```

---

## עקרון מרכזי: משתמשים = צוות

`office_members` הוא **מקור האמת היחיד** לאנשי הצוות.
- אדמין מוסיף משתמש → מגדיר תפקיד → הוא מיד מקבל גישה + מופיע בכל מקום באפליקציה
- אין רשימת "שותפים" נפרדת — `partners` ב-`office_data` מיועד לדיפרקציה ויוחלף
- `PartnersPage` יאוחד עם ניהול המשתמשים (refactor מתוכנן)

## Roles

| role | שם בממשק | הרשאות | מי יכול להוסיף |
|------|----------|---------|----------------|
| admin | מנהל ראשי | הכל | admin בלבד |
| manager | מנהל שותף | הכל חוץ מהגדרות משרד | admin בלבד |
| drafter | עובד | רק פרויקטים שהוקצו | admin + manager |
| client | לקוח | פורטל לקוח בלבד | admin + manager |

---

## פיצ'רים קיימים ✅

- Supabase Auth עם Google OAuth
- ניהול משתמשים + הגנה על מנהל אחרון
- כפתור יציאה (סיידבר + הגדרות)
- זיהוי אוטומטי משתמש לפי email
- פילטור אחראים לפי תפקיד + פרויקט
- היררכיית משימות מלאה + cascade
- קטגוריות כמשימות-אב + תלויות בין קטגוריות
- חיווי ⚡ readiness
- טיים-סטאמפ על שינוי סטטוס
- לוג פעילות לפרויקט (טאב + כפתור בהגדרות)
- לקוחות מרובים מ-CRM בפרויקט
- שדה ת"ז ב-CRM
- עריכה inline ב-CRM
- חיפוש CRM בהוספת לקוח
- תיקון חיפוש תלויות (פרויקט נוכחי ראשון)
- הערות עם שם כותב נכון
- גיבוי 3-2-1 (Supabase + Drive + GitHub)
- RLS authenticated policies על כל הטבלאות (get_my_office_id / get_my_role)
- Deploy ל-Netlify עם `_redirects` לתמיכה ב-OAuth
- הגנה: משתמש לא רשום → שגיאה ברורה במסך כניסה
- email נשמר lowercase בכל מקום (מניעת case mismatch)

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
Netlify מ-deploy אוטומטית — אין צורך בשום פעולה נוספת.

### לעולם לא
- Notepad/batch לעריכה (שובר anon key)
- `import` במקום destructure
- script לפני `<div id="root">`
- לשנות את קובץ `_redirects` (שובר OAuth)

---

## פיצ'רים מתוכננים

**גבוהה:**
- **איחוד partners + office_members** ← הדבר הבא! `db.partners` יגיע מ-`officeMembers`, `PartnersPage` יהפוך לניהול צוות
- סטטוסים בעברית מותאמים
- שדות גוש/חלקה/מגרש
- סימון מסמכים חובה

**בינונית:**
- אינדיקטור שמירה
- convert task to subtask

**נמוכה:**
- תפוגת מסמכים
- סידור קטגוריות ידני
