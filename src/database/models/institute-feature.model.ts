import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { FeatureModel } from './feature.model';
import { InstituteModel } from './institute.model';

interface InstituteFeature {
    id: number;
    institute_id: number;
    feature_id: number;
    certified_by: 'admitquest' | 'college' | 'portals';
    value?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type InstituteFeatureCreationAttributes = Optional<
    InstituteFeature,
    'id' | 'value' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class InstituteFeatureModel
    extends Model<InstituteFeature, InstituteFeatureCreationAttributes>
    implements InstituteFeature
{
    public id!: number;
    public institute_id!: number;
    public feature_id!: number;
    public certified_by!: 'admitquest' | 'college' | 'portals';
    public value?: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
    public feature?: FeatureModel;
    public institute?: InstituteModel;

    public static associate(models: any): void {
        InstituteFeatureModel.belongsTo(models.Feature, {
            foreignKey: 'feature_id',
            as: 'feature',
        });
        InstituteFeatureModel.belongsTo(models.Institute, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
    }
}

export default function (sequelize: Sequelize): typeof InstituteFeatureModel {
    InstituteFeatureModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            institute_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'institutes',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            feature_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'features',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            certified_by: {
                type: DataTypes.ENUM('admitquest', 'college', 'portals'),
                allowNull: false,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'institute_features',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return InstituteFeatureModel;
}
