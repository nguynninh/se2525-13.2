import { Router } from 'express';
import {
    createUser,
    verifyUser,
} from '../controllers/userController';
import { 
    validateCreateUser, 
    validateVerifyUser
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

export default router;