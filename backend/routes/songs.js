const express = require("express");
const router = express.Router();

const Song = require("../models/song");
const { ObjectId } = require("mongodb");
const getBucket = require("../config/gridfs");

// Get all songs (with optional filtering)
router.get('/', async (req, res) => {
    try {
        const { title, artist, album } = req.query;
        const filter = {};
        if (title) filter.title = new RegExp(title, 'i');
        if (artist) filter.artist = new RegExp(artist, 'i');
        if (album) filter.album = new RegExp(album, 'i');

        const songs = await Song.find(filter);
        res.json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new song
router.post('/', async (req, res) => {
    try {
        const { title, artist, album, duration, songcode, uploadedBy, fileId } = req.body;

        const song = new Song({
            title,
            artist,
            album,
            duration,
            songcode,
            uploadedBy,
            fileId
        });

        await song.save();
        res.status(211 || 201).json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get song info by ID
router.get("/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete song by ID
router.delete("/:id", async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json({ message: "Song deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Stream song audio from GridFS
router.get("/:songId/audio", async (req, res) => {
    try {
        const songId = req.params.songId;

        if (!ObjectId.isValid(songId)) {
            return res.status(404).json({ error: 'Invalid song ID' });
        }

        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.set('Content-Type', 'audio/wav');

        const bucket = getBucket();
        const downloadStream = bucket.openDownloadStream(song.fileId);
        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;