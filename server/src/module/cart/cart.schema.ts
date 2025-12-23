import { z } from 'zod';

export const addToCartSchema = z.object({
    body: z.object({
        product_id: z.string().uuid('Invalid product ID format'),
        quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1'),
    }),
});

export const updateCartItemSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid cart item ID format'),
    }),
    body: z.object({
        quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1'),
    }),
});

export const removeCartItemSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid cart item ID format'),
    }),
});

export const clearCartSchema = z.object({
    // No parameters needed for clearing cart
});

export const getCartSchema = z.object({
    // No parameters needed for getting cart (user will be extracted from token)
});

export const getCartSummarySchema = z.object({
    // No parameters needed for getting cart summary (user will be extracted from token)
});

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];
export type CartItemParams = z.infer<typeof updateCartItemSchema>['params'];
