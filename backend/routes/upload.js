const express = require("express");
const router = express.Router();

const upload = require("../config/storage");

router.post("/", upload.single("audioFile"), (req, res) => {
    res.json({
        message: "Upload successful",
        fileId: req.file.id
    });
});

module.exports = router;
