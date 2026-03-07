import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { updateNotificationSettings } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

const Switch = ({ on, onToggle }) => {
    return (
        <div className={on ? 'switch switchOn' : 'switch'} onClick={onToggle} role="switch" aria-checked={on} tabIndex={0}>
            <div className="switchThumb" />
        </div>
    );
};

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

    const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

    const save = async () => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const updated = await updateNotificationSettings(settings);
            if (updated) setSettings(updated);
            setMessage('Saved');
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="headerRow">
                    <div>
                        <div className="title">Notification Settings</div>
                        <div className="subTitle">Control how and when you get updates.</div>
                    </div>
                    <button className="btn" type="button" onClick={save} disabled={saving || loading}>
                        {saving ? 'Saving…' : 'Save Settings'}
                    </button>
                </div>

                {authError ? <div className="error">{authError}</div> : null}
                {error ? <div className="error">{error}</div> : null}
                {message ? <div className="panel">{message}</div> : null}
                {!ready ? <div className="panel">Starting demo session…</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="panel">
                    <div className="switchRow">
                        <div style={{ fontWeight: 700 }}>Email Notifications</div>
                        <Switch on={settings.emailNotifications} onToggle={() => toggle('emailNotifications')} />
                    </div>
                    <div className="divider" />
                    <div className="switchRow">
                        <div style={{ fontWeight: 700 }}>New Job Alerts</div>
                        <Switch on={settings.newJobAlerts} onToggle={() => toggle('newJobAlerts')} />
                    </div>
                    <div className="divider" />
                    <div className="switchRow">
                        <div style={{ fontWeight: 700 }}>Deadline Reminders</div>
                        <Switch on={settings.deadlineReminders} onToggle={() => toggle('deadlineReminders')} />
                    </div>
                    <div className="divider" />
                    <div className="switchRow">
                        <div style={{ fontWeight: 700 }}>Application Updates</div>
                        <Switch on={settings.applicationUpdates} onToggle={() => toggle('applicationUpdates')} />
                    </div>
                </div>
            </div>
        </div>
    );
}
