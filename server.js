const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/job', require('./routes/jobRoutes'));
app.use('/api/form', require('./routes/formRoutes'));
app.use('/api/auth', require('./routes/adminRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));
app.use('/api/user_controls', require('./routes/userControlsRouters'));
app.use('/api/feedbackUser', require('./routes/feedbackRoutes'));
app.use('/api/countUser', require('./routes/totalUserRoutes'));
app.use('/api/DownloadAllResume', require('./routes/Zip_resumeRoutes'));
app.use('/api/monthlyView', require('./routes/monthly_PostRoutes'));
app.use('/api/forgot', require('./routes/forgotRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
