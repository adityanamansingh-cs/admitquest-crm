"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegreeModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class DegreeModel extends sequelize_1.Model {
}
exports.DegreeModel = DegreeModel;
function default_1(sequelize) {
    DegreeModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
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
        tableName: 'degrees',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return DegreeModel;
}
