import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
};

const clientOptions = {
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
    },
    ...(redisConfig.password !== undefined ? { password: redisConfig.password } : {}),
    database: redisConfig.db,
};

const redisClient = createClient(clientOptions);

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
    console.log('Redis Client Ready');
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('✅ Redis connected successfully');
    } catch (error) {
        console.error('❌ Redis connection failed:', error);
        process.exit(1);
    }
};

export default redisClient;
