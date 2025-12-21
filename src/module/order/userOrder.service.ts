import { Transaction, Includeable } from 'sequelize';
import { sequelize } from '../../models';
import { Order, OrderStatus } from '../../models/Order.model';
import { OrderItem } from '../../models/OrderItem.model';
import { OrderAddress } from '../../models/OrderAddress.model';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.model';
import { Payment } from '../../models/Payment.model';
import { PaymentMethod } from '../../models/PaymentMethod.model';
import { Shop } from '../../models/Shop.model';
import { Ward } from '../../models/Wards.model';
import { Province } from '../../models/Provinces.model';
import { Product } from '../../models/Product.model';
import { ProductStock } from '../../models/ProductStock.model';
import { Customer } from '../../models/Customer.model';
import { Shipment } from '../../models/Shipment.model';
import { Address } from '../../models/Address.model';
import { ShippingRate } from '../../models/ShippingRate.model';
import { NotFoundError, ValidationError, InternalServerError } from '../../exception/AppError';
import {
    OrderDetailDto,
    OrderListResultDto,
    OrderSummaryDto,
    OrderStatusHistoryDto,
    OrderItemDto,
    OrderAddressDto,
    CreateOrderDto,
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

const generateOrderCode = async (): Promise<string> => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const prefix = `OD${y}${m}${d}`;
    let attempt = 0;
    while (attempt < 5) {
        const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        const code = `${prefix}-${suffix}`;
        const existed = await Order.findOne({ where: { code } });
        if (!existed) return code;
        attempt += 1;
    }
    throw new InternalServerError('order:code_generate_failed');
};

const validatePaymentMethod = async (payment_method_id: number) => {
    const method = await PaymentMethod.findByPk(payment_method_id);
    if (!method || method.is_active === false) {
        throw new ValidationError('order:payment_method_inactive');
    }
    return method;
};

const validateWard = async (ward_id: string, tx: Transaction) => {
    const ward = await Ward.findByPk(ward_id, {
        include: [{ model: Province, as: 'province' }],
        transaction: tx,
    });
    if (!ward) {
        throw new NotFoundError('order:ward_not_found');
    }
    return ward;
};

type OrderItemSnapshot = {
    product_id: string;
    product_name: string;
    sku_id: string | null;
    sku_name: string | null;
    quantity: number;
    unit_price: number;
    line_discount: number;
    line_total: number;
};

const getShippingRate = async (isSameProvince: boolean, method: 'fast' | 'economy', tx: Transaction) => {
    const rate = await ShippingRate.findOne({
        where: { same_province: isSameProvince, shipping_method: method },
        transaction: tx,
    });
    if (!rate) {
        throw new ValidationError('shipping_rate:not_configured');
    }
    return Number(rate.fee);
};

const buildItemsSnapshot = async (
    shop_id: string,
    items: CreateOrderDto['items'],
    tx: Transaction,
): Promise<{ rows: OrderItemSnapshot[]; subtotal: number; itemCount: number }> => {
    let subtotal = 0;
    let itemCount = 0;
    const rows: OrderItemSnapshot[] = [];

    for (const item of items) {
        const product = await Product.findOne({ where: { id: item.product_id, shop_id }, transaction: tx });
        if (!product) {
            throw new NotFoundError('order:product_not_found');
        }

        let unitPrice = Number(item.unit_price);
        if (item.sku_id) {
            const stock = await ProductStock.findOne({ where: { id: item.sku_id, product_id: item.product_id }, transaction: tx });
            if (!stock) {
                throw new NotFoundError('order:sku_not_found');
            }
            unitPrice = Number(stock.price);
        } else {
            unitPrice = Number(product.price);
        }

        const quantity = item.quantity;
        const lineDiscount = item.line_discount ?? 0;
        const lineTotal = unitPrice * quantity - lineDiscount;

        subtotal += lineTotal;
        itemCount += quantity;

        rows.push({
            product_id: item.product_id,
            product_name: item.product_name || product.name,
            sku_id: item.sku_id ?? null,
            sku_name: item.sku_name ?? null,
            quantity,
            unit_price: unitPrice,
            line_discount: lineDiscount,
            line_total: lineTotal,
        });
    }

    return { rows, subtotal, itemCount };
};

