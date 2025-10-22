import { Router } from 'express';
import {
    createUser,
    verifyUser,
    retrievedUser,
    forgotPasswordVerification,
    resetPassword,
} from '../controllers/userController';
import {
    validateCreateUser,
    validateVerifyUser,
    validateUserId,
    validateForgotPasswordVerification,
    validateResetPassword,
} from '../validation/validateUser';

const router = Router();

router.post(
    '/',
    validateCreateUser,
    createUser,
);

router.post(
    '/verification',
    validateVerifyUser,
    verifyUser,
);

router.post(
    '/forgot-password/verification',
    validateForgotPasswordVerification,
    forgotPasswordVerification,
);

router.post(
    '/reset-password',
    validateResetPassword,
    resetPassword,
);

router.get(
    '/:id',
    validateUserId,
    retrievedUser,
);

export default router;
