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

    const handleCreatePlaylist = () => {
        axios.post('http://localhost:5000/api/playlists', {
            name: newPlaylistName,
            songs: newPlaylistSongs,
            // Include songs array in the request body
            user: 'user_id',
            // Replace 'user_id' with the actual user ID
            playlistCode: 'your_playlist_code'
            // Replace 'your_playlist_code' with 
            // the actual playlist code
        })