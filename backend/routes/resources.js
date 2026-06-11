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
  db.resources.find({}).sort({ addedAt: -1 }).exec((err, docs) => res.json(docs));
});

router.post('/', canWrite, (req, res) => {
  db.resources.insert({ ...req.body, addedAt: new Date(), addedBy: req.session.user.name }, (err, doc) => res.json(doc));
});

router.delete('/:id', canWrite, (req, res) => {
  db.resources.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
