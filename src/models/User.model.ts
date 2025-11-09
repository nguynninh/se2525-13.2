import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export type UserRole = 'customer' | 'seller' | 'admin';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare password: string;
    declare role: CreationOptional<UserRole>;
    declare profile_url: CreationOptional<string | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
                first_name: { type: DataTypes.STRING(255), allowNull: false },
                last_name: { type: DataTypes.STRING(255), allowNull: false },
                email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                password: { type: DataTypes.STRING(255), allowNull: false },
                role: {
                    type: DataTypes.ENUM('customer', 'seller', 'admin'),
                    allowNull: false,
                    defaultValue: 'customer',
                },
                profile_url: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
                created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'users',
                modelName: 'User',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return User;
    }

    static associate(models: any) {
        // User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    }
}

export default User;
