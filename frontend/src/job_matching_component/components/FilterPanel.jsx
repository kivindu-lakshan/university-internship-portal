import React from 'react';

export default function FilterPanel({ filters, onChange, onApply }) {
    const set = (patch) => onChange?.({ ...filters, ...patch });

    return (
        <div className="panel">
            <div className="row" style={{ alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                    <span className="label">Job Type</span>
                    <select
                        className="select"
                        value={filters.jobType}
                        onChange={(e) => set({ jobType: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                <div style={{ flex: 1, minWidth: 180 }}>
                    <span className="label">Location</span>
                    <input
                        className="input"
                        value={filters.location}
                        onChange={(e) => set({ location: e.target.value })}
                        placeholder="e.g., New York"
                    />
                </div>

                <div style={{ flex: 1, minWidth: 140 }}>
                    <span className="label">Min Salary</span>
                    <input
                        className="input"
                        type="number"
                        value={filters.minSalary}
                        onChange={(e) => set({ minSalary: e.target.value })}
                        placeholder="0"
                    />
                </div>

                <div style={{ flex: 1, minWidth: 140 }}>
                    <span className="label">Max Salary</span>
                    <input
                        className="input"
                        type="number"
                        value={filters.maxSalary}
                        onChange={(e) => set({ maxSalary: e.target.value })}
                        placeholder="100000"
                    />
                </div>

                <button className="btn" onClick={() => onApply?.()} type="button">
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
