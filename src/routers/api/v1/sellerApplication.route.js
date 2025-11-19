import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';

import {
    createSellerApplicationController,
    getMyLatestSellerApplicationController,
    listSellerPendingApplicationsController,
    listSellerHistoryApplicationsController,
    reviewSellerApplicationController,
} from '../../../module/sellerApplication/sellerApplication.controller';

import {
    CreateSellerApplicationSchema,
    ReviewSellerApplicationSchema,
    HistoryQuerySchema,
} from '../../../module/sellerApplication/sellerApplication.schema';

const router = Router();

// POST /api/seller-applications
router.post('/', authenticate, v(CreateSellerApplicationSchema, 'user'), createSellerApplicationController);

// GET /api/seller-applications/me/latest
router.get('/me/latest', authenticate, getMyLatestSellerApplicationController);

// GET /api/admin/seller-applications/pending
router.get(
    '/admin/seller-applications/pending',
    authenticate,
    restrictTo('admin'),
    listSellerPendingApplicationsController,
);

// GET /api/admin/seller-applications/history?status=approved|rejected
router.get(
    '/admin/seller-applications/history',
    authenticate,
    restrictTo('admin'),
    v(HistoryQuerySchema, 'user'),
    listSellerHistoryApplicationsController,
);

// PATCH /api/admin/seller-applications/:id/review
router.patch(
    '/admin/seller-applications/:id/review',
    authenticate,
    restrictTo('admin'),
    v(ReviewSellerApplicationSchema, 'user'),
    reviewSellerApplicationController,
);

export default router;
