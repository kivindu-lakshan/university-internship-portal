import React, { useCallback, useEffect, useMemo, useState } from 'react';

import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import { getSavedJobs, saveJob, searchJobs } from '../../services/jobService';

export default function JobSearch() {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        minSalary: '',
        maxSalary: ''
    });

    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const params = useMemo(
        () => ({
            q: query,
            jobType: filters.jobType || undefined,
            location: filters.location || undefined,
            minSalary: filters.minSalary || undefined,
            maxSalary: filters.maxSalary || undefined
        }),
        [query, filters]
    );

    const loadJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await searchJobs(params);
            setJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load jobs');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    useEffect(() => {
        const loadSaved = async () => {
            try {
                const saved = await getSavedJobs();
                const ids = new Set((saved || []).map((s) => String(s.jobId?._id || s.jobId)));
                setSavedJobIds(ids);
            } catch {
                // ignore (likely not logged in)
            }
        };
        loadSaved();
    }, []);

    const handleSave = async (job) => {
        try {
            await saveJob(job._id);
            setSavedJobIds((prev) => new Set([...prev, String(job._id)]));
        } catch {
            // auth interceptor may redirect
        }
    };

    const handleApply = () => {
        // Apply flow is owned by a different module; keep button present per spec.
    };

    return (
        <div className="page">
            <div className="container">
                <div className="headerRow">
                    <div>
                        <div className="title">Job Search</div>
                        <div className="subTitle">Search and filter internships and part-time jobs.</div>
                    </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                    <SearchBar value={query} onChange={setQuery} onSearch={loadJobs} />
                    <FilterPanel filters={filters} onChange={setFilters} onApply={loadJobs} />
                </div>

                <div className="spacer12" />

                {error ? <div className="error">{error}</div> : null}
                {loading ? <div className="panel">Loading…</div> : null}

                <div className="spacer12" />

                <div className="grid">
                    {jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
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
