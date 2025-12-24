import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export type NotificationType = 'order' | 'loyalty' | 'system';
export type NotificationScope = 'personal' | 'broadcast';

export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
    declare id: CreationOptional<string>;
    declare user_id: string;
    declare type: CreationOptional<NotificationType>;
    declare scope: CreationOptional<NotificationScope>;
    declare title: string;
    declare content: string;
    declare data: CreationOptional<any>;
    declare is_read: CreationOptional<boolean>;
    declare read_at: CreationOptional<Date | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Notification.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                user_id: { type: DataTypes.UUID, allowNull: false },
                type: { type: DataTypes.ENUM('order', 'loyalty', 'system'), allowNull: false, defaultValue: 'system' },
                scope: { type: DataTypes.ENUM('personal', 'broadcast'), allowNull: false, defaultValue: 'personal' },
                title: { type: DataTypes.STRING(255), allowNull: false },
                content: { type: DataTypes.TEXT, allowNull: false },
                data: { type: DataTypes.JSONB, allowNull: true },
                is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
                read_at: { type: DataTypes.DATE, allowNull: true },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'notifications',
                modelName: 'Notification',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return Notification;
    }
}

export default Notification;