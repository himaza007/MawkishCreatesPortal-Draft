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
  const { data } = await supabase.from('resources').select('*').order('added_at', { ascending: false });
  res.json((data || []).map(toClient));
});

router.post('/', canWrite, async (req, res) => {
  const { title, category, description, url, type } = req.body;
  const { data, error } = await supabase
    .from('resources')
    .insert({ title, category, description, url, type, added_by: req.user.name })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.put('/:id', canWrite, async (req, res) => {
  const { title, category, description, url, type } = req.body;
  const { data, error } = await supabase
    .from('resources')
    .update({ title, category, description, url, type })
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.delete('/:id', canWrite, async (req, res) => {
  await supabase.from('resources').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
