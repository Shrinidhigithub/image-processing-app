const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");

async function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const imageData = [];
        const requestId = uuidv4();

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                console.log("Parsed Row:", row);  // ✅ Debugging Output
                
                const imageUrls = row["Input Image Urls"]?.split(",").map(url => url.trim()); // ✅ Fix

                imageUrls.forEach(url => {
                    imageData.push({
                        productName: row["Product Name"].trim(),
                        inputImageUrl: url, // ✅ Now stores single URL per entry
                    });
                });
            })
            .on("end", () => resolve({ requestId, imageData }))
            .on("error", reject);
    });
}

module.exports = { parseCSV };
