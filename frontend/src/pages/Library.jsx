import React, { useState, useEffect } from "react";
import api from "../services/api";
import PlaylistCard from "../components/PlaylistCard";
import { useAuth } from "@clerk/clerk-react";

const HAS_CLERK = !!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function LibraryContent({ userId }) {
    const activeUserId = userId || "guest_user";

    const [allPlaylists, setAllPlaylists] = useState([]);
    const [collabPlaylists, setCollabPlaylists] = useState([]);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchPlaylists();
        if (activeUserId) {
            fetchCollaborativePlaylists();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeUserId]);

    const fetchPlaylists = async () => {
        try {
            const response = await api.get("/playlists");
            setAllPlaylists(response.data);
        } catch (err) {
            console.error("Failed to fetch all playlists:", err);
        }
    };

    const fetchCollaborativePlaylists = async () => {
        try {
            const response = await api.get(`/playlists/collaborative/${activeUserId}`);
            setCollabPlaylists(response.data);
        } catch (err) {
            console.error("Failed to fetch collaborative playlists:", err);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div>
                <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: 800 }}>Your Library</h1>
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>Manage your custom mixes and shared playlists.</p>
            </div>

            <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                <button
                    onClick={() => setActiveTab("all")}
                    className={`btn ${activeTab === "all" ? "" : "btn-secondary"}`}
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                    All Playlists ({allPlaylists.length})
                </button>
                <button
                    onClick={() => setActiveTab("collab")}
                    className={`btn ${activeTab === "collab" ? "" : "btn-secondary"}`}
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                    Collaborations ({collabPlaylists.length})
                </button>
            </div>

            <div>
                {activeTab === "all" ? (
                    allPlaylists.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                            No playlists found. Create one from the Home tab!
                        </div>
                    ) : (
                        <div className="playlists-grid">
                            {allPlaylists.map((playlist) => (
                                <PlaylistCard key={playlist._id} playlist={playlist} />
                            ))}
                        </div>
                    )
                ) : (
                    collabPlaylists.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                            {HAS_CLERK 
                                ? "You haven't been added as a collaborator to any playlists yet."
                                : "Sign in to access collaborative features, or test as guest."
                            }
                        </div>
                    ) : (
                        <div className="playlists-grid">
                            {collabPlaylists.map((playlist) => (
                                <PlaylistCard key={playlist._id} playlist={playlist} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function LibraryWithClerk() {
    const { userId } = useAuth();
    return <LibraryContent userId={userId} />;
}

function LibraryWithoutClerk() {
    return <LibraryContent userId="guest_user" />;
}

function Library() {
    return HAS_CLERK ? <LibraryWithClerk /> : <LibraryWithoutClerk />;
}

export default Library;