import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Exam {
    id: number;
    course_id?: number;
    name?: string;
    level?: 'ai' | 'state';
    display_name?: string;
    slug?: string;
    full_name?: string;
    exam_state?: string;
    conducted_by?: string;
    logo?: string;
    mode?: 'offline' | 'online' | 'hybrid';
    status?: 'active' | 'inactive';
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

export type ExamCreationAttributes = Optional<
    Exam,
    | 'id'
    | 'course_id'
    | 'name'
    | 'level'
    | 'display_name'
    | 'slug'
    | 'full_name'
    | 'exam_state'
    | 'conducted_by'
    | 'logo'
    | 'mode'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class ExamModel
    extends Model<Exam, ExamCreationAttributes>
    implements Exam
{
    public id!: number;
    public course_id?: number;
    public name?: string;
    public level?: 'ai' | 'state';
    public display_name?: string;
    public slug?: string;
    public full_name?: string;
    public exam_state?: string;
    public conducted_by?: string;
    public logo?: string;
    public mode?: 'offline' | 'online' | 'hybrid';
    public status?: 'active' | 'inactive';
    public created_at?: Date;
    public updated_at?: Date;
    public deleted_at?: Date | null;

    public static associate(models: any): void {
        ExamModel.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    }
}

export default function (sequelize: Sequelize): typeof ExamModel {
    ExamModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            course_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'courses',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            level: {
                type: DataTypes.ENUM('ai', 'state'),
                allowNull: true,
                defaultValue: 'ai',
            },
            display_name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true,
            },
            full_name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            exam_state: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            conducted_by: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            logo: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            mode: {
                type: DataTypes.ENUM('offline', 'online', 'hybrid'),
                allowNull: true,
                defaultValue: 'offline',
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: true,
                defaultValue: 'inactive',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                ),
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'exams',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return ExamModel;
}
