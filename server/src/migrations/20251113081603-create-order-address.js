'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_addresses', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                // references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            type: {
                type: Sequelize.ENUM('shipping', 'billing'),
                allowNull: false,
                defaultValue: 'shipping',
            },
            receiver_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            receiver_phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
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
        });

        await queryInterface.addIndex('order_addresses', ['order_id'], { name: 'ix_order_addresses_order_id' });
        await queryInterface.addIndex('order_addresses', ['ward_id'], { name: 'ix_order_addresses_ward_id' });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('order_addresses', 'ix_order_addresses_ward_id');
        await queryInterface.removeIndex('order_addresses', 'ix_order_addresses_order_id');
        await queryInterface.dropTable('order_addresses');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_addresses_type";');
    },
};
