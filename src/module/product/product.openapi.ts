import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
    CategoryResponseSchema,
    CreateCategorySchema,
    UpdateCategorySchema,
    CreateProductSchema,
    UpdateProductSchema,
    AddProductImageSchema,
    CreateProductVariantSchema,
    CreateProductVariantOptionSchema,
    CreateProductStockSchema,
    UpdateProductStockSchema,
    ProductResponseSchema,
    ProductListResponseSchema,
    CreateReviewSchema,
    ReviewResponseSchema,
    CreateQuestionSchema,
    QuestionResponseSchema,
    AnswerQuestionSchema,
    ReviewListResponseSchema,
    QuestionListResponseSchema,
    ProductVariantResponseSchema,
    ProductVariantOptionResponseSchema,
    ProductStockResponseSchema,
    ProductImageResponseSchema,
    ProductStatusSchema,
} from './product.schema';

export const registerProductOpenApi = (registry: OpenAPIRegistry) => {
    registry.registerPath({
        method: 'get',
        path: '/api/v1/categories',
        tags: ['Category'],
        summary: 'Get all categories',
        responses: {
            200: {
                description: 'List of categories',
                content: {
                    'application/json': {
                        schema: z.array(CategoryResponseSchema),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/categories',
        tags: ['Category'],
        summary: 'Create new category',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateCategorySchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Category created successfully',
                content: {
                    'application/json': {
                        schema: CategoryResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/v1/categories/{id}',
        tags: ['Category'],
        summary: 'Update category',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: UpdateCategorySchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Category updated successfully',
                content: {
                    'application/json': {
                        schema: CategoryResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/v1/products',
        tags: ['Product'],
        summary: 'Get list of products (Filter, Search, Sort)',
        request: {
            query: z.object({
                page: z.coerce.number().int().min(1).default(1),
                limit: z.coerce.number().int().min(1).max(100).default(10),
                sort: z.enum(['price_asc', 'price_desc', 'sold_desc', 'newest', 'rating_desc']).optional(),
                min_price: z.coerce.number().nonnegative().optional(),
                max_price: z.coerce.number().nonnegative().optional(),
                category_id: z.string().uuid().optional(),
                shop_id: z.string().uuid().optional(),
                keyword: z.string().trim().optional(),
                status: ProductStatusSchema.optional(),
            }),
        },
        responses: {
            200: {
                description: 'List of products',
                content: {
                    'application/json': {
                        schema: ProductListResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products',
        tags: ['Product'],
        summary: 'Create new product',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateProductSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Product created successfully',
                content: {
                    'application/json': {
                        schema: ProductResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/v1/products/{id}',
        tags: ['Product'],
        summary: 'Get product details by ID',
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Product details',
                content: {
                    'application/json': {
                        schema: ProductResponseSchema,
                    },
                },
            },
            404: {
                description: 'Product not found',
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/v1/products/{id}',
        tags: ['Product'],
        summary: 'Update product',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: UpdateProductSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Product updated successfully',
                content: {
                    'application/json': {
                        schema: ProductResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/api/v1/products/{id}',
        tags: ['Product'],
        summary: 'Delete product',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Product deleted successfully',
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/images',
        tags: ['Product'],
        summary: 'Add product image',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: AddProductImageSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Image added successfully',
                content: {
                    'application/json': {
                        schema: ProductImageResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/variants',
        tags: ['Product'],
        summary: 'Create product variant',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateProductVariantSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Variant created successfully',
                content: {
                    'application/json': {
                        schema: ProductVariantResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/variants/options',
        tags: ['Product'],
        summary: 'Create product variant option',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateProductVariantOptionSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Option created successfully',
                content: {
                    'application/json': {
                        schema: ProductVariantOptionResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/stocks',
        tags: ['Product'],
        summary: 'Create product stock (SKU)',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateProductStockSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Stock created successfully',
                content: {
                    'application/json': {
                        schema: ProductStockResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/v1/products/stocks/{id}',
        tags: ['Product'],
        summary: 'Update product stock',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: UpdateProductStockSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Stock updated successfully',
                content: {
                    'application/json': {
                        schema: ProductStockResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/v1/products/{id}/reviews',
        tags: ['Review'],
        summary: 'Get reviews of a product',
        request: {
            params: z.object({ id: z.string().uuid() }),
            query: z.object({
                page: z.coerce.number().int().default(1),
                limit: z.coerce.number().int().default(10),
            }),
        },
        responses: {
            200: {
                description: 'List of reviews',
                content: {
                    'application/json': {
                        schema: ReviewListResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/reviews',
        tags: ['Review'],
        summary: 'Create a review',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateReviewSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Review created successfully',
                content: {
                    'application/json': {
                        schema: ReviewResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/v1/products/{id}/questions',
        tags: ['Question'],
        summary: 'Get questions of a product',
        request: {
            params: z.object({ id: z.string().uuid() }),
            query: z.object({
                page: z.coerce.number().int().default(1),
                limit: z.coerce.number().int().default(10),
            }),
        },
        responses: {
            200: {
                description: 'List of questions',
                content: {
                    'application/json': {
                        schema: QuestionListResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/v1/products/questions',
        tags: ['Question'],
        summary: 'Create a question',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateQuestionSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Question created successfully',
                content: {
                    'application/json': {
                        schema: QuestionResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/v1/products/questions/{id}/answer',
        tags: ['Question'],
        summary: 'Answer a question (Seller/Admin)',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: AnswerQuestionSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Question answered successfully',
                content: {
                    'application/json': {
                        schema: QuestionResponseSchema,
                    },
                },
            },
        },
    });
};