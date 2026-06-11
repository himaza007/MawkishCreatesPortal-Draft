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
  db.pipelines.find({}).exec((err, docs) => res.json(docs));
});

router.post('/', canWrite, (req, res) => {
  db.pipelines.insert({ ...req.body, createdAt: new Date() }, (err, doc) => res.json(doc));
});

router.put('/:id', canWrite, (req, res) => {
  db.pipelines.update({ _id: req.params.id }, { $set: req.body }, {}, () => res.json({ ok: true }));
});

router.delete('/:id', canWrite, (req, res) => {
  db.pipelines.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
