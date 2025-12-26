import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

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
    .strict()
    .openapi('RegisterStart');

export const RegisterResendSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
    })
    .strict()
    .openapi('RegisterResend');

export const RegisterFinalizeSchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(1, 'auth:otp_required')
            .regex(/^\d{4}$/, 'auth:otp_invalid'),
    })
    .strict()
    .openapi('RegisterFinalize');

export const LoginSchema = z
    .object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .min(1, 'auth:email_required')
            .email('auth:email_invalid')
            .openapi({ example: 'minhtu777n@gmail.com' }),
        password: z
            .string()
            .min(1, 'auth:password_required')
            .refine((s) => s.length >= 6, 'auth:password_min_length')
            .openapi({ example: 'minhtu234' }),
    })
    .strict()
    .openapi('Login');

export const SocialLoginSchema = z
    .object({
        provider: z.enum(['google', 'facebook']),
        credential: z.string().min(1, 'auth:credential_required'),
    })
    .strict()
    .openapi('SocialLogin');

export const RefreshTokenSchema = z
    .object({
        refreshToken: z.string().min(1, 'auth:token_required'),
    })
    .strict()
    .openapi('RefreshToken');

export const ResetRequestSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
    })
    .strict()
    .openapi('ResetRequest');

export const ResetResendSchema = z
    .object({
        email: z.string().trim().toLowerCase().min(1, 'auth:email_required').email('auth:email_invalid'),
    })
    .strict()
    .openapi('ResetResend');

export const ResetVerifySchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(1, 'auth:otp_required')
            .regex(/^\d{4}$/, 'auth:otp_invalid'),
    })
    .strict()
    .openapi('ResetVerify');

export const ResetFinalizeSchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(1, 'auth:otp_required')
            .regex(/^\d{4}$/, 'auth:otp_invalid'),
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
    .strict()
    .openapi('ResetFinalize');

export const UserResponseSchema = z
    .object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['customer', 'seller', 'admin']),
        profile_url: z.string().url().nullable().optional(),
    })
    .strict()
    .openapi('UserResponse');

export const UserResponsePublicSchema = z
    .object({
        id: z.string().uuid(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        role: z.enum(['customer', 'seller', 'admin']),
        phone: z.string().nullable(),
        profile_url: z.string().url().nullable().optional(),
    })
    .strict()
    .openapi('UserPublic');

export const LoginResponseSchema = z
    .object({
        user: UserResponsePublicSchema,
        access_token: z.string(),
        refresh_token: z.string(),
    })
    .strict()
    .openapi('LoginResponse');

export const TokenResponseSchema = z
    .object({
        sub: z.string().uuid(),
        access_token: z.string(),
        refresh_token: z.string(),
    })
    .strict()
    .openapi('TokenResponse');

export const ResetResponseSchema = UserResponsePublicSchema.pick({
    id: true,
    email: true,
})
    .strict()
    .openapi('ResetResponse');
