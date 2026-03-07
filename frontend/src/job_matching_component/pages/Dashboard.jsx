import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiBell, FiTrendingUp, FiSearch, FiBookmark, FiTarget, FiStar, FiEdit3, FiAlertTriangle, FiZap, FiRotateCw } from 'react-icons/fi';
import { getRecommendedJobs, getSavedJobs } from '../../services/jobService';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

// Modern Stat Card Component
function StatCard({ icon, label, value, trend, color = 'var(--primary-500)', delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedValue, setAnimatedValue] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    
    useEffect(() => {
        if (isVisible && typeof value === 'number') {
            const duration = 1000;
            const steps = 30;
            const increment = value / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setAnimatedValue(value);
                    clearInterval(timer);
                } else {
                    setAnimatedValue(Math.floor(current));
                }
            }, duration / steps);
            
            return () => clearInterval(timer);
        } else {
            setAnimatedValue(value);
        }
    }, [isVisible, value]);
    
    return (
        <div 
            className={`modern-card ${isVisible ? 'animate-fade-in' : ''}`}
            style={{ 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                border: `1px solid ${color}30`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: `${color}10`,
                borderRadius: '50%',
                zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '12px'
                }}>
                    {icon}
                </div>
                
                <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: color,
                    marginBottom: '8px',
                    fontFamily: 'monospace'
                }}>
                    {typeof animatedValue === 'number' ? animatedValue : value}
                </div>
                
                <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--secondary-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </div>
                
                    <div style={{
                        marginTop: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: trend > 0 ? 'var(--success-500)20' : 'var(--error-500)20',
                        color: trend > 0 ? 'var(--success-500)' : 'var(--error-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                    }}>
                        <FiTrendingUp style={{ transform: trend < 0 ? 'scaleY(-1)' : 'none' }} /> {Math.abs(trend)}% this week
                    </div>
                )}
            </div>
        </div>
    );
}

