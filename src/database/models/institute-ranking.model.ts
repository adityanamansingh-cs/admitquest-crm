import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InstituteRanking {
    id: number;
    institute_id: number;
    course_id: number;
    rank: number;
    out_of: number;
    year?: number;
    ranking_body:
        | 'nirf'
        | 'outlook'
        | 'times'
        | 'times_b'
        | 'qs'
        | 'itoday'
        | 'cs';
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type InstituteRankingCreationAttributes = Optional<
    InstituteRanking,
    'id' | 'year' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class InstituteRankingModel
    extends Model<InstituteRanking, InstituteRankingCreationAttributes>
    implements InstituteRanking
{
    public id!: number;
    public institute_id!: number;
    public course_id!: number;
    public rank!: number;
    public out_of!: number;
    public year?: number;
    public ranking_body!:
        | 'nirf'
        | 'outlook'
        | 'times'
        | 'times_b'
        | 'qs'
        | 'itoday'
        | 'cs';
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof InstituteRankingModel {
    InstituteRankingModel.init(
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
            course_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            rank: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            out_of: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            year: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            ranking_body: {
                type: DataTypes.ENUM(
                    'nirf',
                    'outlook',
                    'times',
                    'times_b',
                    'qs',
                    'itoday',
                    'cs',
                ),
                allowNull: false,
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
            tableName: 'institute_rankings',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return InstituteRankingModel;
}
