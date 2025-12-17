'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['admin@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });

        const idByEmail = Object.fromEntries(rows.map((r) => [r.email, r.id]));

        const admins = [{ user_id: idByEmail['admin@example.com'], created_at: now, updated_at: now }];

        await queryInterface.bulkInsert('admins', admins, {});
    },

    async down(queryInterface, Sequelize) {
        const rows = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: ['admin@example.com'] },
            type: Sequelize.QueryTypes.SELECT,
        });
        const userIds = rows.map((r) => r.id);
        await queryInterface.bulkDelete('admins', { user_id: userIds }, {});
    },
};
