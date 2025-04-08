import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Stream {
    id: number;
    name: string;
    is_stream_page: boolean;
    short_description?: string;
    long_description?: string;
    icon?: string;
    slug: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type StreamCreationAttributes = Optional<
    Stream,
    | 'id'
    | 'is_stream_page'
    | 'short_description'
    | 'long_description'
    | 'icon'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class StreamModel
    extends Model<Stream, StreamCreationAttributes>
    implements Stream
{
    public id!: number;
    public name!: string;
    public is_stream_page!: boolean;
    public short_description?: string;
    public long_description?: string;
    public icon?: string;
    public slug!: string;
    public status!: 'active' | 'inactive';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof StreamModel {
    StreamModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: '',
            },
            is_stream_page: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            short_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            long_description: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
            icon: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
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
            tableName: 'streams',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return StreamModel;
}
