"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class UserModel extends sequelize_1.Model {
}
exports.UserModel = UserModel;
function default_1(sequelize) {
    UserModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        name: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
        },
        username: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user',
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'users',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return UserModel;
}
