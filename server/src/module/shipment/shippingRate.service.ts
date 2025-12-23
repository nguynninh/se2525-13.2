import { ShippingRate } from '../../models/ShippingRate.model';
import { NotFoundError } from '../../exception/AppError';

export type ShippingRateDto = {
    id: number;
    same_province: boolean;
    shipping_method: 'fast' | 'economy';
    fee: number;
    created_at: Date;
    updated_at: Date;
};

const mapRate = (r: ShippingRate): ShippingRateDto => ({
    id: r.id,
    same_province: r.same_province,
    shipping_method: r.shipping_method,
    fee: Number(r.fee),
    created_at: r.created_at,
    updated_at: r.updated_at,
});

export const listShippingRates = async (): Promise<ShippingRateDto[]> => {
    const rows = await ShippingRate.findAll({ order: [['id', 'ASC']] });
    return rows.map(mapRate);
};

export const getShippingRateById = async (id: number): Promise<ShippingRateDto> => {
    const rate = await ShippingRate.findByPk(id);
    if (!rate) {
        throw new NotFoundError('shipping_rate:not_found');
    }
    return mapRate(rate);
};

export const updateShippingRate = async (id: number, fee: number): Promise<ShippingRateDto> => {
    const rate = await ShippingRate.findByPk(id);
    if (!rate) {
        throw new NotFoundError('shipping_rate:not_found');
    }
    rate.fee = fee;
    await rate.save();
    return mapRate(rate);
};

export default {
    listShippingRates,
    getShippingRateById,
    updateShippingRate,
};
