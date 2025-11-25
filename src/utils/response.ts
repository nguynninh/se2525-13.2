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

function resolveMessage(res: Response, message: string) {
    const req = (res as any)?.req as Request | undefined;
    const t = req && typeof (req as any).t === 'function' ? (req as any).t : undefined;
    // convention: nếu là key dạng "ns:key" thì mới dịch
    return t && message.includes(':') ? t(message) : message;
}

const response = {
    /** 200 OK */
    ok<T = any>(res: Response, data: T, message = 'common:ok'): Response<SuccessResponse<T>> {
        const msg = resolveMessage(res, message);
        return res.status(200).json({ code: 200, message: msg, data });
    },

    /** 201 Created */
    created<T = any>(res: Response, data: T, message = 'common:created'): Response<SuccessResponse<T>> {
        const msg = resolveMessage(res, message);
        return res.status(201).json({ code: 201, message: msg, data });
    },

    /** 204 No Content */
    noContent(res: Response): Response<void> {
        return res.status(204).end();
    },

    /** Lỗi*/
    fail<E = any>(res: Response, code = 400, message = 'common:bad_request', errors?: E): Response<ErrorResponse<E>> {
        const msg = resolveMessage(res, message);
        const payload: ErrorResponse<E> = { code, message: msg };
        if (errors !== undefined) payload.errors = errors;
        return res.status(code).json(payload);
    },
};

export default response;
