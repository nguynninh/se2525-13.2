import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const minioClient = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MinIOAccessKey123',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MinIOSecretKey123',
    },
    forcePathStyle: process.env.AWS_FORCE_PATH_STYLE === 'true',
});

const bucketName = process.env.AWS_BUCKET_NAME || 'se-bucket';

export const uploadFileToMinIO = async (fileName: string, buffer: Buffer, contentType: string): Promise<string> => {
    const key = `uploads/${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    await minioClient.send(command);

    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const url = await getSignedUrl(minioClient, getCommand, { expiresIn: 3600 });
    return url;
};

export const getFileFromMinIO = async (key: string): Promise<string | null> => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const url = await getSignedUrl(minioClient, command, { expiresIn: 3600 });
        return url;
    } catch (error) {
        console.error('Error getting file from MinIO:', error);
        return null;
    }
};
