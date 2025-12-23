'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('seller_applications', {
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
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            status: {
                type: Sequelize.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
            },
            reviewed_by: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' } },

            accepted_terms: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            rejection_reason: { type: Sequelize.TEXT, allowNull: true },
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

        await queryInterface.addIndex('seller_applications', ['user_id'], {
            name: 'ux_seller_applications_user_pending',
            unique: true,
            where: { status: 'pending' },
        });

        await queryInterface.sequelize.query(`
      ALTER TABLE seller_applications
      ADD CONSTRAINT ck_rejection_reason_required
        CHECK (status <> 'rejected' OR rejection_reason IS NOT NULL),
      ADD CONSTRAINT ck_rejection_reason_only_when_rejected
        CHECK (status = 'rejected' OR rejection_reason IS NULL);
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('seller_applications', 'ux_seller_applications_user_pending');
        await queryInterface.dropTable('seller_applications');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_seller_applications_status";');
    },
};
