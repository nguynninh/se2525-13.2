'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['admin@example.com', 'admin2@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });

        const idByEmail = Object.fromEntries(rows.map((r) => [r.email, r.id]));

        const existing = await queryInterface.sequelize.query(
            `SELECT user_id FROM admins WHERE user_id IN (:ids)`,
            { replacements: { ids: Object.values(idByEmail) }, type: Sequelize.QueryTypes.SELECT },
        );
        const existingIds = new Set(existing.map((r) => r.user_id));

        const admins = [
            { user_id: idByEmail['admin@example.com'], created_at: now, updated_at: now },
            { user_id: idByEmail['admin2@example.com'], created_at: now, updated_at: now },
        ].filter((a) => a.user_id && !existingIds.has(a.user_id));

        if (admins.length > 0) {
            await queryInterface.bulkInsert('admins', admins, { ignoreDuplicates: true });
        }
    },

    async down(queryInterface, Sequelize) {
        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['admin@example.com', 'admin2@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });
        const userIds = rows.map((r) => r.id);
        await queryInterface.bulkDelete('admins', { user_id: userIds }, {});
    },
};
