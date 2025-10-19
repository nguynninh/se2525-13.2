import { Router } from 'express';
import {
    login,
    loginSocial,
} from '../controllers/authController';
import {
    validateLogin,
    validateLoginSocial,
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

export default router;