const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-${file.originalname}`;

            resolve({
                filename,
                bucketName: "uploads"
            });
        });
    }
});

const upload = multer({ storage });

module.exports = upload;