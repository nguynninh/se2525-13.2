'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const adminHash = await bcrypt.hash('Admin@123', 10);
        const admins = [
            { email: 'admin@example.com', first_name: 'System', last_name: 'Admin', password: adminHash },
            { email: 'admin2@example.com', first_name: 'System', last_name: 'Admin2', password: adminHash },
        ];

        const existing = await queryInterface.sequelize.query(
            `SELECT email FROM users WHERE email IN (:emails)`,
            { replacements: { emails: admins.map((a) => a.email) }, type: Sequelize.QueryTypes.SELECT },
        );
        const existingEmails = new Set(existing.map((r) => r.email));

        const rows = admins
            .filter((a) => !existingEmails.has(a.email))
            .map((a) => ({
                first_name: a.first_name,
                last_name: a.last_name,
                email: a.email,
                password: a.password,
                role: 'admin',
                profile_url: null,
                created_at: now,
                updated_at: now,
            }));

        if (rows.length > 0) {
            await queryInterface.bulkInsert('users', rows, {});
        }
    },

    async down(queryInterface, Sequelize) {
        const { Op } = Sequelize;
        await queryInterface.bulkDelete(
            'users',
            { email: { [Op.in]: ['admin@example.com', 'admin2@example.com'] } },
            {},
        );
    },
};
