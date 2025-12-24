import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { redisCache } from '../../../middlewares/redisCache';
import { v } from '../../../utils/zod.format';
import {
    publicShopController,
    sellerShopController,
    favoriteShopController,
    adminShopController,
} from '../../../module/shop/shop.controller';
import {
    ShopListQuerySchema,
    ShopSlugParamSchema,
    CreateSellerShopSchema,
    UpdateSellerShopSchema,
    UpdateSellerShopStatusSchema,
    FavoriteShopIdParamSchema,
    FavoriteShopListQuerySchema,
    AdminShopListQuerySchema,
    AdminUpdateShopStatusSchema,
    ShopIdParamSchema,
} from '../../../module/shop/shop.schema';
import { z } from 'zod';
import { createImageUploadMiddleware } from '../../../utils/upload';

const router = Router();
const uploadShopImages = createImageUploadMiddleware(5);

// GET /api/shop/public
router.get('/public', redisCache(300), v({ query: ShopListQuerySchema }), publicShopController.list);
// GET /api/shop/public/:slug
router.get('/public/:slug', redisCache(300), v({ params: ShopSlugParamSchema }), publicShopController.detail);

router.get('/me', authenticate, restrictTo('seller'), sellerShopController.getMine);

router.post(
    '/me',
    authenticate,
    restrictTo('seller'),
    uploadShopImages.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]),
    v({ body: CreateSellerShopSchema }),
    sellerShopController.create,
);
router.patch(
    '/me',
    authenticate,
    restrictTo('seller'),
    uploadShopImages.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]),
    v({ body: UpdateSellerShopSchema }),
    sellerShopController.update,
);
router.patch(
    '/me/status',
    authenticate,
    restrictTo('seller'),
    v({ body: UpdateSellerShopStatusSchema }),
    sellerShopController.updateStatus,
);

// GET /api/shop/favorites
router.get(
    '/favorites',
    authenticate,
    restrictTo('customer', 'seller'),
    v({ query: FavoriteShopListQuerySchema }),
    favoriteShopController.listMine,
);
// POST /api/shop/favorites
router.post(
    '/favorites',
    authenticate,
    restrictTo('customer', 'seller'),
    v({ body: z.object({ shop_id: z.string().uuid() }) }),
    favoriteShopController.add,
);
// DELETE /api/shop/favorites/:shopId
router.delete(
    '/favorites/:shopId',
    authenticate,
    restrictTo('customer', 'seller'),
    v({ params: FavoriteShopIdParamSchema }),
    favoriteShopController.remove,
);

// GET /api/shop/admin
router.get(
    '/admin',
    authenticate,
    restrictTo('admin'),
    v({ query: AdminShopListQuerySchema }),
    adminShopController.list,
);
// GET /api/shop/admin/featured
router.get('/admin/featured', authenticate, restrictTo('admin'), redisCache(600), adminShopController.listFeatured);
// GET /api/shop/admin/:id
router.get(
    '/admin/:id',
    authenticate,
    restrictTo('admin'),
    v({ params: ShopIdParamSchema }),
    adminShopController.detail,
);
// PATCH /api/shop/admin/:id/status
router.patch(
    '/admin/:id/status',
    authenticate,
    restrictTo('admin'),
    v({ params: ShopIdParamSchema, body: AdminUpdateShopStatusSchema }),
    adminShopController.updateStatus,
);
// PATCH /api/shop/admin/:id/feature
router.patch(
    '/admin/:id/feature',
    authenticate,
    restrictTo('admin'),
    v({ params: ShopIdParamSchema, body: z.object({ is_featured: z.boolean() }) }),
    adminShopController.updateFeature,
);
// DELETE /api/shop/admin/:id
router.delete(
    '/admin/:id',
    authenticate,
    restrictTo('admin'),
    v({ params: ShopIdParamSchema }),
    adminShopController.delete,
);

export default router;
