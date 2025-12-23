import { Transaction, Op, Includeable, fn, col, literal } from 'sequelize';
import { sequelize } from '../../models';
import { Order, OrderStatus } from '../../models/Order.model';
import { OrderItem } from '../../models/OrderItem.model';
import { OrderAddress } from '../../models/OrderAddress.model';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.model';
import { Payment } from '../../models/Payment.model';
import { PaymentMethod } from '../../models/PaymentMethod.model';
import { Shipment } from '../../models/Shipment.model';
import { Ward } from '../../models/Wards.model';
import { Province } from '../../models/Provinces.model';
import { User } from '../../models/User.model';
import { Shop } from '../../models/Shop.model';
import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import {
    AdminOrderListQueryDto,
    AdminUpdateOrderStatusDto,
    OrderDetailDto,
    OrderListResultDto,
    OrderSummaryDto,
    OrderStatusHistoryDto,
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
        include: [{ model: PaymentMethod, as: 'payment_method' }],
    },
    {
        model: Shipment,
        as: 'shipments',
    },
];

const mapOrderSummary = (order: any): OrderSummaryDto => ({
    id: order.id,
    code: order.code,
    status: order.status,
    payment_status: order.payment_status,
    total_amount: Number(order.total_amount),
    created_at: order.created_at,
});

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
    items: (order.items ?? []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        sku_id: item.sku_id ?? null,
        sku_name: item.sku_name ?? null,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        line_discount: Number(item.line_discount),
        line_total: Number(item.line_total),
    })),
    addresses: (order.order_addresses ?? []).map((addr: any) => {
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
    }),
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

export const adminListOrders = async (query: AdminOrderListQueryDto): Promise<OrderListResultDto> => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.user_id) where.user_id = query.user_id;
    if (query.shop_id) where.shop_id = query.shop_id;
    if (query.code) where.code = { [Op.iLike]: `%${query.code.trim()}%` };
    if (query.date_from || query.date_to) {
        where.created_at = {};
        if (query.date_from) where.created_at[Op.gte] = new Date(query.date_from);
        if (query.date_to) where.created_at[Op.lte] = new Date(query.date_to);
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

export const adminGetOrderDetail = async (id: string): Promise<OrderDetailDto> => {
    const order = await Order.findByPk(id, { include: orderDetailInclude });
    if (!order) {
        throw new NotFoundError('order:not_found');
    }
    return mapOrderDetail(order);
};

export const adminUpdateOrderStatus = async (
    id: string,
    dto: AdminUpdateOrderStatusDto,
    adminUserId: string,
): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const order = await Order.findByPk(id, {
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
        if (!order) {
            throw new NotFoundError('order:not_found');
        }
        const oldStatus = order.status;
        order.status = dto.status;
        await order.save({ transaction: tx });

        await OrderStatusHistory.create(
            {
                order_id: order.id,
                old_status: oldStatus,
                new_status: dto.status,
                changed_by_user_id: adminUserId,
                changed_by_role: 'admin',
                reason: dto.reason ?? null,
            },
            { transaction: tx },
        );

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};

export const adminGetOrderStatusHistory = async (id: string): Promise<OrderStatusHistoryDto[]> => {
    const order = await Order.findByPk(id);
    if (!order) {
        throw new NotFoundError('order:not_found');
    }
    const histories = await OrderStatusHistory.findAll({
        where: { order_id: id },
        order: [['created_at', 'ASC']],
    });
    return histories.map(mapStatusHistory);
};

// Placeholder: refund requires real gateway integration; notify caller to implement provider call
export const adminRefundOrder = async (id: string): Promise<void> => {
    throw new ValidationError('payment:refund_not_implemented');
};

export const adminOrderStats = async (): Promise<{
    by_status: Record<OrderStatus, number>;
    total_revenue: number;
}> => {
    const rows = await Order.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count'], [fn('SUM', col('total_amount')), 'revenue']],
        group: ['status'],
    });

    const by_status: Record<OrderStatus, number> = {
        pending: 0,
        confirmed: 0,
        shipping: 0,
        completed: 0,
        cancelled: 0,
    };
    let total_revenue = 0;

    for (const r of rows as any[]) {
        by_status[r.status as OrderStatus] = Number(r.dataValues.count ?? 0);
        total_revenue += Number(r.dataValues.revenue ?? 0);
    }

    return { by_status, total_revenue };
};
