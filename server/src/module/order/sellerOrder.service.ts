import { Transaction, Op, Includeable } from 'sequelize';
import { sequelize } from '../../models';
import { Order, OrderStatus } from '../../models/Order.model';
import { OrderItem } from '../../models/OrderItem.model';
import { OrderAddress } from '../../models/OrderAddress.model';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.model';
import { Payment } from '../../models/Payment.model';
import { Shop } from '../../models/Shop.model';
import { Seller } from '../../models/Seller.model';
import { Ward } from '../../models/Wards.model';
import { Province } from '../../models/Provinces.model';
import { Customer } from '../../models/Customer.model';
import { Shipment } from '../../models/Shipment.model';
import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import {
    OrderDetailDto,
    OrderListResultDto,
    OrderSummaryDto,
    OrderStatusHistoryDto,
    OrderItemDto,
    OrderAddressDto,
    SellerRejectOrderDto,
    SellerUpdateDeliveryStatusDto,
    SellerOrderListQueryDto,
} from './order.dto';

const orderDetailInclude: Includeable[] = [
    {
        model: OrderItem,
        as: 'items',
    },
    {
        model: OrderAddress,
        as: 'order_addresses',
        include: [
            {
                model: Ward,
                as: 'ward',
                include: [{ model: Province, as: 'province' }],
            },
        ],
    },
    {
        model: OrderStatusHistory,
        as: 'status_history',
        separate: true,
        order: [['created_at', 'ASC']],
    },
    {
        model: Payment,
        as: 'payment',
    },
    {
        model: Shipment,
        as: 'shipments',
    },
];

const mapOrderItem = (item: any): OrderItemDto => ({
    id: item.id,
    product_id: item.product_id,
    product_name: item.product_name,
    sku_id: item.sku_id ?? null,
    sku_name: item.sku_name ?? null,
    quantity: item.quantity,
    unit_price: Number(item.unit_price),
    line_discount: Number(item.line_discount),
    line_total: Number(item.line_total),
});

const mapOrderAddress = (addr: any): OrderAddressDto => {
    const ward = addr.ward;
    const province = ward?.province;

    if (!ward) {
        throw new InternalServerError('order:ward_not_loaded');
    }

    return {
        type: addr.type,
        receiver_name: addr.receiver_name,
        receiver_phone: addr.receiver_phone,
        address_line: addr.address_line,
        ward: {
            id: ward.id,
            code: ward.code,
            name: ward.name,
            province: province
                ? {
                      code: province.code,
                      name: province.name,
                  }
                : undefined,
        },
    };
};

const mapStatusHistory = (h: any): OrderStatusHistoryDto => ({
    id: h.id,
    order_id: h.order_id,
    old_status: h.old_status,
    new_status: h.new_status,
    changed_by_user_id: h.changed_by_user_id,
    changed_by_role: h.changed_by_role,
    reason: h.reason,
    created_at: h.created_at,
});

const mapOrderSummary = (order: any): OrderSummaryDto => ({
    id: order.id,
    code: order.code,
    status: order.status,
    payment_status: order.payment_status,
    total_amount: Number(order.total_amount),
    created_at: order.created_at,
});

const mapOrderDetail = (order: any): OrderDetailDto => ({
    ...mapOrderSummary(order),
    user_id: order.user_id,
    shop_id: order.shop_id,
    payment_method_id: order.payment_method_id,
    shipping_method: order.shipping_method,
    item_count: order.item_count,
    subtotal_amount: Number(order.subtotal_amount),
    shipping_fee: Number(order.shipping_fee),
    discount_amount: Number(order.discount_amount),
    note: order.note,
    items: (order.items ?? []).map(mapOrderItem),
    addresses: (order.order_addresses ?? []).map(mapOrderAddress),
    payment: order.payment
        ? {
              id: order.payment.id,
              order_id: order.payment.order_id,
              payment_method_id: order.payment.payment_method_id,
              status: order.payment.status,
              amount: Number(order.payment.amount),
              transaction_code: order.payment.transaction_code,
              raw_payload: order.payment.raw_payload,
              paid_at: order.payment.paid_at,
              created_at: order.payment.created_at,
              updated_at: order.payment.updated_at,
          }
        : null,
    status_history: (order.status_history ?? []).map(mapStatusHistory),
    shipments: (order.shipments ?? []).map((s: any) => ({
        id: s.id,
        tracking_code: s.tracking_code,
        status: s.status,
        fee: Number(s.fee),
        cod_amount: Number(s.cod_amount),
        shipped_at: s.shipped_at,
        delivered_at: s.delivered_at,
        estimated_delivery_date: s.estimated_delivery_date,
    })),
});

