const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'mawkish-dev-secret';
const isProd = process.env.NODE_ENV === 'production';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user } = await supabase
    .from('users').select('*').eq('email', email).single();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, avatar: user.avatar };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user: payload });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: req.user });
});

router.get('/users', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { data } = await supabase.from('users').select('id, name, email, role, department, avatar');
  res.json(data || []);
});

router.post('/users', async (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, password, role, department } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password: hash, role: role || 'staff', department, avatar })
    .select('id, name, email, role, department, avatar')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
