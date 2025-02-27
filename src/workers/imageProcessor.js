const { Queue, Worker, QueueEvents } = require("bullmq");
const fetch = require("node-fetch"); // For fetching images
const sharp = require("sharp");
const { uploadToS3 } = require("../services/storage");
const { updateProcessedImage } = require("../services/database");
const IORedis = require("ioredis");

// Create Redis connection
const redisConnection = new IORedis(process.env.REDIS_URL);

// Create Queue with explicit connection
const imageQueue = new Queue("image-processing", { connection: redisConnection });

// Create Worker with explicit connection
const worker = new Worker(
    "image-processing",
    async (job) => {
        const { requestId, productName, inputImageUrl } = job.data;

        try {
            console.log(`📸 Processing job ${job.id} for product: ${productName}`);

            // Fetch image
            const response = await fetch(inputImageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

            // Convert arrayBuffer to Buffer
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);

            // 🖼️ Get image metadata (Check format)
            const metadata = await sharp(imageBuffer).metadata();
            console.log(`🖼️ Image format: ${metadata.format}`);

            const supportedFormats = ["jpeg", "png", "webp"];
            if (!supportedFormats.includes(metadata.format)) {
                throw new Error(`Unsupported image format: ${metadata.format}`);
            }

            // Convert image to JPEG (Fix unsupported formats)
            const compressedBuffer = await sharp(imageBuffer).toFormat("jpeg").jpeg({ quality: 50 }).toBuffer();

            // Upload compressed image to S3
            const outputImageUrl = await uploadToS3(compressedBuffer, productName);

            // Update processed image info in DB
            await updateProcessedImage(requestId, inputImageUrl, outputImageUrl);

            console.log(`✅ Job ${job.id} completed successfully.`);
        } catch (error) {
            console.error(`❌ Error processing job ${job.id}:`, error);
            throw error;
        }
    },
    { connection: redisConnection }
);

// (Optional) Attach QueueEvents for debugging
const queueEvents = new QueueEvents("image-processing", { connection: redisConnection });
queueEvents.on("completed", ({ jobId }) => console.log(`✅ Job ${jobId} completed.`));
queueEvents.on("failed", ({ jobId, failedReason }) => console.log(`❌ Job ${jobId} failed: ${failedReason}`));

console.log("🚀 Worker is running and connected to Redis");

module.exports = { imageQueue };
