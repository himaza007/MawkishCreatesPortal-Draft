const express = require('express');
const router = express.Router();
const db = require('../db/database');

const EDITORS = new Set(['Booso', 'Himaza', 'Faraz', 'Bianca']);

const auth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

const canWrite = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!EDITORS.has(req.session.user.name) && req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'View only access' });
  }
  next();
};

router.get('/', auth, (req, res) => {
  db.tasks.find({}).sort({ createdAt: -1 }).exec((err, tasks) => res.json(tasks));
});

router.post('/', canWrite, (req, res) => {
  const task = { ...req.body, createdAt: new Date(), createdBy: req.session.user.name };
  db.tasks.insert(task, (err, doc) => res.json(doc));
});

router.put('/:id', canWrite, (req, res) => {
  db.tasks.update({ _id: req.params.id }, { $set: req.body }, {}, (err) => res.json({ ok: true }));
});

router.delete('/:id', canWrite, (req, res) => {
  db.tasks.remove({ _id: req.params.id }, {}, (err) => res.json({ ok: true }));
});

module.exports = router;
