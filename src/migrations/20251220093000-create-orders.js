'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payment_methods', {
            id: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                primaryKey: true,
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
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.createTable('orders', {
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
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            shop_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'shops', key: 'id' },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            code: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            payment_method_id: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                references: { model: 'payment_methods', key: 'id' },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            payment_status: {
                type: Sequelize.ENUM('unpaid', 'paid', 'refunded', 'failed'),
                allowNull: false,
                defaultValue: 'unpaid',
            },
            shipping_method: {
                type: Sequelize.ENUM('fast', 'economy'),
                allowNull: false,
                defaultValue: 'economy',
            },
            item_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            subtotal_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            shipping_fee: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            discount_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            total_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            note: {
                type: Sequelize.TEXT,
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

        await queryInterface.createTable('order_items', {
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
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            product_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            sku_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            sku_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            line_discount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            line_total: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.createTable('order_status_history', {
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
            old_status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                allowNull: true,
            },
            new_status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                allowNull: false,
            },
            changed_by_user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            changed_by_role: {
                type: Sequelize.ENUM('customer', 'seller', 'admin'),
                allowNull: false,
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.createTable('payments', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: { model: 'orders', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            payment_method_id: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                references: { model: 'payment_methods', key: 'id' },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            status: {
                type: Sequelize.ENUM('pending', 'success', 'failed', 'refunded'),
                allowNull: false,
                defaultValue: 'pending',
            },
            amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            transaction_code: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            raw_payload: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            paid_at: {
                type: Sequelize.DATE,
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
                references: { model: 'orders', key: 'id' },
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
            ward_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'wards', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            address_line: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ix_orders_user_id ON orders(user_id)`);
        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ix_orders_shop_id ON orders(shop_id)`);
        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ix_orders_status ON orders(status)`);
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_orders_payment_status ON orders(payment_status)`,
        );
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items(order_id)`,
        );
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_items_product_id ON order_items(product_id)`,
        );
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_status_history_order_id ON order_status_history(order_id)`,
        );
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_status_history_changed_by ON order_status_history(changed_by_user_id)`,
        );
        await queryInterface.sequelize.query(
            `CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_order_id ON payments(order_id)`,
        );
        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ix_payments_status ON payments(status)`);
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_addresses_order_id ON order_addresses(order_id)`,
        );
        await queryInterface.sequelize.query(
            `CREATE INDEX IF NOT EXISTS ix_order_addresses_ward_id ON order_addresses(ward_id)`,
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_addresses_ward_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_addresses_order_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_payments_status`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ux_payments_order_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_status_history_changed_by`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_status_history_order_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_items_product_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_order_items_order_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_orders_payment_status`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_orders_status`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_orders_shop_id`);
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ix_orders_user_id`);
        await queryInterface.dropTable('order_addresses');
        await queryInterface.dropTable('payments');
        await queryInterface.dropTable('order_status_history');
        await queryInterface.dropTable('order_items');
        await queryInterface.dropTable('orders');
        await queryInterface.dropTable('payment_methods');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_orders_payment_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_status_history_old_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_status_history_new_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_status_history_changed_by_role";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_order_addresses_type";');
    },
};
