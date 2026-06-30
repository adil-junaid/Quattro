require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const shortid = require("shortid");

const connectDB = require("./config/db");

const app = express();

// Set globals so they are accessible to models/routes without standard imports
global.mongoose = mongoose;
global.multer = multer;
global.shortid = shortid;
global.app = app;
global.ObjectId = mongoose.Types.ObjectId;

// Load Models
require("./models/songs");
require("./models/playlist");

// Retrieve Models & Set Globals for routes to use
global.Song = mongoose.model("Song");
global.Playlist = mongoose.model("Playlist");

// Initialize GridFS bucket globally once DB is open
mongoose.connection.once("open", () => {
    global.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
    console.log("GridFS Bucket Initialized");
});

connectDB();

app.use(cors());
app.use(express.json());

// Load Routes (which register endpoints directly on the global `app`)
require("./routes/songs");
require("./routes/playlists");
app.use("/api/upload", require("./routes/upload"));

// Error Handler
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

// Home Route
app.get("/", (req, res) => {
    res.send("Music API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n`);
});