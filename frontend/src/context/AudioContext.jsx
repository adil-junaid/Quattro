import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            // Trigger nextSong inside an function or directly, but wait,
            // nextSong depends on state, so we handle state cleanly.
            handleNextSong();
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("ended", onEnded);
        };
    });

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (currentSong) {
            audio.src = `http://localhost:5000/api/songs/${currentSong._id}/audio`;
            audio.crossOrigin = "anonymous";
            if (isPlaying) {
                audio.play().catch(err => console.log("Audio play failed:", err));
            }
        } else {
            audio.pause();
            audio.src = "";
            setIsPlaying(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong]);

    useEffect(() => {
        if (currentSong) {
            if (isPlaying) {
                audioRef.current.play().catch(err => console.log("Audio play failed:", err));
            } else {
                audioRef.current.pause();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    const playSong = (song, newQueue = []) => {
        if (newQueue.length > 0) {
            setQueue(newQueue);
            const idx = newQueue.findIndex(s => s._id === song._id);
            setCurrentQueueIndex(idx !== -1 ? idx : 0);
        } else {
            setQueue([song]);
            setCurrentQueueIndex(0);
        }
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const handleNextSong = () => {
        setQueue((prevQueue) => {
            if (prevQueue.length === 0) return prevQueue;
            setCurrentQueueIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % prevQueue.length;
                setCurrentSong(prevQueue[nextIndex]);
                setIsPlaying(true);
                return nextIndex;
            });
            return prevQueue;
        });
    };

    const handlePrevSong = () => {
        setQueue((prevQueue) => {
            if (prevQueue.length === 0) return prevQueue;
            setCurrentQueueIndex((prevIndex) => {
                const prevIndexNew = (prevIndex - 1 + prevQueue.length) % prevQueue.length;
                setCurrentSong(prevQueue[prevIndexNew]);
                setIsPlaying(true);
                return prevIndexNew;
            });
            return prevQueue;
        });
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <AudioContext.Provider
            value={{
                currentSong,
                isPlaying,
                queue,
                currentQueueIndex,
                currentTime,
                duration,
                volume,
                setVolume,
                playSong,
                togglePlay,
                nextSong: handleNextSong,
                prevSong: handlePrevSong,
                seek,
                setIsPlaying
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
