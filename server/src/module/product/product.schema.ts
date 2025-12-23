import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserPublicSchema } from '../user/user.schema';

extendZodWithOpenApi(z);

export const CategoryResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    parent_id: z.string().uuid().nullable(),
    icon_url: z.string().url().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
}).strict().openapi('CategoryResponse');

export const CreateCategorySchema = z.object({
    name: z.string().trim().min(1, 'category:name_required').max(255),
    parent_id: z.string().uuid().optional().nullable(),
    icon_url: z.string().trim().url().optional().nullable(),
}).strict().openapi('CreateCategoryRequest');

export const UpdateCategorySchema = z.object({
    name: z.string().trim().min(1).max(255).optional(),
    parent_id: z.string().uuid().optional().nullable(),
    icon_url: z.string().trim().url().optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, { message: 'category:update_empty' }).strict().openapi('UpdateCategoryRequest');

export const ProductStatusSchema = z.enum(['draft', 'active', 'hidden', 'banned']).openapi('ProductStatus');

export const CreateProductSchema = z
    .object({
        category_id: z.string().uuid(),
        name: z.string().trim().min(10, 'product:name_too_short').max(255),
        slug: z.string().trim().max(255).optional(),
        sku: z.string().trim().regex(/^[A-Z0-9-_.]+$/, 'product:sku_invalid').max(100).optional(),
        description: z.string().trim().optional(),
        status: ProductStatusSchema.default('draft'),
        price: z.number().min(1000, 'product:price_min_1000'),
        quantity: z.number().int().nonnegative('product:quantity_negative'),
    })
    .strict()
    .openapi('CreateProductRequest');

export const UpdateProductSchema = z
    .object({
        category_id: z.string().uuid().optional(),
        name: z.string().trim().min(10).max(255).optional(),
        slug: z.string().trim().max(255).optional(),
        sku: z.string().trim().regex(/^[A-Z0-9-_.]+$/).max(100).optional(),
        description: z.string().trim().optional(),
        status: ProductStatusSchema.optional(),
        price: z.number().min(1000).optional(),
        quantity: z.number().int().nonnegative().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'product:update_empty',
    })
    .strict()
    .openapi('UpdateProductRequest');

export const FilterProductQuerySchema = z
    .object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        sort: z.enum(['price_asc', 'price_desc', 'sold_desc', 'newest', 'rating_desc']).optional(),
        min_price: z.coerce.number().nonnegative().optional(),
        max_price: z.coerce.number().nonnegative().optional(),
        category_id: z.string().uuid().optional(),
        shop_id: z.string().uuid().optional(),
        keyword: z.string().trim().optional(),
        status: ProductStatusSchema.optional(),
    })
    .strict()
    .openapi('FilterProductQuery');

export const AddProductImageSchema = z
    .object({
        product_id: z.string().uuid(),
        image_url: z.string().url().optional(),
        is_main: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
    })
    .strict()
    .openapi('AddProductImageRequest');

export const CreateProductVariantSchema = z
    .object({
        product_id: z.string().uuid(),
        name: z.string().trim().min(1).max(100),
    })
    .strict()
    .openapi('CreateProductVariantRequest');

export const CreateProductVariantOptionSchema = z
    .object({
        variant_id: z.string().uuid(),
        value: z.string().trim().min(1).max(100),
    })
    .strict()
    .openapi('CreateProductVariantOptionRequest');

export const CreateProductStockSchema = z
    .object({
        product_id: z.string().uuid(),
        option_ids: z.array(z.string()).optional().nullable(),
        sku: z.string().trim().regex(/^[A-Z0-9-_.]+$/).max(100).optional(),
        price: z.number().min(1000),
        quantity: z.number().int().nonnegative(),
        tier_index: z.array(z.number()).optional(),
    })
    .strict()
    .openapi('CreateProductStockRequest');

export const UpdateProductStockSchema = z
    .object({
        sku: z.string().trim().regex(/^[A-Z0-9-_.]+$/).max(100).optional(),
        price: z.number().min(1000).optional(),
        quantity: z.number().int().nonnegative().optional(),
    })
    .strict()
    .openapi('UpdateProductStockRequest');

