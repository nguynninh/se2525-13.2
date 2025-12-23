import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';

import {
    getMeController,
    updateMeController,
    changePasswordController,
    updateAvatarController,
    deleteMeController,
    adminListUsersController,
    adminGetUserFullDetailController,
    adminUpdateSellerStatusController,
    adminDeleteSellerController,
    adminDeleteUserController,
    getSellerMeController,
} from '../../../module/user/user.controller';

import { UpdateMeSchema, ChangePasswordSchema, AdminUpdateSellerStatusSchema } from '../../../module/user/user.schema';
import { createImageUploadMiddleware } from '../../../utils/upload';

const router = Router();
const uploadAvatar = createImageUploadMiddleware(5);

// GET /api/user/me
router.get('/me', authenticate, getMeController);

// PATCH /api/user/me
router.patch('/me', authenticate, v(UpdateMeSchema, 'user'), updateMeController);

// PATCH /api/user/me/password
router.patch('/me/password', authenticate, v(ChangePasswordSchema, 'user'), changePasswordController);

// PATCH /api/user/me/avatar
router.patch('/me/avatar', authenticate, uploadAvatar.single('avatar'), updateAvatarController);

// DELETE /api/user/me
router.delete('/me', authenticate, deleteMeController);

// GET /api/user/seller/me
router.get('/seller/me', authenticate, getSellerMeController);

// GET /api/user/admin/sellers
// router.get('/admin/sellers', authenticate, restrictTo('admin'), adminListSellersController);

// GET /api/user/admin/users?role=customer|seller|admin&search=...
router.get('/admin/users', authenticate, restrictTo('admin'), adminListUsersController);

// GET /api/user/admin/users/:id
router.get('/admin/users/:id', authenticate, restrictTo('admin'), adminGetUserFullDetailController);

// PATCH /api/user/admin/sellers/:id/status
router.patch(
    '/admin/sellers/:id/status',
    authenticate,
    v(AdminUpdateSellerStatusSchema, 'user'),
    restrictTo('admin'),
    adminUpdateSellerStatusController,
);

// DELETE /api/user/admin/sellers/:id
router.delete('/admin/sellers/:id', authenticate, restrictTo('admin'), adminDeleteSellerController);

// DELETE /api/user/admin/users/:id
router.delete('/admin/users/:id', authenticate, restrictTo('admin'), adminDeleteUserController);
export default router;
