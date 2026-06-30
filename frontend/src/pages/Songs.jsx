import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { MusicPlayerContext } from "../context/MusicPlayerContext";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const { playSong } = useContext(MusicPlayerContext);
  const location = useLocation();

  const search = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, [search]);

  const fetchSongs = async () => {
    try {
      const url = search
        ? `/songs?search=${encodeURIComponent(search)}`
        : "/songs";
        
      console.log(url);
      const res = await api.get(url);
      setSongs(res.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

    const fetchPlaylists = async () => {
      try {
        const res = await api.get("/playlists");

        console.log("Playlists response:", res.data);

        setPlaylists(res.data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };

  const handleAddToPlaylist = async (songId, playlistId) => {
    if (!playlistId) return;

    try {
      await api.put(`/playlists/${playlistId}/add-song`, { songId });

      alert("✅ Song added to playlist successfully!");
      fetchPlaylists();
    } catch (err) {
      console.error("Error adding song to playlist:", err);
      alert("❌ Failed to add song to playlist.");
    }
  };

  if (loading) {
    return <h2>Loading songs...</h2>;
  }

  return (
    <div className="songs-page">
      <h1>
        🎵 Songs Library
        {search && ` - "${search}"`}
      </h1>

      {songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="songs-list">
          {songs.map((song) => (
            <div key={song._id} className="song-card">
              <h3>{song.title}</h3>

              <p>
                <strong>Artist:</strong> {song.artist}
              </p>

              <p>
                <strong>Album:</strong> {song.album}
              </p>

              <button
                onClick={() => playSong(song, songs)}
                className="play-button"
              >
                ▶ Play
              </button>

              <select
                defaultValue=""
                className="playlist-select"
                onChange={(e) => {
                  handleAddToPlaylist(song._id, e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="" disabled>
                  ➕ Add to Playlist
                </option>

                {playlists.map((playlist) => (
                  <option key={playlist._id} value={playlist._id}>
                    {playlist.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Songs;