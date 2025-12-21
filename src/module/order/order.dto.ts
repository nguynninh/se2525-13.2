import { OrderStatus, PaymentStatus } from '../../models/Order.model';

export interface OrderAddressDto {
    type: 'shipping' | 'billing';
    receiver_name: string;
    receiver_phone: string;
    address_line: string;
    ward: {
        id: string;
        code?: string;
        name?: string;
        province?: {
            code?: string;
            name?: string;
        };
    };
}

export interface OrderItemDto {
    id: string;
    product_id: string;
    product_name: string;
    sku_id: string | null;
    sku_name: string | null;
    quantity: number;
    unit_price: number;
    line_discount: number;
    line_total: number;
}

export interface OrderSummaryDto {
    id: string;
    code: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    total_amount: number;
    created_at: Date;
}

export interface OrderDetailDto extends OrderSummaryDto {
    user_id: string;
    shop_id: string;
    payment_method_id: number;
    shipping_method: 'fast' | 'economy';
    item_count: number;
    subtotal_amount: number;
    shipping_fee: number;
    discount_amount: number;
    note: string | null;
    items: OrderItemDto[];
    addresses: OrderAddressDto[];
    shipments?: ShipmentDto[];
    payment?: PaymentDto | null;
    status_history: OrderStatusHistoryDto[];
}

export interface CreateOrderAddressDto {
    type?: 'shipping' | 'billing';
    receiver_name: string;
    receiver_phone: string;
    address_line: string;
    ward_id: string;
}

export interface CreateOrderItemDto {
    product_id: string;
    product_name: string;
    sku_id?: string | null;
    sku_name?: string | null;
    quantity: number;
    unit_price: number;
    line_discount?: number;
    line_total: number;
}

export interface CreateOrderDto {
    shop_id: string;
    payment_method_id: number;
    shipping_method?: 'fast' | 'economy';
    note?: string | null;
    use_loyalty?: boolean;
    items: CreateOrderItemDto[];
    address: CreateOrderAddressDto;
}

export interface OrderListResultDto {
    items: OrderSummaryDto[];
    total: number;
    page: number;
    limit: number;
}

export interface SellerOrderListQueryDto {
    status?: OrderStatus;
    page?: number;
    limit?: number;
}

export interface SellerRejectOrderDto {
    reason: string;
}

export interface SellerUpdateDeliveryStatusDto {
    status: Extract<OrderStatus, 'shipping' | 'completed'>;
}

export interface AdminOrderListQueryDto {
    status?: OrderStatus;
    user_id?: string;
    shop_id?: string;
    code?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
}

export interface AdminUpdateOrderStatusDto {
    status: OrderStatus;
    reason?: string | null;
}

export interface AdminOrderStatsDto {
    by_status: Record<OrderStatus, number>;
    total_revenue: number;
}

export interface ShipmentDto {
    id: string;
    tracking_code: string | null;
    status:
        | 'pending_pickup'
        | 'in_transit'
        | 'out_for_delivery'
        | 'delivered'
        | 'delivery_failed'
        | 'returned'
        | 'cancelled';
    fee: number;
    cod_amount: number;
    shipped_at: Date | null;
    delivered_at: Date | null;
    estimated_delivery_date: string | null;
}

export interface OrderStatusHistoryDto {
    id: string;
    order_id: string;
    old_status: OrderStatus | null;
    new_status: OrderStatus;
    changed_by_user_id: string;
    changed_by_role: 'customer' | 'seller' | 'admin';
    reason: string | null;
    created_at: Date;
}

export interface PaymentDto {
    id: string;
    order_id: string;
    payment_method_id: number;
    status: PaymentStatus | 'pending' | 'success' | 'failed' | 'refunded';
    amount: number;
    transaction_code: string | null;
    raw_payload: any | null;
    paid_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
