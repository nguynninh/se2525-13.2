import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { notificationController } from '../../../module/notification/notification.controller';

const router: Router = Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllRead);

export default router;