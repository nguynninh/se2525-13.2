// src/routes/_helpers/validator.ts
import { ZodIssueCode, ZodSchema } from 'zod';

export const v =
    (schema: ZodSchema, ns = 'auth', topKey = `${ns}:invalid_payload`) =>
    (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            req.body = parsed.data;
            return next();
        }

        const t: ((k: string) => string) | undefined =
            typeof (req as any).t === 'function' ? (req as any).t.bind(req) : undefined;

        const errors = parsed.error.issues.map((i: any) => {
            const path = Array.isArray(i.path) ? i.path.map(String).join('.') : '';
            let key: string;

            if (i.code === ZodIssueCode.invalid_type && i.received === 'undefined') {
                const field = String(i.path?.[0] ?? 'field');
                key = `${ns}:${field}_required`;
            } else {
                key = typeof i.message === 'string' ? i.message.replace(/^([a-z0-9_]+:)\1/i, '$1') : 'invalid';
            }

            return t ? { path, key, message: t(key) } : { path, key };
        });

        const payload = t ? { code: 400, message: t(topKey), errors } : { code: 400, message: topKey, errors };

        return res.status(400).json(payload);
    };
