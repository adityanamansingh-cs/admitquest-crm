import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface StudentLog {
    id: number;
    student_id: number;
    log: any;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type StudentLogCreationAttributes = Optional<
    StudentLog,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class StudentLogModel
    extends Model<StudentLog, StudentLogCreationAttributes>
    implements StudentLog
{
    public id!: number;
    public student_id!: number;
    public log!: any;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof StudentLogModel {
    StudentLogModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            student_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'students',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            log: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'student_logs',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return StudentLogModel;
}
