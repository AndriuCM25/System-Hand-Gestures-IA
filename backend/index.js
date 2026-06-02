const express  = require('express');
const cors     = require('cors');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const low      = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path     = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const app        = express();
const PORT       = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'handcontrol-secret-key-2026';

// ─── Base de datos JSON (lowdb) ───────────────────────────────────────────────
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db      = low(adapter);

// Estructura inicial
db.defaults({
  users:    [],
  gestures: [],
  _nextUserId:    1,
  _nextGestureId: 1
}).write();

// Usuario demo
if (!db.get('users').find({ email: 'demo@handcontrol.ai' }).value()) {
  const hash = bcrypt.hashSync('demo1234', 10);
  const id   = db.get('_nextUserId').value();
  db.get('users').push({ id, name: 'Demo User', email: 'demo@handcontrol.ai', password: hash, role: 'admin', created_at: new Date().toISOString() }).write();
  db.set('_nextUserId', id + 1).write();
  console.log('👤 Usuario demo: demo@handcontrol.ai / demo1234');
}

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://frontend-six-smoky-25.vercel.app',
        'https://frontend-1q9d64xe8-valentino-cms-projects.vercel.app',
      ],
  credentials: true
}));

app.use(express.json());

const requireAuth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try { req.user = jwt.verify(h.split(' ')[1], JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token inválido' }); }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos requeridos' });
  if (password.length < 6) return res.status(400).json({ error: 'Mínimo 6 caracteres' });
  if (db.get('users').find({ email: email.toLowerCase() }).value()) return res.status(400).json({ error: 'Email ya registrado' });

  const hash = bcrypt.hashSync(password, 10);
  const id   = db.get('_nextUserId').value();
  const user = { id, name, email: email.toLowerCase(), password: hash, role: 'user', created_at: new Date().toISOString() };
  db.get('users').push(user).write();
  db.set('_nextUserId', id + 1).write();

  const token = jwt.sign({ id, name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id, name, email: user.email, role: 'user' } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const row = db.get('users').find({ email: (email || '').toLowerCase() }).value();
  if (!row || !bcrypt.compareSync(password, row.password)) return res.status(401).json({ error: 'Credenciales incorrectas' });
  const token = jwt.sign({ id: row.id, name: row.name, email: row.email, role: row.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const row = db.get('users').find({ id: req.user.id }).value();
  if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ id: row.id, name: row.name, email: row.email, role: row.role, created_at: row.created_at });
});

// ─── Gestos ───────────────────────────────────────────────────────────────────
app.post('/api/gestures', requireAuth, (req, res) => {
  const { gesture, action, confidence } = req.body;
  if (!gesture) return res.status(400).json({ error: 'Gesto requerido' });
  const id      = db.get('_nextGestureId').value();
  const entry   = { id, user_id: req.user.id, gesture, action: action || '', confidence: confidence || 0, timestamp: new Date().toISOString() };
  db.get('gestures').push(entry).write();
  db.set('_nextGestureId', id + 1).write();
  res.status(201).json(entry);
});

app.get('/api/gestures', requireAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const rows  = db.get('gestures').filter({ user_id: req.user.id }).sortBy('timestamp').reverse().take(limit).value();
  res.json(rows);
});

app.delete('/api/gestures', requireAuth, (req, res) => {
  db.get('gestures').remove({ user_id: req.user.id }).write();
  res.json({ message: 'Historial limpiado' });
});

// ─── Stats ────────────────────────────────────────────────────────────────────
app.get('/api/stats', requireAuth, (req, res) => {
  const mine   = db.get('gestures').filter({ user_id: req.user.id }).value();
  const today  = new Date().toISOString().slice(0, 10);
  const todayG = mine.filter(g => g.timestamp.startsWith(today));

  // Agrupar por tipo
  const byType = {};
  mine.forEach(g => {
    if (!byType[g.gesture]) byType[g.gesture] = { gesture: g.gesture, count: 0, total_conf: 0 };
    byType[g.gesture].count++;
    byType[g.gesture].total_conf += g.confidence;
  });
  const gesturesByType = Object.values(byType)
    .map(g => ({ gesture: g.gesture, count: g.count, avg_confidence: +(g.total_conf / g.count * 100).toFixed(1) }))
    .sort((a, b) => b.count - a.count);

  res.json({
    totalGestures:  mine.length,
    todayGestures:  todayG.length,
    gesturesByType,
    recentGestures: mine.slice(0, 10),
    accuracy: 98.5,
    activeSessions: 1,
    users: db.get('users').size().value()
  });
});

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 HandControl API → http://localhost:' + PORT);
  console.log('   POST /api/auth/register | /api/auth/login | GET /api/auth/me');
  console.log('   POST/GET/DELETE /api/gestures | GET /api/stats');
  console.log('');
});
