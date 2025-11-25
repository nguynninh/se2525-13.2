import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

export type ShopStatus = 'active' | 'suspended' | 'closed';

export class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
    declare id: CreationOptional<string>;
    declare seller_id: ForeignKey<string>;
    declare name: string;
    declare slug: string;
    declare description: CreationOptional<string | null>;
    declare logo_url: CreationOptional<string | null>;
    declare banner_url: CreationOptional<string | null>;
    declare hotline: CreationOptional<string | null>;
    declare status: CreationOptional<ShopStatus>;
    declare address_id: CreationOptional<string | null>;
    declare rating_avg: CreationOptional<string>;
    declare rating_count: CreationOptional<number>;

    static initModel(sequelize: Sequelize) {
        Shop.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                seller_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                slug: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                logo_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                banner_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                hotline: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: null,
                },
                status: {
                    type: DataTypes.ENUM('active', 'suspended', 'closed'),
                    allowNull: false,
                    defaultValue: 'active',
                },
                address_id: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    defaultValue: null,
                },
                rating_avg: {
                    type: DataTypes.DECIMAL(3, 2),
                    allowNull: false,
                    defaultValue: '0',
                },
                rating_count: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: 'shops',
                modelName: 'Shop',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return Shop;
    }
}

export default Shop;
