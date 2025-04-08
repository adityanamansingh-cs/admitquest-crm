"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class StreamModel extends sequelize_1.Model {
}
exports.StreamModel = StreamModel;
function default_1(sequelize) {
    StreamModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            defaultValue: '',
        },
        is_stream_page: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        short_description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        long_description: {
            type: sequelize_1.DataTypes.TEXT('long'),
            allowNull: true,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'inactive',
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'streams',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return StreamModel;
}
