import React, { useEffect, useState } from 'react';

import { getRecommendedJobs, getSavedJobs } from '../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

const StatCard = ({ label, value }) => {
    return (
        <div className="card">
            <div className="muted" style={{ fontWeight: 700 }}>{label}</div>
            <div className="spacer8" />
            <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
        </div>
    );
};

export default function Dashboard() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [stats, setStats] = useState({
        totalApplicationsSent: 0,
        savedJobsCount: 0,
        recommendedJobsCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!ready) return;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [saved, recommended] = await Promise.all([
                    getSavedJobs(),
                    getRecommendedJobs()
                ]);

                setStats({
                    totalApplicationsSent: 0,
                    savedJobsCount: Array.isArray(saved) ? saved.length : 0,
                    recommendedJobsCount: Array.isArray(recommended) ? recommended.length : 0
                });
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load dashboard');
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
                        <div className="title">Job Matching Dashboard</div>
                        <div className="subTitle">Quick insights based on your activity.</div>
                    </div>
                </div>

                {authError ? <div className="error">{authError}</div> : null}
                {error ? <div className="error">{error}</div> : null}
                {!ready ? <div className="panel">Starting demo session…</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="grid">
                    <StatCard label="Total Applications Sent" value={stats.totalApplicationsSent} />
                    <StatCard label="Saved Jobs Count" value={stats.savedJobsCount} />
                    <StatCard label="Recommended Jobs Count" value={stats.recommendedJobsCount} />
                </div>
            </div>
        </div>
    );
}
