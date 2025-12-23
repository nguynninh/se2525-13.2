import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export const NotificationSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    type: z.enum(['order', 'loyalty', 'system']),
    scope: z.enum(['personal', 'broadcast']),
    title: z.string(),
    content: z.string(),
    data: z.any().nullable(),
    is_read: z.boolean(),
    read_at: z.string().datetime().nullable(),
    created_at: z.string().datetime()
}).openapi('Notification');

export const NotificationListSchema = z.object({
    code: z.number(),
    message: z.string(),
    data: z.object({
        notifications: z.array(NotificationSchema),
        pagination: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            total_pages: z.number()
        })
    })
}).openapi('NotificationList');

export const NotificationQuerySchema = z.object({
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number)
});

export const registerNotificationOpenApi = (registry: OpenAPIRegistry) => {
    registry.register('Notification', NotificationSchema);
    registry.register('NotificationList', NotificationListSchema);

    registry.registerPath({
        method: 'get',
        path: '/api/notifications',
        summary: 'Get my notifications',
        tags: ['Notifications'],
        security: [{ BearerAuth: [] }],
        request: { query: NotificationQuerySchema },
        responses: {
            200: {
                description: 'Success',
                content: { 'application/json': { schema: NotificationListSchema } }
            }
        }
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/notifications/{id}/read',
        summary: 'Mark read',
        tags: ['Notifications'],
        security: [{ BearerAuth: [] }],
        request: { params: z.object({ id: z.string().uuid() }) },
        responses: { 200: { description: 'Success' } }
    });

    registry.registerPath({
        method: 'patch',
        path: '/api/notifications/read-all',
        summary: 'Mark all read',
        tags: ['Notifications'],
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Success' } }
    });
};