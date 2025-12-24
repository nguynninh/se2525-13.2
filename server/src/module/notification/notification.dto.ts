export interface NotificationDto {
    id: string;
    user_id: string;
    type: 'order' | 'loyalty' | 'system';
    scope: 'personal' | 'broadcast';
    title: string;
    content: string;
    data?: any;
    is_read: boolean;
    read_at?: Date | null;
    created_at: Date;
}

export interface NotificationListResponseDto {
    notifications: NotificationDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}