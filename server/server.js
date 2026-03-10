const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1049993992567-ek0ndfka0sd6opuron6n2j3ieknrs3fo.apps.googleusercontent.com';

const ROLES = { ADMIN: 'admin', MANAGER: 'manager', DRAFTER: 'drafter', CLIENT: 'client' };
const PERMISSIONS = {
  admin:   ['all'],
  manager: ['projects','tasks','docs','crm','leads','reports','partners','committees','templates'],
  drafter: ['assigned_projects','tasks','docs'],
  client:  ['portal'],
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors({
  origin: ['https://ddemburg.github.io','http://localhost:3000','http://localhost:5500','http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const p = ticket.getPayload();
    return { email: p.email, name: p.name, picture: p.picture };
  } catch (e) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) return null;
      const info = await res.json();
      return { email: info.email, name: info.name, picture: info.picture };
    } catch (e2) { return null; }
  }
}

async function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  const user = await verifyGoogleToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
}

async function getMember(email) {
  const r = await pool.query(
    `SELECT m.*, o.name as office_name FROM office_members m JOIN offices o ON o.id=m.office_id WHERE m.email=$1 AND m.active=TRUE LIMIT 1`,
    [email]
  );
  return r.rows[0] || null;
}

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS offices (
      id SERIAL PRIMARY KEY,
      name TEXT DEFAULT 'המשרד שלי',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS office_members (
      id SERIAL PRIMARY KEY,
      office_id INTEGER REFERENCES offices(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      name TEXT,
      picture TEXT,
      role TEXT NOT NULL DEFAULT 'drafter',
      assigned_projects TEXT[] DEFAULT '{}',
      active BOOLEAN DEFAULT TRUE,
      joined_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(office_id, email)
    );
    CREATE TABLE IF NOT EXISTS office_data (
      office_id INTEGER REFERENCES offices(id) ON DELETE CASCADE PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('DB ready');
}

app.get('/', (req, res) => res.json({ status: 'ArchStudio API v2' }));

// Login
app.post('/api/login', auth, async (req, res) => {
  try {
    const { email, name, picture } = req.user;
    let member = await getMember(email);

    if (!member) {
      const office = await pool.query('INSERT INTO offices (name) VALUES ($1) RETURNING id', ['המשרד שלי']);
      const oid = office.rows[0].id;
      await pool.query(`INSERT INTO office_members (office_id,email,name,picture,role) VALUES ($1,$2,$3,$4,'admin')`, [oid, email, name, picture]);
      await pool.query('INSERT INTO office_data (office_id,data) VALUES ($1,$2)', [oid, JSON.stringify({ projects:[],tasks:[],docs:[],reqs:[],approvs:[],committees:[],partners:[],templates:[],crm:[],leads:[] })]);
      member = await getMember(email);
    } else {
      await pool.query('UPDATE office_members SET name=$1,picture=$2 WHERE email=$3', [name, picture, email]);
    }

    const members = await pool.query(
      'SELECT email,name,picture,role,assigned_projects FROM office_members WHERE office_id=$1 AND active=TRUE ORDER BY joined_at',
      [member.office_id]
    );

    res.json({ user:{email,name,picture}, role:member.role, officeId:member.office_id, officeName:member.office_name, assignedProjects:member.assigned_projects||[], permissions:PERMISSIONS[member.role]||[], members:members.rows });
  } catch(e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// Load data
app.get('/api/data', auth, async (req, res) => {
  try {
    const member = await getMember(req.user.email);
    if (!member) return res.status(403).json({ error: 'Not a member' });
    if (member.role === 'client') return res.status(403).json({ error: 'Use portal' });

    const r = await pool.query('SELECT data FROM office_data WHERE office_id=$1', [member.office_id]);
    let data = r.rows[0]?.data || {};

    if (member.role === 'drafter') {
      const assigned = member.assigned_projects || [];
      data = { ...data,
        projects: (data.projects||[]).filter(p => assigned.includes(p.id)),
        tasks:    (data.tasks||[]).filter(t => assigned.includes(t.project_id)),
        docs:     (data.docs||[]).filter(d => assigned.includes(d.project_id)),
        reqs:     (data.reqs||[]).filter(r => assigned.includes(r.project_id)),
        approvs:  (data.approvs||[]).filter(a => assigned.includes(a.project_id)),
        crm: [], leads: [],
      };
    }
    res.json(data);
  } catch(e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// Save data
app.post('/api/data', auth, async (req, res) => {
  try {
    const member = await getMember(req.user.email);
    if (!member) return res.status(403).json({ error: 'Not a member' });
    if (member.role === 'client') return res.status(403).json({ error: 'No write access' });

    if (member.role === 'drafter') {
      const assigned = member.assigned_projects || [];
      const cur = await pool.query('SELECT data FROM office_data WHERE office_id=$1', [member.office_id]);
      const existing = cur.rows[0]?.data || {};
      const merged = { ...existing,
        tasks: [...(existing.tasks||[]).filter(t=>!assigned.includes(t.project_id)), ...(req.body.tasks||[]).filter(t=>assigned.includes(t.project_id))],
        docs:  [...(existing.docs||[]).filter(d=>!assigned.includes(d.project_id)),  ...(req.body.docs||[]).filter(d=>assigned.includes(d.project_id))],
      };
      await pool.query('UPDATE office_data SET data=$1,updated_at=NOW() WHERE office_id=$2', [JSON.stringify(merged), member.office_id]);
    } else {
      await pool.query(`INSERT INTO office_data (office_id,data,updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (office_id) DO UPDATE SET data=$2,updated_at=NOW()`, [member.office_id, JSON.stringify(req.body)]);
    }
    res.json({ ok: true });
  } catch(e) { console.error(e); res.status(500).json({ error: e.message }); }
});

// Get members
app.get('/api/members', auth, async (req, res) => {
  try {
    const member = await getMember(req.user.email);
    if (!member) return res.status(403).json({ error: 'Not a member' });
    const r = await pool.query('SELECT email,name,picture,role,assigned_projects,joined_at FROM office_members WHERE office_id=$1 AND active=TRUE ORDER BY joined_at', [member.office_id]);
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Add / update member (admin only)
app.post('/api/members', auth, async (req, res) => {
  try {
    const me = await getMember(req.user.email);
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
    const { email, name, role, assignedProjects } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'email and role required' });
    await pool.query(
      `INSERT INTO office_members (office_id,email,name,role,assigned_projects) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (office_id,email) DO UPDATE SET role=$4,assigned_projects=$5,active=TRUE`,
      [me.office_id, email, name||email, role, assignedProjects||[]]
    );
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update member
app.patch('/api/members/:email', auth, async (req, res) => {
  try {
    const me = await getMember(req.user.email);
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
    const { role, assignedProjects } = req.body;
    await pool.query('UPDATE office_members SET role=$1,assigned_projects=$2 WHERE office_id=$3 AND email=$4', [role, assignedProjects||[], me.office_id, req.params.email]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Remove member
app.delete('/api/members/:email', auth, async (req, res) => {
  try {
    const me = await getMember(req.user.email);
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
    await pool.query('UPDATE office_members SET active=FALSE WHERE office_id=$1 AND email=$2', [me.office_id, req.params.email]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Office settings
app.patch('/api/office', auth, async (req, res) => {
  try {
    const me = await getMember(req.user.email);
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
    await pool.query('UPDATE offices SET name=$1 WHERE id=$2', [req.body.name, me.office_id]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`ArchStudio server on port ${PORT}`));
}).catch(console.error);
