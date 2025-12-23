'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['customer1@example.com', 'customer2@example.com', 'customer3@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });

        const idByEmail = Object.fromEntries(rows.map((r) => [r.email, r.id]));

        const existing = await queryInterface.sequelize.query(
            `SELECT user_id FROM customers WHERE user_id IN (:ids)`,
            { replacements: { ids: Object.values(idByEmail) }, type: Sequelize.QueryTypes.SELECT },
        );
        const existingIds = new Set(existing.map((r) => r.user_id));

        const customers = [
            {
                user_id: idByEmail['customer1@example.com'],
                loyalty_points: 100,
                created_at: now,
                updated_at: now,
            },
            {
                user_id: idByEmail['customer2@example.com'],
                loyalty_points: 50,
                created_at: now,
                updated_at: now,
            },
            {
                user_id: idByEmail['customer3@example.com'],
                loyalty_points: 150,
                created_at: now,
                updated_at: now,
            },
        ];

        const filtered = customers.filter((c) => c.user_id && !existingIds.has(c.user_id));

        if (filtered.length > 0) {
            await queryInterface.bulkInsert('customers', filtered, { ignoreDuplicates: true });
        }
    },

    async down(queryInterface, Sequelize) {
        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['customer1@example.com', 'customer2@example.com', 'customer3@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });
        const userIds = rows.map((r) => r.id);
        await queryInterface.bulkDelete('customers', { user_id: userIds }, {});
    },
};
