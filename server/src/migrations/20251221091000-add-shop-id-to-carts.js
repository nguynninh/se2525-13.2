'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('carts', 'shop_id', {
            type: Sequelize.UUID,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'shops',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Add index for shop_id
        await queryInterface.addIndex('carts', ['shop_id'], {
            name: 'carts_shop_id_index',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove index first
        await queryInterface.removeIndex('carts', 'carts_shop_id_index');
        
        // Remove column
        await queryInterface.removeColumn('carts', 'shop_id');
    },
};
