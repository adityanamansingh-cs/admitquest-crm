import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CartModel } from '@/database/models/cart.model';
import { CourseModel } from '@/database/models/course.model';
import { InstituteModel } from '@/database/models/institute.model';
// import { StudentModel } from '@/database/models/student.model';
import { InstituteProgramModel } from '@/database/models/institute-program.model'; // ✅ New import

interface Application {
    id: number;
    cart_id: number;
    student_id: number;
    institute_id: number;
    course_id: number;
    institute_program_id?: number | null; // ✅ Nullable field
    final_amount: number;
    payable_amount: number;
    added_by: 'admin' | 'student';
    status: '0' | '1' | '2';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type ApplicationCreationAttributes = Optional<
    Application,
    | 'id'
    | 'final_amount'
    | 'payable_amount'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'institute_program_id'
>;

export class ApplicationModel
    extends Model<Application, ApplicationCreationAttributes>
    implements Application
{
    public id!: number;
    public cart_id!: number;
    public student_id!: number;
    public institute_id!: number;
    public course_id!: number;
    public institute_program_id?: number | null; // ✅ Added
    public final_amount!: number;
    public payable_amount!: number;
    public added_by!: 'admin' | 'student';
    public status!: '0' | '1' | '2';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    public static associate(models: any): void {
        ApplicationModel.belongsTo(CartModel, {
            foreignKey: 'cart_id',
            as: 'cart',
        });
        ApplicationModel.belongsTo(CourseModel, {
            foreignKey: 'course_id',
            as: 'course',
        });
        ApplicationModel.belongsTo(InstituteModel, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
        // ApplicationModel.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'student' });
        ApplicationModel.belongsTo(InstituteProgramModel, {
            foreignKey: 'institute_program_id',
            as: 'institute_program',
        });
    }
}

export default function (sequelize: Sequelize): typeof ApplicationModel {
    ApplicationModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            cart_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            student_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'students',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
            institute_program_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'institute_programs',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            final_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            payable_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            added_by: {
                type: DataTypes.ENUM('admin', 'student'),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('0', '1', '2'),
                allowNull: false,
                defaultValue: '0',
                comment: '0: Deleted, 1: Running, 2: Expired',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'applications',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return ApplicationModel;
}
