'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS seller_applications_archive
      (LIKE seller_applications INCLUDING DEFAULTS INCLUDING CONSTRAINTS EXCLUDING INDEXES);
    `);

        await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS ix_app_archive_updated_at
        ON seller_applications_archive(updated_at);
    `);
        await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS ix_app_archive_user
        ON seller_applications_archive(user_id);
    `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS seller_applications_archive;`);
    },
};
