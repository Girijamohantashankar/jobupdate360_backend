const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const cron = require('node-cron');
const Report = require('../models/Report');

// create jobs
router.post('/createJob', authMiddleware, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      createdBy: req.user.id
    };


    const job = new Job(jobData);
    const saveJob = await job.save();

    res.status(201).json(saveJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Job post deleted automatically
async function deleteExpiredJobs() {
  // console.log('Cron job started at:', new Date().toLocaleString());
  try {
    const currentDate = new Date();
    // console.log(currentDate, 'currentDate');
    const expiredJobs = await Job.find({ expireDate: { $lt: currentDate } });

    // console.log('Found expired jobs:', expiredJobs);
    for (const job of expiredJobs) {
      await job.deleteOne(); // Use deleteOne method
    }
    // console.log('Expired job deletion completed.');
  } catch (error) {
    console.error('Error running expired job deletion:', error);
  }
}
cron.schedule('0 18 * * *', deleteExpiredJobs);


//  get all jobs
router.get('/allJobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// User JobPosts
router.get('/userPosts', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ createdBy: userId });
    if (!jobs) {
      return res.status(404).json({ message: 'No jobs found for this user' });
    }
    res.json({ jobs });
  } catch (error) {
    console.error('Error in /userPosts route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE job by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error in DELETE /job/:id route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User JOB Post
router.get('/EditJob/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ job });

  } catch (error) {
    console.error('Error in GET /EditJob/:id route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Job UPdate by ID/user Login
router.put('/updateEdit/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const jobData = req.body;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    Object.assign(job, jobData);
    await job.save();

    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error in PUT /updateEdit/:id route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// report jobs
router.get('/reportAllJobs', async (req, res) => {
  try {
    const jobs = await Report.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});













module.exports = router;
