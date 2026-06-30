const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    songcode: { 
        type: String, 
        unique: true,
        default: () => Math.random().toString(36).substring(2, 10)
    },
    album: String,
    duration: { type: Number, default: 0 },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "uploads.files"
    },
    uploadedBy: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Song", SongSchema);