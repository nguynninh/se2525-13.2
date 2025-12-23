import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class ProductReview extends Model<InferAttributes<ProductReview>, InferCreationAttributes<ProductReview>> {
    declare id: CreationOptional<string>;
    declare product_id: ForeignKey<string>;
    declare user_id: ForeignKey<string>;
    declare rating: number;
    declare comment: CreationOptional<string | null>;
    declare images: CreationOptional<string | null>;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ProductReview.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                product_id: { type: DataTypes.UUID, allowNull: false },
                user_id: { type: DataTypes.UUID, allowNull: false },
                rating: { type: DataTypes.INTEGER, allowNull: false },
                comment: { type: DataTypes.TEXT, allowNull: true },
                images: { type: DataTypes.TEXT, allowNull: true },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'product_reviews',
                modelName: 'ProductReview',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            }
        );
        return ProductReview;
    }
}

export default ProductReview;