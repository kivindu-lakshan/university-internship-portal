import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import './App.css';

import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';
import Dashboard from './job_matching_component/pages/Dashboard';
import OpportunityCentre from './job_matching_component/pages/OpportunityCentre';

// Theme Context
const ThemeContext = React.createContext();

export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Page transition wrapper
function PageWrapper({ children, delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    
    return (
        <div className={`page-wrapper ${isVisible ? 'animate-fade-in' : ''}`}>
            {children}
        </div>
    );
}

function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('careersync-theme');
        return saved || 'light';
    });
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('careersync-theme', theme);
    }, [theme]);
    
    const themeContextValue = {
        theme
    };
    
    return (
        <ThemeContext.Provider value={themeContextValue}>
            <Router>
                <div className="App">
                    
                    <Routes>
                        <Route path="/" element={<Navigate to="/job-matching" replace />} />
                        <Route path="/job-matching" element={<Navigate to="/job-matching/dashboard" replace />} />
                        
                        <Route 
                            path="/job-matching/dashboard" 
                            element={
                                <PageWrapper>
                                    <Dashboard />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/opportunity" 
                            element={
                                <PageWrapper delay={100}>
                                    <OpportunityCentre />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/search" 
                            element={
                                <PageWrapper delay={100}>
                                    <JobSearch />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/recommended" 
                            element={
                                <PageWrapper delay={150}>
                                    <RecommendedJobs />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/saved" 
                            element={
                                <PageWrapper delay={200}>
                                    <SavedJobs />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/notifications" 
                            element={
                                <PageWrapper delay={100}>
                                    <Notifications />
                                </PageWrapper>
                            } 
                        />
                        <Route 
                            path="/job-matching/notifications/settings" 
                            element={
                                <PageWrapper delay={150}>
                                    <NotificationSettings />
                                </PageWrapper>
                            } 
                        />
                        
                        {/* Enhanced 404 Page */}
                        <Route 
                            path="*" 
                            element={
                                <PageWrapper>
                                    <div className="page">
                                        <div className="container">
                                            <div className="page-header">
                                                <h1 className="page-title">404 - Page Not Found</h1>
                                                <p className="page-subtitle">
                                                    The page you're looking for doesn't exist.
                                                </p>
                                                <div className="spacer-8" />
                                                <Link to="/job-matching/dashboard" className="btn-primary">
                                                    Go to Dashboard
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </PageWrapper>
                            } 
                        />
                    </Routes>
                </div>
            </Router>
        </ThemeContext.Provider>
    );
}

export default App;