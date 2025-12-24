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
        path: '/api/products/categories',
        tags: ['Category'],
        summary: 'Lấy danh sách danh mục',
        responses: {
            200: {
                description: 'Danh sách danh mục',
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
        path: '/api/categories',
        tags: ['Category'],
        summary: 'Tạo danh mục',
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
                description: 'Tạo danh mục thành công',
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
        path: '/api/categories/{id}',
        tags: ['Category'],
        summary: 'Cập nhật danh mục',
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
                description: 'Cập nhật danh mục thành công',
                content: {
                    'application/json': {
                        schema: CategoryResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/api/categories/{id}',
        tags: ['Category'],
        summary: 'Xóa danh mục',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Xóa danh mục thành công',
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/product/products',
        tags: ['Product'],
        summary: 'Lấy danh sách sản phẩm (lọc / tìm kiếm / sắp xếp)',
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
                description: 'Danh sách sản phẩm',
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
        path: '/api/product/products',
        tags: ['Product'],
        summary: 'Tạo sản phẩm',
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
                description: 'Tạo sản phẩm thành công',
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
        method: 'get',
        path: '/api/product/products/{id}',
        tags: ['Product'],
        summary: 'Lấy chi tiết sản phẩm theo ID',
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Chi tiết sản phẩm',
                content: {
                    'application/json': {
                        schema: ProductResponseSchema,
                    },
                },
            },
            404: {
                description: 'Không tìm thấy sản phẩm',
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/product/products/{id}',
        tags: ['Product'],
        summary: 'Cập nhật sản phẩm',
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
                description: 'Cập nhật sản phẩm thành công',
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
        path: '/api/product/products/{id}',
        tags: ['Product'],
        summary: 'Xóa sản phẩm',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Xóa sản phẩm thành công',
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/api/product/products/images',
        tags: ['Product'],
        summary: 'Thêm ảnh sản phẩm',
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
                description: 'Thêm ảnh thành công',
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
        path: '/api/product/products/variants',
        tags: ['Product'],
        summary: 'Tạo thuộc tính sản phẩm',
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
                description: 'Tạo thuộc tính thành công',
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
        path: '/api/product/products/variants/options',
        tags: ['Product'],
        summary: 'Tạo giá trị thuộc tính',
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
                description: 'Tạo giá trị thuộc tính thành công',
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
        path: '/api/product/products/stocks',
        tags: ['Product'],
        summary: 'Tạo tồn kho (SKU)',
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
                description: 'Tạo tồn kho thành công',
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
        path: '/api/product/products/stocks/{id}',
        tags: ['Product'],
        summary: 'Cập nhật tồn kho',
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
                description: 'Cập nhật tồn kho thành công',
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
        path: '/api/product/products/{id}/reviews',
        tags: ['Review'],
        summary: 'Lấy đánh giá của sản phẩm',
        request: {
            params: z.object({ id: z.string().uuid() }),
            query: z.object({
                page: z.coerce.number().int().default(1),
                limit: z.coerce.number().int().default(10),
            }),
        },
        responses: {
            200: {
                description: 'Danh sách đánh giá',
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
        path: '/api/product/products/reviews',
        tags: ['Review'],
        summary: 'Tạo đánh giá',
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
                description: 'Tạo đánh giá thành công',
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
        path: '/api/product/products/{id}/questions',
        tags: ['Question'],
        summary: 'Lấy câu hỏi của sản phẩm',
        request: {
            params: z.object({ id: z.string().uuid() }),
            query: z.object({
                page: z.coerce.number().int().default(1),
                limit: z.coerce.number().int().default(10),
            }),
        },
        responses: {
            200: {
                description: 'Danh sách câu hỏi',
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
        path: '/api/product/products/questions',
        tags: ['Question'],
        summary: 'Tạo câu hỏi',
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
                description: 'Tạo câu hỏi thành công',
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
        path: '/api/product/products/questions/{id}/answer',
        tags: ['Question'],
        summary: 'Trả lời câu hỏi (Seller/Admin)',
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
                description: 'Trả lời câu hỏi thành công',
                content: {
                    'application/json': {
                        schema: QuestionResponseSchema,
                    },
                },
            },
        },
    });
};
