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
} from '../../../module/sellerApplication/sellerApplication.schema';

const router = Router();

// POST /api/seller-applications
router.post('/', authenticate, v(CreateSellerApplicationSchema, 'user'), createSellerApplicationController);

// GET /api/seller-applications/me/latest
router.get('/me/latest', authenticate, getMyLatestSellerApplicationController);

// GET /api/seller-applications/admin/pending
router.get('/admin/pending', authenticate, restrictTo('admin'), listSellerPendingApplicationsController);

// GET /api/seller-applications/admin/history?status=approved|rejected
router.get('/admin/history', authenticate, restrictTo('admin'), listSellerHistoryApplicationsController);

// PATCH /api/seller-applications/admin/:id/review
router.patch(
    '/admin/:id/review',
    authenticate,
    restrictTo('admin'),
    v(ReviewSellerApplicationSchema, 'user'),
    reviewSellerApplicationController,
);

export default router;
