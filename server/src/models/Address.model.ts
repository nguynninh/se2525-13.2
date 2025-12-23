import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
    declare id: CreationOptional<string>;
    declare address_line: string;
    declare ward_id: string;

    static initModel(sequelize: Sequelize) {
        Address.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    allowNull: false,
                    defaultValue: DataTypes.UUIDV4,
                },
                address_line: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                ward_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'addresses',
                modelName: 'Address',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return Address;
    }
}

export default Address;
