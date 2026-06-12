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
  const { data } = await supabase.from('pipelines').select('*').order('created_at', { ascending: false });
  res.json((data || []).map(toClient));
});

router.post('/', canWrite, async (req, res) => {
  const { client, stage, service, value, startDate, pm, status } = req.body;
  const { data, error } = await supabase
    .from('pipelines')
    .insert({ client, stage, service, value, pm, status, start_date: startDate })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.put('/:id', canWrite, async (req, res) => {
  const { client, stage, service, value, startDate, pm, status } = req.body;
  const update = {};
  if (client    !== undefined) update.client     = client;
  if (stage     !== undefined) update.stage      = stage;
  if (service   !== undefined) update.service    = service;
  if (value     !== undefined) update.value      = value;
  if (startDate !== undefined) update.start_date = startDate;
  if (pm        !== undefined) update.pm         = pm;
  if (status    !== undefined) update.status     = status;
  await supabase.from('pipelines').update(update).eq('id', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', canWrite, async (req, res) => {
  await supabase.from('pipelines').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
