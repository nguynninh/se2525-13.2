import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';

import {
    listProvincesController,
    listWardsByProvinceController,
    listMyShippingAddressesController,
    createMyShippingAddressController,
    updateMyShippingAddressController,
    deleteMyShippingAddressController,
    setDefaultMyShippingAddressController,
} from '../../../module/location/location.controller';

import {
    CreateShippingAddressSchema,
    UpdateShippingAddressSchema,
    ProvinceIdParamSchema,
} from '../../../module/location/location.schema';

const router = Router();

// GET /api/location/provinces
router.get('/location/provinces', listProvincesController);

// GET /api/location/provinces/:provinceId/wards
router.get(
    '/location/provinces/:provinceId/wards',
    v(ProvinceIdParamSchema, 'shipping'),
    listWardsByProvinceController,
);

// GET /api/user/me/shipping-addresses
router.get('/user/me/shipping-addresses', authenticate, listMyShippingAddressesController);

// POST /api/user/me/shipping-addresses
router.post(
    '/user/me/shipping-addresses',
    authenticate,
    v(CreateShippingAddressSchema, 'shipping'),
    createMyShippingAddressController,
);

// PATCH /api/user/me/shipping-addresses/:id
router.patch(
    '/user/me/shipping-addresses/:id',
    authenticate,
    v(UpdateShippingAddressSchema, 'shipping'),
    updateMyShippingAddressController,
);

// DELETE /api/user/me/shipping-addresses/:id
router.delete('/user/me/shipping-addresses/:id', authenticate, deleteMyShippingAddressController);

// PATCH /api/user/me/shipping-addresses/:id/default
router.patch('/user/me/shipping-addresses/:id/default', authenticate, setDefaultMyShippingAddressController);

export default router;
