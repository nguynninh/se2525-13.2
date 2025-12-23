import { Router, Request, Response } from 'express';
import response from '../utils/response';
import { Client as PgClient } from 'pg';
import { createClient as createRedisClient } from 'redis';

import authRoute from './api/v1/auth.route';
import userRoute from './api/v1/user.route';
import productRoute from './api/v1/product.route';
import sellerApplicationRoute from './api/v1/sellerApplication.route';
import locationRoute from './api/v1/location.route';
import cartRoute from './api/v1/cart.route';
import shopRoute from './api/v1/shop.route';
import orderRoute from './api/v1/order.route';
import shipmentRoute from './api/v1/shipment.route';
import deviceTokenRoute from './api/v1/deviceToken.route';

const router: Router = Router();

router.get('/test/success', (req: Request, res: Response) => {
    const data = { items: ['A', 'B', 'C'] };
    return response.ok(res, data, 'OK');
});

router.get('/test/created', (req: Request, res: Response) => {
    const data = { id: 123, name: 'Item' };
    return response.created(res, data, 'Created');
});

router.get('/test/error', (_req, res) => {
    return response.fail(res, 422, 'validation:failed', [{ field: 'name', message: 'required' }]);
});

router.get('/test/postgres', async (req: Request, res: Response) => {
    const client = new PgClient({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres123',
        database: process.env.DB_NAME || 'hiki_db',
    });

    try {
        await client.connect();
        const r = await client.query('SELECT 1 as ok');
        await client.end();
        const pgStatus = r.rows?.[0]?.ok === 1 ? 'connected' : 'unknown';
        return response.ok(res, { status: pgStatus }, 'PostgreSQL connected');
    } catch (err: any) {
        try {
            await client.end();
        } catch {}
        return response.fail(res, 500, 'PostgreSQL connection failed', { error: err?.message });
    }
});

router.get('/test/redis', async (req: Request, res: Response) => {
    const redis = createRedisClient({
        url:
            process.env.REDIS_URL ||
            `redis://:${process.env.REDIS_PASSWORD || 'redis123'}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    });

    try {
        await redis.connect();
        const pong = await redis.ping();
        await redis.quit();
        const redisStatus = pong === 'PONG' ? 'connected' : 'unknown';
        return response.ok(res, { status: redisStatus }, 'Redis connected');
    } catch (err: any) {
        try {
            await redis.quit();
        } catch {}
        return response.fail(res, 500, 'Redis connection failed', { error: err?.message });
    }
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/seller-applications', sellerApplicationRoute);
router.use('/', productRoute);
router.use('/', locationRoute);
router.use('/cart', cartRoute);
router.use('/shop', shopRoute);
router.use('/', orderRoute);
router.use('/', shipmentRoute);
router.use('/', deviceTokenRoute);

export default router;
