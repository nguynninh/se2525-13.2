import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'shipping', 'completed', 'cancelled']).openapi('OrderStatus');
export const PaymentStatusSchema = z.enum(['unpaid', 'paid', 'refunded', 'failed']).openapi('OrderPaymentStatus');
export const OrderAddressTypeSchema = z.enum(['shipping', 'billing']).openapi('OrderAddressType');
export const OrderChangerRoleSchema = z.enum(['customer', 'seller', 'admin']).openapi('OrderChangerRole');
export const ShippingMethodSchema = z.enum(['fast', 'economy']).openapi('ShippingMethod');
export const ShipmentStatusSchema = z
    .enum([
        'pending_pickup',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'delivery_failed',
        'returned',
        'cancelled',
    ])
    .openapi('ShipmentStatus');

export const OrderIdParamSchema = z
    .object({
        id: z.string().uuid('order:id_invalid'),
    })
    .strict()
    .openapi('OrderIdParams');

export const OrderAddressSchema = z
    .object({
        type: OrderAddressTypeSchema.default('shipping'),
        receiver_name: z.string().trim().min(1, 'order:receiver_name_required').max(255),
        receiver_phone: z.string().trim().min(1, 'order:receiver_phone_required').max(20),
        address_line: z.string().trim().min(1, 'order:address_line_required'),
        ward_id: z.string().uuid('order:ward_id_invalid'),
    })
    .strict()
    .openapi('OrderAddressPayload');

export const OrderItemPayloadSchema = z
    .object({
        product_id: z.string().uuid('order:product_id_invalid'),
        product_name: z.string().trim().min(1).max(255),
        sku_id: z.string().uuid().nullable().optional(),
        sku_name: z.string().trim().max(255).nullable().optional(),
        quantity: z.number().int().positive(),
        unit_price: z.number(),
        line_discount: z.number().default(0),
        line_total: z.number(),
    })
    .strict()
    .openapi('OrderItemPayload');

export const CreateOrderSchema = z
    .object({
        shop_id: z.string().uuid('order:shop_id_invalid'),
        payment_method_id: z.number().int().positive(),
        shipping_method: ShippingMethodSchema.default('economy').optional(),
        note: z.string().trim().max(2000).nullable().optional(),
        use_loyalty: z.coerce.boolean().default(false).optional(),
        items: z.array(OrderItemPayloadSchema).min(1, 'order:items_required'),
        address: OrderAddressSchema,
    })
    .strict()
    .openapi('CreateOrder');

export const SellerOrderListQuerySchema = z
    .object({
        status: OrderStatusSchema.optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    })
    .strict()
    .openapi('SellerOrderListQuery');

export const UpdateOrderStatusSchema = z
    .object({
        status: OrderStatusSchema,
        reason: z.string().trim().max(2000).nullable().optional(),
    })
    .strict()
    .openapi('UpdateOrderStatus');

export const SellerRejectOrderSchema = z
    .object({
        reason: z.string().trim().min(1, 'order:reject_reason_required').max(2000),
    })
    .strict()
    .openapi('SellerRejectOrder');

export const SellerUpdateDeliveryStatusSchema = z
    .object({
        status: z.enum(['shipping', 'completed']),
    })
    .strict()
    .openapi('SellerUpdateDeliveryStatus');

export const AdminOrderListQuerySchema = z
    .object({
        status: OrderStatusSchema.optional(),
        user_id: z.string().uuid().optional(),
        shop_id: z.string().uuid().optional(),
        code: z.string().trim().optional(),
        date_from: z.string().datetime().optional(),
        date_to: z.string().datetime().optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    })
    .strict()
    .openapi('AdminOrderListQuery');

export const AdminUpdateOrderStatusSchema = z
    .object({
        status: OrderStatusSchema,
        reason: z.string().trim().max(2000).nullable().optional(),
    })
    .strict()
    .openapi('AdminUpdateOrderStatus');

export const OrderItemResponseSchema = OrderItemPayloadSchema.extend({
    id: z.string().uuid(),
}).openapi('OrderItemResponse');

export const OrderAddressResponseSchema = z
    .object({
        id: z.string().uuid(),
        type: OrderAddressTypeSchema,
        receiver_name: z.string(),
        receiver_phone: z.string(),
        address_line: z.string(),
        ward: z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            code: z.string().optional(),
            province: z
                .object({
                    code: z.string().optional(),
                    name: z.string().optional(),
                })
                .optional(),
        }),
    })
    .strict()
    .openapi('OrderAddressResponse');

export const OrderStatusHistoryResponseSchema = z
    .object({
        id: z.string().uuid(),
        order_id: z.string().uuid(),
        old_status: OrderStatusSchema.nullable(),
        new_status: OrderStatusSchema,
        changed_by_user_id: z.string().uuid(),
        changed_by_role: OrderChangerRoleSchema,
        reason: z.string().nullable(),
        created_at: z.string().datetime(),
    })
    .strict()
    .openapi('OrderStatusHistoryResponse');

export const OrderSummaryResponseSchema = z
    .object({
        id: z.string().uuid(),
        code: z.string(),
        status: OrderStatusSchema,
        payment_status: PaymentStatusSchema,
        total_amount: z.number(),
        created_at: z.string().datetime(),
    })
    .strict()
    .openapi('OrderSummaryResponse');

export const OrderDetailResponseSchema = OrderSummaryResponseSchema.extend({
    user_id: z.string().uuid(),
    shop_id: z.string().uuid(),
    payment_method_id: z.number().int(),
    item_count: z.number().int(),
    subtotal_amount: z.number(),
    shipping_fee: z.number(),
    discount_amount: z.number(),
    shipping_method: ShippingMethodSchema,
    note: z.string().nullable(),
    items: z.array(OrderItemResponseSchema),
    addresses: z.array(OrderAddressResponseSchema),
    payment: z
        .object({
            id: z.string().uuid(),
            order_id: z.string().uuid(),
            payment_method_id: z.number().int(),
            status: z.enum(['pending', 'success', 'failed', 'refunded']),
            amount: z.number(),
            transaction_code: z.string().nullable(),
            raw_payload: z.unknown().nullable(),
            paid_at: z.string().datetime().nullable(),
            created_at: z.string().datetime(),
            updated_at: z.string().datetime(),
        })
        .nullable()
        .optional(),
        status_history: z.array(OrderStatusHistoryResponseSchema),
        shipments: z
            .array(
                z.object({
                    id: z.string().uuid(),
                    tracking_code: z.string().nullable(),
                    status: ShipmentStatusSchema,
                    fee: z.number(),
                    cod_amount: z.number(),
                    shipped_at: z.string().datetime().nullable(),
                    delivered_at: z.string().datetime().nullable(),
                    estimated_delivery_date: z.string().date().nullable(),
                }),
            )
            .optional(),
    })
    .strict()
    .openapi('OrderDetailResponse');
