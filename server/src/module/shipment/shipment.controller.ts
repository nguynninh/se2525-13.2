import { Request, Response } from 'express';
import response from '../../utils/response';
import { createShipment, getShipmentById, listShipmentsByOrder, updateShipmentStatus } from './shipment.service';

export const ShipmentController = {
    async create(req: Request, res: Response) {
        const shipment = await createShipment(req.body);
        return response.created(res, shipment, 'shipment:create_success');
    },

    async getDetail(req: Request, res: Response) {
        const shipment = await getShipmentById(req.params.id);
        return response.ok(res, shipment, 'shipment:get_success');
    },

    async listByOrder(req: Request, res: Response) {
        const shipments = await listShipmentsByOrder(req.params.id);
        return response.ok(res, shipments, 'shipment:list_success');
    },

    async updateStatus(req: Request, res: Response) {
        const shipment = await updateShipmentStatus(req.params.id, req.body);
        return response.ok(res, shipment, 'shipment:update_status_success');
    },
};

export default ShipmentController;
