import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Province extends Model<InferAttributes<Province>, InferCreationAttributes<Province>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;

    static initModel(sequelize: Sequelize) {
        Province.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                code: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'provinces',
                modelName: 'Province',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Province;
    }
}

export default Province;
