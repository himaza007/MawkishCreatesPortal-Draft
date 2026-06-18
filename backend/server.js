require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { ensureSeeded } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mawkish-dev-secret';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Seed initial data on first request
app.use(async (req, res, next) => {
  try { await ensureSeeded(); } catch (e) { console.error('Seed error:', e); }
  next();
});

// Attach user from JWT cookie to every request
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
});

// Serve built frontend (local dev only — Vercel serves public/ via @vercel/static)
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/pipelines',     require('./routes/pipelines'));
app.use('/api/resources',     require('./routes/resources'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Only listen when run directly (not on Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Mawkish Portal running on http://localhost:${PORT}`));
}

module.exports = app;
