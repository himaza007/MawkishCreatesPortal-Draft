const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const announcementsRoutes = require('./routes/announcements');
const eventsRoutes = require('./routes/events');
const pipelinesRoutes = require('./routes/pipelines');
const resourcesRoutes = require('./routes/resources');
   
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mawkish-creates-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/pipelines', pipelinesRoutes);
app.use('/api/resources', resourcesRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Mawkish Creates Portal running at http://localhost:${PORT}`);
});
