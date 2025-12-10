import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export class ProductQuestion extends Model<InferAttributes<ProductQuestion>, InferCreationAttributes<ProductQuestion>> {
    declare id: CreationOptional<string>;
    declare product_id: ForeignKey<string>;
    declare user_id: ForeignKey<string>;
    declare question: string;
    declare answer: CreationOptional<string | null>;
    declare answered_by: CreationOptional<ForeignKey<string> | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ProductQuestion.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
                product_id: { type: DataTypes.UUID, allowNull: false },
                user_id: { type: DataTypes.UUID, allowNull: false },
                question: { type: DataTypes.TEXT, allowNull: false },
                answer: { type: DataTypes.TEXT, allowNull: true },
                answered_by: { type: DataTypes.UUID, allowNull: true },
                created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: 'product_questions',
                modelName: 'ProductQuestion',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            }
        );
        return ProductQuestion;
    }
}

export default ProductQuestion;