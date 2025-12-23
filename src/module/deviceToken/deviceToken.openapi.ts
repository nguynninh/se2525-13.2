import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { RegisterDeviceTokenSchema, RemoveDeviceTokenQuerySchema } from './deviceToken.schema';

export const registerDeviceTokenOpenApi = (registry: OpenAPIRegistry) => {
    registry.registerPath({
        method: 'post',
        path: '/api/user/me/device-tokens',
        tags: ['DeviceToken - Customer'],
        summary: 'Đăng ký / cập nhật device token',
        security: [{ BearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: RegisterDeviceTokenSchema,
                    },
                },
            },
        },
        responses: {
            200: { description: 'Upsert device token thành công' },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/api/user/me/device-tokens',
        tags: ['DeviceToken - Customer'],
        summary: 'Xoá / deactivate device token',
        security: [{ BearerAuth: [] }],
        request: {
            query: RemoveDeviceTokenQuerySchema,
        },
        responses: {
            200: { description: 'Xoá token thành công' },
        },
    });
};
