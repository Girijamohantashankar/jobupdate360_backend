const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true,  
    },
    rating: {
        type: Number,
        required: true, 
    },
    email: {
        type: String,
        required: true,  
    },
    phoneNumber: {
        type: String,
        required: true,  
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        default: 'view' 
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
