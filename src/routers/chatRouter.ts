import { Router } from 'express';
import {
    internalChatAI
} from '../controllers/chatController';
import {
    validateInternalAI
} from '../validation/validateChat';

const router = Router();

router.post(
    '/internal-ai',
    validateInternalAI,
    internalChatAI
);

export default router;
