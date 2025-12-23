import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
    forgotPasswordController,
} from '../../../module/auth/auth.controller';
import { v } from '../../../utils/zod.format';
import {
    RegisterStartSchema,
    RegisterResendSchema,
    RegisterFinalizeSchema,
    LoginSchema,
    SocialLoginSchema,
    RefreshTokenSchema,
    ResetRequestSchema,
    ResetVerifySchema,
    ResetFinalizeSchema,
    ResetResendSchema,
} from '../../../module/auth/auth.schema';

const router = Router();

const allowedProviders = new Set(['google', 'facebook']);
const checkProvider = (req, res, next) => {
    const { provider } = req.params;
    if (!allowedProviders.has(provider)) {
        return res.status(400).json({ code: 400, message: 'auth:invalid_provider' });
    }
    next();
};

// POST api/auth/register
router.post('/register/start', v(RegisterStartSchema, 'auth'), registerController.start);
router.post('/register/resend', v(RegisterResendSchema, 'auth'), registerController.resend);
router.post('/register/finalize', v(RegisterFinalizeSchema, 'auth'), registerController.finalize);

// POST api/auth/login
router.post('/login', v(LoginSchema, 'auth'), loginController.login);
router.post('/login/social/:provider', checkProvider, v(SocialLoginSchema), loginController.socialLogin);

// POST api/auth/refresh
router.post('/refresh', v(RefreshTokenSchema), refreshTokenController.refresh);

// POST api/auth/reset
router.post('/reset/request', v(ResetRequestSchema, 'auth'), forgotPasswordController.request);
router.post('/reset/resend', v(ResetResendSchema, 'auth'), forgotPasswordController.resend);
router.post('/reset/verify', v(ResetVerifySchema, 'auth'), forgotPasswordController.verify);
router.post('/reset/finalize', v(ResetFinalizeSchema, 'auth'), forgotPasswordController.finalize);

// POST api/auth/logout
router.post('/logout', v(RefreshTokenSchema), logoutController.logoutOne);
router.post('/logout/all', authenticate, logoutController.logoutAll);

export default router;
