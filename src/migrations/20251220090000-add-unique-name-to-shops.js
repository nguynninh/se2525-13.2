'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('shops', ['name'], {
            name: 'uq_shops_name',
            unique: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('shops', 'uq_shops_name');
    },
};
