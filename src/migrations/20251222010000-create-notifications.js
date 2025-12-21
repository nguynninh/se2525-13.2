/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.ENUM('order', 'loyalty', 'system'),
                allowNull: false,
                defaultValue: 'system',
            },
            scope: {
                type: Sequelize.ENUM('personal', 'broadcast'),
                allowNull: false,
                defaultValue: 'personal',
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            data: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            read_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
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

        await queryInterface.addIndex('notifications', ['user_id']);
        await queryInterface.addIndex('notifications', ['type']);
        await queryInterface.addIndex('notifications', ['scope']);
        await queryInterface.addIndex('notifications', ['is_read']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('notifications');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notifications_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notifications_scope";');
    },
};
