import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const NAME_REGEX = /^[\p{L}\s'-]+$/u;

export const UploadAvatarSchema = z.object({
    avatar: z.custom<Express.Multer.File>().openapi({
        type: 'string',
        format: 'binary',
        description: 'File ảnh avatar (image/*)',
    }),
});

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
    .strict()
    .openapi('UpdateMeRequest');

export const ChangePasswordSchema = z
    .object({
        current_password: z
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
        if (v.new_password === v.current_password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['new_password'],
                message: 'user:new_password_same_as_old',
            });
        }
    })
    .strict()
    .openapi('ChangePasswordRequest');

export const AdminUpdateSellerStatusSchema = z
    .object({
        status: z.enum(['active', 'suspended', 'closed'], {
            message: 'user:invalid_status_filter',
        }),
    })
    .strict()
    .openapi('AdminUpdateSellerStatusRequest');

export const UserRoleSchema = z.enum(['customer', 'seller', 'admin']).openapi('UserRole');

export const AdminListUsersQuerySchema = z
    .object({
        role: UserRoleSchema.optional(),
        search: z.string().trim().optional(),
    })
    .strict()
    .openapi('AdminListUsersQuery');

export const UserResponseSchema = z
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
    .openapi('UserResponse');

export const UserPublicSchema = UserResponseSchema.pick({
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    phone: true,
    profile_url: true,
}).openapi('UserPublic');

export const SellerStatusSchema = z.enum(['active', 'suspended', 'closed']).openapi('SellerStatus');

export const SellerWithUserResponseSchema = z
    .object({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        status: SellerStatusSchema,
        user: UserPublicSchema,
    })
    .strict()
    .openapi('SellerWithUserResponse');

export const SellerResponseSchema = z
    .object({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        status: SellerStatusSchema,
    })
    .strict()
    .openapi('SellerResponse');

export const CustomerResponseSchema = z
    .object({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        loyalty_points: z.number().int(),
    })
    .strict()
    .openapi('CustomerResponse');

export const AdminResponseSchema = z
    .object({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
    })
    .strict()
    .openapi('AdminResponse');

export const AdminUserDetailResponseSchema = z
    .object({
        user: UserResponseSchema,
        customer: CustomerResponseSchema.nullable(),
        seller: SellerResponseSchema.nullable(),
        admin: AdminResponseSchema.nullable(),
    })
    .strict()
    .openapi('AdminUserDetailResponse');

export const CustomerWithUserResponseSchema = z
    .object({
        id: z.string().uuid(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        role: z.enum(['customer', 'seller', 'admin']),
        phone: z.string().nullable(),
        profile_url: z.string().url().nullable().optional(),
        customer: CustomerResponseSchema.pick({
            id: true,
            loyalty_points: true,
        }),
    })
    .strict()
    .openapi('CustomerWithUserResponse');
