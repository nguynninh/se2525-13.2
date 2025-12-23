import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { v } from '../../../utils/zod.format';

import {
    getMeController,
    updateMeController,
    changePasswordController,
    updateAvatarController,
    deleteMeController,
} from '../../../module/user/user.controller';

import { UpdateMeSchema, ChangePasswordSchema } from '../../../module/user/user.schema';
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

export default router;
