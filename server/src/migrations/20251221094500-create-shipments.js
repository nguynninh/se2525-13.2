'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shipments', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            tracking_code: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM(
                    'pending_pickup',
                    'in_transit',
                    'out_for_delivery',
                    'delivered',
                    'delivery_failed',
                    'returned',
                    'cancelled',
                ),
                allowNull: false,
                defaultValue: 'pending_pickup',
            },
            fee: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            cod_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            shipped_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            delivered_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            estimated_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
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

        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ix_shipments_order_id ON shipments(order_id)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_shipments_order_id`);
        await queryInterface.dropTable('shipments');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shipments_status";');
    },
};