// Activity Timeline Component
function ActivityTimeline({ activities }) {
    return (
        <div className="glass-panel">
            <h3 style={{ 
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FiTrendingUp /> Recent Activity
            </h3>
            
            <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'linear-gradient(to bottom, var(--primary-500), var(--accent-500))',
                    borderRadius: '1px'
                }} />
                
                {activities.map((activity, index) => (
                    <div 
                        key={index}
                        className="animate-fade-in"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            marginBottom: index < activities.length - 1 ? '24px' : '0',
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Timeline dot */}
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: activity.color || 'var(--primary-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${activity.color || 'var(--primary-500)'}30`
                        }}>
                            {activity.icon}
                        </div>
                        
                        {/* Activity content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: '600',
                                color: 'var(--secondary-800)',
                                marginBottom: '4px'
                            }}>
                                {activity.title}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--secondary-600)',
                                marginBottom: '4px'
                            }}>
                                {activity.description}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--secondary-400)'
                            }}>
                                {activity.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick Actions Component
function QuickActions({ onActionClick }) {
    const actions = [
        { 
            id: 'search', 
            label: 'Search Jobs', 
            icon: <FiSearch />, 
            color: 'var(--primary-500)',
            path: '/job-matching/search'
        },
        { 
            id: 'recommended', 
            label: 'View Recommendations', 
            icon: <FiStar />, 
            color: 'var(--accent-500)',
            path: '/job-matching/recommended'
        },
        { 
            id: 'saved', 
            label: 'Saved Jobs', 
            icon: <FiBookmark />, 
            color: 'var(--success-500)',
            path: '/job-matching/saved'
        },
        { 
            id: 'notifications', 
            label: 'Notifications', 
            icon: <FiBell />, 
            color: 'var(--warning-500)',
            path: '/job-matching/notifications'
        }
    ];
    
    return (
        <div className="glass-panel">
            <h3 style={{ 
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FiTarget /> Quick Actions
            </h3>
            
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
            }}>
                {actions.map((action, index) => (
                    <button
                        key={action.id}
                        className="btn-secondary animate-fade-in"
                        onClick={() => onActionClick(action.path)}
                        style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            border: `1px solid ${action.color}30`,
                            background: `${action.color}10`,
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <div style={{
                            fontSize: '24px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            background: action.color,
                            color: 'white'
                        }}>
                            {action.icon}
                        </div>
                        <span style={{ fontWeight: '600' }}>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [stats, setStats] = useState({
        totalApplicationsSent: 0,
        savedJobsCount: 0,
        recommendedJobsCount: 0,
        notificationsCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentActivities, setRecentActivities] = useState([]);
    
    useEffect(() => {
        if (!ready) return;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [saved, recommended, notifications] = await Promise.all([
                    getSavedJobs(),
                    getRecommendedJobs(),
                    getNotifications().catch(() => [])
                ]);
                
                setStats({
                    totalApplicationsSent: Math.floor(Math.random() * 12) + 1, // Mock data
                    savedJobsCount: Array.isArray(saved) ? saved.length : 0,
                    recommendedJobsCount: Array.isArray(recommended) ? recommended.length : 0,
                    notificationsCount: Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0
                });
                
                // Generate mock recent activities
                setRecentActivities([
                    {
                        icon: <FiBriefcase />,
                        title: 'Job Saved',
                        description: 'Frontend Intern (React) at CareerSync Labs',
                        time: '2 hours ago',
                        color: 'var(--success-500)'
                    },
                    {
                        icon: <FiSearch />,
                        title: 'New Search',
                        description: 'Searched for "React Developer" positions',
                        time: '5 hours ago',
                        color: 'var(--primary-500)'
                    },
                    {
                        icon: <FiStar />,
                        title: 'Recommendations Updated',
                        description: `${Array.isArray(recommended) ? recommended.length : 0} new job matches found`,
                        time: '1 day ago',
                        color: 'var(--accent-500)'
                    },
                    {
                        icon: <FiBell />,
                        title: 'Notification Received',
                        description: 'Application deadline reminder',
                        time: '2 days ago',
                        color: 'var(--warning-500)'
                    }
                ]);
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        
        load();
    }, [ready]);
    
    const handleActionClick = (path) => {
        window.location.href = path;
    };
    
    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Job Matching Dashboard</h1>
                    <p className="page-subtitle">
                        Your personalized job search command center with AI-powered insights
                    </p>
                </div>
                
                {authError && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <FiAlertTriangle /> {authError}
                    </div>
                )}
                
                {error && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <FiAlertTriangle /> {error}
                    </div>
                )}
                
                {!ready && (
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><FiZap /></div>
                        <div>Starting demo session…</div>
                    </div>
                )}
                
                {loading && (
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <div style={{ 
                            fontSize: '24px', 
                            marginBottom: '16px',
                            animation: 'spin 1s linear infinite',
                            display: 'flex', 
                            justifyContent: 'center' 
                        }}><FiRotateCw /></div>
                        <div>Loading dashboard…</div>
                    </div>
                )}
                
                {ready && !loading && (
                    <>
                        {/* Stats Grid */}
                        <div className="modern-grid" style={{ marginBottom: '40px' }}>
                            <StatCard
                                icon={<FiEdit3 />}
                                label="Applications Sent"
                                value={stats.totalApplicationsSent}
                                trend={12}
                                color="var(--primary-500)"
                                delay={0}
                            />
                            <StatCard
                                icon={<FiBookmark />}
                                label="Saved Jobs"
                                value={stats.savedJobsCount}
                                trend={stats.savedJobsCount > 0 ? 25 : 0}
                                color="var(--success-500)"
                                delay={100}
                            />
                            <StatCard
                                icon={<FiStar />}
                                label="Recommended Jobs"
                                value={stats.recommendedJobsCount}
                                color="var(--accent-500)"
                                delay={200}
                            />
                            <StatCard
                                icon={<FiBell />}
                                label="New Notifications"
                                value={stats.notificationsCount}
                                color="var(--warning-500)"
                                delay={300}
                            />
                        </div>
                        
                        {/* Main Content Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                            gap: '32px',
                            marginBottom: '40px'
                        }}>
                            <QuickActions onActionClick={handleActionClick} />
                            <ActivityTimeline activities={recentActivities} />
                        </div>
                        
                        {/* Welcome Message */}
                        <div className="glass-panel animate-fade-in" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, var(--primary-500)15, var(--accent-500)15)',
                            border: '1px solid var(--primary-300)30'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                            <h2 style={{ 
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'var(--secondary-800)',
                                marginBottom: '12px'
                            }}>
                                Ready to find your dream job?
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: 'var(--secondary-600)',
                                maxWidth: '500px',
                                margin: '0 auto 24px',
                                lineHeight: '1.6'
                            }}>
                                Our AI-powered job matching system has analyzed your profile and found
                                {stats.recommendedJobsCount > 0 ? ` ${stats.recommendedJobsCount} personalized` : ' amazing'} job
                                recommendations just for you!
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => handleActionClick('/job-matching/recommended')}
                                style={{
                                    fontSize: '16px',
                                    padding: '12px 32px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                🚀 View Recommendations
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
