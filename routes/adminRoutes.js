const express = require('express');
const router = express.Router();
require('dotenv').config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

router.post('/admin-login', (req, res) => {
    const { email, password } = req.body;

    if (email === adminEmail && password === adminPassword) {
        res.status(200).json({ message: 'Admin login successful!', token: 'admin-token' });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

module.exports = router;
