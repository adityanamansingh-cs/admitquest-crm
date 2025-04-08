"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentLogModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class StudentLogModel extends sequelize_1.Model {
}
exports.StudentLogModel = StudentLogModel;
function default_1(sequelize) {
    StudentLogModel.init({
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
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        log: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'student_logs',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return StudentLogModel;
}
