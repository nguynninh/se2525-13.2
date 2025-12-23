import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';
import { PaymentStatus } from './Order.model';

export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
    declare id: CreationOptional<string>;
    declare order_id: ForeignKey<string>;
    declare payment_method_id: ForeignKey<number>;
    declare status: CreationOptional<PaymentStatus>;
    declare amount: number;
    declare transaction_code: CreationOptional<string | null>;
    declare raw_payload: CreationOptional<object | null>;
    declare paid_at: CreationOptional<Date | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Payment.init(
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
                payment_method_id: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
                    allowNull: false,
                    defaultValue: 'pending',
                },
                amount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                },
                transaction_code: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    defaultValue: null,
                },
                raw_payload: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: null,
                },
                paid_at: {
                    type: DataTypes.DATE,
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
                tableName: 'payments',
                modelName: 'Payment',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return Payment;
    }
}

export default Payment;
