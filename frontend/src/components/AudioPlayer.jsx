import React from "react";
import { useAudio } from "../context/AudioContext";

function AudioPlayer() {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        togglePlay,
        nextSong,
        prevSong,
        seek
    } = useAudio();

    if (!currentSong) return null;

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleProgressChange = (e) => {
        seek(parseFloat(e.target.value));
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className="audio-player-bar">
            <div className="player-song-info">
                <div className="album-art-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </div>
                <div className="song-meta-text">
                    <span className="song-title-main">{currentSong.title}</span>
                    <span className="song-artist-sub">{currentSong.artist}</span>
                </div>
            </div>

            <div className="player-controls">
                <div className="control-buttons">
                    <button className="control-btn" onClick={prevSong} title="Previous Song">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="19,20 9,12 19,4" />
                            <rect x="5" y="4" width="2" height="16" />
                        </svg>
                    </button>
                    <button className="control-btn control-btn-play" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"} style={{ border: "none", cursor: "pointer" }}>
                        {isPlaying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="5" y="4" width="4" height="16" />
                                <rect x="15" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                                <polygon points="6,4 20,12 6,20" />
                            </svg>
                        )}
                    </button>
                    <button className="control-btn" onClick={nextSong} title="Next Song">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,4 15,12 5,20" />
                            <rect x="17" y="4" width="2" height="16" />
                        </svg>
                    </button>
                </div>
                <div className="player-progress-container">
                    <span className="progress-time">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        className="progress-bar-slider"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleProgressChange}
                    />
                    <span className="progress-time">{formatTime(duration)}</span>
                </div>
            </div>

            <div className="player-volume-container">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
}

export default AudioPlayer;
