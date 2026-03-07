import React, { useEffect, useState } from 'react';
import { FiSettings, FiCheck, FiZap, FiMail, FiTarget, FiInfo } from 'react-icons/fi';
import api from '../../services/api';
import { updateNotificationSettings } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

// Modern Toggle Switch Component
const modernSwitch = ({ on, onToggle, label, description, disabled = false }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '20px 0',
            borderBottom: '1px solid var(--secondary-200)'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--secondary-800)',
                    marginBottom: '4px'
                }}>
                    {label}
                </div>
                {description && (
                    <div style={{
                        fontSize: '14px',
                        color: 'var(--secondary-600)',
                        lineHeight: '1.4'
                    }}>
                        {description}
                    </div>
                )}
            </div>
            
            <div
                onClick={disabled ? undefined : onToggle}
                style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    background: on ? 'var(--primary-500)' : 'var(--secondary-300)',
                    position: 'relative',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: disabled ? 0.5 : 1,
                    boxShadow: on ? `0 0 0 2px ${on ? 'var(--primary-500)' : 'var(--secondary-300)'}20` : 'none'
                }}
            >
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: on ? '22px' : '2px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            </div>
        </div>
    );
};

// Settings Section Component
function SettingsSection({ title, description, children, icon }) {
    return (
        <div className="glass-panel animate-fade-in" style={{ marginBottom: '24px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid var(--secondary-200)'
            }}>
                <div style={{ fontSize: '32px' }}>{icon}</div>
                <div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--secondary-800)',
                        margin: '0 0 4px 0'
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--secondary-600)',
                        margin: '0'
                    }}>
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </div>
    );
}

