const express = require("express");
const { getStatus } = require("../services/database");

const router = express.Router();

router.get("/:request_id", async (req, res) => {
    const { request_id } = req.params;
    try {
        const status = await getStatus(request_id);
        res.json(status);
    } catch (error) {
        console.error("Status API Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
