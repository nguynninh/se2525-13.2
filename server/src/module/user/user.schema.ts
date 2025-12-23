import { z } from 'zod';

const NAME_REGEX = /^[\p{L}\s'-]+$/u;

export const UpdateMeSchema = z
    .object({
        first_name: z
            .string()
            .trim()
            .min(1, 'auth:first_name_required')
            .max(255, 'auth:first_name_too_long')
            .regex(NAME_REGEX, 'auth:name_invalid')
            .optional(),
        last_name: z
            .string()
            .trim()
            .min(1, 'auth:last_name_required')
            .max(255, 'auth:last_name_too_long')
            .regex(NAME_REGEX, 'auth:name_invalid')
            .optional(),
        phone: z.string().trim().max(20, 'user:phone_too_long').optional().nullable(),
        profile_url: z.string().trim().url('user:profile_url_invalid').optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'user:update_empty',
        path: ['_root'],
    })
    .strict();

export const ChangePasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, 'user:password_required')
            .refine((s) => s.length >= 6, 'auth:password_min_length'),
        new_password: z
            .string()
            .min(1, 'user:new_password_required')
            .refine((s) => s.length >= 6, 'auth:password_min_length'),
        confirm_password: z.string().min(1, 'auth:confirm_password_required'),
    })
    .superRefine((v, ctx) => {
        if (v.new_password !== v.confirm_password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['confirm_password'],
                message: 'auth:password_mismatch',
            });
        }
        if (v.new_password === v.password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['new_password'],
                message: 'user:new_password_same_as_old',
            });
        }
    })
    .strict();
