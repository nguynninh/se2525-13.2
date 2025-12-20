'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Ensure gen_random_uuid is available (Postgres)
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

        await queryInterface.changeColumn('favorite_shops', 'id', {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
        });

        await queryInterface.changeColumn('favorite_items', 'id', {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('favorite_shops', 'id', {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
        });

        await queryInterface.changeColumn('favorite_items', 'id', {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
        });
    },
};
