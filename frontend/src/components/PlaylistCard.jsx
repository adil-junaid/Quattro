import React from "react";
import { Link } from "react-router-dom";

function PlaylistCard({ playlist }) {
    const songCount = playlist.songs ? playlist.songs.length : 0;

    return (
        <Link to={`/playlist/${playlist.name}`} className="playlist-card glass-panel">
            <div className="playlist-card-info">
                <span className="playlist-card-name">{playlist.name}</span>
                <span className="playlist-card-count">
                    {songCount} {songCount === 1 ? "song" : "songs"}
                </span>
                {playlist.playlistCode && (
                    <span style={{ fontSize: "11px", color: "var(--accent-purple)", marginTop: "4px" }}>
                        Code: {playlist.playlistCode}
                    </span>
                )}
            </div>
            <div className="playlist-card-arrow" style={{ color: "var(--accent-orange)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        </Link>
    );
}

export default PlaylistCard;
