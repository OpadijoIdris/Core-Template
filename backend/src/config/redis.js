import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
    console.log("Redis conected");
});

redis.on("error", (err) => {
    console.error("Redis error", err);
});

export default redis;
