import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class ProductVariantOption extends Model<InferAttributes<ProductVariantOption>, InferCreationAttributes<ProductVariantOption>> {
    declare id: CreationOptional<string>;
    declare variant_id: ForeignKey<string>;
    declare value: string;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ProductVariantOption.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                variant_id: { type: DataTypes.UUID, allowNull: false },
                value: { type: DataTypes.STRING(255), allowNull: false },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'product_variant_options',
                modelName: 'ProductVariantOption',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            }
        );
        return ProductVariantOption;
    }
}

export default ProductVariantOption;