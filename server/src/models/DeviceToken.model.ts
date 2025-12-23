import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export type DevicePlatform = 'android' | 'ios' | 'web';

export class DeviceToken extends Model<InferAttributes<DeviceToken>, InferCreationAttributes<DeviceToken>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare device_id: CreationOptional<string | null>;
    declare platform: DevicePlatform;
    declare push_token: string;
    declare app_version: CreationOptional<string | null>;
    declare os_version: CreationOptional<string | null>;
    declare is_active: CreationOptional<boolean>;
    declare last_used_at: CreationOptional<Date | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        DeviceToken.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                device_id: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    defaultValue: null,
                },
                platform: {
                    type: DataTypes.ENUM('android', 'ios', 'web'),
                    allowNull: false,
                },
                push_token: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                app_version: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    defaultValue: null,
                },
                os_version: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    defaultValue: null,
                },
                is_active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                last_used_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: DataTypes.NOW,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: 'device_tokens',
                modelName: 'DeviceToken',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return DeviceToken;
    }
}

export default DeviceToken;
