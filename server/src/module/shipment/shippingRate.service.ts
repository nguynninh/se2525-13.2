import { ShippingRate } from '../../models/ShippingRate.model';
import { NotFoundError } from '../../exception/AppError';

export const listShippingRates = async () => {
    const rows = await ShippingRate.findAll({ order: [['id', 'ASC']] });
    return rows.map((r) => ({
        id: r.id,
        same_province: r.same_province,
        shipping_method: r.shipping_method,
        fee: Number(r.fee),
        created_at: r.created_at,
        updated_at: r.updated_at,
    }));
};

export const getShippingRateById = async (id: number) => {
    const rate = await ShippingRate.findByPk(id);
    if (!rate) {
        throw new NotFoundError('shipping_rate:not_found');
    }
    return {
        id: rate.id,
        same_province: rate.same_province,
        shipping_method: rate.shipping_method,
        fee: Number(rate.fee),
        created_at: rate.created_at,
        updated_at: rate.updated_at,
    };
};

export const updateShippingRate = async (id: number, fee: number) => {
    const rate = await ShippingRate.findByPk(id);
    if (!rate) {
        throw new NotFoundError('shipping_rate:not_found');
    }
    rate.fee = fee;
    await rate.save();
    return {
        id: rate.id,
        same_province: rate.same_province,
        shipping_method: rate.shipping_method,
        fee: Number(rate.fee),
        created_at: rate.created_at,
        updated_at: rate.updated_at,
    };
};

export default {
    listShippingRates,
    getShippingRateById,
    updateShippingRate,
};
