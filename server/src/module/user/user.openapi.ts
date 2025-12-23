import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import {
    UpdateMeSchema,
    ChangePasswordSchema,
    AdminUpdateSellerStatusSchema,
    AdminListUsersQuerySchema,
    AdminUserDetailResponseSchema,
    SellerResponseSchema,
    UserResponseSchema,
    SellerWithUserResponseSchema,
    UploadAvatarSchema,
    CustomerWithUserResponseSchema,
} from './user.schema';

export const registerUserOpenApi = (registry: OpenAPIRegistry) => {
    // GET /api/user/me
    registry.registerPath({
        method: 'get',
        path: '/api/user/me',
        tags: ['User'],
        summary: 'Người dùng lấy thông tin của chính người dùng',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Get user information successfully',
                content: {
                    'application/json': { schema: CustomerWithUserResponseSchema },
                },
            },
            401: { description: 'Unauthorized' },
        },
    });

    // PATCH /api/user/me
    registry.registerPath({
        method: 'patch',
        path: '/api/user/me',
        tags: ['User'],
        summary: 'Người dùng cập nhật thông tin của chính người dùng',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: UpdateMeSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Update user information successfully',
                content: {
                    'application/json': { schema: UserResponseSchema },
                },
            },
            400: { description: 'Validation error' },
            404: { description: 'Not found user' },
        },
    });

    // PATCH /api/user/me/password
    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/password',
        summary: 'Người dùng tự thay đổi mật khẩu',
        tags: ['User'],
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: ChangePasswordSchema,
                    },
                },
            },
        },
        responses: {
            200: { description: 'Change password successfully' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
        },
    });

    // DELETE /api/user/me
    registry.registerPath({
        method: 'delete',
        path: '/api/user/me',
        tags: ['User'],
        summary: 'Người dùng xóa tài khoản của chính người dùng',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Delete user information successfully',
            },
            401: { description: 'Unauthorized' },
        },
    });

    // PATCH /api/user/me/avatar
    registry.registerPath({
        method: 'patch',
        path: '/api/user/me/avatar',
        tags: ['User'],
        summary: 'Cập nhật avatar của user hiện tại',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: UploadAvatarSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Change avatar successfully',
                content: {
                    'application/json': {
                        schema: UserResponseSchema,
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
        },
    });

    // GET /api/user/seller/me
    registry.registerPath({
        method: 'get',
        path: '/api/user/seller/me',
        tags: ['User', 'Seller'],
        summary: 'Người dùng tự lấy thông tin seller của bản thân',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Get current seller info of user successfully',
                content: {
                    'application/json': {
                        schema: SellerWithUserResponseSchema,
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Seller not found' },
        },
    });

    // GET /api/user/admin/users?role=customer|seller|admin&search=...
    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/users',
        tags: ['Admin', 'User'],
        summary: 'Admin liệt kê danh sách user theo filter',
        security: [{ BearerAuth: [] }],
        request: {
            query: AdminListUsersQuerySchema,
        },
        responses: {
            200: {
                description: 'Danh sách user phù hợp với filter',
                content: {
                    'application/json': {
                        schema: z.array(UserResponseSchema),
                    },
                },
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (not admin)' },
        },
    });

    // GET /api/user/admin/users/:id
    registry.registerPath({
        method: 'get',
        path: '/api/user/admin/users/{id}',
        tags: ['Admin', 'User'],
        summary: 'Admin xem full detail của một user',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'User ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Thông tin chi tiết của user',
                content: {
                    'application/json': {
                        schema: AdminUserDetailResponseSchema,
                    },
                },
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (not admin)' },
            404: { description: 'User not found' },
        },
    });

    // PATCH /api/user/admin/sellers/:id/status
    registry.registerPath({
        method: 'patch',
        path: '/api/user/admin/sellers/{id}/status',
        tags: ['Admin', 'Seller'],
        summary: 'Admin đổi trạng thái của các seller',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Seller ID',
                }),
            }),
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: AdminUpdateSellerStatusSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Update seller status successfully',
                content: {
                    'application/json': {
                        schema: z.array(SellerResponseSchema),
                    },
                },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (not admin)' },
            404: { description: 'Seller not found' },
        },
    });

    // DELETE /api/user/admin/sellers/:id
    registry.registerPath({
        method: 'delete',
        path: '/api/user/admin/sellers/{id}',
        tags: ['Admin', 'Seller'],
        summary: 'Admin xoá seller (không xoá user)',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'Seller ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Xoá seller thành công',
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (not admin)' },
            404: { description: 'Seller not found' },
        },
    });

    // DELETE /api/user/admin/users/{id}
    registry.registerPath({
        method: 'delete',
        path: '/api/user/admin/users/{id}',
        tags: ['Admin', 'User'],
        summary: 'Xoá user (cascade xoá seller/customer liên quan)',
        security: [{ BearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'User ID',
                }),
            }),
        },
        responses: {
            200: {
                description: 'Xoá user thành công',
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (not admin)' },
            404: { description: 'User not found' },
        },
    });
};
