const express = require("express");
const router = express.Router();

const upload = require("../config/gridfs");

router.post("/", upload.single("audioFile"), (req, res) => {
    console.log("Upload route reached");
    console.log(req.file);

    res.json({
        message: "Upload successful",
        fileId: req.file.id
    });
});

module.exports = router;
