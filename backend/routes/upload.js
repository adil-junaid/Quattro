const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const getBucket = require("../config/gridfs");

router.post("/", upload.single("audioFile"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded."
            });
        }

        const bucket = getBucket();

        const uploadStream = bucket.openUploadStream(
            req.file.originalname,
            {
                contentType: req.file.mimetype
            }
        );

        uploadStream.on("finish", () => {
            res.status(201).json({
                message: "Upload successful",
                fileId: uploadStream.id
            });
        });

        uploadStream.on("error", (err) => {
            console.error(err);

            res.status(500).json({
                error: "Upload failed."
            });
        });

        uploadStream.end(req.file.buffer);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Server error."
        });
    }
});

module.exports = router;
