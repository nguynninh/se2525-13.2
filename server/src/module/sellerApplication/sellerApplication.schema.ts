import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserPublicSchema } from '../user/user.schema';

extendZodWithOpenApi(z);

export const CreateSellerApplicationSchema = z
    .object({
        accepted_terms: z.boolean(),
    })
    .superRefine((v, ctx) => {
        if (!v.accepted_terms) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['accepted_terms'],
                message: 'user:must_accept_terms',
            });
        }
    })
    .strict()
    .openapi('CreateSellerApplication');

export const ReviewSellerApplicationSchema = z
    .discriminatedUnion('status', [
        z
            .object({
                status: z.literal('approved'),
            })
            .strict(),
        z
            .object({
                status: z.literal('rejected'),
                rejection_reason: z.string().min(1, 'seller_app:rejection_reason_required'),
            })
            .strict(),
    ])
    .openapi('ReviewSellerApplication');

export const SellerApplicationStatus = z.enum(['approved', 'rejected']).openapi('SellerApplicationStatus');

export const SellerApplicationResponseSchema = z
    .object({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        status: SellerApplicationStatus,
        accepted_terms: z.boolean(),
        rejection_reason: z.string().nullable(),
        reviewed_by: z.string().uuid().nullable(),
    })
    .openapi('SellerApplicationResponse');

export const GetMySellerApplicationResponseSchema = z
    .object({
        status: z.enum(['approved', 'rejected']).optional(),
    })
    .strict();
