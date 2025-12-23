import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
    CreateShipmentSchema,
    ShipmentIdParamSchema,
    UpdateShipmentStatusSchema,
    ShipmentResponseSchema,
    ShippingRateResponseSchema,
    ShippingRateIdParamSchema,
    UpdateShippingRateSchema,
} from './shipment.schema';
import { OrderIdParamSchema } from '../order/order.schema';

export const registerShipmentOpenApi = (registry: OpenAPIRegistry) => {
    registry.registerPath({
        method: 'post',
        path: '/api/shipments',
        tags: ['Shipment - Admin'],
        summary: 'Tạo shipment',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateShipmentSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Tạo shipment thành công',
                content: {
                    'application/json': {
                        schema: ShipmentResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/shipments/{id}',
        tags: ['Shipment - Admin'],
        summary: 'Xem chi tiết shipment',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShipmentIdParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết shipment',
                content: {
                    'application/json': {
                        schema: ShipmentResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/orders/{id}/shipments',
        tags: ['Shipment - Admin'],
        summary: 'Danh sách shipment của đơn hàng',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Danh sách shipment của đơn',
                content: {
                    'application/json': {
                        schema: ShipmentResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/shipments/{id}/status',
        tags: ['Shipment - Admin'],
        summary: 'Cập nhật trạng thái shipment',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShipmentIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: UpdateShipmentStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật shipment thành công',
                content: {
                    'application/json': {
                        schema: ShipmentResponseSchema,
                    },
                },
            },
        },
    });

    // Shipping rates (admin)
    registry.registerPath({
        method: 'get',
        path: '/api/shipping-rates',
        tags: ['Shipment - Admin'],
        summary: 'Danh sách phí vận chuyển',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách cấu hình phí',
                content: {
                    'application/json': {
                        schema: ShippingRateResponseSchema.array(),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/api/shipping-rates/{id}',
        tags: ['Shipment - Admin'],
        summary: 'Xem chi tiết phí vận chuyển',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShippingRateIdParamSchema,
        },
        responses: {
            200: {
                description: 'Chi tiết cấu hình phí',
                content: {
                    'application/json': {
                        schema: ShippingRateResponseSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/shipping-rates/{id}',
        tags: ['Shipment - Admin'],
        summary: 'Cập nhật phí vận chuyển',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShippingRateIdParamSchema,
            body: {
                content: {
                    'application/json': {
                        schema: UpdateShippingRateSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật phí thành công',
                content: {
                    'application/json': {
                        schema: ShippingRateResponseSchema,
                    },
                },
            },
        },
    });
};
