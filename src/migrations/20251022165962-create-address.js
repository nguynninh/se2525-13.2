'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('addresses', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            address_line: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            ward_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'wards', key: 'id' },
                onDelete: 'RESTRICT',
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

        await queryInterface.addIndex('addresses', ['ward_id'], {
            name: 'ix_addresses_ward_id',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('addresses', 'ix_addresses_ward_id');
        await queryInterface.dropTable('addresses');
    },
};
