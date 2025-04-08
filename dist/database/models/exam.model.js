"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class ExamModel extends sequelize_1.Model {
    static associate(models) {
        ExamModel.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    }
}
exports.ExamModel = ExamModel;
function default_1(sequelize) {
    ExamModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        course_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        level: {
            type: sequelize_1.DataTypes.ENUM('ai', 'state'),
            allowNull: true,
            defaultValue: 'ai',
        },
        display_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        full_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        exam_state: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        conducted_by: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        logo: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        mode: {
            type: sequelize_1.DataTypes.ENUM('offline', 'online', 'hybrid'),
            allowNull: true,
            defaultValue: 'offline',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            allowNull: true,
            defaultValue: 'inactive',
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'exams',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return ExamModel;
}
