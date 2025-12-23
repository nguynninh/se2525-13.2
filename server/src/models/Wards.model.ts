import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Ward extends Model<InferAttributes<Ward>, InferCreationAttributes<Ward>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;
    declare province_id: string;

    static initModel(sequelize: Sequelize) {
        Ward.init(
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
                province_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'wards',
                modelName: 'Ward',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Ward;
    }
}

export default Ward;
