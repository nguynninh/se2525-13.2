'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('wards', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            province_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'provinces', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('wards');
    },
};
