require("dotenv").config();
const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const multer=require("multer");
const shortid=require("shortid");
const { GridFsStorage }=require("multer-gridfs-storage");

const connectDB=require("./config/db");

const app=express();

// Set globals so they are accessible to models/routes without standard imports
global.mongoose = mongoose;
global.multer = multer;
global.shortid = shortid;
global.GridFsStorage = GridFsStorage;
global.app = app;
global.ObjectId = mongoose.Types.ObjectId;

// Load Models
require("./models/songs");
require("./models/playlist");

// Retrieve Models & Set Globals
global.Song = mongoose.model("Song");
global.Playlist = mongoose.model("Playlist");

// Initialize GridFS globally once DB connects
mongoose.connection.once("open", () => {
    global.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
    console.log("GridFS Bucket Initialized");
});

connectDB();

app.use(cors());
app.use(express.json());

// Load Routes
require("./routes/songs");
require("./routes/playlists");

app.listen(process.env.PORT || 5000,()=>{
 console.log("Server Running");
});