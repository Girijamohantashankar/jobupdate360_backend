const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../models/User');


// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Forgot Password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const encryptedResetToken = CryptoJS.AES.encrypt(resetToken, process.env.ENCRYPTION_SECRET_KEY).toString();
        // const resetTokenExpiry = Date.now() + 3600000;
        const resetTokenExpiry = Date.now() + 2 * 60 * 1000;
        user.resetToken = encryptedResetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        const resetLink = `https://jobupdate360.in/reset-password/${resetToken}`;

        const filePath = path.join(__dirname, '../views/password-reset-email.html');
        let htmlTemplate = fs.readFileSync(filePath, 'utf8');
        htmlTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);

        await transporter.sendMail({
            // from: process.env.EMAIL_USER,
            from: `"jobupdate360" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: htmlTemplate,
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password route
router.post('/reset-password/:resetToken', async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Please provide both new password and confirm password' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const users = await User.find({});
        let user = null;

        for (let i = 0; i < users.length; i++) {
            if (users[i].resetToken) {
                const decryptedToken = CryptoJS.AES.decrypt(users[i].resetToken, process.env.ENCRYPTION_SECRET_KEY).toString(CryptoJS.enc.Utf8);
                if (decryptedToken === resetToken) {
                    user = users[i];
                    break;
                }
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        if (user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = newPassword;  
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;












module.exports = router;
