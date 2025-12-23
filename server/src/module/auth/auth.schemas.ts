// Validate input cho auth

import { z } from 'zod';

const NAME_REGEX = /^[\p{L}\s'-]+$/u;

export const RegisterStartSchema = z
    .object({
        first_name: z
            .string()
            .trim()
            .min(1, 'auth:first_name_required')
            .max(255, 'auth:first_name_too_long')
            .regex(NAME_REGEX, 'auth:name_invalid'),
        last_name: z
            .string()
            .trim()
            .min(1, 'auth:last_name_required')
            .max(255, 'auth:last_name_too_long')
            .regex(NAME_REGEX, 'auth:name_invalid'),
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
        password: z
            .string()
            .min(1, 'auth:password_required')
            .refine((s) => s.length >= 6, 'auth:password_min_length'),
        confirm_password: z.string().min(1, 'auth:confirm_password_required'),
    })
    .superRefine((v, ctx) => {
        if (v.password !== v.confirm_password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['confirm_password'],
                message: 'auth:password_mismatch',
            });
        }
    })
    .strict();

export const RegisterResendSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
    })
    .strict();

export const RegisterFinalizeSchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(1, 'auth:otp_required')
            .regex(/^\d{4}$/, 'auth:otp_invalid'),
    })
    .strict();

export const LoginSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
        password: z
            .string()
            .min(1, 'auth:password_required')
            .refine((s) => s.length >= 6, 'auth:password_min_length'),
    })
    .strict();

export const SocialLoginSchema = z
    .object({
        provider: z.enum(['google', 'facebook']),
        credential: z.string().min(1, 'auth:credential_required'),
    })
    .strict();

export const RefreshTokenSchema = z
    .object({
        refreshToken: z.string().min(1, 'auth:token_required'),
    })
    .strict();

export const ResetRequestSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
    })
    .strict();

export const ResetVerifySchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(1, 'auth:otp_required')
            .regex(/^\d{4}$/, 'auth:otp_invalid'),
    })
    .strict();

export const ResetFinalizeSchema = z
    .object({
        new_password: z
            .string()
            .min(1, 'auth:password_required')
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
    })
    .strict();
