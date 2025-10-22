import 'express';

declare module 'express-serve-static-core' {
    interface Response {
        response?: {
            ok: (data: any, messageKey?: string, req?: import('express').Request) => Response;

            created: (data: any, messageKey?: string, req?: import('express').Request) => Response;

            fail: (code?: number, message?: string, errors?: any, req?: import('express').Request) => Response;
        };
    }
}

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
            files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

            t?: (key: string) => string;
        }
    }
}

export {};
