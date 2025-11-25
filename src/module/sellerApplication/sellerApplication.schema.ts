import { z } from 'zod';

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
    .strict();

export const ReviewSellerApplicationSchema = z.discriminatedUnion('status', [
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
]);

export const HistoryQuerySchema = z
    .object({
        status: z.enum(['approved', 'rejected']).optional(),
    })
    .strict();
