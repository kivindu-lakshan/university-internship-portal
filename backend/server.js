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

// Dev helper: list registered routes (avoid enabling in production)
if (process.env.NODE_ENV !== 'production') {
    app.get('/__debug/routes', (req, res) => {
        const routes = [];

        const addStack = (stack, prefix = '') => {
            if (!Array.isArray(stack)) return;

            stack.forEach((layer) => {
                if (!layer) return;

                if (layer.route && layer.route.path) {
                    const methods = Object.keys(layer.route.methods || {})
                        .filter((m) => layer.route.methods[m])
                        .map((m) => m.toUpperCase());
                    routes.push({ methods, path: `${prefix}${layer.route.path}` });
                    return;
                }

                if (layer.name === 'router' && layer.handle && Array.isArray(layer.handle.stack)) {
                    // Express stores the mount path in layer.regexp; keep it simple and just recurse.
                    addStack(layer.handle.stack, prefix);
                }
            });
        };

        addStack(app._router?.stack);
        res.json({ count: routes.length, routes });
    });
}

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