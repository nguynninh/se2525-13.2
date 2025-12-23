import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id: CreationOptional<string>;
    declare parent_id: CreationOptional<ForeignKey<string> | null>;
    declare name: string;
    declare slug: string;
    declare icon_url: CreationOptional<string | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Category.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                parent_id: { type: DataTypes.UUID, allowNull: true },
                name: { type: DataTypes.STRING(255), allowNull: false },
                slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                icon_url: { type: DataTypes.TEXT, allowNull: true },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'categories',
                modelName: 'Category',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return Category;
    }
}

export default Category;