"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
const coupon_model_1 = require("./coupon.model");
class CartModel extends sequelize_1.Model {
    static associate(models) {
        CartModel.belongsTo(coupon_model_1.CouponModel, {
            foreignKey: 'coupon_id',
            as: 'coupon',
        });
    }
}
exports.CartModel = CartModel;
function default_1(sequelize) {
    CartModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        coupon_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true, // ✅ Allow null values
            references: {
                model: 'coupons',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        total_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        discount_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        final_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        status: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'carts',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return CartModel;
}
