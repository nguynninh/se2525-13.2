/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const notifications = [
            {
                id: '11111111-1111-1111-1111-111111111111',
                user_id: '8b82a23f-c2a3-4dab-8915-7b84ea398aef', // sample user
                type: 'order',
                scope: 'personal',
                title: 'Đơn hàng của bạn đã được xác nhận',
                content: 'Shop đã xác nhận đơn hàng OD20251220-0001. Vui lòng theo dõi trạng thái giao hàng.',
                data: { order_code: 'OD20251220-0001', status: 'confirmed' },
                is_read: false,
                read_at: null,
                created_at: now,
                updated_at: now,
            },
            {
                id: '22222222-2222-2222-2222-222222222222',
                user_id: 'fc8ddfc7-3353-49a3-b49d-50afc47f500d', // sample user
                type: 'loyalty',
                scope: 'personal',
                title: 'Bạn được cộng 500 điểm thưởng',
                content: 'Cảm ơn bạn đã hoàn tất đơn hàng OD20251220-0002. 500 điểm loyalty đã được cộng.',
                data: { points: 500, reason: 'order_completed', order_code: 'OD20251220-0002' },
                is_read: false,
                read_at: null,
                created_at: now,
                updated_at: now,
            },
            {
                id: '33333333-3333-3333-3333-333333333333',
                user_id: '8b82a23f-c2a3-4dab-8915-7b84ea398aef',
                type: 'system',
                scope: 'broadcast',
                title: 'Chào mừng đến với Hiki Shop',
                content: 'Hiki Shop ra mắt nhiều ưu đãi hấp dẫn. Đừng bỏ lỡ!',
                data: { campaign: 'launch_2025' },
                is_read: false,
                read_at: null,
                created_at: now,
                updated_at: now,
            },
        ];

        await queryInterface.bulkInsert('notifications', notifications, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('notifications', null, {});
    },
};
