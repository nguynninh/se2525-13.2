import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';
import { OrderController } from '../../../module/order/order.controller';
import {
    CreateOrderSchema,
    OrderIdParamSchema,
    SellerOrderListQuerySchema,
    SellerRejectOrderSchema,
    SellerUpdateDeliveryStatusSchema,
    AdminOrderListQuerySchema,
    AdminUpdateOrderStatusSchema,
} from '../../../module/order/order.schema';

const router = Router();

// User
router.post('/orders', authenticate, restrictTo('customer'), v({ body: CreateOrderSchema }), OrderController.create);
router.get('/user/me/orders', authenticate, restrictTo('customer'), OrderController.listMy);
router.get('/user/me/orders/:id', authenticate, restrictTo('customer'), v({ params: OrderIdParamSchema }), OrderController.getMyDetail);
router.patch('/user/me/orders/:id/cancel', authenticate, restrictTo('customer'), v({ params: OrderIdParamSchema }), OrderController.cancelMy);
router.patch('/user/me/orders/:id/confirm-received', authenticate, restrictTo('customer'), v({ params: OrderIdParamSchema }), OrderController.confirmReceived);
router.get('/user/me/orders/:id/status-history', authenticate, restrictTo('customer'), v({ params: OrderIdParamSchema }), OrderController.getMyStatusHistory);

// Seller
router.get('/user/seller/me/orders', authenticate, restrictTo('seller'), v({ query: SellerOrderListQuerySchema }), OrderController.sellerList);
router.get('/user/seller/me/orders/:id', authenticate, restrictTo('seller'), v({ params: OrderIdParamSchema }), OrderController.sellerGetDetail);
router.patch('/user/seller/me/orders/:id/confirm', authenticate, restrictTo('seller'), v({ params: OrderIdParamSchema }), OrderController.sellerConfirm);
router.patch('/user/seller/me/orders/:id/reject', authenticate, restrictTo('seller'), v({ params: OrderIdParamSchema, body: SellerRejectOrderSchema }), OrderController.sellerReject);
router.patch('/user/seller/me/orders/:id/status', authenticate, restrictTo('seller'), v({ params: OrderIdParamSchema, body: SellerUpdateDeliveryStatusSchema }), OrderController.sellerUpdateStatus);

// Admin
router.get('/user/admin/orders', authenticate, restrictTo('admin'), v({ query: AdminOrderListQuerySchema }), OrderController.adminList);
router.get('/user/admin/orders/:id', authenticate, restrictTo('admin'), v({ params: OrderIdParamSchema }), OrderController.adminGetDetail);
router.patch('/user/admin/orders/:id/status', authenticate, restrictTo('admin'), v({ params: OrderIdParamSchema, body: AdminUpdateOrderStatusSchema }), OrderController.adminUpdateStatus);
router.get('/user/admin/orders/:id/status-history', authenticate, restrictTo('admin'), v({ params: OrderIdParamSchema }), OrderController.adminStatusHistory);
router.get('/user/admin/orders/stats', authenticate, restrictTo('admin'), OrderController.adminStats);
router.post('/user/admin/orders/:id/refund', authenticate, restrictTo('admin'), v({ params: OrderIdParamSchema }), OrderController.adminRefund);

export default router;
