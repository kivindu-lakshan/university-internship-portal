import React from 'react';

export default function JobCard({
    job,
    matchPercentage,
    onApply,
    onSave,
    onRemove,
    isSaved,
    showRemove
}) {
    const salaryText = job?.salary ? `${job.salary}` : 'Not listed';

    return (
        <div className="card">
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cardTitle">{job?.title}</div>
                    <div className="muted">{job?.company}</div>
                    <div className="spacer8" />
                    <div className="muted">Location: {job?.location}</div>
                    <div className="muted">Type: {job?.jobType}</div>
                    <div className="muted">Salary: {salaryText}</div>
                </div>

                {typeof matchPercentage === 'number' ? (
                    <span className="badge">{matchPercentage}% Match</span>
                ) : null}
            </div>

            <div className="spacer12" />

            <div className="row" style={{ justifyContent: 'space-between' }}>
                <button className="btn btnSmall" type="button" onClick={() => onApply?.(job)}>
                    Apply
                </button>

                {showRemove ? (
                    <button className="clickableIcon" type="button" onClick={() => onRemove?.(job)} aria-label="Remove saved job">
                        ✕
                    </button>
                ) : (
                    <button
                        className={isSaved ? 'btnSecondary btnSmall' : 'btn btnSmall'}
                        type="button"
                        onClick={() => onSave?.(job)}
                        disabled={Boolean(isSaved)}
                    >
                        {isSaved ? 'Saved' : 'Save Job'}
                    </button>
                )}
            </div>
        </div>
    );
}
