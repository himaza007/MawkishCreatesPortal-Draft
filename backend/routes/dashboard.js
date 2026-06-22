const express = require('express');
const router = express.Router();
const { supabase, toClient } = require('../db/database');

const auth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

router.get('/', auth, async (req, res) => {
  const [tasks, announcements, events, pipelines] = await Promise.all([
    supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    supabase.from('events').select('*').order('date', { ascending: true }),
    supabase.from('pipelines').select('*').order('created_at', { ascending: false }),
  ]);

  res.json({
    tasks:         (tasks.data         || []).map(toClient),
    announcements: (announcements.data || []).map(toClient),
    events:        (events.data        || []).map(toClient),
    pipelines:     (pipelines.data     || []).map(toClient),
  });
});

module.exports = router;
