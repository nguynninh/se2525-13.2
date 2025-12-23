import { S3Client } from '@aws-sdk/client-s3';

export const MINIO_BUCKET = process.env.AWS_BUCKET_NAME || 'se-bucket';

export const publicBaseUrl = process.env.AWS_ENDPOINT || 'http://localhost:9000';

export const minioClient = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MinIOAccessKey123',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MinIOSecretKey123',
    },
    forcePathStyle: process.env.AWS_FORCE_PATH_STYLE === 'true',
});
