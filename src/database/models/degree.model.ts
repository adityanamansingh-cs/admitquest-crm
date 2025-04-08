import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Degree {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type DegreeCreationAttributes = Optional<
    Degree,
    'id' | 'status' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class DegreeModel
    extends Model<Degree, DegreeCreationAttributes>
    implements Degree
{
    public id!: number;
    public name!: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof DegreeModel {
    DegreeModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
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
            tableName: 'degrees',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return DegreeModel;
}
