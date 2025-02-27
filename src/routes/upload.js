const express = require("express");
const multer = require("multer");
const { parseCSV } = require("../utils/csvParser");
const { saveRequest } = require("../services/database");
const { imageQueue } = require("../workers/imageProcessor");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "CSV file is required" });

    try {
        const { requestId, imageData } = await parseCSV(req.file.path);
        await saveRequest(requestId, imageData);

        // Enqueue a job for each image record
        imageData.forEach((item) => {
            imageQueue.add("process-image", { requestId, ...item });
        });

        res.json({ request_id: requestId });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
