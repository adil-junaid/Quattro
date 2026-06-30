import React from "react";

function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar-wrapper">
            <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                type="text"
                className="search-input"
                placeholder="Search songs or artists..."
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default SearchBar;