export const ProductImageResponseSchema = z
    .object({
        id: z.string().uuid(),
        image_url: z.string(),
        is_main: z.boolean(),
    })
    .strict()
    .openapi('ProductImageResponse');

export const ProductVariantOptionResponseSchema = z
    .object({
        id: z.string().uuid(),
        value: z.string(),
    })
    .strict()
    .openapi('ProductVariantOptionResponse');

export const ProductVariantResponseSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string(),
        options: z.array(z.string()),
    })
    .strict()
    .openapi('ProductVariantOptionResponse');

export const ProductStockResponseSchema = z
    .object({
        id: z.string().uuid(),
        option_ids: z.string().nullable(),
        sku: z.string().nullable(),
        price: z.number(),
        quantity: z.number(),
        tier_index: z.array(z.number()).nullable(),
    })
    .strict()
    .openapi('ProductStockResponse');

export const ProductResponseSchema = z
    .object({
        id: z.string().uuid(),
        category_id: z.string().uuid(),
        shop_id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        sku: z.string().nullable(),
        description: z.string().nullable(),
        status: ProductStatusSchema,
        price: z.number(),
        quantity: z.number(),
        sold_count: z.number(),
        rating_avg: z.number(),
        rating_count: z.number(),
        images: z.array(ProductImageResponseSchema).optional(),
        variants: z.array(ProductVariantResponseSchema).optional(),
        stocks: z.array(ProductStockResponseSchema).optional(),
        created_at: z.date(),
        updated_at: z.date(),
    })
    .strict()
    .openapi('ProductResponse');

export const ProductListResponseSchema = z
    .object({
        data: z.array(ProductResponseSchema),
        pagination: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            total_pages: z.number(),
        }),
    })
    .strict()
    .openapi('ProductListResponse');

export const CreateReviewSchema = z
    .object({
        product_id: z.string().uuid(),
        rating: z.number().int().min(1, 'review:rating_min_1').max(5, 'review:rating_max_5'),
        comment: z.string().trim().optional(),
        images: z.string().trim().optional(),
    })
    .strict()
    .openapi('CreateReviewRequest');

export const UpdateReviewSchema = z
    .object({
        rating: z.number().int().min(1).max(5).optional(),
        comment: z.string().trim().optional(),
        images: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'review:update_empty',
    })
    .strict()
    .openapi('UpdateReviewRequest');

export const ReviewResponseSchema = z
    .object({
        id: z.string().uuid(),
        product_id: z.string().uuid(),
        user_id: z.string().uuid(),
        user: UserPublicSchema.optional(),
        rating: z.number(),
        comment: z.string().nullable(),
        images: z.string().nullable(),
        created_at: z.date(),
    })
    .strict()
    .openapi('ReviewResponse');

export const CreateQuestionSchema = z
    .object({
        product_id: z.string().uuid(),
        question: z.string().trim().min(5, 'question:too_short'),
    })
    .strict()
    .openapi('CreateQuestionRequest');

export const AnswerQuestionSchema = z
    .object({
        answer: z.string().trim().min(1, 'question:answer_required'),
    })
    .strict()
    .openapi('AnswerQuestionRequest');

export const QuestionResponseSchema = z
    .object({
        id: z.string().uuid(),
        product_id: z.string().uuid(),
        user_id: z.string().uuid(),
        user: UserPublicSchema.optional(),
        question: z.string(),
        answer: z.string().nullable(),
        answered_by: z.string().uuid().nullable(),
        answerer: UserPublicSchema.optional().nullable(),
        created_at: z.date(),
        updated_at: z.date(),
    })
    .strict()
    .openapi('QuestionResponse');

export const ReviewListResponseSchema = z
    .object({
        data: z.array(ReviewResponseSchema),
        pagination: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            total_pages: z.number(),
        }),
    })
    .strict()
    .openapi('ReviewListResponse');

export const QuestionListResponseSchema = z
    .object({
        data: z.array(QuestionResponseSchema),
        pagination: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            total_pages: z.number(),
        }),
    })
    .strict()
    .openapi('QuestionListResponse');
