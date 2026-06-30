import React from "react";
import { useAudio } from "../context/AudioContext";

function SongCard({ song, queue = [] }) {
    const { playSong, currentSong, isPlaying, togglePlay } = useAudio();

    const isCurrent = currentSong && currentSong._id === song._id;

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (isCurrent) {
            togglePlay();
        } else {
            playSong(song, queue);
        }
    };

    return (
        <div className="song-card glass-panel" onClick={handlePlayClick}>
            <div className="song-card-art">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                </svg>
                <div className="song-card-play-overlay">
                    <button className="play-overlay-icon" onClick={handlePlayClick} style={{ border: "none", cursor: "pointer" }}>
                        {isCurrent && isPlaying ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="5" y="4" width="4" height="16" />
                                <rect x="15" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="song-meta-text">
                <span className="song-title-main" style={{ color: isCurrent ? "var(--accent-orange)" : "inherit" }}>
                    {song.title}
                </span>
                <span className="song-artist-sub">{song.artist}</span>
                {song.album && <span className="song-artist-sub" style={{ opacity: 0.6 }}>{song.album}</span>}
            </div>
        </div>
    );
}

export default SongCard;
