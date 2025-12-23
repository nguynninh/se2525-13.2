import 'express-serve-static-core';
import type { TFunction, i18n } from 'i18next';
import type * as Express from 'express';
import type { Response as ExpressResponse } from 'express';
import type { UserRole } from '../models/User.model';

declare module 'express-serve-static-core' {
    interface Request {
        // i18n
        t: TFunction;
        i18n: i18n;
        language: string;
        languages: string[];

        // Multer
        file?: Express.Multer.File;
        files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>;

        // authenticate middleware
        user?: { id: string; role: UserRole; email?: string };
    }

    interface Response {
        response?: {
            ok: (data: any, messageKey?: string, req?: Express.Request) => ExpressResponse;
            created: (data: any, messageKey?: string, req?: Express.Request) => ExpressResponse;
            fail: (code?: number, messageKey?: string, errors?: any, req?: Express.Request) => ExpressResponse;
        };
    }
}

declare module 'express' {
    interface Request {
        user?: { id: string; role: UserRole; email?: string };
    }
}

export {};
