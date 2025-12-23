import { Request, Response, NextFunction } from 'express';
import response from '../../utils/response';
import { notificationService } from './notification.service';

export const notificationController = {
    async getMyNotifications(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const result = await notificationService.getMyNotifications(userId, page, limit);
            return response.ok(res, result, 'notification:list_success');
        } catch (err) {
            next(err);
        }
    },

    async markAsRead(req: any, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await notificationService.markAsRead(id, userId);
            return response.ok(res, null, 'notification:marked_read');
        } catch (err) {
            next(err);
        }
    },

    async markAllRead(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            await notificationService.markAllAsRead(userId);
            return response.ok(res, null, 'notification:all_marked_read');
        } catch (err) {
            next(err);
        }
    }
};