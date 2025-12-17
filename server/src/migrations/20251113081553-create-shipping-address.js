'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shipping_addresses', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            address_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'addresses', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            receiver_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            receiver_phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        await queryInterface.addIndex('shipping_addresses', ['user_id'], {
            name: 'ux_shipaddr_default_one_per_user',
            unique: true,
            where: { is_default: true },
        });

        await queryInterface.addIndex('shipping_addresses', ['user_id'], {
            name: 'ix_shipaddr_user',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('shipping_addresses', 'ix_shipaddr_user');
        await queryInterface.removeIndex('shipping_addresses', 'ux_shipaddr_default_one_per_user');
        await queryInterface.dropTable('shipping_addresses');
    },
};
