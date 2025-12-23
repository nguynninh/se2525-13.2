import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
    declare id: CreationOptional<string>;
    declare order_id: ForeignKey<string>;
    declare product_id: string;
    declare product_name: string;
    declare sku_id: CreationOptional<string | null>;
    declare sku_name: CreationOptional<string | null>;
    declare quantity: number;
    declare unit_price: number;
    declare line_discount: CreationOptional<number>;
    declare line_total: number;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        OrderItem.init(
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
                product_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                product_name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                sku_id: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    defaultValue: null,
                },
                sku_name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    defaultValue: null,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                unit_price: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                },
                line_discount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                line_total: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: 'order_items',
                modelName: 'OrderItem',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            },
        );

        return OrderItem;
    }
}

export default OrderItem;
