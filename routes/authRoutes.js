const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
require('dotenv').config();
const sendWelcomeEmail = require('../utils/mailer');




// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
      if (err) {
        throw err;
      }
      const secretKey = process.env.ENCRYPTION_SECRET_KEY;
      const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
      res.json({ token: encryptedToken, message: 'Login successful' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password });
    await user.save();


    // Send the welcome email
    await sendWelcomeEmail(email, name);

    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, message: 'User created successfully' });
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
