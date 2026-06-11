const express = require('express');
const router = express.Router();
const db = require('../db/database');

const auth = (req, res, next) => { next(); };

router.get('/', auth, (req, res) => {
  db.events.find({}).sort({ date: 1 }).exec((err, docs) => res.json(docs));
});

router.post('/', auth, (req, res) => {
  db.events.insert({ ...req.body, createdBy: req.session.user.name }, (err, doc) => res.json(doc));
});

router.put('/:id', auth, (req, res) => {
  db.events.update({ _id: req.params.id }, { $set: req.body }, {}, () => res.json({ ok: true }));
});

router.delete('/:id', auth, (req, res) => {
  db.events.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
