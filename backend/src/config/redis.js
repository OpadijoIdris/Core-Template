import Redis from 'ioredis';
import 'dotenv/config';

class MemoryRedis {
    constructor() {
        this.store = new Map();
        this.timeouts = new Map();
        console.log("--- [DEBUG] Using In-Memory Redis Mock Fallback ---");
    }

    async get(key) {
        return this.store.has(key) ? this.store.get(key) : null;
    }

    async set(key, value, option, expireTime) {
        this.store.set(key, String(value));
        
        // Handle expiration (e.g. EX 1800)
        if (option === "EX" && expireTime) {
            this.clearTimeout(key);
            const durationMs = expireTime * 1000;
            const t = setTimeout(() => {
                this.store.delete(key);
                this.timeouts.delete(key);
            }, durationMs);
            this.timeouts.set(key, { end: Date.now() + durationMs, timeout: t });
        }
        return "OK";
    }

    async del(key) {
        this.clearTimeout(key);
        const deleted = this.store.delete(key);
        return deleted ? 1 : 0;
    }

    async incr(key) {
        const val = this.store.has(key) ? parseInt(this.store.get(key), 10) : 0;
        if (isNaN(val)) {
            throw new Error("ERR value is not an integer or out of range");
        }
        const newVal = val + 1;
        this.store.set(key, String(newVal));
        return newVal;
    }

    async expire(key, seconds) {
        if (!this.store.has(key)) return 0;
        this.clearTimeout(key);
        const durationMs = seconds * 1000;
        const t = setTimeout(() => {
            this.store.delete(key);
            this.timeouts.delete(key);
        }, durationMs);
        this.timeouts.set(key, { end: Date.now() + durationMs, timeout: t });
        return 1;
    }

    async ttl(key) {
        if (!this.store.has(key)) return -2;
        if (!this.timeouts.has(key)) return -1;
        const timeObj = this.timeouts.get(key);
        const remaining = Math.round((timeObj.end - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }

    clearTimeout(key) {
        if (this.timeouts.has(key)) {
            clearTimeout(this.timeouts.get(key).timeout);
            this.timeouts.delete(key);
        }
    }

    on(event, callback) {
        if (event === "connect") {
            // Trigger connect callback asynchronously to mimic live connection
            setTimeout(() => {
                if (typeof callback === "function") callback();
            }, 50);
        }
        return this;
    }

    async quit() {
        return "OK";
    }

    async disconnect() {
        return "OK";
    }
}

let redis;
const useMock = process.env.USE_REDIS_MOCK === 'true' || !process.env.REDIS_URL;

if (useMock) {
    redis = new MemoryRedis();
} else {
    let redisUrl = process.env.REDIS_URL;
    
    // Aggressively clean the URL of any invisible characters, quotes, or whitespace
    redisUrl = redisUrl.replace(/["']/g, '').trim();
    redisUrl = decodeURIComponent(redisUrl).trim();
    
    try {
        const urlObj = new URL(redisUrl);
        console.log(`--- [DEBUG] Connecting to Redis Host: ${urlObj.hostname}`);
    } catch (e) {
        console.log('--- [DEBUG] Redis URL is invalid. Falling back to Memory Mock.');
        redis = new MemoryRedis();
    }

    if (!redis) {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            connectTimeout: 10000,
        });

        redis.on("connect", () => {
            console.log("Redis connected successfully");
        });

        redis.on("error", (err) => {
            console.error("Redis connection error:", err.message);
            console.log("--- [DEBUG] Redis connection failed, but proceeding...");
        });
    }
}

export default redis;
