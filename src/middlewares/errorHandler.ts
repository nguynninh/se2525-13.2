import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../exception/AppError';

const tKey = (req: Request, key?: string) => {
    const t = (req as any).t as ((k: string) => string) | undefined;
    if (!key) return '';
    return t && key.includes(':') ? t(key) : key;
};

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        const errors = (err.details ?? []).map((e: any) => ({
            ...e,
            message: tKey(req, e.key ?? e.message),
        }));

        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: tKey(req, err.message),
            errors,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: tKey(req, err.message),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            code: 400,
            message: tKey(req, err.message) || tKey(req, 'common:validation_error'),
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ code: 401, message: tKey(req, 'auth:invalid_token') });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ code: 401, message: tKey(req, 'auth:token_expired') });
    }

    return res.status(500).json({
        code: 500,
        message: tKey(req, 'common:internal_server_error'),
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
    });
};
