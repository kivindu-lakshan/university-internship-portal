const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || true,
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'University Internship Portal API is running' });
});

// Routes will be added here later
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./job_matching_component/routes/jobRoutes'));
app.use('/api/notifications', require('./job_matching_component/routes/notificationRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});