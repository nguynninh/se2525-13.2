import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';
export type ShippingMethod = 'fast' | 'economy';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare shop_id: ForeignKey<string>;
    declare code: string;
    declare status: CreationOptional<OrderStatus>;
    declare payment_method_id: ForeignKey<number>;
    declare payment_status: CreationOptional<PaymentStatus>;
    declare shipping_method: CreationOptional<ShippingMethod>;
    declare item_count: CreationOptional<number>;
    declare subtotal_amount: CreationOptional<number>;
    declare shipping_fee: CreationOptional<number>;
    declare discount_amount: CreationOptional<number>;
    declare total_amount: CreationOptional<number>;
    declare note: CreationOptional<string | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Order.init(
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
                shop_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                    unique: true,
                },
                status: {
                    type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                    allowNull: false,
                    defaultValue: 'pending',
                },
                payment_method_id: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                },
                payment_status: {
                    type: DataTypes.ENUM('unpaid', 'paid', 'refunded', 'failed'),
                    allowNull: false,
                    defaultValue: 'unpaid',
                },
                shipping_method: {
                    type: DataTypes.ENUM('fast', 'economy'),
                    allowNull: false,
                    defaultValue: 'economy',
                },
                item_count: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                subtotal_amount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                shipping_fee: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                discount_amount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                total_amount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                note: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
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
                tableName: 'orders',
                modelName: 'Order',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return Order;
    }
}

export default Order;
