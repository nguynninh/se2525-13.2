import { Router } from 'express';
import {
    login,
    loginSocial,
    forgotPasswordVerification,
    resetPassword,
} from '../controllers/authController';
import {
    validateLogin,
    validateLoginSocial,
    validateForgotPasswordVerification,
    validateResetPassword,
} from '../validation/validateAuth';

const router = Router();

router.post(
    '/login', 
    validateLogin,
    login
);

router.post(
    '/login/:provider/social',
    validateLoginSocial,
    loginSocial,
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

export default router;
