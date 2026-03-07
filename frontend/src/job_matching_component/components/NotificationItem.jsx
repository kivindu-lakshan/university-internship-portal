import React from 'react';

const iconLetterForType = (type) => {
    if (type === 'new_job') return 'N';
    if (type === 'deadline_reminder') return 'D';
    if (type === 'application_update') return 'A';
    return 'I';
};

export default function NotificationItem({ notification }) {
    const createdAt = notification?.createdAt ? new Date(notification.createdAt) : null;
    const timestamp = createdAt ? createdAt.toLocaleString() : '';

    return (
        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="iconBubble" aria-hidden>
                {iconLetterForType(notification?.type)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{notification?.message}</div>
                <div className="spacer8" />
                <div className="muted">{timestamp}</div>
            </div>
        </div>
    );
}
