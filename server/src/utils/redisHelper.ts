import redisClient from '../config/redis';

export const redisHelper = {
    async set(key: string, value: any, expirationInSeconds?: number): Promise<void> {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            if (expirationInSeconds) {
                await redisClient.setEx(key, expirationInSeconds, stringValue);
            } else {
                await redisClient.set(key, stringValue);
            }
        } catch (error) {
            console.error('Redis SET error:', error);
            throw error;
        }
    },

    async get<T = any>(key: string, parseJson: boolean = true): Promise<T | null> {
        try {
            const value = await redisClient.get(key);

            if (!value) {
                return null;
            }

            if (parseJson) {
                try {
                    return JSON.parse(value) as T;
                } catch {
                    return value as T;
                }
            }

            return value as T;
        } catch (error) {
            console.error('Redis GET error:', error);
            throw error;
        }
    },

    async del(key: string): Promise<number> {
        try {
            return await redisClient.del(key);
        } catch (error) {
            console.error('Redis DEL error:', error);
            throw error;
        }
    },

    async exists(key: string): Promise<boolean> {
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Redis EXISTS error:', error);
            throw error;
        }
    },

    async expire(key: string, seconds: number): Promise<boolean> {
        try {
            const result = await redisClient.expire(key, seconds);
            return result === 1;
        } catch (error) {
            console.error('Redis EXPIRE error:', error);
            throw error;
        }
    },

    async ttl(key: string): Promise<number> {
        try {
            return await redisClient.ttl(key);
        } catch (error) {
            console.error('Redis TTL error:', error);
            throw error;
        }
    },

    async delPattern(pattern: string): Promise<number> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }
            return await redisClient.del(keys);
        } catch (error) {
            console.error('Redis DEL PATTERN error:', error);
            throw error;
        }
    },

    async incr(key: string): Promise<number> {
        try {
            return await redisClient.incr(key);
        } catch (error) {
            console.error('Redis INCR error:', error);
            throw error;
        }
    },

    async decr(key: string): Promise<number> {
        try {
            return await redisClient.decr(key);
        } catch (error) {
            console.error('Redis DECR error:', error);
            throw error;
        }
    },
};

export default redisHelper;
