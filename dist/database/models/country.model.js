"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class CountryModel extends sequelize_1.Model {
}
exports.CountryModel = CountryModel;
function default_1(sequelize) {
    CountryModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        code: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
            unique: true,
        },
        phone_code: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'countries',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return CountryModel;
}
