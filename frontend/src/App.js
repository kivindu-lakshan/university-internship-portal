import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

import './App.css';

import JobSearch from './job_matching_component/pages/JobSearch';
import RecommendedJobs from './job_matching_component/pages/RecommendedJobs';
import SavedJobs from './job_matching_component/pages/SavedJobs';
import Notifications from './job_matching_component/pages/Notifications';
import NotificationSettings from './job_matching_component/pages/NotificationSettings';
import Dashboard from './job_matching_component/pages/Dashboard';

// Theme Context
const ThemeContext = React.createContext();

export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Modern Navigation Component
function Navigation() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    
    const navItems = [
        { path: '/job-matching/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/job-matching/search', label: 'Search Jobs', icon: '🔍' },
        { path: '/job-matching/recommended', label: 'Recommended', icon: '⭐' },
        { path: '/job-matching/saved', label: 'Saved Jobs', icon: '💾' },
        { path: '/job-matching/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/job-matching/notifications/settings', label: 'Settings', icon: '⚙️' }
    ];
    
    return (
        <div className="nav-container">
            <div className="nav-content">
                <Link to="/job-matching/dashboard" className="nav-logo">
                    CareerSync
                </Link>
                
                <div className="nav-buttons">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-button ${
                                location.pathname === item.path ? 'active' : ''
                            }`}
                        >
                            <span style={{ marginRight: '8px' }}>{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                    
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </div>
    );
}

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
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const themeContextValue = {
        theme,
        toggleTheme
    };
    
    return (
        <ThemeContext.Provider value={themeContextValue}>
            <Router>
                <div className="App">
                    <Navigation />
                    
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