export const createOrder = async (userId: string, dto: CreateOrderDto): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shop = await Shop.findByPk(dto.shop_id, {
            transaction: tx,
            include: [
                {
                    model: Address,
                    as: 'address',
                    include: [
                        {
                            model: Ward,
                            as: 'ward',
                            include: [{ model: Province, as: 'province' }],
                        },
                    ],
                },
            ],
        });
        if (!shop) {
            throw new NotFoundError('order:shop_not_found');
        }

        const customer = await Customer.findOne({ where: { user_id: userId }, transaction: tx });
        if (!customer) {
            throw new ValidationError('order:not_customer');
        }
        const currentPoints = customer.loyalty_points ?? 0;

        await validatePaymentMethod(dto.payment_method_id);
        const shippingWard = await validateWard(dto.address.ward_id, tx);

        const { rows: itemSnapshots, subtotal, itemCount } = await buildItemsSnapshot(dto.shop_id, dto.items, tx);

        const code = await generateOrderCode();
        const shopProvinceId = shop.address?.ward?.province_id ?? null;
        const shippingProvinceId = shippingWard.province_id ?? null;

        if (!shopProvinceId || !shippingProvinceId) {
            throw new ValidationError('order:province_missing');
        }

        const shippingMethod = dto.shipping_method ?? 'economy';
        const shippingFee = await getShippingRate(shopProvinceId === shippingProvinceId, shippingMethod, tx);
        const maxDeductible = subtotal + shippingFee;
        const useLoyalty = dto.use_loyalty === true;
        const pointsToUse = useLoyalty ? Math.min(currentPoints, Math.floor(maxDeductible / 10)) : 0;
        const discountAmount = pointsToUse * 10;
        const total = subtotal + shippingFee - discountAmount;

        const order = await Order.create(
            {
                user_id: userId,
                shop_id: dto.shop_id,
                code,
                status: 'pending',
                payment_method_id: dto.payment_method_id,
                payment_status: 'unpaid',
                shipping_method: dto.shipping_method ?? 'economy',
                item_count: itemCount,
                subtotal_amount: subtotal,
                shipping_fee: shippingFee,
                discount_amount: discountAmount,
                total_amount: total,
                note: dto.note ?? null,
            },
            { transaction: tx },
        );

        if (pointsToUse > 0) {
            customer.loyalty_points = currentPoints - pointsToUse;
            await customer.save({ transaction: tx });
        }

        const orderItems = itemSnapshots.map((i) => ({
            order_id: order.id,
            product_id: i.product_id,
            product_name: i.product_name,
            sku_id: i.sku_id,
            sku_name: i.sku_name,
            quantity: i.quantity,
            unit_price: i.unit_price,
            line_discount: i.line_discount,
            line_total: i.line_total,
        }));
        await OrderItem.bulkCreate(orderItems, { transaction: tx });

        await OrderAddress.create(
            {
                order_id: order.id,
                type: dto.address.type ?? 'shipping',
                receiver_name: dto.address.receiver_name,
                receiver_phone: dto.address.receiver_phone,
                ward_id: dto.address.ward_id,
                address_line: dto.address.address_line,
            },
            { transaction: tx },
        );

        await OrderStatusHistory.create(
            {
                order_id: order.id,
                old_status: null,
                new_status: 'pending',
                changed_by_user_id: userId,
                changed_by_role: 'customer',
                reason: null,
            },
            { transaction: tx },
        );

        await order.reload({
            include: orderDetailInclude,
            transaction: tx,
        });

        return mapOrderDetail(order);
    });
};

export const listMyOrders = async (
    userId: string,
    page = 1,
    limit = 10,
): Promise<OrderListResultDto> => {
    const offset = (page - 1) * limit;
    const { rows, count } = await Order.findAndCountAll({
        where: { user_id: userId },
        include: [],
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

const findMyOrderOrThrow = async (userId: string, id: string) => {
    const order = await Order.findOne({
        where: { id, user_id: userId },
        include: orderDetailInclude,
    });
    if (!order) {
        throw new NotFoundError('order:not_found');
    }
    return order;
};

export const getMyOrderDetail = async (userId: string, id: string): Promise<OrderDetailDto> => {
    const order = await findMyOrderOrThrow(userId, id);
    return mapOrderDetail(order);
};

const appendHistory = async (
    tx: Transaction,
    orderId: string,
    oldStatus: OrderStatus | null,
    newStatus: OrderStatus,
    userId: string,
    role: 'customer' | 'seller' | 'admin',
    reason: string | null,
) => {
    await OrderStatusHistory.create(
        {
            order_id: orderId,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by_user_id: userId,
            changed_by_role: role,
            reason,
        },
        { transaction: tx },
    );
};

export const cancelMyOrder = async (userId: string, id: string, reason?: string | null): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const order = await Order.findOne({
            where: { id, user_id: userId },
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });

        if (!order) {
            throw new NotFoundError('order:not_found');
        }

        if (!['pending', 'confirmed'].includes(order.status)) {
            throw new ValidationError('order:cannot_cancel');
        }

        const oldStatus = order.status;
        order.status = 'cancelled';
        await order.save({ transaction: tx });

        const pointsRefund = Math.floor(Number(order.discount_amount || 0) / 10);
        if (pointsRefund > 0) {
            const customer = await Customer.findOne({ where: { user_id: userId }, transaction: tx });
            if (customer) {
                customer.loyalty_points = (customer.loyalty_points ?? 0) + pointsRefund;
                await customer.save({ transaction: tx });
            }
        }

        await appendHistory(tx, order.id, oldStatus, 'cancelled', userId, 'customer', reason ?? null);

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};

export const confirmMyOrderReceived = async (userId: string, id: string): Promise<OrderDetailDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const order = await Order.findOne({
            where: { id, user_id: userId },
            include: orderDetailInclude,
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });

        if (!order) {
            throw new NotFoundError('order:not_found');
        }

        if (!['shipping', 'confirmed'].includes(order.status)) {
            throw new ValidationError('order:cannot_confirm_received');
        }

        const oldStatus = order.status;
        order.status = 'completed';
        await order.save({ transaction: tx });

        await appendHistory(tx, order.id, oldStatus, 'completed', userId, 'customer', null);

        if (oldStatus !== 'completed') {
            const customer = await Customer.findOne({ where: { user_id: userId }, transaction: tx });
            if (customer) {
                customer.loyalty_points = (customer.loyalty_points ?? 0) + 500;
                await customer.save({ transaction: tx });
            }
        }

        await order.reload({ include: orderDetailInclude, transaction: tx });
        return mapOrderDetail(order);
    });
};

export const getMyOrderStatusHistory = async (userId: string, id: string): Promise<OrderStatusHistoryDto[]> => {
    const histories = await OrderStatusHistory.findAll({
        where: { order_id: id },
        include: [],
        order: [['created_at', 'ASC']],
    });

    const order = await Order.findOne({ where: { id, user_id: userId } });
    if (!order) {
        throw new NotFoundError('order:not_found');
    }

    return histories.map(mapStatusHistory);
};
