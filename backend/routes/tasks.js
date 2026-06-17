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
  const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  res.json((data || []).map(toClient));
});

router.post('/', canWrite, async (req, res) => {
  const { title, description, status, priority, assignee, assignedTeam, dueDate, tags } = req.body;
  const insert = { title, description, status, priority, assignee, tags, due_date: dueDate, created_by: req.user.name };
  if (assignedTeam) insert.assigned_team = assignedTeam;
  const { data, error } = await supabase.from('tasks').insert(insert).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClient(data));
});

router.put('/:id', canWrite, async (req, res) => {
  const { title, description, status, priority, assignee, assignedTeam, dueDate, tags } = req.body;
  const update = {};
  if (title       !== undefined) update.title       = title;
  if (description !== undefined) update.description = description;
  if (status      !== undefined) update.status      = status;
  if (priority    !== undefined) update.priority    = priority;
  if (assignee    !== undefined) update.assignee    = assignee;
  if (assignedTeam)              update.assigned_team = assignedTeam;
  if (dueDate     !== undefined) update.due_date    = dueDate;
  if (tags        !== undefined) update.tags        = tags;
  const { error } = await supabase.from('tasks').update(update).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'in-progress', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const { data: task, error: taskError } = await supabase.from('tasks').select('*').eq('id', req.params.id).single();
  if (!task || taskError) return res.status(404).json({ error: 'Task not found' });

  const { name, role, department } = req.user;
  const allowed = role === 'admin' || task.assignee === name || (task.assigned_team && task.assigned_team === department);
  if (!allowed) return res.status(403).json({ error: 'Not authorized to update this task status' });

  await supabase.from('tasks').update({ status }).eq('id', req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', canWrite, async (req, res) => {
  await supabase.from('tasks').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
