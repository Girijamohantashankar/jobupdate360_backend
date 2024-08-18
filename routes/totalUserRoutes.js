const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



// To get the total number of users
router.get('/totalUsers', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        res.json({ totalUsers });
    } catch (error) {
        console.error('Error in /totalUsers route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// To get the number of blocked users
router.get('/blockedUsers', async (req, res) => {
    try {
        const blockedUsers = await User.countDocuments({ status: 'blocked' });
        res.json({ blockedUsers });
    } catch (error) {
        console.error('Error in /blockedUsers route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// To get the number of active users
router.get('/activeUsers', async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({ status: 'active' });
        res.json({ activeUsers });
    } catch (error) {
        console.error('Error in /activeUsers route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// To get the total number of jobs
router.get('/totalJobs', async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments({});
        res.json({ totalJobs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Monthly jobs post
router.get('/monthlyJobCounts', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthlyCounts = Array(12).fill(0);
        const results = await Job.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
        ]);
        results.forEach((result) => {
            monthlyCounts[result._id - 1] = result.count;
        });
        res.json({ monthlyCounts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






module.exports = router;
