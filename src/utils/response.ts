import { Response, Request } from 'express';

export interface SuccessResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

export interface ErrorResponse<E = any> {
    code: number;
    message: string;
    errors?: E;
}

function resolveMessage(message: string, req?: Request) {
    if (req && typeof req.t === 'function' && message.includes(':')) {
        return req.t(message);
    }
    return message;
}

const response = {
    /** 200 OK */
    ok<T = any>(res: Response, data: T, message: string = 'common:ok', req?: Request): Response<SuccessResponse<T>> {
        const msg = resolveMessage(message, req);
        return res.status(200).json({ code: 200, message: msg, data });
    },

    /** 201 Created */
    created<T = any>(
        res: Response,
        data: T,
        message: string = 'common:created',
        req?: Request,
    ): Response<SuccessResponse<T>> {
        const msg = resolveMessage(message, req);
        return res.status(201).json({ code: 201, message: msg, data });
    },

    /** 204 No Content */
    noContent(res: Response): Response<void> {
        return res.status(204).end();
    },

    /** Lỗi: code mặc định 400 */
    fail<E = any>(
        res: Response,
        code: number = 400,
        message: string = 'common:bad_request',
        errors?: E,
        req?: Request,
    ): Response<ErrorResponse<E>> {
        const msg = resolveMessage(message, req);
        const payload: ErrorResponse<E> = { code, message: msg };
        if (errors !== undefined) payload.errors = errors;
        return res.status(code).json(payload);
    },
};

export default response;
