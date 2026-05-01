import Redis from 'ioredis';
import 'dotenv/config';

let redisUrl = process.env.REDIS_URL || "";
if (redisUrl) {
    // Clean potential quotes or whitespace from environment variables
    redisUrl = redisUrl.trim().replace(/^["'](.+)["']$/, '$1');
    
    // Safety check: log the cleaned URL structure (hiding sensitive parts)
    try {
        const urlObj = new URL(redisUrl);
        console.log(`--- [DEBUG] Redis Host: ${urlObj.hostname}`);
        console.log(`--- [DEBUG] Redis Port: ${urlObj.port}`);
        console.log(`--- [DEBUG] Redis Protocol: ${urlObj.protocol}`);
    } catch (e) {
        console.log('--- [DEBUG] Redis URL is still not a valid URL format after cleaning');
    }
}

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 10000, // 10 seconds
});

redis.on("connect", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

export default redis;
