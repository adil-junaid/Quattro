const multer = require("multer");

// Set up memory storage so req.file.buffer is populated for manual GridFS streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
