import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Course {
    id: number;
    degree_id: number;
    stream_id: number;
    name: string;
    display_name: string;
    short_name: string;
    slug: string;
    mode: 'online' | 'offline' | 'distance';
    eligibility_desc?: string;
    sequence: number;
    duration: string;
    icon?: string;
    elig_marks_12th?: number;
    elig_marks_10th?: number;
    elig_marks_ug?: number;
    further_pg_ids?: any;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export type CourseCreationAttributes = Optional<
    Course,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class CourseModel
    extends Model<Course, CourseCreationAttributes>
    implements Course
{
    public id!: number;
    public degree_id!: number;
    public stream_id!: number;
    public name!: string;
    public display_name!: string;
    public short_name!: string;
    public slug!: string;
    public mode!: 'online' | 'offline' | 'distance';
    public eligibility_desc?: string;
    public sequence!: number;
    public duration!: string;
    public icon?: string;
    public elig_marks_12th?: number;
    public elig_marks_10th?: number;
    public elig_marks_ug?: number;
    public further_pg_ids?: any;
    public status!: 'active' | 'inactive';
    public created_at!: Date;
    public updated_at!: Date;
    public deleted_at?: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof CourseModel {
    CourseModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            degree_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'degrees',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            stream_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'streams',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            display_name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            short_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            mode: {
                type: DataTypes.ENUM('online', 'offline', 'distance'),
                allowNull: false,
            },
            eligibility_desc: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            sequence: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            duration: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            icon: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            elig_marks_12th: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            elig_marks_10th: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            elig_marks_ug: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            further_pg_ids: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'inactive',
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
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'courses',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
            defaultScope: {
                where: {
                    status: 'active',
                },
            },
        },
    );

    return CourseModel;
}
