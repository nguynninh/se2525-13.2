import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare shop_id: CreationOptional<ForeignKey<string> | null>;
    declare total_items: CreationOptional<number>;
    declare total_price: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Cart.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
                user_id: { type: DataTypes.UUID, allowNull: false },
                shop_id: { type: DataTypes.UUID, allowNull: true, defaultValue: null },
                total_items: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
                total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
                created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'carts',
                modelName: 'Cart',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return Cart;
    }
}

export default Cart;
