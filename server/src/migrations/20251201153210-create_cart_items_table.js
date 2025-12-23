'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('cart_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            cart_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            unit_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            total_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });

        // Add indexes
        await queryInterface.addIndex('cart_items', ['cart_id'], {
            name: 'cart_items_cart_id_idx',
        });

        await queryInterface.addIndex('cart_items', ['product_id'], {
            name: 'cart_items_product_id_idx',
        });

        // Add unique constraint for cart_id and product_id combination
        await queryInterface.addIndex('cart_items', ['cart_id', 'product_id'], {
            unique: true,
            name: 'cart_items_cart_product_unique',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('cart_items');
    },
};
