import { Router } from 'express';
import {
    login,
    loginSocial,
    resetPassword,
    forgotPassword,
} from '../controllers/authController';
import {
    validateLogin,
    validateLoginSocial,
    validateResetPassword,
    validateForgotPassword,
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
    '/reset-password',
    validateResetPassword,
    resetPassword,
);

router.post(
    '/forgot-password/verification',
    validateForgotPassword,
    forgotPassword,
);

export default router;
