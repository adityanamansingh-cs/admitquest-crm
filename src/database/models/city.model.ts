import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface City {
    id: number;
    state_id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type CityCreationAttributes = Optional<
    City,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class CityModel
    extends Model<City, CityCreationAttributes>
    implements City
{
    public id!: number;
    public state_id!: number;
    public name!: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof CityModel {
    CityModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            state_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'states',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'cities',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return CityModel;
}
