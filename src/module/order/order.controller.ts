import { Request, Response } from 'express';
import { createOrder, listMyOrders, getMyOrderDetail, cancelMyOrder, confirmMyOrderReceived, getMyOrderStatusHistory } from './userOrder.service';
import { listSellerOrders, getSellerOrderDetail, sellerConfirmOrder, sellerRejectOrder, sellerUpdateDeliveryStatus } from './sellerOrder.service';
import { adminListOrders, adminGetOrderDetail, adminUpdateOrderStatus, adminGetOrderStatusHistory, adminOrderStats, adminRefundOrder } from './adminOrder.service';
import response from '../../utils/response';

export const OrderController = {
    async create(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await createOrder(userId, req.body);
        return response.created(res, order, 'order:create_success');
    },

    async listMy(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const { page, limit } = req.query as any;
        const result = await listMyOrders(userId, Number(page) || 1, Number(limit) || 10);
        return response.ok(res, result, 'order:list_success');
    },

    async getMyDetail(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await getMyOrderDetail(userId, req.params.id);
        return response.ok(res, order, 'order:get_detail_success');
    },

    async cancelMy(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await cancelMyOrder(userId, req.params.id, req.body?.reason);
        return response.ok(res, order, 'order:cancel_success');
    },

    async confirmReceived(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await confirmMyOrderReceived(userId, req.params.id);
        return response.ok(res, order, 'order:confirm_success');
    },

    async getMyStatusHistory(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const data = await getMyOrderStatusHistory(userId, req.params.id);
        return response.ok(res, data, 'order:status_history_success');
    },

    // Seller
    async sellerList(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const result = await listSellerOrders(userId, req.query as any);
        return response.ok(res, result, 'order:list_success');
    },

    async sellerGetDetail(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await getSellerOrderDetail(userId, req.params.id);
        return response.ok(res, order, 'order:get_detail_success');
    },

    async sellerConfirm(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await sellerConfirmOrder(userId, req.params.id);
        return response.ok(res, order, 'order:update_status_success');
    },

    async sellerReject(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await sellerRejectOrder(userId, req.params.id, req.body);
        return response.ok(res, order, 'order:update_status_success');
    },

    async sellerUpdateStatus(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const order = await sellerUpdateDeliveryStatus(userId, req.params.id, req.body);
        return response.ok(res, order, 'order:update_status_success');
    },

    // Admin
    async adminList(req: Request, res: Response) {
        const result = await adminListOrders(req.query as any);
        return response.ok(res, result, 'order:list_success');
    },

    async adminGetDetail(req: Request, res: Response) {
        const order = await adminGetOrderDetail(req.params.id);
        return response.ok(res, order, 'order:get_detail_success');
    },

    async adminUpdateStatus(req: Request, res: Response) {
        const adminUserId = req.user?.id as string;
        const order = await adminUpdateOrderStatus(req.params.id, req.body, adminUserId);
        return response.ok(res, order, 'order:update_status_success');
    },

    async adminStatusHistory(req: Request, res: Response) {
        const data = await adminGetOrderStatusHistory(req.params.id);
        return response.ok(res, data, 'order:status_history_success');
    },

    async adminStats(req: Request, res: Response) {
        const data = await adminOrderStats();
        return response.ok(res, data, 'order:list_success');
    },

    async adminRefund(req: Request, res: Response) {
        await adminRefundOrder(req.params.id);
        return response.ok(res, {}, 'payment:refund_not_implemented');
    },
};
