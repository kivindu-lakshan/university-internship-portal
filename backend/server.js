const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeDeadlineScheduler } = require('./job_matching_component/services/deadlineReminderService');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

const configuredOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
            if (isLocalhost || configuredOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'University Internship Portal API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./job_matching_component/routes/jobRoutes'));
app.use('/api/notifications', require('./job_matching_component/routes/notificationRoutes'));
app.use('/api/opportunity', require('./job_matching_component/routes/opportunityRoutes'));
app.use('/api/ai', require('./job_matching_component/routes/aiChatRoutes'));

// Initialize deadline reminder scheduler
initializeDeadlineScheduler();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Backend Server Ready on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log('═══════════════════════════════════════════\n');
    initializeDeadlineScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});