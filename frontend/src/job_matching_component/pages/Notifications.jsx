import React, { useEffect, useState, useMemo } from 'react';
import { FiBell, FiCheck, FiSettings, FiSearch, FiTrash2, FiTarget } from 'react-icons/fi';
import NotificationItem from '../components/NotificationItem';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

// Professional Notification Header
function NotificationHeader({ unreadCount, onMarkAllRead, onSettings }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'white',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px',
            marginBottom: '16px'
        }}>
            <div>
                <h2 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: 'var(--secondary-800)' 
                }}>
                    Notifications
                </h2>
                <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: 'var(--secondary-600)' 
                }}>
                    {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
                </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                    <button
                        className="btn-outline"
                        onClick={onMarkAllRead}
                        style={{ 
                            padding: '6px 12px', 
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <FiCheck size={14} /> Mark all read
                    </button>
                )}
                <button
                    className="btn-outline"
                    onClick={onSettings}
                    style={{ 
                        padding: '6px 12px', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <FiSettings size={14} /> Settings
                </button>
            </div>
        </div>
    );
}

// Simple Filter Tabs
function NotificationTabs({ activeTab, setActiveTab, counts }) {
    const tabs = [
        { id: 'all', label: 'All', count: counts.total },
        { id: 'unread', label: 'Unread', count: counts.unread },
        { id: 'new_job', label: 'Job Alerts', count: counts.newJob },
        { id: 'deadline_reminder', label: 'Deadlines', count: counts.deadline }
    ].filter(tab => tab.count > 0);

    return (
        <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--secondary-200)',
            marginBottom: '16px',
            background: 'white'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--secondary-600)',
                        borderBottom: activeTab === tab.id ? '2px solid var(--primary-600)' : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span style={{
                            background: activeTab === tab.id ? 'var(--primary-600)' : 'var(--secondary-400)',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            minWidth: '16px',
                            textAlign: 'center'
                        }}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

// Notification Controls
function NotificationControls({ 
    showReadFilter, 
    setShowReadFilter 
}) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid var(--secondary-200)',
            background: 'white'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
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
                    emoji: '🎯'
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
        <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                {emptyState.emoji || '🔔'}
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
        <div style={{
            textAlign: 'center',
            padding: '48px 32px',
            background: 'white',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '24px'
            }}>
                <FiBell color="var(--secondary-400)" />
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
    const [activeTab, setActiveTab] = useState('all');

    const counts = useMemo(() => {
        return {
            total: notifications.length,
            unread: notifications.filter(n => !n.isRead).length,
            newJob: notifications.filter(n => n.type === 'new_job').length,
            deadline: notifications.filter(n => n.type === 'deadline_reminder').length
        };
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        switch(activeTab) {
            case 'unread':
                return notifications.filter(n => !n.isRead);
            case 'new_job':
                return notifications.filter(n => n.type === 'new_job');
            case 'deadline_reminder':
                return notifications.filter(n => n.type === 'deadline_reminder');
            default:
                return notifications;
        }
    }, [notifications, activeTab]);

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

    const handleMarkAllRead = async () => {
        // Mock implementation
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updatedNotifications);
    };

    const handleSettings = () => {
        window.location.href = '/job-matching/notification-settings';
    };

    if (authError) {
        return (
            <div className="page">
                <div className="container">
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        background: 'var(--error-50)',
                        border: '1px solid var(--error-200)',
                        borderRadius: '8px',
                        color: 'var(--error-600)'
                    }}>
                        {authError}
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--secondary-200)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <FiBell size={32} color="var(--secondary-400)" />
                        </div>
                        <p style={{ margin: 0, color: 'var(--secondary-600)' }}>Loading notifications...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <NotificationHeader 
                    unreadCount={counts.unread}
                    onMarkAllRead={handleMarkAllRead}
                    onSettings={handleSettings}
                />

                {notifications.length > 0 && (
                    <NotificationTabs 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        counts={counts}
                    />
                )}

                {error && (
                    <div style={{
                        padding: '16px',
                        background: 'var(--error-50)',
                        border: '1px solid var(--error-200)',
                        borderRadius: '8px',
                        color: 'var(--error-600)',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{
                    background: 'white',
                    border: '1px solid var(--secondary-200)',
                    borderRadius: '8px'
                }}>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => (
                            <div key={notification._id || index}>
                                <NotificationItem notification={notification} />
                                {index < filteredNotifications.length - 1 && (
                                    <div style={{ 
                                        height: '1px', 
                                        background: 'var(--secondary-100)',
                                        margin: '0 16px'
                                    }} />
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'var(--secondary-500)'
                        }}>
                            <FiBell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3 style={{ 
                                margin: '0 0 8px 0',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}>
                                No notifications
                            </h3>
                            <p style={{ 
                                margin: 0,
                                fontSize: '14px'
                            }}>
                                {activeTab === 'unread' 
                                    ? "You're all caught up!" 
                                    : "We'll notify you when there are updates."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
