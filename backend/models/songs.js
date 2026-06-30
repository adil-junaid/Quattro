const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    songcode: { type: String, required: true, unique: true },
    album: String,
    duration: { type: Number, required: true },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "uploads.files"
    }
});

module.exports = mongoose.model("Song", SongSchema);