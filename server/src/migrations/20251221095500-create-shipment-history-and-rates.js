'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shipping_rates', {
            id: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                primaryKey: true,
            },
            same_province: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            shipping_method: {
                type: Sequelize.ENUM('fast', 'economy'),
                allowNull: false,
            },
            fee: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
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

        await queryInterface.createTable('shipment_status_history', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            shipment_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'shipments', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            old_status: {
                type: Sequelize.ENUM(
                    'pending_pickup',
                    'in_transit',
                    'out_for_delivery',
                    'delivered',
                    'delivery_failed',
                    'returned',
                    'cancelled',
                ),
                allowNull: true,
            },
            new_status: {
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
            },
            event_time: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            source: {
                type: Sequelize.ENUM('system', 'manual'),
                allowNull: false,
                defaultValue: 'system',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            raw_payload: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_shipment_status_history_shipment_id ON shipment_status_history(shipment_id)`,
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_shipment_status_history_shipment_id`);
        await queryInterface.dropTable('shipment_status_history');
        await queryInterface.dropTable('shipping_rates');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shipment_status_history_old_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shipment_status_history_new_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shipment_status_history_source";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_shipping_rates_shipping_method";');
    },
};
