'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('shops', 'is_featured', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.addIndex('shops', ['is_featured'], { name: 'ix_shops_is_featured' });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('shops', 'ix_shops_is_featured');
        await queryInterface.removeColumn('shops', 'is_featured');
    },
};
