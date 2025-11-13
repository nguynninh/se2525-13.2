'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // 1. Lấy seller theo email
        const emails = ['seller1@example.com', 'seller2@example.com'];
        const sellers = await queryInterface.sequelize.query(
            `
            SELECT s.id AS seller_id, u.email
            FROM sellers s
            JOIN users u ON u.id = s.user_id
            WHERE u.email IN (:emails)
            `,
            { replacements: { emails }, type: Sequelize.QueryTypes.SELECT },
        );

        const byEmail = Object.fromEntries(sellers.map((r) => [r.email, r.seller_id]));

        if (!byEmail['seller1@example.com'] || !byEmail['seller2@example.com']) {
            throw new Error(
                'Không tìm thấy seller tương ứng với seller1@example.com hoặc seller2@example.com. Kiểm tra seed users/sellers trước.',
            );
        }

        // 2. Lấy address cho HÀ NỘI (Cầu Giấy) và HCM (Bến Thành)
        const addressRows = await queryInterface.sequelize.query(
            `
            SELECT
                a.id AS address_id,
                w.name AS ward_name,
                p.name AS province_name
            FROM addresses a
            JOIN wards w ON a.ward_id = w.id
            JOIN provinces p ON w.province_id = p.id
            WHERE
                (p.name = 'Hà Nội' AND w.name = 'Cầu Giấy')
                OR
                (p.name = 'Hồ Chí Minh' AND w.name = 'Bến Thành')
            `,
            { type: Sequelize.QueryTypes.SELECT },
        );

        const findAddressId = (provinceName, wardName) => {
            const row = addressRows.find((r) => r.province_name === provinceName && r.ward_name === wardName);
            if (!row) {
                throw new Error(
                    `Không tìm thấy address cho '${provinceName}|${wardName}' trong bảng addresses. ` +
                        'Đảm bảo seed addresses (Hà Nội: Cầu Giấy, HCM: Bến Thành) đã chạy trước.',
                );
            }
            return row.address_id;
        };

        const addressHanoiCauGiayId = findAddressId('Hà Nội', 'Cầu Giấy');
        const addressHcmBenThanhId = findAddressId('Hồ Chí Minh', 'Bến Thành');

        await queryInterface.bulkInsert(
            'shops',
            [
                {
                    seller_id: byEmail['seller1@example.com'],
                    name: 'Seller One Shop',
                    slug: 'seller-one-shop',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                    logo_url: null,
                    banner_url: null,
                    hotline: '0900001001',
                    status: 'active',
                    address_id: addressHanoiCauGiayId,
                    rating_avg: 0,
                    rating_count: 0,
                    created_at: now,
                    updated_at: now,
                },
                {
                    seller_id: byEmail['seller2@example.com'],
                    name: 'Seller Two Shop',
                    slug: 'seller-two-shop',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                    logo_url: null,
                    banner_url: null,
                    hotline: '0900001002',
                    status: 'active',
                    address_id: addressHcmBenThanhId,
                    rating_avg: 0,
                    rating_count: 0,
                    created_at: now,
                    updated_at: now,
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('shops', { slug: ['seller-one-shop', 'seller-two-shop'] }, {});
    },
};
