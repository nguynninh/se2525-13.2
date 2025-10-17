import { Response } from 'express';

interface SuccessResponseOptions {
    code?: number;
    message: string;
    data?: any;
}

interface ErrorResponseOptions {
    code?: number;
    message: string;
    errors?: any;
}

export const successResponse = (res: Response, options: SuccessResponseOptions) => {
    const { code = 200, message, data } = options;
    
    return res.status(code).json({
        code,
        message,
        data: data || {},
    });
};

export const errorResponse = (res: Response, options: ErrorResponseOptions) => {
    const { code = 500, message, errors } = options;
    
    return res.status(code).json({
        code,
        message,
        ...(errors && { errors }),
    });
};
