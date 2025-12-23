'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const adminHash = await bcrypt.hash('Admin@123', 10);
        const email = 'admin@example.com';

        const exists = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = :email LIMIT 1`,
            { replacements: { email }, type: Sequelize.QueryTypes.SELECT },
        );

        if (exists && exists.length > 0) {
            // admin already exists -> skip
            return;
        }

        await queryInterface.bulkInsert(
            'users',
            [
                {
                    first_name: 'System',
                    last_name: 'Admin',
                    email,
                    password: adminHash,
                    role: 'admin',
                    profile_url: null,
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
    },
};
