const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.users.findOne({ email }, (err, user) => {
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, avatar: user.avatar };
    res.json({ user: req.session.user });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.session.user });
});

router.get('/users', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  db.users.find({}, { password: 0 }, (err, users) => res.json(users));
});

router.post('/users', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, password, role, department } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  db.users.insert({ name, email, password: hash, role: role || 'staff', department, avatar, createdAt: new Date() }, (err, doc) => {
    if (err) return res.status(400).json({ error: err.message });
    const { password: _, ...user } = doc;
    res.json(user);
  });
});

module.exports = router;
