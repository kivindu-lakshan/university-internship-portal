import React, { useEffect, useState } from 'react';

import JobCard from '../components/JobCard';
import { getSavedJobs, removeSavedJob } from '../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

export default function SavedJobs() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getSavedJobs();
            setSavedJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ready) return;
        load();
    }, [ready]);

    const handleRemove = async (savedJob) => {
        try {
            await removeSavedJob(savedJob._id);
            await load();
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
                        <div className="title">Saved Jobs</div>
                        <div className="subTitle">Your bookmarked opportunities.</div>
                    </div>
                </div>

                {authError ? <div className="error">{authError}</div> : null}
                {error ? <div className="error">{error}</div> : null}
                {!ready ? <div className="panel">Starting demo session…</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="grid">
                    {savedJobs.map((saved) => (
                        <JobCard
                            key={saved._id}
                            job={saved.jobId}
                            onApply={handleApply}
                            showRemove
                            onRemove={() => handleRemove(saved)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
