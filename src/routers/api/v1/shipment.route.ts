import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';
import ShipmentController from '../../../module/shipment/shipment.controller';
import ShippingRateController from '../../../module/shipment/shippingRate.controller';
import {
    CreateShipmentSchema,
    ShipmentIdParamSchema,
    UpdateShipmentStatusSchema,
} from '../../../module/shipment/shipment.schema';
import { OrderIdParamSchema } from '../../../module/order/order.schema';
import { ShippingRateIdParamSchema, UpdateShippingRateSchema } from '../../../module/shipment/shipment.schema';

const router = Router();

router.post(
    '/shipments',
    authenticate,
    restrictTo('admin'),
    v({ body: CreateShipmentSchema }),
    ShipmentController.create,
);
router.get(
    '/shipments/:id',
    authenticate,
    restrictTo('admin'),
    v({ params: ShipmentIdParamSchema }),
    ShipmentController.getDetail,
);
router.get(
    '/orders/:id/shipments',
    authenticate,
    restrictTo('admin'),
    v({ params: OrderIdParamSchema }),
    ShipmentController.listByOrder,
);
router.patch(
    '/shipments/:id/status',
    authenticate,
    restrictTo('admin'),
    v({ params: ShipmentIdParamSchema, body: UpdateShipmentStatusSchema }),
    ShipmentController.updateStatus,
);

router.get('/shipping-rates', authenticate, restrictTo('admin'), ShippingRateController.list);
router.get(
    '/shipping-rates/:id',
    authenticate,
    restrictTo('admin'),
    v({ params: ShippingRateIdParamSchema }),
    ShippingRateController.getDetail,
);
router.patch(
    '/shipping-rates/:id',
    authenticate,
    restrictTo('admin'),
    v({ params: ShippingRateIdParamSchema, body: UpdateShippingRateSchema }),
    ShippingRateController.update,
);

export default router;
