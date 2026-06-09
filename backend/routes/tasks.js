const express = require('express');
const router = express.Router();
const db = require('../db/database');

const auth = (req, res, next) => {
  if (!req.session.user) {
    req.session.user = { name: 'Admin User', email: 'admin@mawkish.com', role: 'admin' };
  }
  next();
};

router.get('/', auth, (req, res) => {
  db.tasks.find({}).sort({ createdAt: -1 }).exec((err, tasks) => res.json(tasks));
});

router.post('/', auth, (req, res) => {
  const task = { ...req.body, createdAt: new Date(), createdBy: req.session.user.name };
  db.tasks.insert(task, (err, doc) => res.json(doc));
});

router.put('/:id', auth, (req, res) => {
  db.tasks.update({ _id: req.params.id }, { $set: req.body }, {}, (err) => res.json({ ok: true }));
});

router.delete('/:id', auth, (req, res) => {
  db.tasks.remove({ _id: req.params.id }, {}, (err) => res.json({ ok: true }));
});

module.exports = router;
