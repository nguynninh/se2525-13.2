// Tạo và lưu API Key vào Redis

import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { redisConfig } from '../../config/redis.config';
import { ROLES } from '../constants';

export class ApiKeyUtils {
    private static redisClient = new Redis(redisConfig);

    // Tạo và lưu API Key với role
    static async generateApiKey(role: keyof typeof ROLES): Promise<string> {
        const apiKey = uuidv4();
        const keyData = JSON.stringify({ role });
        await this.redisClient.set(`api-key:${apiKey}`, keyData);
        return apiKey;
    }

    // Xóa API Key
    static async revokeApiKey(apiKey: string): Promise<void> {
        await this.redisClient.del(`api-key:${apiKey}`);
    }
}
