import {
    Model,
    DataTypes,
    Sequelize,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    ForeignKey,
} from 'sequelize';

import { User } from './User.model';

export type SellerApplicationStatus = 'pending' | 'approved' | 'rejected';

export class SellerApplication extends Model<
    InferAttributes<SellerApplication>,
    InferCreationAttributes<SellerApplication>
> {
    declare id: CreationOptional<string>;
    declare user_id: ForeignKey<string>;
    declare status: CreationOptional<SellerApplicationStatus>;
    declare reviewed_by: CreationOptional<ForeignKey<string> | null>;
    declare accepted_terms: CreationOptional<boolean>;
    declare rejection_reason: CreationOptional<string | null>;
    declare user?: User;

    static initModel(sequelize: Sequelize) {
        SellerApplication.init(
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
                },
                status: {
                    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                    allowNull: false,
                    defaultValue: 'pending',
                },
                reviewed_by: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    defaultValue: null,
                },
                accepted_terms: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                rejection_reason: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                },
            },
            {
                sequelize,
                tableName: 'seller_applications',
                modelName: 'SellerApplication',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                underscored: true,
            },
        );
        return SellerApplication;
    }
}

export default SellerApplication;
