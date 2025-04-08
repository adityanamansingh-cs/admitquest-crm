import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Program {
    id: number;
    course_id: number;
    specialization_id: number;
    name: string;
    eligibility_desc?: string;
    career_desc?: string;
    icon: string;
    status: 'active' | 'inactive';
    slug: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type ProgramCreationAttributes = Optional<
    Program,
    | 'id'
    | 'eligibility_desc'
    | 'career_desc'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class ProgramModel
    extends Model<Program, ProgramCreationAttributes>
    implements Program
{
    public id!: number;
    public course_id!: number;
    public specialization_id!: number;
    public name!: string;
    public eligibility_desc?: string;
    public career_desc?: string;
    public icon!: string;
    public status!: 'active' | 'inactive';
    public slug!: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof ProgramModel {
    ProgramModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            course_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            specialization_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'specializations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            eligibility_desc: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
            career_desc: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
            icon: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'inactive',
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'programs',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return ProgramModel;
}
