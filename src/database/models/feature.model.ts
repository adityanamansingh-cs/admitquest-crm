import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Feature {
    id: number;
    type: string;
    name?: string;
    value?: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type FeatureCreationAttributes = Optional<
    Feature,
    | 'id'
    | 'name'
    | 'value'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class FeatureModel
    extends Model<Feature, FeatureCreationAttributes>
    implements Feature
{
    public id!: number;
    public type!: string;
    public name?: string;
    public value?: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof FeatureModel {
    FeatureModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            value: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'inactive',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'features',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return FeatureModel;
}
