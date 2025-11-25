import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;

    static initModel(sequelize: Sequelize) {
        Admin.init(
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
                    unique: true,
                },
            },
            {
                sequelize,
                tableName: 'admins',
                modelName: 'Admin',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Admin;
    }
}

export default Admin;
