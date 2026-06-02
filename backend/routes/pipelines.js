const express = require('express');
const router = express.Router();
const db = require('../db/database');

const auth = (req, res, next) => { next(); };

router.get('/', auth, (req, res) => {
  db.pipelines.find({}).exec((err, docs) => res.json(docs));
});

router.post('/', auth, (req, res) => {
  db.pipelines.insert({ ...req.body, createdAt: new Date() }, (err, doc) => res.json(doc));
});

router.put('/:id', auth, (req, res) => {
  db.pipelines.update({ _id: req.params.id }, { $set: req.body }, {}, () => res.json({ ok: true }));
});

router.delete('/:id', auth, (req, res) => {
  db.pipelines.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
