import { useContext, useEffect, useRef, useState } from "react";
import { MusicPlayerContext } from "../context/MusicPlayerContext";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from "react-icons/fa";

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    setIsPlaying,
    playlist,
  } = useContext(MusicPlayerContext);

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Sync play/pause state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  // Reset time and duration when song changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong]);

  if (!currentSong) {
    return (
      <div className="player no-song">
        <p>No song playing. Select a song or play a playlist.</p>
      </div>
    );
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={`http://34.60.148.8:5000/api/songs/${currentSong._id}/audio`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextSong}
      />

      <div className="player-left">
        <div className="song-thumbnail">🎵</div>
        <div className="song-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist || "Unknown Artist"}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button 
            onClick={prevSong} 
            className="control-btn" 
            disabled={playlist.length <= 1}
            title="Previous Song"
          >
            <FaStepBackward />
          </button>
          <button 
            onClick={togglePlay} 
            className="control-btn play-btn"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button 
            onClick={nextSong} 
            className="control-btn" 
            disabled={playlist.length <= 1}
            title="Next Song"
          >
            <FaStepForward />
          </button>
        </div>

        <div className="player-progress">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-slider"
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <FaVolumeUp className="volume-icon" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
}