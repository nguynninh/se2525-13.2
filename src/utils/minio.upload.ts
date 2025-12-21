import { PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { minioClient, MINIO_BUCKET, publicBaseUrl } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadToMinio = async (file: Express.Multer.File): Promise<string> => {
    try {
        await minioClient.send(new CreateBucketCommand({
            Bucket: MINIO_BUCKET,
        }));
    } catch (err: any) {
        if (err.name !== 'BucketAlreadyOwnedByYou' && err.name !== 'BucketAlreadyExists') {
            throw err;
        }
    }

    const ext = path.extname(file.originalname);
    const filename = `products/${uuidv4()}${ext}`;

    const command = new PutObjectCommand({
        Bucket: MINIO_BUCKET,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    });

    await minioClient.send(command);

    return `${publicBaseUrl}/${MINIO_BUCKET}/${filename}`;
};