// Save Status Component
function SaveStatus({ saving, message, error }) {
    if (saving) {
        return (
            <div className="glass-panel" style={{
                background: 'var(--primary-500)15',
                border: '1px solid var(--primary-500)30',
                color: 'var(--primary-600)',
                textAlign: 'center',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid var(--primary-500)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <span style={{ fontWeight: '600' }}>Saving your preferences...</span>
            </div>
        );
    }

    if (message) {
        return (
            <div className="glass-panel animate-fade-in" style={{
                background: 'var(--success-500)15',
                border: '1px solid var(--success-500)30',
                color: 'var(--success-600)',
                textAlign: 'center',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '20px', color: 'var(--success-500)' }}><FiCheck /></span>
                <span style={{ fontWeight: '600' }}>{message}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel animate-fade-in" style={{
                background: 'var(--error-500)15',
                border: '1px solid var(--error-500)30',
                color: 'var(--error-500)',
                textAlign: 'center',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <span style={{ fontWeight: '600' }}>{error}</span>
            </div>
        );
    }

    return null;
}

export default function NotificationSettings() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        newJobAlerts: true,
        deadlineReminders: true,
        applicationUpdates: true
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const me = await api.get('/auth/me');
                const s = me?.data?.user?.notificationSettings;
                if (s) {
                    setSettings({
                        emailNotifications: Boolean(s.emailNotifications),
                        newJobAlerts: Boolean(s.newJobAlerts),
                        deadlineReminders: Boolean(s.deadlineReminders),
                        applicationUpdates: Boolean(s.applicationUpdates)
                    });
                }
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load settings');
            } finally {
                setLoading(false);
            }
        };

        if (ready) load();
    }, [ready]);

    const toggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
        setHasUnsavedChanges(true);
        setMessage('');
        setError('');
    };

    const save = async () => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const updated = await updateNotificationSettings(settings);
            if (updated) setSettings(updated);
            setMessage('Settings saved successfully! 🎉');
            setHasUnsavedChanges(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiSettings /> Notification Settings
                    </h1>
                    <p className="page-subtitle">
                        Customize how and when you receive job-related updates and alerts
                    </p>
                </div>

                {/* Action Bar */}
                <div className="glass-panel" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        {hasUnsavedChanges && (
                            <>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'var(--warning-500)',
                                    animation: 'pulse 2s infinite'
                                }} />
                                <span style={{
                                    fontSize: '14px',
                                    color: 'var(--warning-600)',
                                    fontWeight: '600'
                                }}>
                                    You have unsaved changes
                                </span>
                            </>
                        )}
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <button 
                            className="btn-secondary"
                            onClick={() => window.location.href = '/job-matching/notifications'}
                        >
                            📋 View Notifications
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={save} 
                            disabled={saving || loading || !hasUnsavedChanges}
                            style={{
                                opacity: (!hasUnsavedChanges && !saving) ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {saving ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid currentColor',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    💾 Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                <SaveStatus saving={saving} message={message} error={error} />

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

                {loading ? (
                    <div className="glass-panel animate-fade-in" style={{
                        textAlign: 'center',
                        padding: '48px 32px'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '24px',
                            animation: 'spin 1s linear infinite'
                        }}>
                            <div style={{ fontSize: '18px', marginRight: '8px' }}><FiSettings /></div>
                        </div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'var(--secondary-700)',
                            marginBottom: '8px'
                        }}>
                            Loading your preferences...
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--secondary-500)'
                        }}>
                            Retrieving your notification settings
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Email Notifications Section */}
                        <SettingsSection
                            title="Email Notifications"
                            description="Control how we communicate with you via email"
                            icon={<FiMail />}
                        >
                            {modernSwitch({
                                on: settings.emailNotifications,
                                onToggle: () => toggle('emailNotifications'),
                                label: 'Email Notifications',
                                description: 'Receive all job-related updates via email. This includes new job matches, application updates, and important announcements.'
                            })}
                        </SettingsSection>

                        {/* Job Alerts Section */}
                        <SettingsSection
                            title="Job Matching Alerts"
                            description="Get notified when new opportunities match your profile"
                            icon={<FiTarget />}
                        >
                            {modernSwitch({
                                on: settings.newJobAlerts,
                                onToggle: () => toggle('newJobAlerts'),
                                label: 'New Job Alerts',
                                description: 'Get instant notifications when new jobs match your skills, preferences, and career goals.',
                                disabled: !settings.emailNotifications
                            })}
                        </SettingsSection>

                        {/* Deadlines Section */}
                        <SettingsSection
                            title="Application Deadlines"
                            description="Never miss an important application deadline"
                            icon="⏰"
                        >
                            {modernSwitch({
                                on: settings.deadlineReminders,
                                onToggle: () => toggle('deadlineReminders'),
                                label: 'Deadline Reminders',
                                description: 'Receive timely reminders before application deadlines. We\'ll notify you 3 days, 1 day, and 2 hours before deadlines.',
                                disabled: !settings.emailNotifications
                            })}
                        </SettingsSection>

                        {/* Application Updates Section */}
                        <SettingsSection
                            title="Application Status"
                            description="Stay informed about your application progress"
                            icon="📊"
                        >
                            {modernSwitch({
                                on: settings.applicationUpdates,
                                onToggle: () => toggle('applicationUpdates'),
                                label: 'Application Updates',
                                description: 'Get notified when employers review your applications, schedule interviews, or update application status.',
                                disabled: !settings.emailNotifications
                            })}
                        </SettingsSection>

                        {/* Information Panel */}
                        <div className="glass-panel" style={{
                            background: 'var(--primary-500)10',
                            border: '1px solid var(--primary-500)30',
                            padding: '24px',
                            marginTop: '32px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px'
                            }}>
                                <div style={{ fontSize: '32px', color: 'var(--warning-500)' }}><FiInfo /></div>
                                <div>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: 'var(--secondary-800)',
                                        marginBottom: '8px'
                                    }}>
                                        Quick Tips
                                    </h3>
                                    <ul style={{
                                        margin: '0',
                                        paddingLeft: '20px',
                                        color: 'var(--secondary-600)',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}>
                                        <li>Email notifications must be enabled to receive other types of alerts</li>
                                        <li>You can always adjust these settings later as your preferences change</li>
                                        <li>All notifications respect your local timezone settings</li>
                                        <li>Critical system updates will always be delivered regardless of preferences</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
