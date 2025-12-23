import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

export type UserRole = 'customer' | 'seller' | 'admin';

export interface UserAttributes {
    id: string; // UUID
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
    profile_url?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

// Cho phép bỏ qua các trường tùy chọn khi khởi tạo User, nên có defaultValue
export type UserCreationAttributes = Optional<
    UserAttributes,
    'id' | 'profile_url' | 'created_at' | 'updated_at' | 'role'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    public profile_url?: string | null;
    public created_at?: Date;
    public updated_at?: Date;

    static initModel(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
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
