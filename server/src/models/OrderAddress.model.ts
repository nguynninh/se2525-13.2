import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export type OrderAddressType = 'shipping' | 'billing';

export class OrderAddress extends Model<InferAttributes<OrderAddress>, InferCreationAttributes<OrderAddress>> {
    declare id: CreationOptional<string>;
    declare order_id: string;
    declare type: CreationOptional<OrderAddressType>;
    declare receiver_name: string;
    declare receiver_phone: string;
    declare address_line: string;
    declare ward_id: string;

    static initModel(sequelize: Sequelize) {
        OrderAddress.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                order_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.ENUM('shipping', 'billing'),
                    allowNull: false,
                    defaultValue: 'shipping',
                },
                receiver_name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                receiver_phone: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
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
                tableName: 'order_addresses',
                modelName: 'OrderAddress',
                underscored: true,

                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
            },
        );

        return OrderAddress;
    }
}

export default OrderAddress;
