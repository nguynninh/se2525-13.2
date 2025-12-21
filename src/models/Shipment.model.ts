import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

export type ShipmentStatus =
    | 'pending_pickup'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'delivery_failed'
    | 'returned'
    | 'cancelled';

export class Shipment extends Model<InferAttributes<Shipment>, InferCreationAttributes<Shipment>> {
    declare id: CreationOptional<string>;
    declare order_id: ForeignKey<string>;
    declare tracking_code: CreationOptional<string | null>;
    declare status: CreationOptional<ShipmentStatus>;
    declare fee: CreationOptional<number>;
    declare cod_amount: CreationOptional<number>;
    declare shipped_at: CreationOptional<Date | null>;
    declare delivered_at: CreationOptional<Date | null>;
    declare estimated_delivery_date: CreationOptional<Date | null>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        Shipment.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                order_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                tracking_code: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    defaultValue: null,
                },
                status: {
                    type: DataTypes.ENUM(
                        'pending_pickup',
                        'in_transit',
                        'out_for_delivery',
                        'delivered',
                        'delivery_failed',
                        'returned',
                        'cancelled',
                    ),
                    allowNull: false,
                    defaultValue: 'pending_pickup',
                },
                fee: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                cod_amount: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                },
                shipped_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null,
                },
                delivered_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null,
                },
                estimated_delivery_date: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                    defaultValue: null,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: 'shipments',
                modelName: 'Shipment',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );

        return Shipment;
    }
}

export default Shipment;
