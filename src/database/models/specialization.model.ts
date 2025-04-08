import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Specialization {
    id: number;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type SpecializationCreationAttributes = Optional<
    Specialization,
    'id' | 'description' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class SpecializationModel
    extends Model<Specialization, SpecializationCreationAttributes>
    implements Specialization
{
    public id!: number;
    public name!: string;
    public description?: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof SpecializationModel {
    SpecializationModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active',
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },

        {
            tableName: 'specializations',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return SpecializationModel;
}
