import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface State {
    id: number;
    country_id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type StateCreationAttributes = Optional<
    State,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class StateModel
    extends Model<State, StateCreationAttributes>
    implements State
{
    public id!: number;
    public country_id!: number;
    public name!: string;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof StateModel {
    StateModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            country_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'countries',
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
            tableName: 'states',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return StateModel;
}
