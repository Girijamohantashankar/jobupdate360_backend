const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); 
const Report = require('../models/Report');

router.delete('/delete_job/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        // Delete the job
        await Job.findByIdAndDelete(jobId);
        // Delete associated reports
        await Report.deleteMany({ job_id: jobId });
        res.status(200).json({ message: 'Job and its reports deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job and reports', error });
    }
});


module.exports = router;
