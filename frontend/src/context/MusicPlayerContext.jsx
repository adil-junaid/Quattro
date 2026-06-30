import { createContext, useState } from "react";

export const MusicPlayerContext = createContext();

export function MusicPlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playSong = (song, customPlaylist = []) => {
    if (customPlaylist && customPlaylist.length > 0) {
      setPlaylist(customPlaylist);
      const idx = customPlaylist.findIndex(s => s._id === song._id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
      setPlaylist([song]);
      setCurrentIndex(0);
    }
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const playPlaylist = (playlistSongs) => {
    if (!playlistSongs || playlistSongs.length === 0) return;
    setPlaylist(playlistSongs);
    setCurrentIndex(0);
    setCurrentSong(playlistSongs[0]);
    setIsPlaying(true);
  };

  const nextSong = () => {
    if (playlist && playlist.length > 0) {
      const nextIdx = currentIndex + 1;
      if (nextIdx < playlist.length) {
        setCurrentIndex(nextIdx);
        setCurrentSong(playlist[nextIdx]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const prevSong = () => {
    if (playlist && playlist.length > 0) {
      const prevIdx = currentIndex - 1;
      if (prevIdx >= 0) {
        setCurrentIndex(prevIdx);
        setCurrentSong(playlist[prevIdx]);
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playlist,
        currentIndex,
        setIsPlaying,
        playSong,
        playPlaylist,
        nextSong,
        prevSong,
        togglePlay,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
