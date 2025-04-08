import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InstituteCourseSummary {
    id: number;
    institute_id: number;
    course_id: number;
    discount_amount?: number;
    total_amount?: number;
    final_amount?: number;
    last_date_to_apply?: Date;
    fees_min?: number;
    fees_max?: number;
    fees_avg?: number;
    total_seats?: number;
    average_package?: number;
    highest_package?: number;
    exam_ids?: string;
    faculty_to_student_ratio?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type InstituteCourseSummaryCreationAttributes = Optional<
    InstituteCourseSummary,
    | 'id'
    | 'discount_amount'
    | 'total_amount'
    | 'final_amount'
    | 'last_date_to_apply'
    | 'fees_min'
    | 'fees_max'
    | 'fees_avg'
    | 'total_seats'
    | 'average_package'
    | 'highest_package'
    | 'exam_ids'
    | 'faculty_to_student_ratio'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class InstituteCourseSummaryModel
    extends Model<
        InstituteCourseSummary,
        InstituteCourseSummaryCreationAttributes
    >
    implements InstituteCourseSummary
{
    public id!: number;
    public institute_id!: number;
    public course_id!: number;
    public discount_amount?: number;
    public total_amount?: number;
    public final_amount?: number;
    public last_date_to_apply?: Date;
    public fees_min?: number;
    public fees_max?: number;
    public fees_avg?: number;
    public total_seats?: number;
    public average_package?: number;
    public highest_package?: number;
    public exam_ids?: string;
    public faculty_to_student_ratio?: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
    public course?: any;

    public static associate(models: any): void {
        InstituteCourseSummaryModel.belongsTo(models.Institute, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
        InstituteCourseSummaryModel.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    }
}

export default function (
    sequelize: Sequelize,
): typeof InstituteCourseSummaryModel {
    InstituteCourseSummaryModel.init(
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
            discount_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            final_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            last_date_to_apply: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            fees_min: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            fees_max: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            fees_avg: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            total_seats: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            average_package: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            highest_package: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            exam_ids: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            faculty_to_student_ratio: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'institutes_course_summaries',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return InstituteCourseSummaryModel;
}
