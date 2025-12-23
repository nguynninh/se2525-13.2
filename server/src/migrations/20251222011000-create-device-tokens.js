/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('device_tokens', {
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
            device_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            platform: {
                type: Sequelize.ENUM('android', 'ios', 'web'),
                allowNull: false,
            },
            push_token: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            app_version: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            os_version: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            last_used_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

        await queryInterface.addIndex('device_tokens', ['user_id']);
        await queryInterface.addIndex('device_tokens', ['platform']);
        await queryInterface.addIndex('device_tokens', ['is_active']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('device_tokens');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_device_tokens_platform";');
    },
};
