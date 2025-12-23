import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export type SellerStatus = 'active' | 'suspended' | 'closed';

export class Seller extends Model<InferAttributes<Seller>, InferCreationAttributes<Seller>> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare status: CreationOptional<SellerStatus>;

    static initModel(sequelize: Sequelize) {
        Seller.init(
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
                status: {
                    type: DataTypes.ENUM('active', 'suspended', 'closed'),
                    allowNull: false,
                    defaultValue: 'active',
                },
            },
            {
                sequelize,
                tableName: 'sellers',
                modelName: 'Seller',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Seller;
    }
}

export default Seller;
