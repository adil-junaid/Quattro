

// Playlist Model
const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    playlistCode: {
        type: String,
        required: true,
        unique: true,
        default: () => shortid.generate()
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

