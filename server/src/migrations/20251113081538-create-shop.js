'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shops', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            seller_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'sellers', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },

            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            slug: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            logo_url: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            banner_url: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            hotline: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM('active', 'suspended', 'closed'),
                allowNull: false,
                defaultValue: 'active',
            },

            address_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'addresses', key: 'id' },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            },

            rating_avg: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false,
                defaultValue: 0,
            },
            rating_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        // Indexes
        await queryInterface.addIndex('shops', ['seller_id'], { name: 'ix_shops_seller_id' });
        await queryInterface.addIndex('shops', ['status'], { name: 'ix_shops_status' });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('shops', 'ix_shops_status');
        await queryInterface.removeIndex('shops', 'ix_shops_seller_id');
        await queryInterface.dropTable('shops');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shops_status";');
    },
};
