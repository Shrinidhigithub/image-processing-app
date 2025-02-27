const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Configure the S3 client with AWS credentials
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
});

async function uploadToS3(imageBuffer, productName) {
    const fileName = `compressed/${productName}-${Date.now()}.jpg`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg",
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        console.log(`Image uploaded: ${fileName}`);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error("AWS S3 Upload Error:", error);
        throw error;
    }
}

module.exports = { uploadToS3 };
