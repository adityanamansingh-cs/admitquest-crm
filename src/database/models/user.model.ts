import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface User {
    id: number;
    email: string;
    name: string;
    username?: string;
    password?: string;
    role: 'admin' | 'user';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type UserCreationAttributes = Optional<
    User,
    'id' | 'username' | 'role' | 'created_at' | 'updated_at' | 'deleted_at' | 'password'
>;

export class UserModel
    extends Model<User, UserCreationAttributes>
    implements User
{
    public id!: number;
    public email!: string;
    public name!: string;
    public username?: string;
    public password?: string;
    public role!: 'admin' | 'user';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(45),
                allowNull: true,
                unique: true,
            },
            name: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'),
                allowNull: false,
                defaultValue: 'user',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            paranoid: true,
            underscored: true,
        }
    );

    return UserModel;
}
