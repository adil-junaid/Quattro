import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAudio } from "../context/AudioContext";

function Playlist() {
    const { playlistName } = useParams();
    const { playSong } = useAudio();

    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [collaboratorId, setCollaboratorId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylistAndSongs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistName]);

    const fetchPlaylistAndSongs = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            // 1. Fetch songs of this playlist
            const songsResponse = await api.get(`/playlists/${playlistName}/songs`);
            setSongs(songsResponse.data);

            // 2. Fetch playlists list to find the metadata (like _id, playlistCode, collaborators)
            const playlistsResponse = await api.get("/playlists");
            const meta = playlistsResponse.data.find(
                (p) => p.name.toLowerCase() === playlistName.toLowerCase()
            );

            if (meta) {
                setPlaylist(meta);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to load playlist details.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (songs.length > 0) {
            playSong(songs[0], songs);
        }
    };

    const handleAddCollaboratorSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");

        if (!collaboratorId.trim()) return;

        try {
            const response = await api.post(`/playlists/${playlist._id}/collaborators`, {
                userId: collaboratorId,
            });
            setPlaylist(response.data); // Update with new collaborator array
            setSuccessMsg("Collaborator added successfully!");
            setCollaboratorId("");
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Failed to add collaborator.");
        }
    };

    const formatDuration = (sec) => {
        if (isNaN(sec) || sec === undefined) return "0:00";
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", paddingTop: "80px" }}>
                Loading playlist details...
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="glass-panel" style={{ textAlign: "center", paddingTop: "40px" }}>
                <h2>Playlist not found</h2>
                <Link to="/" className="btn" style={{ display: "inline-flex", marginTop: "16px" }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Back button */}
            <div>
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Header Banner */}
            <div className="playlist-header-banner">
                <div className="playlist-banner-art">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                </div>
                <div className="playlist-banner-info">
                    <span className="playlist-banner-type">
                        {playlist.collaborators?.length > 0 ? "Collaborative Playlist" : "Playlist"}
                    </span>
                    <h1 className="playlist-banner-title">{playlist.name}</h1>
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px", display: "flex", gap: "16px" }}>
                        <span>{songs.length} {songs.length === 1 ? "track" : "tracks"}</span>
                        {playlist.playlistCode && (
                            <span style={{ color: "var(--accent-purple)", fontWeight: 600 }}>Code: {playlist.playlistCode}</span>
                        )}
                    </span>
                </div>
            </div>

            {/* Content area split: Left (Tracks), Right (Collaborators) */}
            <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
                {/* Tracks list */}
                <div className="glass-panel" style={{ flex: 2, minWidth: "300px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Tracks</h3>
                        {songs.length > 0 && (
                            <button className="btn" onClick={handlePlayAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                Play All
                                </button>
                        )}
                    </div>

                    {songs.length === 0 ? (
                        <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "45px 0" }}>
                            This playlist is empty. Add songs on the dashboard!
                        </div>
                    ) : (
                        <table className="song-list-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Artist</th>
                                    <th>Album</th>
                                    <th>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {songs.map((song, index) => (
                                    <tr key={song._id} className="song-list-row" onClick={() => playSong(song, songs)}>
                                        <td style={{ color: "var(--text-secondary)", width: "30px" }}>{index + 1}</td>
                                        <td>
                                            <div className="song-list-title-col">
                                                <span style={{ fontWeight: 600 }}>{song.title}</span>
                                            </div>
                                        </td>
                                        <td>{song.artist}</td>
                                        <td style={{ color: "var(--text-secondary)" }}>{song.album || "—"}</td>
                                        <td style={{ color: "var(--text-secondary)", width: "60px" }}>{formatDuration(song.duration)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Collaborators side section */}
                <div className="glass-panel" style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700 }}>Collaborators</h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                            Add friends using their Clerk User ID to collaborate on this playlist.
                        </p>
                    </div>

                    {/* Invite form */}
                    <form onSubmit={handleAddCollaboratorSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Clerk User ID (e.g. user_...)"
                            value={collaboratorId}
                            onChange={(e) => setCollaboratorId(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn" style={{ justifyContent: "center" }}>
                            Add Collaborator
                        </button>
                    </form>

                    {successMsg && <div style={{ fontSize: "13px", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "8px 12px", borderRadius: "6px" }}>{successMsg}</div>}
                    {errorMsg && <div style={{ fontSize: "13px", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "8px 12px", borderRadius: "6px" }}>{errorMsg}</div>}

                    {/* Collaborator List */}
                    <div>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Active ({playlist.collaborators?.length || 0})
                        </h4>
                        {playlist.collaborators?.length === 0 ? (
                            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                No collaborators added yet.
                            </span>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {playlist.collaborators.map((userId) => (
                                    <div key={userId} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-purple)", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: "11px", fontWeight: "bold" }}>
                                            U
                                        </div>
                                        <span style={{ fontSize: "12px", wordBreak: "break-all", fontFamily: "monospace" }}>{userId}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Playlist;