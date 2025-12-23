import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare loyalty_points: CreationOptional<number>;

    static initModel(sequelize: Sequelize) {
        Customer.init(
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
                    unique: true,
                },
                loyalty_points: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: 'customers',
                modelName: 'Customer',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Customer;
    }
}

export default Customer;
