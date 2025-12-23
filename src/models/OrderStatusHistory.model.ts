import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';
import { OrderStatus } from './Order.model';

export type OrderStatusChangerRole = 'customer' | 'seller' | 'admin';

export class OrderStatusHistory extends Model<
    InferAttributes<OrderStatusHistory>,
    InferCreationAttributes<OrderStatusHistory>
> {
    declare id: CreationOptional<string>;
    declare order_id: ForeignKey<string>;
    declare old_status: CreationOptional<OrderStatus | null>;
    declare new_status: OrderStatus;
    declare changed_by_user_id: ForeignKey<string>;
    declare changed_by_role: OrderStatusChangerRole;
    declare reason: CreationOptional<string | null>;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        OrderStatusHistory.init(
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
                old_status: {
                    type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                    allowNull: true,
                    defaultValue: null,
                },
                new_status: {
                    type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled'),
                    allowNull: false,
                },
                changed_by_user_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                changed_by_role: {
                    type: DataTypes.ENUM('customer', 'seller', 'admin'),
                    allowNull: false,
                },
                reason: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: 'order_status_history',
                modelName: 'OrderStatusHistory',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            },
        );

        return OrderStatusHistory;
    }
}

export default OrderStatusHistory;
