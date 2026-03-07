import React, { useEffect, useState, useMemo } from 'react';

import JobCard from '../components/JobCard';
import { getRecommendedJobs, getSavedJobs, saveJob } from '../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';

// Match Quality Banner Component
function MatchQualityBanner({ averageMatch, totalJobs }) {
    const getMatchQuality = (avg) => {
        if (avg >= 80) return { label: 'Excellent', color: 'var(--success-500)', emoji: '🎯' };
        if (avg >= 60) return { label: 'Good', color: 'var(--primary-500)', emoji: '👍' };
        if (avg >= 40) return { label: 'Fair', color: 'var(--warning-500)', emoji: '⚡' };
        return { label: 'Basic', color: 'var(--secondary-500)', emoji: '📍' };
    };

    const quality = getMatchQuality(averageMatch);

    return (
        <div className="glass-panel animate-fade-in" style={{
            background: `linear-gradient(135deg, ${quality.color}15, ${quality.color}05)`,
            border: `1px solid ${quality.color}30`,
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '16px'
            }}>
                🤖✨
            </div>
            <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '12px'
            }}>
                AI-Powered Job Recommendations
            </h2>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                marginBottom: '20px',
                maxWidth: '600px',
                margin: '0 auto 20px'
            }}>
                Our intelligent matching algorithm analyzed your profile, skills, and preferences to find {totalJobs} personalized opportunities
            </p>
            
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                borderRadius: '50px',
                background: `${quality.color}20`,
                border: `1px solid ${quality.color}40`
            }}>
                <span style={{ fontSize: '24px' }}>{quality.emoji}</span>
                <span style={{
                    fontWeight: '700',
                    color: quality.color,
                    fontSize: '16px'
                }}>
                    Match Quality: {quality.label}
                </span>
                <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: quality.color,
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    {averageMatch}% avg
                </div>
            </div>
        </div>
    );
}

// Recommendation Categories Component
function RecommendationCategories({ jobs, activeCategory, setActiveCategory }) {
    const categories = useMemo(() => {
        const cats = [
            { id: 'all', label: 'All Recommendations', count: jobs.length, icon: '🎯' },
            { id: 'perfect', label: 'Perfect Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 90).length, icon: '⭐' },
            { id: 'high', label: 'High Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 70 && (j.matchPercentage || 0) < 90).length, icon: '🔥' },
            { id: 'good', label: 'Good Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 50 && (j.matchPercentage || 0) < 70).length, icon: '👍' },
            { id: 'potential', label: 'Potential', count: jobs.filter(j => (j.matchPercentage || 0) < 50).length, icon: '💡' }
        ];
        return cats.filter(cat => cat.count > 0);
    }, [jobs]);

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '8px'
        }}>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`btn-outline ${activeCategory === category.id ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        whiteSpace: 'nowrap',
                        background: activeCategory === category.id ? 'var(--primary-500)' : 'transparent',
                        color: activeCategory === category.id ? 'white' : 'var(--secondary-700)',
                        border: `1px solid ${activeCategory === category.id ? 'var(--primary-500)' : 'var(--secondary-300)'}`,
                        borderRadius: '50px'
                    }}
                >
                    <span>{category.icon}</span>
                    <span style={{ fontWeight: '600' }}>{category.label}</span>
                    <div style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: activeCategory === category.id ? 'rgba(255,255,255,0.2)' : 'var(--secondary-200)',
                        fontSize: '12px',
                        fontWeight: '700'
                    }}>
                        {category.count}
                    </div>
                </button>
            ))}
        </div>
    );
}

// Empty Recommendations State
function EmptyRecommendationsState() {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                Building Your Recommendations
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                Our AI is learning your preferences! Complete your profile and interact with jobs to get personalized recommendations.
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
                    🔍 Browse All Jobs
                </button>
                <button 
                    className="btn-secondary"
                    onClick={() => window.location.href = '/job-matching/dashboard'}
                >
                    📊 View Dashboard
                </button>
            </div>
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
                🤖
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                AI is analyzing your profile...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Finding the best job matches based on your skills and preferences
            </p>
        </div>
    );
}

export default function RecommendedJobs() {
    const { ready, error: authError } = useEnsureDemoAuth();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredJobs = useMemo(() => {
        switch(activeCategory) {
            case 'perfect':
                return jobs.filter(j => (j.matchPercentage || 0) >= 90);
            case 'high':
                return jobs.filter(j => (j.matchPercentage || 0) >= 70 && (j.matchPercentage || 0) < 90);
            case 'good':
                return jobs.filter(j => (j.matchPercentage || 0) >= 50 && (j.matchPercentage || 0) < 70);
            case 'potential':
                return jobs.filter(j => (j.matchPercentage || 0) < 50);
            default:
                return jobs;
        }
    }, [jobs, activeCategory]);

    const averageMatch = useMemo(() => {
        if (!jobs || jobs.length === 0) return 0;
        const total = jobs.reduce((sum, job) => sum + (job.matchPercentage || 0), 0);
        return Math.round(total / jobs.length);
    }, [jobs]);

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
                <div className="page-header">
                    <h1 className="page-title">⭐ AI Recommendations</h1>
                    <p className="page-subtitle">
                        Personalized job matches powered by machine learning and skill analysis
                    </p>
                </div>

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
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '16px' }}
                        >
                            🔄 Retry
                        </button>
                    </div>
                )}

                {!ready && (
                    <div className="glass-panel" style={{ 
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚡</div>
                        <div>Starting demo session…</div>
                    </div>
                )}

                {loading && <LoadingState />}

                {ready && !loading && !error && (
                    <>
                        {jobs.length > 0 ? (
                            <>
                                <MatchQualityBanner 
                                    averageMatch={averageMatch}
                                    totalJobs={jobs.length}
                                />
                                
                                <RecommendationCategories
                                    jobs={jobs}
                                    activeCategory={activeCategory}
                                    setActiveCategory={setActiveCategory}
                                />

                                <div className="modern-grid">
                                    {filteredJobs.map((job, index) => (
                                        <div
                                            key={job._id}
                                            className="animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            <JobCard
                                                job={job}
                                                matchPercentage={typeof job.matchPercentage === 'number' ? job.matchPercentage : undefined}
                                                onApply={handleApply}
                                                onSave={handleSave}
                                                isSaved={savedJobIds.has(String(job._id))}
                                                showMatchDetails={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyRecommendationsState />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
