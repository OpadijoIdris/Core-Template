import redis from "./redis.js";

export const rateLimit = async ({
    key,
    windowSeconds,
    maxAttempts
}) => {
    const attempts = await redis.incr(key);

    if (attempts === 1) {
        await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
        attempts,                        
        remaining: Math.max(maxAttempts - attempts, 0),
        isLimited: attempts >= maxAttempts,     
        retryAfter: ttl > 0 ? ttl : windowSeconds
    };
};

export const resetRateLimit = async (key) => {
    await redis.del(key);
};

const LOGIN_WINDOW_SECONDS = 15 * 60; 
const LOGIN_MAX_ATTEMPTS = 20;

export const checkLoginRateLimit = async ({ email, ip }) => {
    const emailKey = `rl:login:email:${email}`;
    const ipKey = `rl:login:ip:${ip}`;

    const emailLimit = await rateLimit({
        key: emailKey,
        windowSeconds: LOGIN_WINDOW_SECONDS,
        maxAttempts: LOGIN_MAX_ATTEMPTS
    });

    const ipLimit = await rateLimit({
        key: ipKey,
        windowSeconds: LOGIN_WINDOW_SECONDS,
        maxAttempts: LOGIN_MAX_ATTEMPTS
    });

    return {
        isLimited: emailLimit.isLimited || ipLimit.isLimited,
        email: emailLimit,
        ip: ipLimit
    };
};


export const resetLoginRateLimit = async ({ email, ip }) => {
    await resetRateLimit(`rl:login:email:${email}`);
    await resetRateLimit(`rl:login:ip:${ip}`);
};
