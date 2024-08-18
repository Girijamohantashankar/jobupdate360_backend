const express = require('express');
const router = express.Router();
const Post = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose'); // Import mongoose

router.get('/monthly-post-views', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const objectId = new mongoose.Types.ObjectId(userId);
    const posts = await Post.aggregate([
      {
        $match: {
          createdBy: objectId,
          createdAt: { $gte: startOfYear, $lt: endOfYear }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const monthlyViews = Array(12).fill(0);
    posts.forEach(post => {
      monthlyViews[post._id - 1] = post.count;
    });
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    res.json({ months, views: monthlyViews });
  } catch (error) {
    console.error('Error fetching monthly post views:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;
