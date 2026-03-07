import React from 'react';

export default function SearchBar({ value, onChange, onSearch }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.();
    };

    return (
        <form className="panel" onSubmit={handleSubmit}>
            <label className="label" htmlFor="job-search">
                Search
            </label>
            <div className="row">
                <input
                    id="job-search"
                    className="input"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder="Search by title, company, or keyword"
                />
                <button className="btn" type="submit">
                    Search
                </button>
            </div>
        </form>
    );
}
