# Image Processing App

## Overview
This application processes image data from CSV files asynchronously. It:
- Accepts CSV uploads containing product image URLs.
- Validates and parses the CSV.
- Queues image processing tasks (compression via Sharp).
- Uploads processed images to AWS S3.
- Stores request and image data in a PostgreSQL database.
- Provides APIs to upload CSVs and check processing status.

## Project Structure
image-processing-app/ ├── src/ │ ├── routes/ │ │ ├── upload.js # CSV upload API │ │ └── status.js # Processing status API │ ├── workers/ │ │ └── imageProcessor.js # Asynchronous worker for image processing │ ├── services/ │ │ ├── storage.js # AWS S3 integration for image uploads │ │ └── database.js # Database interactions (PostgreSQL) │ ├── utils/ │ │ └── csvParser.js # CSV parsing utility │ ├── models/ │ │ └── request.model.js # Documentation for database schema │ └── app.js # Express application setup ├── config/ │ ├── dbConfig.js # (Optional) Database configuration │ └── redisConfig.js # (Optional) Redis configuration ├── .env # Environment variables ├── package.json # Dependencies & scripts └── README.md # Documentation & setup instructions


## npm install
Start the Express server:

## npm start
Start the worker process:

## npm run worker
6. Test the APIs using Postman or curl:
- **POST /upload**: Upload a CSV file.
- **GET /status/:request_id**: Check processing status.

### Sample `.env` File

PORT=5000 DATABASE_URL=postgres://user:password@localhost:5432/images REDIS_URL=redis://127.0.0.1:6379 AWS_REGION=us-east-1 AWS_BUCKET_NAME=your_bucket_name AWS_ACCESS_KEY=your_access_key AWS_SECRET_KEY=your_secret_key WEBHOOK_URL=https://your-webhook-url.com/notify


## Bonus Features
- **Webhook Notification:** Trigger a webhook when all images have been processed.
- **Output CSV Generation:** Generate a CSV file with input and output image URLs once processing is complete.

## API Documentation
- **POST /upload**: Accepts a CSV file. Returns a unique request ID.
- **GET /status/:request_id**: Returns the processing status.

## Database Schema
See `src/models/request.model.js` for details.

## License
MIT

## Postman Test 
API - POST - http://localhost:5000/upload
Body - Key - file and Value - sample.csv

{
    "request_id": "5b1fc5c7-416d-469d-8d0c-96f3c643024a"
}

