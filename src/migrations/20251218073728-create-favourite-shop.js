'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('favorite_shops', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            shop_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'shops',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
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

        await queryInterface.addConstraint('favorite_shops', {
            fields: ['user_id', 'shop_id'],
            type: 'unique',
            name: 'favorite_shops_user_id_shop_id_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('favorite_shops');
    },
};
