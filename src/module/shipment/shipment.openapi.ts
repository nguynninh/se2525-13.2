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
        tags: ['Shipment'],
        summary: 'Create shipment',
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
                description: 'Shipment created',
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
        tags: ['Shipment'],
        summary: 'Get shipment detail',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShipmentIdParamSchema,
        },
        responses: {
            200: {
                description: 'Shipment detail',
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
        tags: ['Shipment'],
        summary: 'List shipments of an order',
        security: [{ BearerAuth: [] }],
        request: {
            params: OrderIdParamSchema,
        },
        responses: {
            200: {
                description: 'Shipments of order',
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
        tags: ['Shipment'],
        summary: 'Update shipment status',
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
                description: 'Shipment updated',
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
        tags: ['Shipment'],
        summary: 'List shipping rates',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Shipping rates',
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
        tags: ['Shipment'],
        summary: 'Get shipping rate detail',
        security: [{ BearerAuth: [] }],
        request: {
            params: ShippingRateIdParamSchema,
        },
        responses: {
            200: {
                description: 'Shipping rate detail',
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
        tags: ['Shipment'],
        summary: 'Update shipping rate',
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
                description: 'Shipping rate updated',
                content: {
                    'application/json': {
                        schema: ShippingRateResponseSchema,
                    },
                },
            },
        },
    });
};
