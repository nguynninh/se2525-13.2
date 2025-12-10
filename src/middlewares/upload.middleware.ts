import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../exception/AppError';

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new AppError('upload:invalid_file_type', 400) as any);
    }
    cb(null, true);
};

export const uploadImage = (fieldName: string, maxSizeMB: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const upload = multer({
            storage: multer.memoryStorage(),
            fileFilter: imageFileFilter,
            limits: {
                fileSize: maxSizeMB * 1024 * 1024,
            },
        }).single(fieldName);

        upload(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new AppError('upload:file_too_large', 400));
                }
                return next(new AppError('upload:unknown_error', 400));
            }
            if (err) {
                return next(err);
            }
            next();
        });
    };
};