import { ZodIssueCode, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const v =
    (schema: ZodSchema | { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }, ns = 'auth', topKey = `${ns}:invalid_payload`) =>
    (req: Request, res: Response, next: NextFunction) => {
        let issues: any[] = [];

        if ('safeParse' in schema) {
            const parsed = schema.safeParse(req.body ?? {});
            if (parsed.success) {
                req.body = parsed.data;
            } else {
                issues = parsed.error.issues;
            }
        } else {
            if (schema.body) {
                const parsed = schema.body.safeParse(req.body ?? {});
                if (parsed.success) {
                    req.body = parsed.data;
                } else {
                    issues = [...issues, ...parsed.error.issues];
                }
            }
            if (schema.query) {
                const parsed = schema.query.safeParse(req.query ?? {});
                if (parsed.success) {
                    Object.defineProperty(req, 'query', {
                        value: parsed.data,
                        writable: true,
                    });
                } else {
                    issues = [...issues, ...parsed.error.issues];
                }
            }
            if (schema.params) {
                const parsed = schema.params.safeParse(req.params ?? {});
                if (parsed.success) {
                    Object.defineProperty(req, 'params', {
                        value: parsed.data,
                        writable: true,
                    });
                } else {
                    issues = [...issues, ...parsed.error.issues];
                }
            }
        }

        if (issues.length === 0) {
            return next();
        }

        const t: ((k: string) => string) | undefined =
            typeof (req as any).t === 'function' ? (req as any).t.bind(req) : undefined;

        const errors = issues.map((i: any) => {
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