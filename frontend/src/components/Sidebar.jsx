import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/songs">🎵 Songs</Link>

      <Link to="/upload">⬆ Upload Songs</Link>

      <Link to="/playlists">📂 Playlists</Link>

      <Link to="/create-playlist">➕ Playlist</Link>

    </div>
  );
}