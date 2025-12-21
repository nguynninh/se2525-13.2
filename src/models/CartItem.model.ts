import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
    declare id: CreationOptional<string>;
    declare cart_id: ForeignKey<string>;
    declare product_id: ForeignKey<string>;
    declare quantity: number;
    declare unit_price: number;
    declare total_price: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        CartItem.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
                cart_id: { type: DataTypes.UUID, allowNull: false },
                product_id: { type: DataTypes.UUID, allowNull: false },
                quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
                unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
                total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
                created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'cart_items',
                modelName: 'CartItem',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return CartItem;
    }
}

export default CartItem;
