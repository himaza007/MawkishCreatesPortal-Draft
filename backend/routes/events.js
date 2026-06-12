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
  const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
  res.json((data || []).map(toClient));
});

router.post('/', canWrite, async (req, res) => {
  const { title, date, time, type, description, location } = req.body;
  const { data, error } = await supabase
    .from('events')
    .insert({ title, date, time, type, description, location, created_by: req.user.name })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.put('/:id', canWrite, async (req, res) => {
  const { title, date, time, type, description, location } = req.body;
  const update = {};
  if (title       !== undefined) update.title       = title;
  if (date        !== undefined) update.date        = date;
  if (time        !== undefined) update.time        = time;
  if (type        !== undefined) update.type        = type;
  if (description !== undefined) update.description = description;
  if (location    !== undefined) update.location    = location;
  await supabase.from('events').update(update).eq('id', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', canWrite, async (req, res) => {
  await supabase.from('events').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
