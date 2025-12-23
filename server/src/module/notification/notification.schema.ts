import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const NotificationSchema = z.object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    user_id: z.string().uuid().openapi({ example: 'user-uuid-here' }),
    type: z.enum(['order', 'loyalty', 'system']).openapi({ example: 'order' }),
    scope: z.enum(['personal', 'broadcast']).openapi({ example: 'personal' }),
    title: z.string().openapi({ example: 'Đơn hàng đã giao' }),
    content: z.string().openapi({ example: 'Đơn hàng #OD123 đã được giao thành công.' }),
    data: z.any().optional().openapi({ example: { orderId: 'uuid' } }),
    is_read: z.boolean().openapi({ example: false }),
    read_at: z.string().datetime().nullable().openapi({ example: null }),
    created_at: z.string().datetime().openapi({ example: '2025-12-23T14:00:00Z' })
}).openapi('Notification');

export const NotificationListSchema = z.object({
    code: z.number().openapi({ example: 200 }),
    message: z.string().openapi({ example: 'notification:list_success' }),
    data: z.object({
        notifications: z.array(NotificationSchema),
        pagination: z.object({
            total: z.number().openapi({ example: 100 }),
            page: z.number().openapi({ example: 1 }),
            limit: z.number().openapi({ example: 10 }),
            total_pages: z.number().openapi({ example: 10 })
        })
    })
}).openapi('NotificationList');