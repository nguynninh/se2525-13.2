import { Transaction } from 'sequelize';
import { sequelize } from '../../models';
import { Shipment } from '../../models/Shipment.model';
import { ShipmentStatusHistory } from '../../models/ShipmentStatusHistory.model';
import { Order } from '../../models/Order.model';
import { NotFoundError, ValidationError } from '../../exception/AppError';
import { ShipmentDto, ShipmentStatusHistoryDto, CreateShipmentDto, UpdateShipmentStatusDto } from './shipment.dto';

const mapHistory = (h: any): ShipmentStatusHistoryDto => ({
    id: h.id,
    shipment_id: h.shipment_id,
    old_status: h.old_status,
    new_status: h.new_status,
    event_time: h.event_time,
    source: h.source,
    description: h.description,
    raw_payload: h.raw_payload,
    created_at: h.created_at,
});

const mapShipment = (s: any): ShipmentDto => ({
    id: s.id,
    order_id: s.order_id,
    tracking_code: s.tracking_code,
    status: s.status,
    fee: Number(s.fee),
    cod_amount: Number(s.cod_amount),
    shipped_at: s.shipped_at,
    delivered_at: s.delivered_at,
    estimated_delivery_date: s.estimated_delivery_date,
    created_at: s.created_at,
    updated_at: s.updated_at,
    status_history: (s.status_history ?? []).map(mapHistory),
});

export const createShipment = async (dto: CreateShipmentDto): Promise<ShipmentDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const order = await Order.findByPk(dto.order_id, { transaction: tx });
        if (!order) {
            throw new NotFoundError('shipment:order_not_found');
        }

        const shippedAt = dto.shipped_at ? new Date(dto.shipped_at) : null;
        const deliveredAt = dto.delivered_at ? new Date(dto.delivered_at) : null;
        const estimatedDeliveryDate = dto.estimated_delivery_date ? new Date(dto.estimated_delivery_date) : null;

        const shipment = await Shipment.create(
            {
                order_id: dto.order_id,
                tracking_code: dto.tracking_code ?? null,
                status: dto.status ?? 'pending_pickup',
                fee: dto.fee ?? 0,
                cod_amount: dto.cod_amount ?? 0,
                shipped_at: shippedAt,
                delivered_at: deliveredAt,
                estimated_delivery_date: estimatedDeliveryDate,
            },
            { transaction: tx },
        );

        await ShipmentStatusHistory.create(
            {
                shipment_id: shipment.id,
                old_status: null,
                new_status: shipment.status,
                event_time: new Date(),
                source: 'system',
                description: 'Shipment created',
                raw_payload: null,
            },
            { transaction: tx },
        );

        await shipment.reload({
            include: [
                { model: ShipmentStatusHistory, as: 'status_history', separate: true, order: [['created_at', 'ASC']] },
            ],
            transaction: tx,
        });

        return mapShipment(shipment);
    });
};

export const getShipmentById = async (id: string): Promise<ShipmentDto> => {
    const shipment = await Shipment.findByPk(id, {
        include: [
            { model: ShipmentStatusHistory, as: 'status_history', separate: true, order: [['created_at', 'ASC']] },
        ],
    });
    if (!shipment) {
        throw new NotFoundError('shipment:not_found');
    }
    return mapShipment(shipment);
};

export const listShipmentsByOrder = async (orderId: string): Promise<ShipmentDto[]> => {
    const rows = await Shipment.findAll({
        where: { order_id: orderId },
        include: [
            { model: ShipmentStatusHistory, as: 'status_history', separate: true, order: [['created_at', 'ASC']] },
        ],
        order: [['created_at', 'DESC']],
    });
    return rows.map(mapShipment);
};

export const updateShipmentStatus = async (id: string, dto: UpdateShipmentStatusDto): Promise<ShipmentDto> => {
    return sequelize.transaction(async (tx: Transaction) => {
        const shipment = await Shipment.findByPk(id, {
            include: [
                { model: ShipmentStatusHistory, as: 'status_history', separate: true, order: [['created_at', 'ASC']] },
            ],
            transaction: tx,
            lock: tx.LOCK.UPDATE,
        });
        if (!shipment) {
            throw new NotFoundError('shipment:not_found');
        }

        const oldStatus = shipment.status;
        shipment.status = dto.status;
        await shipment.save({ transaction: tx });

        await ShipmentStatusHistory.create(
            {
                shipment_id: shipment.id,
                old_status: oldStatus,
                new_status: dto.status,
                event_time: new Date(),
                source: dto.source ?? 'system',
                description: dto.description ?? null,
                raw_payload: dto.raw_payload ?? null,
            },
            { transaction: tx },
        );

        await shipment.reload({
            include: [
                { model: ShipmentStatusHistory, as: 'status_history', separate: true, order: [['created_at', 'ASC']] },
            ],
            transaction: tx,
        });

        return mapShipment(shipment);
    });
};
