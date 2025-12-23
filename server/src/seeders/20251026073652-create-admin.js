'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const adminHash = await bcrypt.hash('Admin@123', 10);

        await queryInterface.bulkInsert(
            'users',
            [
                {
                    first_name: 'System',
                    last_name: 'Admin',
                    email: 'admin@example.com',
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
