const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const Playlist = require("../models/playlist");
const Song = require("../models/song");
const { ObjectId } = require("mongodb");

// Get all playlists
router.get("/", requireAuth(), async (req, res) => {
    try {
        const playlists = await Playlist.find({
            owner: req.auth.userId
        }).populate("songs");
        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get songs in a playlist
router.get("/:playlistName/songs", async (req, res) => {
    try {
        const playlist = await Playlist.findOne({
            name: req.params.playlistName,
        }).populate("songs");

        if (!playlist) {
            return res.status(404).json({
                error: "Playlist not found",
            });
        }

        res.json(playlist.songs);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error",
        });
    }
});

// Create playlist
// Create playlist
router.post("/", requireAuth(), async (req, res) => {
    try {
        const { name, songs = [] } = req.body;

        let songIds = [];

        if (songs.length > 0) {
            const existingSongs = await Song.find({
                title: { $in: songs }
            });

            songIds = existingSongs.map((song) => song._id);

            if (existingSongs.length !== songs.length) {
                return res.status(400).json({
                    error: "Some songs were not found"
                });
            }
        }

        const playlist = new Playlist({
            name,
            songs: songIds,
            owner: req.auth.userId
        });

        await playlist.save();

        res.status(201).json(playlist);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error"
        });
    }
});

// Add collaborator
router.post("/:playlistId/collaborators", async (req, res) => {
    try {
        const { userId } = req.body;

        const playlist = await Playlist.findByIdAndUpdate(
            req.params.playlistId,
            {
                $addToSet: {
                    collaborators: userId,
                },
            },
            { new: true }
        );

        res.json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error",
        });
    }
});

// Get collaborative playlists
router.get("/collaborative/:userId", async (req, res) => {
    try {
        const playlists = await Playlist.find({
            collaborators: req.params.userId,
        });

        res.json(playlists);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error",
        });
    }
});

// Add song to playlist
router.put("/:playlistId/add-song", async (req, res) => {
    try {
        const { songId } = req.body;
        if (!ObjectId.isValid(req.params.playlistId)) {
            return res.status(400).json({ error: "Invalid playlist ID" });
        }
        if (!ObjectId.isValid(songId)) {
            return res.status(400).json({ error: "Invalid song ID" });
        }

        const playlist = await Playlist.findByIdAndUpdate(
            req.params.playlistId,
            { $addToSet: { songs: songId } },
            { new: true }
        ).populate("songs");

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete playlist
router.delete("/:playlistId", requireAuth(), async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.playlistId)) {
            return res.status(400).json({
                error: "Invalid playlist ID"
            });
        }

        const playlist = await Playlist.findOneAndDelete({
            _id: req.params.playlistId,
            owner: req.auth.userId
        });

        if (!playlist) {
            return res.status(404).json({
                error: "Playlist not found"
            });
        }

        res.json({
            message: "Playlist deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Server error"
        });
    }
});

module.exports = router;