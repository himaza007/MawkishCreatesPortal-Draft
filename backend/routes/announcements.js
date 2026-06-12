const express = require('express');
const router = express.Router();
const { supabase, toClient } = require('../db/database');

const EDITORS = new Set(['Booso', 'Himaza', 'Faraz', 'Bianca']);

const auth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

const canWrite = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!EDITORS.has(req.user.name) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'View only access' });
  }
  next();
};

router.get('/', auth, async (req, res) => {
  const { data } = await supabase
    .from('announcements').select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  res.json((data || []).map(toClient));
});

router.post('/', canWrite, async (req, res) => {
  const { title, content, priority, pinned } = req.body;
  const { data, error } = await supabase
    .from('announcements')
    .insert({ title, content, priority, pinned: !!pinned, author: req.user.name })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.put('/:id', canWrite, async (req, res) => {
  const { title, content, priority, pinned } = req.body;
  const update = {};
  if (title    !== undefined) update.title    = title;
  if (content  !== undefined) update.content  = content;
  if (priority !== undefined) update.priority = priority;
  if (pinned   !== undefined) update.pinned   = pinned;
  await supabase.from('announcements').update(update).eq('id', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', canWrite, async (req, res) => {
  await supabase.from('announcements').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
