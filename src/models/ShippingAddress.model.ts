import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Address from './Address.model';

export class ShippingAddress extends Model<InferAttributes<ShippingAddress>, InferCreationAttributes<ShippingAddress>> {
    declare id: CreationOptional<string>;
    declare user_id: string;
    declare address_id: string;
    declare receiver_name: string;
    declare receiver_phone: string;
    declare is_default: CreationOptional<boolean>;
    declare address?: Address;

    static initModel(sequelize: Sequelize) {
        ShippingAddress.init(
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
                address_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                receiver_name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                receiver_phone: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                is_default: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                tableName: 'shipping_addresses',
                modelName: 'ShippingAddress',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return ShippingAddress;
    }
}

export default ShippingAddress;
