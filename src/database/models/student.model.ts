import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface Student {
    id: number;
    name: string;
    email: string;
    mobile: string;
    otp?: string;
    otp_expiry?: Date;
    is_mobile_verified: boolean;
    is_email_verified: boolean;
    course_id?: number;
    ip_address?: string;
    lead_utm_campaign?: string;
    lead_utm_source?: string;
    lead_utm_medium?: string;
    admitted_institute_id?: number;
    image?: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type StudentCreationAttributes = Optional<
    Student,
    | 'id'
    | 'is_mobile_verified'
    | 'is_email_verified'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class StudentModel
    extends Model<Student, StudentCreationAttributes>
    implements Student
{
    public id!: number;
    public name!: string;
    public email!: string;
    public mobile!: string;
    public otp?: string;
    public otp_expiry?: Date;
    public is_mobile_verified!: boolean;
    public is_email_verified!: boolean;
    public course_id?: number;
    public ip_address?: string;
    public lead_utm_campaign?: string;
    public lead_utm_source?: string;
    public lead_utm_medium?: string;
    public admitted_institute_id?: number;
    public image?: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof StudentModel {
    StudentModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true,
            },
            mobile: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            otp: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            otp_expiry: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_mobile_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_email_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            course_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'courses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            ip_address: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            lead_utm_campaign: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            lead_utm_source: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            lead_utm_medium: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            admitted_institute_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'institutes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            image: {
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
            tableName: 'students',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return StudentModel;
}
