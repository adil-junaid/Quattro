const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

mongoose.connection.once("open", () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
    console.log("GridFS initialized");
});

const getBucket = () => {
    if (!bucket) {
        if (mongoose.connection.db) {
            bucket = new GridFSBucket(mongoose.connection.db, {
                bucketName: "uploads"
            });
            return bucket;
        }
        throw new Error("GridFS bucket has not been initialized yet.");
    }
    return bucket;
};

module.exports = getBucket;
