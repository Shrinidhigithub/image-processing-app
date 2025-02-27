const IORedis = require("ioredis");

const redis = new IORedis({
    host: "127.0.0.1",
    port: 6379,
});

redis.on("connect", () => console.log("✅ Redis Connected Successfully"));
redis.on("error", (err) => console.error("❌ Redis Connection Error:", err));

redis.ping()
    .then((res) => {
        console.log(`Redis Ping Response: ${res}`);
        redis.quit();
    })
    .catch((err) => console.error("Redis Ping Failed:", err));
