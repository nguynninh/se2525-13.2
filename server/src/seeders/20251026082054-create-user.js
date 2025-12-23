'use strict';

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const [seller1Hash, seller2Hash, customer1Hash, customer2Hash] = await Promise.all([
            bcrypt.hash('Seller@123', SALT_ROUNDS),
            bcrypt.hash('Seller@123', SALT_ROUNDS),
            bcrypt.hash('User@123', SALT_ROUNDS),
            bcrypt.hash('User@123', SALT_ROUNDS),
        ]);
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    first_name: 'Alice',
                    last_name: 'Seller',
                    email: 'seller1@example.com',
                    password: seller1Hash,
                    role: 'seller',
                    profile_url: null,
                },
                {
                    first_name: 'Bob',
                    last_name: 'Seller',
                    email: 'seller2@example.com',
                    password: seller2Hash,
                    role: 'seller',
                    profile_url: null,
                },

                // Customers
                {
                    first_name: 'Charlie',
                    last_name: 'Customer',
                    email: 'customer1@example.com',
                    password: customer1Hash,
                    role: 'customer',
                    profile_url: null,
                },
                {
                    first_name: 'Daisy',
                    last_name: 'Customer',
                    email: 'customer2@example.com',
                    password: customer2Hash,
                    role: 'customer',
                    profile_url: null,
                },
            ],
            {},
        );
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
                    ],
                },
            },
            {},
        );
    },
};
