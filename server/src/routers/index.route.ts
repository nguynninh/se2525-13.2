import { Router, Request, Response } from 'express';
import response from '../utils/response';
import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { Client as PgClient } from 'pg';
import { createClient as createRedisClient } from 'redis';
import { AppError, InternalServerError } from '../exception/AppError';

const router: Router = Router();

// Root endpoint
router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Tiki API');
});

router.get('/test/success', (req: Request, res: Response) => {
    const data = { items: ['A', 'B', 'C'] };
    return response.ok(res, data, 'OK');
});

// Test created (201)
router.get('/test/created', (req: Request, res: Response) => {
    const data = { id: 123, name: 'Item' };
    return response.created(res, data, 'Created');
});

// Test error/fail (422 + errors)
router.get('/test/error', (_req, res) => {
    return response.fail(res, 422, 'validation:failed', [{ field: 'name', message: 'required' }]);
});

// const upload = multer({ storage: multer.memoryStorage() });

// /** --- Helper tránh lặp --- */
// const s3 = new S3Client({
//     region: process.env.AWS_REGION || 'us-east-1',
//     endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MinIOAccessKey123',
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MinIOSecretKey123',
//     },
//     forcePathStyle: true, // MinIO thường cần
// });

// /** ========== Test MinIO connection ========== */
// router.get('/test/minio', async (req: Request, res: Response) => {
//     try {
//         await s3.send(new ListBucketsCommand({}));
//         return response.ok(res, { status: 'connected' }, 'common:minio_connected', req);
//     } catch (err: any) {
//         return response.fail(res, 500, 'MinIO connection failed', { error: err?.message }, req);
//     }
// });

// /** ========== Test upload file to MinIO ========== */
// router.post('/test/minio/upload', upload.single('file'), async (req, res) => {
//     if (!req.file) {
//         return response.fail(res, 400, 'No file provided');
//     }

//     const bucket = process.env.MINIO_BUCKET || 'uploads';
//     const objectKey = `${Date.now()}-${req.file.originalname}`;

//     await s3.send(
//         new PutObjectCommand({
//             Bucket: bucket,
//             Key: objectKey,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype,
//         }),
//     );

//     const endpoint = process.env.MINIO_PUBLIC_ENDPOINT || process.env.MINIO_ENDPOINT || 'http://localhost:9000';
//     const fileUrl = `${endpoint}/${bucket}/${objectKey}`;

//     return response.created(res, { url: fileUrl }, 'File uploaded', req);
// });

/** ========== Test PostgreSQL connection ========== */
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

/** ========== Test Redis connection ========== */
router.get('/test/redis', async (req: Request, res: Response) => {
    const redis = createRedisClient({
        url:
            process.env.REDIS_URL ||
            `redis://:${process.env.REDIS_PASSWORD || 'redis123'}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    });

    try {
        await redis.connect();
        const pong = await redis.ping(); // 'PONG' nếu ok
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

export default router;
