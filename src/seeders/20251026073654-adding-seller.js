'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['seller1@example.com', 'seller2@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });

        const idByEmail = Object.fromEntries(rows.map((r) => [r.email, r.id]));

        const existing = await queryInterface.sequelize.query(
            `SELECT user_id FROM sellers WHERE user_id IN (:ids)`,
            { replacements: { ids: Object.values(idByEmail) }, type: Sequelize.QueryTypes.SELECT },
        );
        const existingIds = new Set(existing.map((r) => r.user_id));

        const sellers = [
            { user_id: idByEmail['seller1@example.com'], status: 'active', created_at: now, updated_at: now },
            { user_id: idByEmail['seller2@example.com'], status: 'suspended', created_at: now, updated_at: now },
        ].filter((s) => s.user_id && !existingIds.has(s.user_id));

        if (sellers.length > 0) {
            await queryInterface.bulkInsert('sellers', sellers, { ignoreDuplicates: true });
        }
    },

    async down(queryInterface, Sequelize) {
        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['seller1@example.com', 'seller2@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });
        const userIds = rows.map((r) => r.id);
        await queryInterface.bulkDelete('sellers', { user_id: userIds }, {});
    },
};
