import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';
import Dashboard from './job_matching_component/pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Auth Routes */}
                    <Route path="/" element={<h1>Welcome to University Internship Portal</h1>} />
                    <Route path="/register" element={<h1>Register Page</h1>} />
                    <Route path="/login" element={<h1>Login Page</h1>} />
                    <Route path="/verify-email/:token" element={<h1>Verify Email Page</h1>} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />

                    {/* Matching, Search Intelligence & Notifications */}
                    <Route path="/student/jobs/search" element={<JobSearch />} />
                    <Route path="/student/jobs/recommended" element={<RecommendedJobs />} />
                    <Route path="/student/jobs/saved" element={<SavedJobs />} />
                    <Route path="/student/notifications" element={<Notifications />} />
                    <Route path="/student/notifications/settings" element={<NotificationSettings />} />
                    <Route path="/student/dashboard/matching" element={<Dashboard />} />

                    {/* Employer Routes */}
                    <Route path="/employer/dashboard" element={<h1>Employer Dashboard</h1>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />

                    {/* 404 Route */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;