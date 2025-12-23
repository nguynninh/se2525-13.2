import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
    CreateShippingAddressSchema,
    UpdateShippingAddressSchema,
    ShippingAddressResponseSchema,
} from './location.schema';

import { ProvinceResponseSchema, WardResponseSchema } from './location.schema';

export const registerLocationOpenApi = (registry: OpenAPIRegistry) => {
    // GET /api/location/provinces
    registry.registerPath({
        method: 'get',
        path: '/api/location/provinces',
        tags: ['Location'],
        summary: 'Lấy danh sách tỉnh thành',
        responses: {
            200: {
                description: 'Danh sách tỉnh thành',
                content: {
                    'application/json': {
                        schema: z.array(ProvinceResponseSchema),
                    },
                },
            },
        },
    });

    // GET /api/location/provinces/{provinceId}/wards
    registry.registerPath({
        method: 'get',
        path: '/api/location/provinces/{provinceId}/wards',
        tags: ['Location'],
        summary: 'Lấy danh sách quận huyện của một tỉnh thành',
        request: {
            params: z.object({
                provinceId: z.string().uuid().openapi({
                    description: 'Province ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Danh sách quận/huyện/phường của tỉnh/thành được chọn',
                content: {
                    'application/json': {
                        schema: z.array(WardResponseSchema),
                    },
                },
            },
            400: { description: 'provinceId không hợp lệ' },
        },
    });

    // GET /api/user/me/shipping-addresses
    registry.registerPath({
        method: 'get',
        path: '/api/user/me/shipping-addresses',
        tags: ['User', 'ShippingAddress'],
        summary: 'User lấy danh sách địa chỉ giao hàng của chính mình',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Danh sách địa chỉ giao hàng của user',
                content: {
                    'application/json': {
                        schema: z.array(ShippingAddressResponseSchema),
                    },
                },
            },
            401: { description: 'Unauthorized' },
        },
    });

    /**
     * POST /api/user/me/shipping-addresses
     * Tạo địa chỉ giao hàng mới cho user hiện tại
     */
    registry.registerPath({
        method: 'post',
        path: '/api/user/me/shipping-addresses',
        tags: ['User', 'ShippingAddress'],
        summary: 'User tạo địa chỉ giao hàng mới',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: CreateShippingAddressSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Tạo địa chỉ giao hàng thành công',
                content: {
                    'application/json': {
                        schema: ShippingAddressResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
        },
    });

    // PATCH /api/user/me/shipping-addresses/{id}
    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/shipping-addresses/{id}',
        tags: ['User', 'ShippingAddress'],
        summary: 'User cập nhật địa chỉ giao hàng của chính mình',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Shipping address ID',
                }),
            }),
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: UpdateShippingAddressSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cập nhật địa chỉ giao hàng thành công',
                content: {
                    'application/json': {
                        schema: ShippingAddressResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Không tìm thấy địa chỉ giao hàng' },
        },
    });

    // DELETE /api/user/me/shipping-addresses/{id}
    registry.registerPath({
        method: 'delete',
        path: '/api/user/me/shipping-addresses/{id}',
        tags: ['User', 'ShippingAddress'],
        summary: 'User xoá một địa chỉ giao hàng của chính mình',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Shipping address ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Xoá địa chỉ giao hàng thành công ',
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Không tìm thấy địa chỉ giao hàng' },
        },
    });

    // PATCH /api/user/me/shipping-addresses/{id}/default
    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/shipping-addresses/{id}/default',
        tags: ['User', 'ShippingAddress'],
        summary: 'User đặt một địa chỉ giao hàng làm mặc định',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Shipping address ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Đặt địa chỉ mặc định thành công',
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Không tìm thấy địa chỉ giao hàng' },
        },
    });
};
