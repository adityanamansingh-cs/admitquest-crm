import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface InstituteProgram {
    id: number;
    course_id: number;
    program_id: number;
    institute_id: number;
    institute_course_name: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type InstituteProgramCreationAttributes = Optional<
    InstituteProgram,
    'id' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class InstituteProgramModel
    extends Model<InstituteProgram, InstituteProgramCreationAttributes>
    implements InstituteProgram
{
    public id!: number;
    public course_id!: number;
    public program_id!: number;
    public institute_id!: number;
    public institute_course_name!: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
    public program?: any;

    public static associate(models: any): void {
        InstituteProgramModel.belongsTo(models.Program, {
            foreignKey: 'program_id',
            as: 'program',
        });
    }
}

export default function (sequelize: Sequelize): typeof InstituteProgramModel {
    InstituteProgramModel.init(
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
                onDelete: 'CASCADE',
            },
            program_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'programs',
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
            institute_course_name: {
                type: DataTypes.STRING,
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
            tableName: 'institute_programs',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return InstituteProgramModel;
}
