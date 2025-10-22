import { Router } from 'express';
import {
    createUser,
    verifyUser,
    retrievedUser,
} from '../controllers/userController';
import { 
    validateCreateUser, 
    validateVerifyUser,
    validateUserId
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

router.get(
    '/:id',
    validateUserId,
    retrievedUser,
);

export default router; 
