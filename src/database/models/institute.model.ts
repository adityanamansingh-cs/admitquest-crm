import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Institute {
    id: number;
    name: string;
    display_name: string;
    logo?: string;
    city_id: number;
    state_id: number;
    is_paid: boolean;
    google_rating?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type InstituteCreationAttributes = Optional<
    Institute,
    | 'id'
    | 'is_paid'
    | 'google_rating'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class InstituteModel
    extends Model<Institute, InstituteCreationAttributes>
    implements Institute
{
    public id!: number;
    public name!: string;
    public display_name!: string;
    public logo?: string;
    public city_id!: number;
    public state_id!: number;
    public is_paid!: boolean;
    public google_rating?: number;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
    public state?: any;
    public state_name?: any;
    public instituteFeatures?: any[];
    public features?: Record<string, string[]>;
    public courseSummaries?: any;
    public exams?: any[];
    public institutePrograms?: any[];

    public static associate(models: any): void {
        InstituteModel.hasMany(models.InstituteCourseSummary, {
            foreignKey: 'institute_id',
            as: 'courseSummaries',
        });
        InstituteModel.belongsTo(models.State, {
            foreignKey: 'state_id',
            as: 'state_name',
        });
        InstituteModel.belongsTo(models.City, {
            foreignKey: 'city_id',
            as: 'city_name',
        });
        InstituteModel.hasMany(models.InstituteFeature, {
            foreignKey: 'institute_id',
            as: 'instituteFeatures',
        });
        InstituteModel.belongsToMany(models.Feature, {
            through: models.InstituteFeature,
            foreignKey: 'institute_id',
            as: 'features',
            otherKey: 'feature_id',
        });
        InstituteModel.hasMany(models.InstituteRanking, {
            foreignKey: 'institute_id',
            as: 'rankings',
        });
        InstituteModel.hasMany(models.InstituteProgram, {
            foreignKey: 'institute_id',
            as: 'institutePrograms',
        });
    }
}

export default function (sequelize: Sequelize): typeof InstituteModel {
    InstituteModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            display_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'cities',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            state_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'states',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            is_paid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            google_rating: {
                type: DataTypes.DECIMAL(3, 2),
                allowNull: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'institutes',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return InstituteModel;
}
