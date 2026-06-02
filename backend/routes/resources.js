const express = require('express');
const router = express.Router();
const db = require('../db/database');

const auth = (req, res, next) => { next(); };

router.get('/', auth, (req, res) => {
  db.resources.find({}).sort({ addedAt: -1 }).exec((err, docs) => res.json(docs));
});

router.post('/', auth, (req, res) => {
  db.resources.insert({ ...req.body, addedAt: new Date(), addedBy: req.session.user.name }, (err, doc) => res.json(doc));
});

router.delete('/:id', auth, (req, res) => {
  db.resources.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
