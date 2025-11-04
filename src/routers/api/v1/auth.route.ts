import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { authenticate, restrictTo } from '../../../middlewares/auth.middleware';
import { registerController } from '../../../module/auth/auth.controller';
import { v } from '../../../utils/zod.format';
import { RegisterStartSchema, RegisterResendSchema, RegisterFinalizeSchema } from '../../../module/auth/auth.schemas';

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
// router.post('/login', authController.login);

// // POST api/auth/social/:provider
// router.post('/social/:provider', checkProvider, authController.loginSocial);

// // POST api/auth/refresh
// router.post('/refresh', authController.refreshToken);

// // POST api/auth/logout
// router.post('/logout', authenticate, authController.logout);

// // GET api/auth/profile
// router.get('/profile', authenticate, authController.getProfile);

// // GET api/auth/admin
// router.get('/admin', authenticate, restrictTo('admin'), authController.adminDashboard);

// // GET api/auth/seller
// router.get('/seller', authenticate, restrictTo('seller'), authController.sellerDashboard);

export default router;
