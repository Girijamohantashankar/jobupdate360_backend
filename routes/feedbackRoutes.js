const express = require('express');
const Feedback = require('../models/feedback');
const router = express.Router();


// TO Save the feedback 
router.post('/feedback', async (req, res) => {
    const { feedback, rating, email, phoneNumber } = req.body;
    if (!feedback || !rating || !email || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newFeedback = new Feedback({ feedback, rating, email, phoneNumber });
        await newFeedback.save();
        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ message: 'Failed to submit feedback', error: err });
    }
});

// To Retrieve status-->"view" feedback
router.get('/feedbackView', (req, res) => {
    Feedback.find({ status: 'view' })
        .then(feedbacks => res.json(feedbacks))
        .catch(err => res.status(400).send(err));
});

// updated feedback status
router.patch('/feedback/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedFeedback);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete feedback by ID
router.delete('/feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        res.status(400).send(err);
    }
});


// To Retrieve status-->"accepted" feedback
router.get('/feedbackAccepted', (req, res) => {
    Feedback.find({ status: 'accepted' })
        .then(feedbacks => res.json(feedbacks))
        .catch(err => res.status(400).send(err));
});


module.exports = router;
