import Redis from 'ioredis';
import 'dotenv/config';

let redisUrl = process.env.REDIS_URL || "";
if (redisUrl) {
    // Aggressively clean the URL of any invisible characters, quotes, or whitespace
    // %20 is a space, %22 is a quote. We remove anything that isn't a valid URL character.
    redisUrl = redisUrl.replace(/["']/g, '').trim();
    
    // Decodes %20 (space) and other encoded characters if they exist
    redisUrl = decodeURIComponent(redisUrl).trim();
    
    // Safety check: log the cleaned URL structure (hiding sensitive parts)
    try {
        const urlObj = new URL(redisUrl);
        console.log(`--- [DEBUG] Redis Host: ${urlObj.hostname}`);
        console.log(`--- [DEBUG] Redis Port: ${urlObj.port}`);
        console.log(`--- [DEBUG] Redis Protocol: ${urlObj.protocol}`);
    } catch (e) {
        console.log('--- [DEBUG] Redis URL is still not a valid URL format after aggressive cleaning');
        console.log('--- [DEBUG] Cleaned URL was:', redisUrl.substring(0, 20) + '...');
    }
}

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
});

redis.on("connect", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

export default redis;
