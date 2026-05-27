const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// Messages
router.post('/contact', async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;