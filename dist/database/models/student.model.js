"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class StudentModel extends sequelize_1.Model {
}
exports.StudentModel = StudentModel;
function default_1(sequelize) {
    StudentModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        mobile: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        otp: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        otp_expiry: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        is_mobile_verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_email_verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        course_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'courses',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        ip_address: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
        },
        lead_utm_campaign: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        lead_utm_source: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        lead_utm_medium: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        admitted_institute_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'institutes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        image: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
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
        tableName: 'students',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return StudentModel;
}
