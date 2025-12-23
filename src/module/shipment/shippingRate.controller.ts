import { Request, Response } from 'express';
import response from '../../utils/response';
import { listShippingRates, getShippingRateById, updateShippingRate, ShippingRateDto } from './shippingRate.service';

export const ShippingRateController = {
    async list(req: Request, res: Response) {
        const data: ShippingRateDto[] = await listShippingRates();
        return response.ok(res, data, 'shipping_rate:list_success');
    },

    async getDetail(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data: ShippingRateDto = await getShippingRateById(id);
        return response.ok(res, data, 'shipping_rate:get_success');
    },

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { fee } = req.body;
        const data: ShippingRateDto = await updateShippingRate(id, fee);
        return response.ok(res, data, 'shipping_rate:update_success');
    },
};

export default ShippingRateController;
