const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobType: String,
  jobTitle: String,
  companyName: String,
  location: String,
  qualification: String,
  batch: String,
  experience: String,
  salary: String,
  applyDate: Date,
  expireDate: Date,
  description: String,
  selectionProcess: String,
  applicationFee: String,
  technology: [String],
  websiteUrl: String,
  detailsType: String,
  Shift: String,
  webUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Report: {
    type: Number,
    default: 0
  },
}, { timestamps: true });
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;