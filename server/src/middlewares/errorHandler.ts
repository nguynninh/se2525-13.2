import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../exception/AppError';

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message,
            errors: err.details,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            code: 400,
            message: err.message || req.t('common:validation_error'),
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            code: 401,
            message: req.t('auth:invalid_token'),
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            code: 401,
            message: req.t('auth:token_expired'),
        });
    }

    return res.status(500).json({
        code: 500,
        message: req.t('common:internal_server_error'),
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack,
        }),
    });
};
