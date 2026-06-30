const express = require("express");
const router = express.Router();

const Song = require("../models/song");
const { ObjectId } = require("mongodb");

// Songs
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

router.get('/:songId/audio', async (req, res) => {
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

        // Set the appropriate Content-Type header
        res.set('Content-Type', 'audio/wav');

        // Stream the audio file from GridFS
        const downloadStream = gfs.openDownloadStream(song.fileId);
        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

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
        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

//get song info from id
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

//update song by id
router.put("/:id", async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

//delete song by id
router.delete("/:id", async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json({
            message: "Song deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;