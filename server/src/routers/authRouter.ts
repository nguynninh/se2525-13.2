import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateLogin } from '../validation/validateLogin';

const router = Router();

router.post(
    '/login', 
    validateLogin,
    login
);

export default router;