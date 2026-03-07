import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import './App.css';

import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';
import Dashboard from './job_matching_component/pages/Dashboard';

function JobMatchingNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { label: 'Dashboard', path: '/job-matching/dashboard' },
        { label: 'Search', path: '/job-matching/search' },
        { label: 'Recommended', path: '/job-matching/recommended' },
        { label: 'Saved', path: '/job-matching/saved' },
        { label: 'Notifications', path: '/job-matching/notifications' },
        { label: 'Settings', path: '/job-matching/notifications/settings' }
    ];

    const isJobMatching = location.pathname === '/job-matching' || location.pathname.startsWith('/job-matching/');
    if (!isJobMatching) return null;

    return (
        <div className="container" style={{ padding: '12px 16px' }}>
            <div className="panel">
                <div className="row">
                    {items.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                type="button"
                                className={(active ? 'btn' : 'btnSecondary') + ' btnSmall'}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <JobMatchingNav />
                <Routes>
                    <Route path="/" element={<Navigate to="/job-matching" replace />} />

                    <Route path="/job-matching" element={<Navigate to="/job-matching/dashboard" replace />} />
                    <Route path="/job-matching/dashboard" element={<Dashboard />} />
                    <Route path="/job-matching/search" element={<JobSearch />} />
                    <Route path="/job-matching/recommended" element={<RecommendedJobs />} />
                    <Route path="/job-matching/saved" element={<SavedJobs />} />
                    <Route path="/job-matching/notifications" element={<Notifications />} />
                    <Route path="/job-matching/notifications/settings" element={<NotificationSettings />} />

                    {/* 404 Route */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;