const findSellerShopIds = async (userId: string): Promise<string[]> => {
    const seller = await Seller.findOne({ where: { user_id: userId } });
    if (!seller) {
        throw new ValidationError('seller:not_seller');
    }
    const shops = await Shop.findAll({ where: { seller_id: seller.id } });
    if (!shops.length) {
        throw new NotFoundError('seller:shop_not_found');
    }
    return shops.map((s) => s.id);
};

export const listSellerOrders = async (userId: string, query: SellerOrderListQueryDto): Promise<OrderListResultDto> => {
    const shopIds = await findSellerShopIds(userId);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: any = { shop_id: { [Op.in]: shopIds } };
    if (query.status) {
        where.status = query.status;
    }

    const { rows, count } = await Order.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit,
        offset,
    });

    return {
        items: rows.map(mapOrderSummary),
        total: count,
        page,
        limit,
    };
};

export const getSellerOrderDetail = async (userId: string, id: string): Promise<OrderDetailDto> => {
    const shopIds = await findSellerShopIds(userId);
    const order = await Order.findOne({
        where: { id, shop_id: { [Op.in]: shopIds } },
        include: orderDetailInclude,
    });
    if (!order) {
        throw new NotFoundError('order:not_found');
    }
    return mapOrderDetail(order);
};

const appendHistory = async (
    tx: Transaction,
    orderId: string,
    oldStatus: OrderStatus | null,
    newStatus: OrderStatus,
    userId: string,
    reason: string | null,
) => {
    await OrderStatusHistory.create(
        {
            order_id: orderId,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by_user_id: userId,
            changed_by_role: 'seller',
            reason,
        },
        { transaction: tx },
    );
};

export const sellerConfirmOrder = async (userId: string, id: string): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shopIds = await findSellerShopIds(userId);
        const order = await Order.findOne({
            where: { id, shop_id: { [Op.in]: shopIds } },
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
        if (!order) {
            throw new NotFoundError('order:not_found');
        }
        if (order.status !== 'pending') {
            throw new ValidationError('order:cannot_confirm');
        }

        const oldStatus = order.status;
        order.status = 'confirmed';
        await order.save({ transaction: tx });
        await appendHistory(tx, order.id, oldStatus, 'confirmed', userId, null);

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};

export const sellerRejectOrder = async (
    userId: string,
    id: string,
    payload: SellerRejectOrderDto,
): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shopIds = await findSellerShopIds(userId);
        const order = await Order.findOne({
            where: { id, shop_id: { [Op.in]: shopIds } },
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
        if (!order) {
            throw new NotFoundError('order:not_found');
        }
        if (order.status !== 'pending') {
            throw new ValidationError('order:cannot_reject');
        }
        const reason = payload.reason?.trim();
        if (!reason) {
            throw new ValidationError('order:reject_reason_required');
        }

        const oldStatus = order.status;
        order.status = 'cancelled';
        await order.save({ transaction: tx });
        await appendHistory(tx, order.id, oldStatus, 'cancelled', userId, reason);

        const pointsRefund = Math.floor(Number(order.discount_amount || 0) / 10);
        if (pointsRefund > 0) {
            const customer = await Customer.findOne({ where: { user_id: order.user_id }, transaction: tx });
            if (customer) {
                customer.loyalty_points = (customer.loyalty_points ?? 0) + pointsRefund;
                await customer.save({ transaction: tx });
            }
        }

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};

export const sellerUpdateDeliveryStatus = async (
    userId: string,
    id: string,
    payload: SellerUpdateDeliveryStatusDto,
): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shopIds = await findSellerShopIds(userId);
        const order = await Order.findOne({
            where: { id, shop_id: { [Op.in]: shopIds } },
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
        if (!order) {
            throw new NotFoundError('order:not_found');
        }

        const target = payload.status;
        if (target === 'shipping' && order.status !== 'confirmed') {
            throw new ValidationError('order:invalid_transition');
        }
        if (target === 'completed' && order.status !== 'shipping') {
            throw new ValidationError('order:invalid_transition');
        }

        const oldStatus = order.status;
        order.status = target;
        await order.save({ transaction: tx });
        await appendHistory(tx, order.id, oldStatus, target, userId, null);

        if (target === 'completed' && oldStatus !== 'completed') {
            const customer = await Customer.findOne({ where: { user_id: order.user_id }, transaction: tx });
            if (customer) {
                customer.loyalty_points = (customer.loyalty_points ?? 0) + 500;
                await customer.save({ transaction: tx });
            }
        }

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};