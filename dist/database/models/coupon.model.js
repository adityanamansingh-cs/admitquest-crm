"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class CouponModel extends sequelize_1.Model {
}
exports.CouponModel = CouponModel;
function default_1(sequelize) {
    CouponModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        discount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        capping: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        type_discount: {
            type: sequelize_1.DataTypes.ENUM('percentage', 'flat'),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('student', 'institute', 'course', 'program'),
            allowNull: false,
        },
        type_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        expiry: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'coupons',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return CouponModel;
}
