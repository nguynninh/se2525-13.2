import redisClient from '../config/redis';
import { Request, Response, NextFunction } from 'express';

export const redisCache = (duration: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `cache:${req.originalUrl || req.url}`;

        // Lấy thử dữ liệu từ Redis
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error('Redis cache error:', error);
        }

        // Nếu không có trong cache, tiếp tục xử lý và lưu kết quả vào Redis
        const originalSend = res.json.bind(res) as Response['json'];
        (res as any).json = (data: any) => {
            try {
                void redisClient.setEx(key, duration, JSON.stringify(data));
            } catch (error) {
                console.error('Redis set cache error:', error);
            }
            return originalSend(data);
        };

        next();
    };
};
