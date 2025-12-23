import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export type ProductStatus = 'draft' | 'active' | 'hidden' | 'banned';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
    declare id: CreationOptional<string>;
    declare shop_id: ForeignKey<string>;
    declare category_id: ForeignKey<string>;
    declare name: string;
    declare slug: string;
    declare sku: CreationOptional<string | null>;
    declare description: CreationOptional<string | null>;
    declare status: CreationOptional<ProductStatus>;
    declare price: number;
    declare quantity: number;
    declare sold_count: CreationOptional<number>;
    declare rating_avg: CreationOptional<number>;
    declare rating_count: CreationOptional<number>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Product.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                shop_id: { type: DataTypes.UUID, allowNull: false },
                category_id: { type: DataTypes.UUID, allowNull: false },
                name: { type: DataTypes.STRING(255), allowNull: false },
                slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                sku: { type: DataTypes.STRING(100), unique: true, allowNull: true },
                description: { type: DataTypes.TEXT, allowNull: true },
                status: {
                    type: DataTypes.ENUM('draft', 'active', 'hidden', 'banned'),
                    defaultValue: 'draft',
                },
                price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
                quantity: { type: DataTypes.INTEGER, allowNull: false },
                sold_count: { type: DataTypes.INTEGER, defaultValue: 0 },
                rating_avg: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
                rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'products',
                modelName: 'Product',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return Product;
    }
}

export default Product;