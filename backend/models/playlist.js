const mongoose = require("mongoose");
const shortid = require("shortid");

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ],

    playlistCode: {
        type: String,
        required: true,
        unique: true,
        default: () => shortid.generate()
    },

    owner: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Playlist", PlaylistSchema);