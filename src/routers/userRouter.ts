import { Router } from 'express';
import {
    createUser,
} from '../controllers/userController';
import { valid } from 'joi';
import { validateCreateUser } from '../validation/validateUser';

const router = Router();

router.post(
    '/',
    validateCreateUser,
    createUser,
);

export default router;