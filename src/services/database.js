const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Save a new processing request and its associated image data
async function saveRequest(requestId, imageData) {
    await pool.query(
        "INSERT INTO processing_requests (request_id, status) VALUES ($1, 'processing')",
        [requestId]
    );
    for (const item of imageData) {
        await pool.query(
            "INSERT INTO images (request_id, product_name, input_url) VALUES ($1, $2, $3)",
            [requestId, item.productName, item.inputImageUrl]
        );
    }
}

// Update the processed image URL and mark the request as complete if all images are processed
async function updateProcessedImage(requestId, inputImageUrl, outputImageUrl) {
    await pool.query(
        "UPDATE images SET output_url = $1 WHERE request_id = $2 AND input_url = $3",
        [outputImageUrl, requestId, inputImageUrl]
    );

    const { rowCount } = await pool.query(
        "SELECT * FROM images WHERE request_id = $1 AND output_url IS NULL",
        [requestId]
    );
    if (rowCount === 0) {
        // All images processed; update request status
        await pool.query(
            "UPDATE processing_requests SET status = 'completed' WHERE request_id = $1",
            [requestId]
        );

        // BONUS: Optionally, trigger webhook and generate CSV here.
        // For example:
        // await generateOutputCSV(requestId, processedData);
        // await triggerWebhook(requestId, processedData);
    }
}

// Get processing status for a given request ID
async function getStatus(requestId) {
    const res = await pool.query(
        "SELECT status FROM processing_requests WHERE request_id = $1",
        [requestId]
    );
    return res.rows[0] || { status: "not found" };
}

module.exports = { saveRequest, updateProcessedImage, getStatus };
