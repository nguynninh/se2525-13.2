'use strict';

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const [seller1Hash, seller2Hash, customer1Hash, customer2Hash, customer3Hash] = await Promise.all([
            bcrypt.hash('Seller@123', SALT_ROUNDS),
            bcrypt.hash('Seller@123', SALT_ROUNDS),
            bcrypt.hash('User@123', SALT_ROUNDS),
            bcrypt.hash('User@123', SALT_ROUNDS),
            bcrypt.hash('User@123', SALT_ROUNDS),
        ]);
        const targetEmails = [
            'seller1@example.com',
            'seller2@example.com',
            'customer1@example.com',
            'customer2@example.com',
            'customer3@example.com',
        ];

        const existing = await queryInterface.sequelize.query(
            `SELECT email FROM users WHERE email IN (:emails)`,
            { replacements: { emails: targetEmails }, type: Sequelize.QueryTypes.SELECT },
        );
        const existingEmails = new Set(existing.map((r) => r.email));

        const rows = [
            {
                first_name: 'Alice',
                last_name: 'Seller',
                email: 'seller1@example.com',
                password: seller1Hash,
                role: 'seller',
                phone: '1234567890',
                profile_url: null,
            },
            {
                first_name: 'Bob',
                last_name: 'Seller',
                email: 'seller2@example.com',
                password: seller2Hash,
                role: 'seller',
                phone: '0987654321',
                profile_url: null,
            },
            {
                first_name: 'Charlie',
                last_name: 'Customer',
                email: 'customer1@example.com',
                password: customer1Hash,
                role: 'customer',
                phone: '5551234567',
                profile_url: null,
            },
            {
                first_name: 'Daisy',
                last_name: 'Customer',
                email: 'customer2@example.com',
                password: customer2Hash,
                role: 'customer',
                phone: '5559876543',
                profile_url: null,
            },
            {
                first_name: 'Thomas',
                last_name: 'Customer',
                email: 'customer3@example.com',
                password: customer3Hash,
                role: 'customer',
                phone: '5556789123',
                profile_url: null,
            },
        ].filter((r) => !existingEmails.has(r.email));

        if (rows.length > 0) {
            await queryInterface.bulkInsert('users', rows, {});
        }
    },

    async down(queryInterface, Sequelize) {
        const { Op } = Sequelize;
        await queryInterface.bulkDelete(
            'users',
            {
                email: {
                    [Op.in]: [
                        'seller1@example.com',
                        'seller2@example.com',
                        'customer1@example.com',
                        'customer2@example.com',
                        'customer3@example.com',
                    ],
                },
            },
            {},
        );
    },
};
