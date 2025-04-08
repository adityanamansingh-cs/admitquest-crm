import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Country {
    id: number;
    name: string;
    code: string;
    phone_code: string;
    currency: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type CountryCreationAttributes = Optional<
    Country,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class CountryModel
    extends Model<Country, CountryCreationAttributes>
    implements Country
{
    public id!: number;
    public name!: string;
    public code!: string;
    public phone_code!: string;
    public currency!: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof CountryModel {
    CountryModel.init(
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
            code: {
                type: DataTypes.STRING(2),
                allowNull: false,
                unique: true,
            },
            phone_code: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            currency: {
                type: DataTypes.STRING(3),
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'countries',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return CountryModel;
}
