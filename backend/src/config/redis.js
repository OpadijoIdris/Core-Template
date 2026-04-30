import Redis from 'ioredis';
import 'dotenv/config';

let redisUrl = process.env.REDIS_URL || "";
if (redisUrl) {
    // Clean potential quotes or whitespace from environment variables
    redisUrl = redisUrl.trim().replace(/^["'](.+)["']$/, '$1');
}

const redis = new Redis(redisUrl);

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis error", err);
});

export default redis;
