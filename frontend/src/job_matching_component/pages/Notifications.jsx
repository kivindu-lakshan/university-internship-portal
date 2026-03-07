import React, { useEffect, useState } from 'react';

import NotificationItem from '../components/NotificationItem';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

export default function Notifications() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                <div className="headerRow">
                    <div>
                        <div className="title">Notification Center</div>
                        <div className="subTitle">Job updates, deadlines, and application updates.</div>
                    </div>
                </div>

                {authError ? <div className="error">{authError}</div> : null}
                {error ? <div className="error">{error}</div> : null}
                {!ready ? <div className="panel">Starting demo session…</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                    {notifications.map((n) => (
                        <NotificationItem key={n._id} notification={n} />
                    ))}
                    {!loading && notifications.length === 0 ? (
                        <div className="panel">No notifications yet.</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
