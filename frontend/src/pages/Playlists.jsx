import { useEffect, useState } from "react";
import api from "../services/api";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlists;