import React, { useEffect, useState, useMemo } from 'react';
import { FiBell, FiTarget, FiCheck, FiSearch, FiList, FiSettings, FiZap } from 'react-icons/fi';
import NotificationItem from '../components/NotificationItem';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

// Notification Statistics Component
function NotificationStats({ notifications }) {
    const stats = useMemo(() => {
        const total = notifications.length;
        const unread = notifications.filter(n => !n.isRead).length;
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayNotifications = notifications.filter(n => {
            const notifDate = new Date(n.createdAt || n.timestamp);
            return notifDate >= todayStart;
        }).length;

        const types = notifications.reduce((acc, n) => {
            const type = n.type || 'general';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const mostActiveType = Object.entries(types)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

        return {
            total,
            unread,
            todayNotifications,
            mostActiveType
        };
    }, [notifications]);

    const statCards = [
        { 
            label: 'Total Notifications', 
            value: stats.total, 
            icon: <FiBell />, 
            color: 'var(--primary-500)' 
        },
        { 
            label: 'Unread', 
            value: stats.unread, 
            icon: '🆕', 
            color: 'var(--warning-500)' 
        },
        { 
            label: 'Today', 
            value: stats.todayNotifications, 
            icon: '📅', 
            color: 'var(--success-500)' 
        },
        { 
            label: 'Most Active', 
            value: stats.mostActiveType, 
            icon: <FiTarget />, 
            color: 'var(--accent-500)' 
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
        }}>
            {statCards.map((stat, index) => (
                <div
                    key={stat.label}
                    className="modern-card animate-fade-in"
                    style={{
                        textAlign: 'center',
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                        border: `1px solid ${stat.color}30`,
                        animationDelay: `${index * 100}ms`
                    }}
                >
                    <div style={{
                        fontSize: '32px',
                        marginBottom: '12px'
                    }}>
                        {stat.icon}
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: stat.color,
                        marginBottom: '8px'
                    }}>
                        {stat.value}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--secondary-600)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Notification Filters Component
function NotificationFilters({ 
    notifications, 
    activeFilter, 
    setActiveFilter, 
    showReadFilter, 
    setShowReadFilter 
}) {
    const filterCounts = useMemo(() => {
        const counts = {
            all: notifications.length,
            unread: notifications.filter(n => !n.isRead).length,
            job_match: notifications.filter(n => n.type === 'job_match').length,
            deadline: notifications.filter(n => n.type === 'deadline').length,
            application: notifications.filter(n => n.type === 'application').length,
            system: notifications.filter(n => n.type === 'system').length
        };
        return counts;
    }, [notifications]);

    const filters = [
        { id: 'all', label: 'All', icon: <FiList />, count: filterCounts.all },
        { id: 'unread', label: 'Unread', icon: '🆕', count: filterCounts.unread },
        { id: 'job_match', label: 'Job Matches', icon: <FiTarget />, count: filterCounts.job_match },
        { id: 'deadline', label: 'Deadlines', icon: '⏰', count: filterCounts.deadline },
        { id: 'application', label: 'Applications', icon: '📄', count: filterCounts.application },
        { id: 'system', label: 'System', icon: <FiSettings />, count: filterCounts.system }
    ].filter(f => f.count > 0);

    return (
        <div className="glass-panel" style={{
            padding: '20px 24px',
            marginBottom: '24px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                {/* Filter Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                }}>
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`btn-outline ${activeFilter === filter.id ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                borderRadius: '50px',
                                background: activeFilter === filter.id ? 'var(--primary-500)' : 'transparent',
                                color: activeFilter === filter.id ? 'white' : 'var(--secondary-700)',
                                border: `1px solid ${activeFilter === filter.id ? 'var(--primary-500)' : 'var(--secondary-300)'}`,
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                            <div style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'var(--secondary-200)',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>
                                {filter.count}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Read Filter Toggle */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={showReadFilter}
                            onChange={(e) => setShowReadFilter(e.target.checked)}
                            style={{ margin: 0 }}
                        />
                        Include read notifications
                    </label>

                    <button
                        className="btn-secondary"
                        onClick={() => window.location.href = '/job-matching/notification-settings'}
                        style={{
                            padding: '8px 16px',
                            fontSize: '14px'
                        }}
                    >
                        <FiSettings style={{ marginRight: '8px' }} /> Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

// Empty Notifications State
function EmptyNotificationsState({ activeFilter }) {
    const getEmptyMessage = (filter) => {
        switch (filter) {
            case 'unread':
                return {
                    title: 'All caught up! 🎉',
                    message: 'You\'ve read all your notifications. Great job staying on top of things!',
                    icon: <FiCheck />
                };
            case 'job_match':
                return {
                    title: 'No job matches yet',
                    message: 'Update your profile and preferences to receive personalized job recommendations.',
                    icon: <FiTarget />
                };
            case 'deadline':
                return {
                    title: 'No upcoming deadlines',
                    message: 'No application deadlines to worry about right now.',
                    emoji: '⏰'
                };
            default:
                return {
                    title: 'No notifications yet',
                    message: 'Stay tuned! We\'ll notify you about job matches, deadlines, and important updates.',
                    icon: <FiBell />
                };
        }
    };

    const emptyState = getEmptyMessage(activeFilter);

    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                {emptyState.emoji}
            </div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                {emptyState.title}
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                {emptyState.message}
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <button 
                    className="btn-primary"
                    onClick={() => window.location.href = '/job-matching/search'}
                >
                    <FiSearch style={{ marginRight: '8px' }} /> Browse Jobs
                </button>
                <button 
                    className="btn-secondary"
                    onClick={() => window.location.href = '/job-matching/recommended'}
                >
                    ⭐ View Recommendations
                </button>
            </div>
        </div>
    );
}

// Loading State Component
function LoadingState() {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '48px 32px'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '24px',
                animation: 'spin 1s linear infinite'
            }}>
                <div style={{ fontSize: '18px', marginRight: '8px' }}><FiBell /></div>
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                Loading notifications...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Fetching your latest updates
            </p>
        </div>
    );
}

export default function Notifications() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showReadFilter, setShowReadFilter] = useState(false);

    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        // Apply read filter first
        if (!showReadFilter) {
            filtered = filtered.filter(n => !n.isRead);
        }

        // Apply type filter
        switch (activeFilter) {
            case 'unread':
                return filtered.filter(n => !n.isRead);
            case 'job_match':
                return filtered.filter(n => n.type === 'job_match');
            case 'deadline':
                return filtered.filter(n => n.type === 'deadline');
            case 'application':
                return filtered.filter(n => n.type === 'application');
            case 'system':
                return filtered.filter(n => n.type === 'system');
            default:
                return filtered;
        }
    }, [notifications, activeFilter, showReadFilter]);

    useEffect(() => {
        if (!ready) return;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getNotifications();
                setNotifications(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load notifications');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [ready]);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiBell /> Notification Center
                    </h1>
                    <p className="page-subtitle">
                        Stay updated with job matches, deadlines, and application updates
                    </p>
                </div>

                {authError && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
                        <div style={{ fontWeight: '600' }}>{authError}</div>
                    </div>
                )}

                {error && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
                        <div style={{ fontWeight: '600' }}>{error}</div>
                        <button 
                            className="btn-secondary" 
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '16px' }}
                        >
                            🔄 Retry
                        </button>
                    </div>
                )}

                {!ready && (
                    <div className="glass-panel" style={{ 
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}><FiZap /></div>
                        <div>Starting demo session…</div>
                    </div>
                )}

                {loading && <LoadingState />}

                {ready && !loading && !error && (
                    <>
                        {notifications.length > 0 && (
                            <NotificationStats notifications={notifications} />
                        )}

                        <NotificationFilters
                            notifications={notifications}
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                            showReadFilter={showReadFilter}
                            setShowReadFilter={setShowReadFilter}
                        />

                        {filteredNotifications.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '16px'
                            }}>
                                {filteredNotifications.map((notification, index) => (
                                    <div
                                        key={notification._id}
                                        className="animate-fade-in"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <NotificationItem 
                                            notification={notification}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyNotificationsState activeFilter={activeFilter} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
