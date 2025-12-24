import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { minioClient, MINIO_BUCKET, publicBaseUrl } from '../config/minio';

import path from 'path';

export const buildPublicFileUrl = (key: string): string => {
    const base = publicBaseUrl.replace(/\/$/, '');
    return `${base}/${MINIO_BUCKET}/${key}`;
};

export const uploadFileToMinIO = async (
    fileName: string,
    buffer: Buffer,
    contentType: string,
    folder = 'uploads',
): Promise<string> => {
    // Ensure bucket exists (idempotent)
    try {
        await minioClient.send(
            new CreateBucketCommand({
                Bucket: MINIO_BUCKET,
            }),
        );
    } catch (err: any) {
        if (err.name !== 'BucketAlreadyOwnedByYou' && err.name !== 'BucketAlreadyExists') {
            throw err;
        }
    }

    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext).replace(/\s+/g, '_');

    const key = `${folder}/${Date.now()}_${name}${ext}`;

    const command = new PutObjectCommand({
        Bucket: MINIO_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read' as any,
    });

    await minioClient.send(command);

    return buildPublicFileUrl(key);
};

export const getFileFromMinIO = async (key: string): Promise<string> => {
    return buildPublicFileUrl(key);
};

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('user:invalid_file_type'));
    }
    cb(null, true);
};

export const createImageUploadMiddleware = (maxSizeMB = 5) =>
    multer({
        storage: multer.memoryStorage(),
        fileFilter: imageFileFilter,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024,
        },
    });
