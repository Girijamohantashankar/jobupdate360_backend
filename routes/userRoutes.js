const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get the user's name
router.get('/username', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ name: user.name });
    } catch (error) {
        console.error('Error in /username route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile details
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});






module.exports = router;
