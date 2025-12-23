import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class PaymentMethod extends Model<InferAttributes<PaymentMethod>, InferCreationAttributes<PaymentMethod>> {
    declare id: number;
    declare code: string;
    declare name: string;
    declare is_active: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        PaymentMethod.init(
            {
                id: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    primaryKey: true,
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
                is_active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
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
                tableName: 'payment_methods',
                modelName: 'PaymentMethod',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return PaymentMethod;
    }
}

export default PaymentMethod;
