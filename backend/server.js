require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const playlistRoutes = require("./routes/playlists");
const songRoutes = require("./routes/songs");

// Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/playlists", playlistRoutes);
app.use("/api/songs", songRoutes);

// Error Handler
app.use(errorMiddleware);

// Home Route
app.get("/", (req, res) => {
    res.send("Music API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});