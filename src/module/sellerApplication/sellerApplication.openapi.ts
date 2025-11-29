import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
    CreateSellerApplicationSchema,
    ReviewSellerApplicationSchema,
    HistoryQuerySchema,
    SellerApplicationResponseSchema,
    GetMySellerApplicationResponseSchema,
    SellerApplicationWithUserResponseSchema,
} from './sellerApplication.schema';

export const registerSellerApplicationOpenApi = (registry: OpenAPIRegistry) => {
    // POST /api/seller-applications
    registry.registerPath({
        method: 'post',
        path: '/api/seller-applications',
        tags: ['SellerApplication', 'User'],
        summary: 'User tạo đơn đăng ký seller mới',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: CreateSellerApplicationSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Tạo đơn đăng ký seller thành công',
                content: {
                    'application/json': {
                        schema: SellerApplicationResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error (chưa chấp nhận điều khoản, v.v.)' },
            401: { description: 'Unauthorized' },
            409: { description: 'Đã có đơn đăng ký đang pending / đã approved' },
        },
    });

    // GET /api/seller-applications/me/latest
    registry.registerPath({
        method: 'get',
        path: '/api/seller-applications/me/latest',
        tags: ['SellerApplication', 'User'],
        summary: 'User lấy đơn đăng ký seller mới nhất của chính mình',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Lấy đơn đăng ký seller mới nhất thành công ',
                content: {
                    'application/json': {
                        schema: GetMySellerApplicationResponseSchema,
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Không có đơn đăng ký nào' },
        },
    });

    // GET /api/seller-applications/admin/pending
    registry.registerPath({
        method: 'get',
        path: '/api/seller-applications/admin/pending',
        tags: ['SellerApplication', 'Admin'],
        summary: 'Admin liệt kê các đơn đăng ký seller đang pending',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách các đơn đăng ký đang pending',
                content: {
                    'application/json': {
                        schema: z.array(SellerApplicationWithUserResponseSchema),
                    },
                },
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (không phải admin)' },
        },
    });

    // GET /api/seller-applications/admin/history?status=approved|rejected
    registry.registerPath({
        method: 'get',
        path: '/api/seller-applications/admin/history',
        tags: ['SellerApplication', 'Admin'],
        summary: 'Admin xem lịch sử các đơn đăng ký seller đã được xử lý',
        security: [{ BearerAuth: [] }],
        request: {
            query: HistoryQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách history các đơn đăng ký đã approved/rejected',
                content: {
                    'application/json': {
                        schema: z.array(SellerApplicationWithUserResponseSchema),
                    },
                },
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (không phải admin)' },
        },
    });

    // PATCH /api/seller-applications/admin/:id/review
    registry.registerPath({
        method: 'patch',
        path: '/api/seller-applications/admin/{id}/review',
        tags: ['SellerApplication', 'Admin'],
        summary: 'Admin duyệt hoặc từ chối một đơn đăng ký seller',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Seller application ID',
                }),
            }),
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ReviewSellerApplicationSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Review đơn đăng ký thành công ',
                content: {
                    'application/json': {
                        schema: SellerApplicationResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (không phải admin)' },
            404: { description: 'Không tìm thấy đơn đăng ký' },
        },
    });
};
