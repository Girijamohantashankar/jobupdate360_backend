const mongoose = require('mongoose');

const jobReportSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true,
        unique: true
    },
    reports: [{
        problem: {
            type: String,
            required: true
        },
        description: String
    }],
    reportCount: {
        type: Number,
        default: 0
    }
});

const Report = mongoose.model('Report', jobReportSchema);

module.exports = Report;
