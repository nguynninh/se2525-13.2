import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
    CreateOrderSchema,
    OrderIdParamSchema,
    SellerOrderListQuerySchema,
    SellerRejectOrderSchema,
    SellerUpdateDeliveryStatusSchema,
    AdminOrderListQuerySchema,
    AdminUpdateOrderStatusSchema,
    OrderDetailResponseSchema,
    OrderStatusHistoryResponseSchema,
    OrderSummaryResponseSchema,
} from './order.schema';

export const registerOrderOpenApi = (registry: OpenAPIRegistry) => {
    // User routes
    registry.registerPath({
        method: 'post',
        path: '/api/orders',
        tags: ['Order'],
        summary: 'User tạo đơn mới',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateOrderSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Đơn hàng đã tạo',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/me/orders',
        tags: ['Order'],
        summary: 'User xem danh sách đơn của mình',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách đơn',
                content: {
                    'application/json': {
                        schema: OrderSummaryResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/me/orders/{id}',
        tags: ['Order'],
        summary: 'User xem chi tiết đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết đơn',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/orders/{id}/cancel',
        tags: ['Order'],
        summary: 'User hủy đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Đơn đã hủy',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/orders/{id}/confirm-received',
        tags: ['Order'],
        summary: 'User xác nhận đã nhận hàng',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Đơn đã completed',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/me/orders/{id}/status-history',
        tags: ['Order'],
        summary: 'User xem lịch sử trạng thái đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Lịch sử trạng thái',
                content: {
                    'application/json': {
                        schema: OrderStatusHistoryResponseSchema.array(),
                    },
                },
            },
        },
    });

    // Seller routes
    registry.registerPath({
        method: 'get',
        path: '/api/user/seller/me/orders',
        tags: ['Order'],
        summary: 'Seller xem đơn của shop mình',
        security: [{ BearerAuth: [] }],
        request: {
            query: SellerOrderListQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách đơn',
                content: {
                    'application/json': {
                        schema: OrderSummaryResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/seller/me/orders/{id}',
        tags: ['Order'],
        summary: 'Seller xem chi tiết đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết đơn',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/seller/me/orders/{id}/confirm',
        tags: ['Order'],
        summary: 'Seller xác nhận đơn',
        security: [{ BearerAuth: [] }],
        request: { params: OrderIdParamSchema },
        responses: {
            200: {
                description: 'Đã chuyển trạng thái confirmed',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/seller/me/orders/{id}/reject',
        tags: ['Order'],
        summary: 'Seller từ chối đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: SellerRejectOrderSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đơn đã bị hủy',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/seller/me/orders/{id}/status',
        tags: ['Order'],
        summary: 'Seller cập nhật trạng thái giao hàng',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: SellerUpdateDeliveryStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đơn đã cập nhật trạng thái',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    // Admin routes
    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/orders',
        tags: ['Order'],
        summary: 'Admin xem tất cả đơn',
        security: [{ BearerAuth: [] }],
        request: { query: AdminOrderListQuerySchema },
        responses: {
            200: {
                description: 'Danh sách đơn',
                content: {
                    'application/json': {
                        schema: OrderSummaryResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/orders/{id}',
        tags: ['Order'],
        summary: 'Admin xem chi tiết đơn',
        security: [{ BearerAuth: [] }],
        request: { params: OrderIdParamSchema },
        responses: {
            200: {
                description: 'Chi tiết đơn',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/user/admin/orders/{id}/status',
        tags: ['Order'],
        summary: 'Admin cập nhật trạng thái đơn',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: AdminUpdateOrderStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Đơn đã cập nhật trạng thái',
                content: {
                    'application/json': {
                        schema: OrderDetailResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/orders/{id}/status-history',
        tags: ['Order'],
        summary: 'Admin xem lịch sử trạng thái đơn',
        security: [{ BearerAuth: [] }],
        request: { params: OrderIdParamSchema },
        responses: {
            200: {
                description: 'Lịch sử trạng thái',
                content: {
                    'application/json': {
                        schema: OrderStatusHistoryResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/orders/stats',
        tags: ['Order'],
        summary: 'Thống kê đơn hàng',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Thống kê',
            },
        },
    });
};
