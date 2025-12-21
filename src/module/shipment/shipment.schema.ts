import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ShipmentStatusSchema = z
    .enum(['pending_pickup', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'returned', 'cancelled'])
    .openapi('ShipmentStatus');

export const ShipmentStatusSourceSchema = z.enum(['system', 'manual']).openapi('ShipmentStatusSource');

export const ShipmentIdParamSchema = z
    .object({
        id: z.string().uuid('shipment:id_invalid'),
    })
    .strict()
    .openapi('ShipmentIdParams');

export const CreateShipmentSchema = z
    .object({
        order_id: z.string().uuid('shipment:order_id_invalid'),
        tracking_code: z.string().max(100).nullable().optional(),
        status: ShipmentStatusSchema.default('pending_pickup').optional(),
        fee: z.number().nonnegative().default(0).optional(),
        cod_amount: z.number().nonnegative().default(0).optional(),
        shipped_at: z.string().datetime().nullable().optional(),
        delivered_at: z.string().datetime().nullable().optional(),
        estimated_delivery_date: z.string().date().nullable().optional(),
    })
    .strict()
    .openapi('CreateShipment');

export const UpdateShipmentStatusSchema = z
    .object({
        status: ShipmentStatusSchema,
        source: ShipmentStatusSourceSchema.default('system').optional(),
        description: z.string().trim().max(2000).nullable().optional(),
        raw_payload: z.unknown().nullable().optional(),
    })
    .strict()
    .openapi('UpdateShipmentStatus');

export const ShipmentStatusHistoryResponseSchema = z
    .object({
        id: z.string().uuid(),
        shipment_id: z.string().uuid(),
        old_status: ShipmentStatusSchema.nullable(),
        new_status: ShipmentStatusSchema,
        event_time: z.string().datetime(),
        source: ShipmentStatusSourceSchema,
        description: z.string().nullable(),
        raw_payload: z.unknown().nullable(),
        created_at: z.string().datetime(),
    })
    .strict()
    .openapi('ShipmentStatusHistoryResponse');

export const ShipmentResponseSchema = z
    .object({
        id: z.string().uuid(),
        order_id: z.string().uuid(),
        tracking_code: z.string().nullable(),
        status: ShipmentStatusSchema,
        fee: z.number(),
        cod_amount: z.number(),
        shipped_at: z.string().datetime().nullable(),
        delivered_at: z.string().datetime().nullable(),
        estimated_delivery_date: z.string().date().nullable(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
        status_history: z.array(ShipmentStatusHistoryResponseSchema),
    })
    .strict()
    .openapi('ShipmentResponse');

// Shipping rate schemas
export const ShippingRateMethodSchema = z.enum(['fast', 'economy']).openapi('ShippingRateMethod');

export const ShippingRateIdParamSchema = z
    .object({
        id: z.coerce.number().int().min(1, 'shipping_rate:id_invalid'),
    })
    .strict()
    .openapi('ShippingRateIdParams');

export const ShippingRateResponseSchema = z
    .object({
        id: z.number().int(),
        same_province: z.boolean(),
        shipping_method: ShippingRateMethodSchema,
        fee: z.number(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
    })
    .strict()
    .openapi('ShippingRateResponse');

export const UpdateShippingRateSchema = z
    .object({
        fee: z.number().nonnegative('shipping_rate:fee_invalid'),
    })
    .strict()
    .openapi('UpdateShippingRate');
