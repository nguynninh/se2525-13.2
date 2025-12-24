'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('payments', 'payment_code', {
            type: Sequelize.STRING(30),
            allowNull: true,
        });

        await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX payments_payment_code_uq
      ON payments(payment_code)
      WHERE payment_code IS NOT NULL;
    `);

        await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX payments_transaction_code_uq
      ON payments(transaction_code)
      WHERE transaction_code IS NOT NULL;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS payments_payment_code_uq;
    `);

        await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS payments_transaction_code_uq;
    `);

        await queryInterface.removeColumn('payments', 'payment_code');
    },
};
