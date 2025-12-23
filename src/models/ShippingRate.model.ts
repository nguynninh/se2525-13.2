import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export type ShippingRateMethod = 'fast' | 'economy';

export class ShippingRate extends Model<InferAttributes<ShippingRate>, InferCreationAttributes<ShippingRate>> {
    declare id: number;
    declare same_province: boolean;
    declare shipping_method: ShippingRateMethod;
    declare fee: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ShippingRate.init(
            {
                id: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    primaryKey: true,
                },
                same_province: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                shipping_method: {
                    type: DataTypes.ENUM('fast', 'economy'),
                    allowNull: false,
                },
                fee: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
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
                tableName: 'shipping_rates',
                modelName: 'ShippingRate',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return ShippingRate;
    }
}

export default ShippingRate;
