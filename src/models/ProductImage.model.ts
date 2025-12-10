import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class ProductImage extends Model<InferAttributes<ProductImage>, InferCreationAttributes<ProductImage>> {
    declare id: CreationOptional<string>;
    declare product_id: ForeignKey<string>;
    declare image_url: string;
    declare is_main: CreationOptional<boolean>;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ProductImage.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                product_id: { type: DataTypes.UUID, allowNull: false },
                image_url: { type: DataTypes.TEXT, allowNull: false },
                is_main: { type: DataTypes.BOOLEAN, defaultValue: false },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'product_images',
                modelName: 'ProductImage',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            }
        );
        return ProductImage;
    }
}

export default ProductImage;