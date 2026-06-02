const express = require('express');
const router = express.Router();
const db = require('../db/database');

const auth = (req, res, next) => { next(); };

router.get('/', auth, (req, res) => {
  db.announcements.find({}).sort({ pinned: -1, createdAt: -1 }).exec((err, docs) => res.json(docs));
});

router.post('/', auth, (req, res) => {
  const ann = { ...req.body, author: req.session.user.name, createdAt: new Date() };
  db.announcements.insert(ann, (err, doc) => res.json(doc));
});

router.put('/:id', auth, (req, res) => {
  db.announcements.update({ _id: req.params.id }, { $set: req.body }, {}, () => res.json({ ok: true }));
});

router.delete('/:id', auth, (req, res) => {
  db.announcements.remove({ _id: req.params.id }, {}, () => res.json({ ok: true }));
});

module.exports = router;
