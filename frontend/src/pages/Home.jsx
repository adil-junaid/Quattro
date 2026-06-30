import React, { useState, useEffect } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import SongCard from "../components/SongCard";
import PlaylistCard from "../components/PlaylistCard";

function Home() {
    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchSongs();
        fetchPlaylists();
    }, []);

    const fetchSongs = async (query = "") => {
        try {
            const url = query ? `/songs?title=${query}` : "/songs";
            const response = await api.get(url);
            setSongs(response.data);
        } catch (err) {
            console.error("Failed to fetch songs:", err);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await api.get("/playlists");
            setPlaylists(response.data);
        } catch (err) {
            console.error("Failed to fetch playlists:", err);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchSongs(query);
    };

    const toggleSongSelection = (songTitle) => {
        setSelectedSongs((prev) =>
            prev.includes(songTitle)
                ? prev.filter((title) => title !== songTitle)
                : [...prev, songTitle]
        );
    };

    const handleCreatePlaylistSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!newPlaylistName.trim()) {
            setErrorMessage("Playlist name is required.");
            return;
        }

        try {
            const payload = {
                name: newPlaylistName,
                songs: selectedSongs,
            };
            await api.post("/playlists", payload);
            setSuccessMessage("Playlist created successfully!");
            setTimeout(() => setSuccessMessage(""), 4000);
            setNewPlaylistName("");
            setSelectedSongs([]);
            setIsModalOpen(false);
            fetchPlaylists();
        } catch (err) {
            setErrorMessage(err.response?.data?.error || "Failed to create playlist.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Top area with title, search, and action button */}
            <div className="search-header-container">
                <div>
                    <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 800 }}>Explore Music</h1>
                    <p style={{ margin: 0, color: "var(--text-secondary)" }}>Search, play, and build your collaborative playlists.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <SearchBar value={searchQuery} onChange={handleSearchChange} />
                    <button className="btn" onClick={() => setIsModalOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Playlist
                    </button>
                </div>
            </div>

            {successMessage && (
                <div style={{ color: "#10b981", padding: "12px 16px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", fontSize: "14px", fontWeight: 600 }}>
                    {successMessage}
                </div>
            )}

            {/* Playlists Section */}
            <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 16px 0" }}>Featured Playlists</h2>
                {playlists.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                        No playlists found. Create one to get started!
                    </div>
                ) : (
                    <div className="playlists-grid">
                        {playlists.map((playlist) => (
                            <PlaylistCard key={playlist._id} playlist={playlist} />
                        ))}
                    </div>
                )}
            </div>

            {/* All Songs Section */}
            <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 16px 0" }}>All Tracks</h2>
                {songs.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                        No tracks found.
                    </div>
                ) : (
                    <div className="songs-grid">
                        {songs.map((song) => (
                            <SongCard key={song._id} song={song} queue={songs} />
                        ))}
                    </div>
                )}
            </div>

            {/* Playlist Creation Modal */}
            {isModalOpen && (
                <div className="dialog-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="dialog-content glass-panel" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: 700 }}>Create New Playlist</h3>
                        
                        {errorMessage && (
                            <div style={{ color: "#ef4444", padding: "10px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", marginBottom: "16px", fontSize: "14px" }}>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleCreatePlaylistSubmit}>
                            <div className="form-group">
                                <label className="form-label">Playlist Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter a title for your playlist..."
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Tracks to Add</label>
                                <div className="form-checkbox-group">
                                    {songs.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>No songs available to select.</p>
                                    ) : (
                                        songs.map((song) => (
                                            <div key={song._id} className="checkbox-item" onClick={() => toggleSongSelection(song.title)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSongs.includes(song.title)}
                                                    onChange={() => {}} // handled by click on parent div
                                                />
                                                <span>{song.title} - <span style={{ opacity: 0.6 }}>{song.artist}</span></span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="dialog-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;