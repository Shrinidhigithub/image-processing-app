const { imageQueue } = require("./src/workers/imageProcessor");

async function testJob() {
    await imageQueue.add("test-job", { message: "Hello, this is a test job!" });
    console.log("✅ Test job added to the queue.");
}

testJob();
