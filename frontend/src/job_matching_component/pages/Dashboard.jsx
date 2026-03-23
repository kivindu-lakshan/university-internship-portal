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
                overflow: 'hidden',
                padding: '16px'
            }}
        >
            <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '80px',
                height: '80px',
                background: `${color}10`,
                borderRadius: '50%',
                zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    fontSize: '1.5rem',
                    marginBottom: '8px'
                }}>
                    {icon}
                </div>
                
                <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: color,
                    marginBottom: '4px',
                    fontFamily: 'monospace'
                }}>
                    {typeof animatedValue === 'number' ? animatedValue : value}
                </div>
                
                <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--secondary-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </div>

                {typeof trend === 'number' && (
                    <div style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
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
function ActivityTimeline({ activities, onActivityClick, formatRelativeTime }) {
    const [displayTimes, setDisplayTimes] = useState({});

    useEffect(() => {
        const updateTimes = () => {
            const newTimes = {};
            activities.forEach((activity, index) => {
                newTimes[index] = formatRelativeTime(activity.timestamp);
            });
            setDisplayTimes(newTimes);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [activities, formatRelativeTime]);

    return (
        <div className="glass-panel">
            <h3 style={{ 
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <FiTrendingUp /> Recent Activity
            </h3>
            
            <div>
                {activities.map((activity, index) => (
                    <div 
                        key={index}
                        className="animate-fade-in"
                        onClick={() => onActivityClick?.(activity.path)}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px',
                            marginBottom: index < activities.length - 1 ? '14px' : '0',
                            animationDelay: `${index * 100}ms`,
                            cursor: activity.path ? 'pointer' : 'default',
                            borderRadius: '10px',
                            padding: '8px',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        {/* Timeline dot */}
                        <div style={{
                            width: '34px',
                            height: '34px',
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
                                {displayTimes[index] || activity.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Line Chart Component for Activity Snapshot
function LineChart({ data }) {
    const points = [
        { key: 'Applications', value: data.totalApplicationsSent, color: 'var(--primary-500)' },
        { key: 'Saved', value: data.savedJobsCount, color: 'var(--success-500)' },
        { key: 'Recommended', value: data.recommendedJobsCount, color: 'var(--accent-500)' },
        { key: 'Alerts', value: data.notificationsCount, color: 'var(--warning-500)' }
    ];

    const maxValue = Math.max(...points.map(p => p.value), 1);
    const width = 240;
    const height = 86;
    const padding = 20;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Calculate normalized Y positions
    const xStep = graphWidth / (points.length - 1 || 1);
    const points_normalized = points.map((point, index) => ({
        ...point,
        x: padding + index * xStep,
        y: padding + graphHeight - (point.value / maxValue) * graphHeight
    }));

    // Create SVG path for line
    const pathData = points_normalized
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    // Create gradient path for fill under line
    const fillPath = `${pathData} L ${points_normalized[points_normalized.length - 1].x} ${padding + graphHeight} L ${padding} ${padding + graphHeight} Z`;

    return (
        <div style={{ position: 'relative' }}>
            <svg width={width} height={height} style={{ display: 'block' }}>
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="lineChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'var(--primary-500)', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--primary-500)', stopOpacity: 0.05 }} />
                    </linearGradient>
                </defs>

                {/* Fill under line */}
                <path d={fillPath} fill="url(#lineChartGradient)" stroke="none" />

                {/* Line */}
                <path
                    d={pathData}
                    stroke="var(--primary-500)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points (circles) */}
                {points_normalized.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="white"
                        stroke={p.color}
                        strokeWidth="2"
                    />
                ))}
            </svg>

            {/* Labels below chart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--secondary-500)' }}>
                {points.map((p) => (
                    <div key={p.key} style={{ textAlign: 'center', flex: 1 }}>
                        {p.key}: <strong style={{ color: p.color }}>{p.value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick Actions Component
function QuickActions({ onActionClick, stats }) {
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
                margin: '0 0 16px 0',
                fontSize: '16px',
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px'
            }}>
                {actions.map((action, index) => (
                    <button
                        key={action.id}
                        className="btn-secondary animate-fade-in"
                        onClick={() => onActionClick(action.path)}
                        style={{
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            border: `1px solid ${action.color}30`,
                            background: `${action.color}10`,
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <div style={{
                            fontSize: '24px',
                            width: '30px',
                            height: '30px',
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

            <div style={{
                marginTop: '12px',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '12px'
            }}>
                <div style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--secondary-700)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                }}>
                    Activity Snapshot
                </div>
                <LineChart data={stats} />
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

    const formatRelativeTime = (dateInput) => {
        if (!dateInput) return 'Just now';

        const date = new Date(dateInput);
        const now = new Date();
        const diffMs = now - date;
        const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };
    
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

                const activityItems = [];

                if (Array.isArray(saved)) {
                    saved.forEach((savedJob) => {
                        const title = savedJob?.jobId?.title || 'Saved job';
                        const company = savedJob?.jobId?.company || 'Company';
                        const timestamp = savedJob?.dateSaved || savedJob?.createdAt || new Date();
                        activityItems.push({
                            icon: <FiBookmark />,
                            title: 'Job Saved',
                            description: `${title} at ${company}`,
                            time: formatRelativeTime(timestamp),
                            timestamp: timestamp,
                            sortAt: new Date(timestamp).getTime(),
                            color: 'var(--success-500)',
                            path: '/job-matching/saved'
                        });
                    });
                }

                if (Array.isArray(notifications)) {
                    notifications.forEach((notification) => {
                        const createdAt = notification?.createdAt || new Date();
                        activityItems.push({
                            icon: <FiBell />,
                            title: 'Notification Received',
                            description: notification?.message || 'New update received',
                            time: formatRelativeTime(createdAt),
                            timestamp: createdAt,
                            sortAt: new Date(createdAt).getTime(),
                            color: 'var(--warning-500)',
                            path: '/job-matching/notifications'
                        });
                    });
                }

                if (Array.isArray(recommended) && recommended.length > 0) {
                    const latestRecommendedAt = recommended
                        .map((job) => new Date(job?.updatedAt || job?.createdAt || Date.now()).getTime())
                        .sort((a, b) => b - a)[0];

                    activityItems.push({
                        icon: <FiStar />,
                        title: 'Recommendations Updated',
                        description: `${recommended.length} personalized job matches available`,
                        time: formatRelativeTime(latestRecommendedAt),
                        timestamp: latestRecommendedAt,
                        sortAt: latestRecommendedAt,
                        color: 'var(--accent-500)',
                        path: '/job-matching/recommended'
                    });
                }

                const dynamicActivities = activityItems
                    .sort((a, b) => b.sortAt - a.sortAt)
                    .slice(0, 6)
                    .map(({ sortAt, ...rest }) => rest);

                setRecentActivities(dynamicActivities);
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        load();

        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, [ready]);
    
    const handleActionClick = (path) => {
        window.location.href = path;
    };
    
    return (
        <div className="page">
            <div className="container">
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
                        {/* Welcome Message */}
                        <div className="glass-panel animate-fade-in" style={{
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, var(--primary-500)15, var(--accent-500)15)',
                            border: '1px solid var(--primary-300)30',
                            padding: '16px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><FiTarget /></div>
                            <h2 style={{ 
                                fontSize: '20px',
                                fontWeight: '700',
                                color: 'var(--secondary-800)',
                                marginBottom: '8px'
                            }}>
                                Ready to find your dream job?
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--secondary-600)',
                                maxWidth: '500px',
                                margin: '0 auto',
                                lineHeight: '1.4'
                            }}>
                                Our AI-powered job matching system has analyzed your profile and found
                                {stats.recommendedJobsCount > 0 ? ` ${stats.recommendedJobsCount} personalized` : ' amazing'} job
                                recommendations just for you!
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => handleActionClick('/job-matching/recommended')}
                                style={{
                                    fontSize: '14px',
                                    padding: '10px 20px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '12px'
                                }}
                            >
                                <FiZap /> View Recommendations
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="modern-grid" style={{
                            marginBottom: '20px',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '12px'
                        }}>
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
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '18px',
                            marginBottom: '20px'
                        }}>
                            <QuickActions onActionClick={handleActionClick} stats={stats} />
                            <ActivityTimeline activities={recentActivities} onActivityClick={handleActionClick} formatRelativeTime={formatRelativeTime} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
