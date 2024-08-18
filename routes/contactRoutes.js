const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');


// for User Contact form
router.post('/contact-us', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const existingMessage = await ContactMessage.findOne({ email });

    if (existingMessage) {
      return res.status(400).json({ message: 'You have already submitted a request.' });
    }
    const newContactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    await newContactMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// View All Contact Requests
router.get('/requests', async (req, res) => {
  try {
    const contacts = await ContactMessage.find(); 
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Delete  contact message 
router.delete('/requests/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    await ContactMessage.findByIdAndDelete(contactId); 
    res.status(200).json({ message: 'Contact request deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ message: 'Error deleting contact request', error });
  }
});



module.exports = router;
