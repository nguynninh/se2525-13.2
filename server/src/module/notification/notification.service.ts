import Notification from '../../models/Notification.model';

export const notificationService = {
    async getMyNotifications(userId: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const { rows, count } = await Notification.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit,
            offset
        });
        return {
            notifications: rows,
            pagination: {
                total: count,
                page,
                limit,
                total_pages: Math.ceil(count / limit)
            }
        };
    },

    async markAsRead(notificationId: string, userId: string) {
        const notify = await Notification.findOne({
            where: { id: notificationId, user_id: userId }
        });
        if (!notify) throw new Error('notification:not_found');

        return await notify.update({ 
            is_read: true, 
            read_at: new Date() 
        });
    },

    async markAllAsRead(userId: string) {
        return await Notification.update(
            { is_read: true, read_at: new Date() },
            { where: { user_id: userId, is_read: false } }
        );
    },

    async createNotification(payload: {
        userId: string;
        title: string;
        content: string;
        type: 'order' | 'loyalty' | 'system';
        data?: any;
    }) {
        return await Notification.create({
            user_id: payload.userId,
            title: payload.title,
            content: payload.content,
            type: payload.type,
            data: payload.data,
            scope: 'personal'
        });
    }
};