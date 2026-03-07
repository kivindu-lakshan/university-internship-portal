import React, { useCallback, useEffect, useMemo, useState } from 'react';

import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import { getSavedJobs, saveJob, searchJobs } from '../../services/jobService';

// Results Header Component
function ResultsHeader({ total, query, sortBy, setSortBy, viewMode, setViewMode }) {
    return (
        <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '16px 24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--secondary-800)'
                }}>
                    📊 {total} {total === 1 ? 'result' : 'results'}
                    {query && (
                        <span style={{ color: 'var(--secondary-600)' }}>
                            {' '}for "<span style={{ color: 'var(--primary-500)', fontWeight: '700' }}>{query}</span>"
                        </span>
                    )}
                </div>
            </div>
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                {/* Sort Dropdown */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--secondary-600)'
                    }}>
                        Sort by:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--secondary-300)',
                            background: 'var(--background)',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--secondary-700)'
                        }}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest First</option>
                        <option value="salary-high">Salary (High to Low)</option>
                        <option value="salary-low">Salary (Low to High)</option>
                        <option value="deadline">Application Deadline</option>
                    </select>
                </div>
                
                {/* View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--secondary-200)',
                    borderRadius: '8px',
                    padding: '4px'
                }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            background: viewMode === 'grid' ? 'var(--primary-500)' : 'transparent',
                            color: viewMode === 'grid' ? 'white' : 'var(--secondary-600)',
                            cursor: 'pointer'
                        }}
                    >
                        ⚏ Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            background: viewMode === 'list' ? 'var(--primary-500)' : 'transparent',
                            color: viewMode === 'list' ? 'white' : 'var(--secondary-600)',
                            cursor: 'pointer'
                        }}
                    >
                        ☰ List
                    </button>
                </div>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({ query, hasFilters }) {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                {query ? '🔍' : '💼'}
            </div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                {query ? 'No jobs found' : 'Start your job search'}
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                {query 
                    ? hasFilters 
                        ? `Try adjusting your search filters or search for different keywords.`
                        : `We couldn't find any jobs matching "${query}". Try different keywords or browse all available positions.`
                    : 'Enter keywords, skills, or company names to discover amazing internship and job opportunities.'
                }
            </p>
            {query && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <button className="btn-secondary" onClick={() => window.location.reload()}>
                        🔄 Clear filters
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => window.location.href = '/job-matching/recommended'}
                    >
                        ⭐ View Recommendations
                    </button>
                </div>
            )}
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
                🔄
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                Searching for perfect matches...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Our AI is analyzing thousands of opportunities
            </p>
        </div>
    );
}

export default function JobSearch() {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        minSalary: '',
        maxSalary: ''
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState('grid');

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
            maxSalary: filters.maxSalary || undefined,
            sortBy
        }),
        [query, filters, sortBy]
    );

    const hasActiveFilters = useMemo(() => {
        return filters.jobType || filters.location || filters.minSalary || filters.maxSalary;
    }, [filters]);

    const sortedJobs = useMemo(() => {
        if (!Array.isArray(jobs)) return [];
        
        const sorted = [...jobs];
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'salary-high':
                return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
            case 'salary-low':
                return sorted.sort((a, b) => (a.salary || 0) - (b.salary || 0));
            case 'deadline':
                return sorted.sort((a, b) => new Date(a.applicationDeadline || '9999-12-31') - new Date(b.applicationDeadline || '9999-12-31'));
            default:
                return sorted;
        }
    }, [jobs, sortBy]);

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
                <div className="page-header">
                    <h1 className="page-title">🔍 Advanced Job Search</h1>
                    <p className="page-subtitle">
                        Discover internships and part-time opportunities with AI-powered matching
                    </p>
                </div>

                {/* Search Interface */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <SearchBar 
                        value={query} 
                        onChange={setQuery} 
                        onSearch={loadJobs}
                        placeholder="Search by title, skills, company, or keywords..." 
                    />
                    <FilterPanel 
                        filters={filters} 
                        onChange={setFilters} 
                        onApply={loadJobs} 
                    />
                </div>

                {/* Error State */}
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
                            onClick={loadJobs}
                            style={{ marginTop: '16px' }}
                        >
                            🔄 Try Again
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Results */}
                {!loading && !error && (
                    <>
                        {sortedJobs.length > 0 ? (
                            <>
                                <ResultsHeader
                                    total={sortedJobs.length}
                                    query={query}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                />
                                
                                <div style={{ marginTop: '24px' }}>
                                    <div 
                                        className={viewMode === 'grid' ? 'modern-grid' : 'list-view'}
                                        style={viewMode === 'list' ? {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '16px'
                                        } : {}}
                                    >
                                        {sortedJobs.map((job, index) => (
                                            <div
                                                key={job._id}
                                                className="animate-fade-in"
                                                style={{
                                                    animationDelay: `${index * 50}ms`
                                                }}
                                            >
                                                <JobCard
                                                    job={job}
                                                    onApply={handleApply}
                                                    onSave={handleSave}
                                                    isSaved={savedJobIds.has(String(job._id))}
                                                    viewMode={viewMode}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyState query={query} hasFilters={hasActiveFilters} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
