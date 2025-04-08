"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLogModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class PaymentLogModel extends sequelize_1.Model {
}
exports.PaymentLogModel = PaymentLogModel;
function default_1(sequelize) {
    PaymentLogModel.init({
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
        cart_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'carts',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        application_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'applications',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        coupon_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'coupons',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        transaction_no: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        response: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('0', '1', '2', '3'),
            allowNull: false,
            defaultValue: '0',
            comment: '0: Initiated, 1: Pending, 2: Success, 3: Failed',
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'payment_logs',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return PaymentLogModel;
}
