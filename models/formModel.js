const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    portfolioUrl: {
        type: String,
        required: false,
    },
    pdf: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    highestQualification: {
        type: String,
        required: true,
    },
    totalExperience: {
        type: String,
        required: true,
    },
    interviewDate: {
        type: Date,
        required: true,
    },
    noticePeriod: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true,

    },
    createdBy: {
        type: String,
        required: true,

    },
}, {
    timestamps: true,
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
