// Songs
app.get('/api/songs', async (req, res) => {
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

app.post('/api/songs', async (req, res) => {
    try {
        const { title, artist, album, duration } = req.body;
        const song =
            new Song({ title, artist, album, duration });
        await song.save();
        res.json(song);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});