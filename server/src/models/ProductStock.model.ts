import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class ProductStock extends Model<InferAttributes<ProductStock>, InferCreationAttributes<ProductStock>> {
    declare id: CreationOptional<string>;
    declare product_id: ForeignKey<string>;
    declare option_ids: string;
    declare sku: CreationOptional<string | null>;
    declare price: number;
    declare quantity: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ProductStock.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                product_id: { type: DataTypes.UUID, allowNull: false },
                option_ids: { type: DataTypes.TEXT, allowNull: false },
                sku: { type: DataTypes.STRING(100), allowNull: true },
                price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
                quantity: { type: DataTypes.INTEGER, allowNull: false },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'product_stocks',
                modelName: 'ProductStock',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return ProductStock;
    }
}

export default ProductStock;