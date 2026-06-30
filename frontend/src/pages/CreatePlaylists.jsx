import { useState } from "react";
import api from "../services/api";

function CreatePlaylists() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const createPlaylist = async (e) => {
    e.preventDefault();

    try {
      await api.post("/playlists", {
        name,
      });

      setMessage("✅ Playlist created successfully!");
      setName("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create playlist.");
    }
  };

  return (
    <div className="upload-page">
      <h1>Create Playlist</h1>

      <form onSubmit={createPlaylist} className="upload-form">
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit">
          Create Playlist
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreatePlaylists;