import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/">🏠 Home</Link>

      <Link to="/songs">🎵 Songs</Link>

      <Link to="/upload">⬆ Upload</Link>

      <Link to="/playlists">📂 Playlists</Link>

      <Link to="/create-playlist">➕ Playlist</Link>

      <Link to="/profile">👤 Profile</Link>

    </div>
  );
}