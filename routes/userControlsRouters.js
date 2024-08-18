// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/all_user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user status
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = req.body.status;
      await user.save();
      res.json({ message: 'User status updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
