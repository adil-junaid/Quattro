import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file

function PlaylistList() {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistSongs, setNewPlaylistSongs] = useState([]);
    const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
    // State to track the hovered playlist ID

    useEffect(() => {
        axios.get('http://localhost:5000/api/playlists')
            .then(response => {
                setPlaylists(response.data);
            })
            .catch(error => {
                console.error('Error fetching playlists:', error);
            });
    }, []);