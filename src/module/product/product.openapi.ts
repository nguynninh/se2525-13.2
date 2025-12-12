import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
    CategoryResponseSchema,
    CreateCategorySchema,
    UpdateCategorySchema,
    ProductResponseSchema,
    CreateProductSchema,
    UpdateProductSchema,
    FilterProductQuerySchema,
    ProductListResponseSchema,
    AddProductImageSchema,
    CreateProductVariantSchema,
    CreateProductVariantOptionSchema,
    CreateProductStockSchema,
    UpdateProductStockSchema,
    CreateReviewSchema,
    ReviewResponseSchema,
    ReviewListResponseSchema,
    CreateQuestionSchema,
    QuestionResponseSchema,
    AnswerQuestionSchema,
    QuestionListResponseSchema,
} from './product.schema';

export const productRegistry = new OpenAPIRegistry();

productRegistry.register('CategoryResponse', CategoryResponseSchema);
productRegistry.register('ProductResponse', ProductResponseSchema);
productRegistry.register('ReviewResponse', ReviewResponseSchema);
productRegistry.register('QuestionResponse', QuestionResponseSchema);

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/categories',
    tags: ['Category'],
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

productRegistry.registerPath({
    method: 'patch',
    path: '/api/v1/categories/{id}',
    tags: ['Category'],
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

productRegistry.registerPath({
    method: 'get',
    path: '/api/v1/categories',
    tags: ['Category'],
    responses: {
        200: {
            description: 'Get category tree',
            content: {
                'application/json': {
                    schema: z.array(CategoryResponseSchema),
                },
            },
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products',
    tags: ['Product'],
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

productRegistry.registerPath({
    method: 'patch',
    path: '/api/v1/products/{id}',
    tags: ['Product'],
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

productRegistry.registerPath({
    method: 'get',
    path: '/api/v1/products',
    tags: ['Product'],
    request: {
        query: FilterProductQuerySchema,
    },
    responses: {
        200: {
            description: 'Get product list',
            content: {
                'application/json': {
                    schema: ProductListResponseSchema,
                },
            },
        },
    },
});

productRegistry.registerPath({
    method: 'get',
    path: '/api/v1/products/{id}',
    tags: ['Product'],
    request: {
        params: z.object({ id: z.string().uuid() }),
    },
    responses: {
        200: {
            description: 'Get product detail',
            content: {
                'application/json': {
                    schema: ProductResponseSchema,
                },
            },
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/images',
    tags: ['Product Sub-resources'],
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
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/variants',
    tags: ['Product Sub-resources'],
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
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/variants/options',
    tags: ['Product Sub-resources'],
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
            description: 'Variant option created successfully',
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/stocks',
    tags: ['Product Sub-resources'],
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
        },
    },
});

productRegistry.registerPath({
    method: 'patch',
    path: '/api/v1/products/stocks/{id}',
    tags: ['Product Sub-resources'],
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
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/reviews',
    tags: ['Interaction'],
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

productRegistry.registerPath({
    method: 'get',
    path: '/api/v1/products/{id}/reviews',
    tags: ['Interaction'],
    request: {
        params: z.object({ id: z.string().uuid() }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Get product reviews',
            content: {
                'application/json': {
                    schema: ReviewListResponseSchema,
                },
            },
        },
    },
});

productRegistry.registerPath({
    method: 'post',
    path: '/api/v1/products/questions',
    tags: ['Interaction'],
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

productRegistry.registerPath({
    method: 'patch',
    path: '/api/v1/products/questions/{id}/answer',
    tags: ['Interaction'],
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

productRegistry.registerPath({
    method: 'get',
    path: '/api/v1/products/{id}/questions',
    tags: ['Interaction'],
    request: {
        params: z.object({ id: z.string().uuid() }),
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Get product questions',
            content: {
                'application/json': {
                    schema: QuestionListResponseSchema,
                },
            },
        },
    },
});