const express = require("express");
const router = express.Router();

const Song = require("../models/song");
const { ObjectId } = require("mongodb");
const getBucket = require("../config/gridfs");

// Songs
router.get('/', async (req, res) => {
    console.log(req.query);
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { title: new RegExp(search, "i") },
                    { artist: new RegExp(search, "i") },
                    { album: new RegExp(search, "i") }
                ]
            };
        }

        const songs = await Song.find(filter);
        res.json(songs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get("/:songId/audio", async (req, res) => {
    try {
        const songId = req.params.songId;

        if (!ObjectId.isValid(songId)) {
            return res.status(404).json({
                error: "Invalid song ID"
            });
        }

        const song = await Song.findById(songId);

        if (!song) {
            return res.status(404).json({
                error: "Song not found"
            });
        }

        if (!song.fileId) {
            return res.status(404).json({
                error: "No audio file associated with this song"
            });
        }

        const bucket = getBucket();

        const files = await bucket.find({
            _id: new ObjectId(song.fileId)
        }).toArray();

        if (files.length === 0) {
            return res.status(404).json({
                error: "Audio file not found"
            });
        }

        res.set("Content-Type", files[0].contentType);

        const downloadStream = bucket.openDownloadStream(
            new ObjectId(song.fileId)
        );

        downloadStream.on("error", (err) => {
            console.error(err);

            res.status(500).json({
                error: "Error streaming audio"
            });
        });

        downloadStream.pipe(res);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Server error"
        });
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