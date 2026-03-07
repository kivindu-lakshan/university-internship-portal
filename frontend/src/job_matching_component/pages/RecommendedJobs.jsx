import React, { useEffect, useState } from 'react';

import JobCard from '../components/JobCard';
import { getRecommendedJobs, getSavedJobs, saveJob } from '../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

export default function RecommendedJobs() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!ready) return;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [recommended, saved] = await Promise.all([
                    getRecommendedJobs(),
                    getSavedJobs().catch(() => [])
                ]);

                setJobs(Array.isArray(recommended) ? recommended : []);
                const ids = new Set((saved || []).map((s) => String(s.jobId?._id || s.jobId)));
                setSavedJobIds(ids);
            } catch (e) {
                setError(e?.response?.data?.message || 'Unable to load recommendations');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [ready]);

    const handleSave = async (job) => {
        try {
            await saveJob(job._id);
            setSavedJobIds((prev) => new Set([...prev, String(job._id)]));
        } catch {
            // auth interceptor may redirect
        }
    };

    const handleApply = () => {
        // Apply flow handled elsewhere.
    };

    return (
        <div className="page">
            <div className="container">
                <div className="headerRow">
                    <div>
                        <div className="title">Recommended Jobs</div>
                        <div className="subTitle">Matched using skills + preferences with a simple rule-based score.</div>
                    </div>
                </div>

                {authError ? <div className="error">{authError}</div> : null}
                {error ? <div className="error">{error}</div> : null}
                {!ready ? <div className="panel">Starting demo session…</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="grid">
                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            matchPercentage={typeof job.matchPercentage === 'number' ? job.matchPercentage : undefined}
                            onApply={handleApply}
                            onSave={handleSave}
                            isSaved={savedJobIds.has(String(job._id))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
