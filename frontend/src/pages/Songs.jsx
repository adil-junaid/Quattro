import { useEffect, useState } from "react";
import api from "../services/api";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await api.get("/songs");
      setSongs(res.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  const playSong = (id) => {
    const audio = new Audio(
      `http://localhost:5000/api/songs/${id}/audio`
    );
    audio.play();
  };

  if (loading) {
    return <h2>Loading songs...</h2>;
  }

  return (
    <div className="songs-page">
      <h1>🎵 Songs Library</h1>

      {songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="songs-list">
          {songs.map((song) => (
            <div key={song._id} className="song-card">
              <h3>{song.title}</h3>
              <p><strong>Artist:</strong> {song.artist}</p>
              <p><strong>Album:</strong> {song.album}</p>
              <p><strong>Duration:</strong> {song.duration} sec</p>

              <button onClick={() => playSong(song._id)}>
                ▶ Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Songs;