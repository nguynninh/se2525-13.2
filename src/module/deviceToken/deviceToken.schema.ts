import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const RegisterDeviceTokenSchema = z
    .object({
        device_id: z.string().min(1, 'device_token:device_id_required'),
        platform: z.enum(['android', 'ios', 'web']),
        push_token: z.string().min(1, 'device_token:push_token_required'),
        app_version: z.string().max(50).optional(),
        os_version: z.string().max(50).optional(),
    })
    .strict()
    .openapi('RegisterDeviceToken');

export const RemoveDeviceTokenQuerySchema = z
    .object({
        deviceId: z.string().min(1, 'device_token:device_id_required'),
    })
    .strict()
    .openapi('RemoveDeviceTokenQuery');
