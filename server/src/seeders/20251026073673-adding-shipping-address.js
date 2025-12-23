'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Lấy user customers theo email
        const emails = ['customer1@example.com', 'customer2@example.com'];
        const users = await queryInterface.sequelize.query(
            `
            SELECT id, email
            FROM users
            WHERE email IN (:emails)
            `,
            { replacements: { emails }, type: Sequelize.QueryTypes.SELECT },
        );

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));

        if (!byEmail['customer1@example.com'] || !byEmail['customer2@example.com']) {
            throw new Error(
                "Không tìm thấy user với email 'customer1@example.com' hoặc 'customer2@example.com'. " +
                    'Đảm bảo seed users/customers đã chạy trước và dùng đúng email.',
            );
        }

        const addresses = await queryInterface.sequelize.query(
            `
            SELECT id, address_line
            FROM addresses
            ORDER BY created_at ASC
            LIMIT 4
            `,
            { type: Sequelize.QueryTypes.SELECT },
        );

        if (addresses.length < 4) {
            throw new Error(
                `Cần ít nhất 4 bản ghi trong bảng addresses để seed shipping_addresses, hiện chỉ có ${addresses.length}.`,
            );
        }

        const a1 = addresses[0]; // gán cho customer1 - default
        const a2 = addresses[1]; // gán cho customer1 - non-default
        const a3 = addresses[2]; // gán cho customer2 - default
        const a4 = addresses[3]; // gán cho customer2 - non-default

        await queryInterface.bulkInsert(
            'shipping_addresses',
            [
                // Customer 1: 2 địa chỉ
                {
                    user_id: byEmail['customer1@example.com'],
                    address_id: a1.id,
                    receiver_name: 'Nguyễn Văn A',
                    receiver_phone: '0901111001',
                    is_default: true, // default
                    created_at: now,
                    updated_at: now,
                },
                {
                    user_id: byEmail['customer1@example.com'],
                    address_id: a2.id,
                    receiver_name: 'Nguyễn Văn A (Cơ quan)',
                    receiver_phone: '0901111002',
                    is_default: false,
                    created_at: now,
                    updated_at: now,
                },

                // Customer 2: 2 địa chỉ
                {
                    user_id: byEmail['customer2@example.com'],
                    address_id: a3.id,
                    receiver_name: 'Trần Thị B',
                    receiver_phone: '0902222001',
                    is_default: true, // default
                    created_at: now,
                    updated_at: now,
                },
                {
                    user_id: byEmail['customer2@example.com'],
                    address_id: a4.id,
                    receiver_name: 'Trần Thị B (Nhà bố mẹ)',
                    receiver_phone: '0902222002',
                    is_default: false,
                    created_at: now,
                    updated_at: now,
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'shipping_addresses',
            {
                receiver_phone: ['0901111001', '0901111002', '0902222001', '0902222002'],
            },
            {},
        );
    },
};
