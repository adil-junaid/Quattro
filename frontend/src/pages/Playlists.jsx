import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { MusicPlayerContext } from "../context/MusicPlayerContext";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playPlaylist, playSong } = useContext(MusicPlayerContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists");
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading playlists...</h2>;
  }

  return (
    <div className="playlists-page">
      <h1>📂 Playlists</h1>

      {playlists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        <div className="playlists-list">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="playlist-card"
            >
              <h2>{playlist.name}</h2>

              <p>
                <strong>Total Songs:</strong>{" "}
                {playlist.songs.length}
              </p>

              {playlist.songs.length > 0 ? (
                <>
                  <button 
                    onClick={() => playPlaylist(playlist.songs)}
                    className="play-playlist-btn"
                  >
                    ▶ Play Playlist
                  </button>

                  <div className="playlist-songs-container">
                    <h4>Songs:</h4>
                    <ul className="playlist-songs-list">
                      {playlist.songs.map((song, index) => (
                        <li 
                          key={song._id} 
                          onClick={() => playSong(song, playlist.songs)}
                          className="playlist-song-item"
                        >
                          <span className="song-title-text">{index + 1}. {song.title}</span>
                          <span className="song-artist-text">{song.artist}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="no-songs-msg">No songs in this playlist. Add some from the library!</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;