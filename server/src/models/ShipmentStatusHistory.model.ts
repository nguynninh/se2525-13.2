import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { ShipmentStatus } from './Shipment.model';

export type ShipmentStatusSource = 'system' | 'manual';

export class ShipmentStatusHistory extends Model<
    InferAttributes<ShipmentStatusHistory>,
    InferCreationAttributes<ShipmentStatusHistory>
> {
    declare id: CreationOptional<string>;
    declare shipment_id: ForeignKey<string>;
    declare old_status: CreationOptional<ShipmentStatus | null>;
    declare new_status: ShipmentStatus;
    declare event_time: CreationOptional<Date>;
    declare source: CreationOptional<ShipmentStatusSource>;
    declare description: CreationOptional<string | null>;
    declare raw_payload: CreationOptional<object | null>;
    declare created_at: CreationOptional<Date>;

    static initModel(sequelize: Sequelize) {
        ShipmentStatusHistory.init(
            {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                shipment_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                old_status: {
                    type: DataTypes.ENUM(
                        'pending_pickup',
                        'in_transit',
                        'out_for_delivery',
                        'delivered',
                        'delivery_failed',
                        'returned',
                        'cancelled',
                    ),
                    allowNull: true,
                    defaultValue: null,
                },
                new_status: {
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
                },
                event_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                source: {
                    type: DataTypes.ENUM('system', 'manual'),
                    allowNull: false,
                    defaultValue: 'system',
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
                raw_payload: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: null,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
            },
            {
                sequelize,
                tableName: 'shipment_status_history',
                modelName: 'ShipmentStatusHistory',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: false,
                underscored: true,
            },
        );

        return ShipmentStatusHistory;
    }
}

export default ShipmentStatusHistory;
