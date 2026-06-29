const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist");
const Song = require("../models/song");
const { ObjectId } = require("mongodb");

// Playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs');
        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/api/songs/:songId/audio', async (req, res) => {
    try {
        const songId = req.params.songId;

        // Ensure the songId is a valid ObjectId
        if (!ObjectId.isValid(songId)) {
            return res.status(404).json({ error: 'Invalid song ID' });
        }

        // Find the song in MongoDB
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        // Set the routerropriate Content-Type header
        res.set('Content-Type', 'audio/wav');
        // Modify the Content-Type as per your file format

        // Stream the audio file from GridFS
        const downloadStream = gfs.openDownloadStream(song.fileId);
        // Assuming fileId is the ID of the audio file in GridFS
        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:playlistName/songs', async (req, res) => {
    try {
        const playlistName = req.params.playlistName;
        const playlist =
            await Playlist.findOne({ name: playlistName })
                .populate('songs');
        if (!playlist) {
            return res.status(404)
                      .json({ error: 'Playlist not found' });
        }
        res.json(playlist.songs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update the playlist POST endpoint
router.post('/', async (req, res) => {
    try {
        const { name, songs } = req.body;

        // Find the ObjectId values of the
        // songs specified by their titles
        const existingSongs = await Song.find({ title: { $in: songs } });
        const songIds = existingSongs.map(song => song._id);

        // Validate if all songs were found
        if (existingSongs.length !== songs.length) {
            const missingSongs =
                songs.filter(
                    song => !existingSongs.find(
                        existingSong => existingSong.title === song)
                );
            return res.status(400)
                .json(
                    {
                        error: `One or more songs not found:
                                ${missingSongs.join(', ')}`
                    });
        }

        // Create the playlist with the provided data
        const playlist = new Playlist({ name, songs: songIds });

        // Save the playlist to the database
        await playlist.save();

        // Return the created playlist
        res.json(playlist);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern
            && err.keyPattern.songcode) {
            return res.status(400)
                .json({ error: 'Duplicate songcode found' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
});

// Collaborative Playlists
router.post('/:playlistId/collaborators', async (req, res) => {
    try {
        const { userId } = req.body;
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.playlistId,
            { $addToSet: { collaborators: userId } },
            { new: true }
        );
        res.json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/collaborative/:userId', async (req, res) => {
    try {
        const playlists =
            await Playlist.find({ collaborators: req.params.userId });
        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;