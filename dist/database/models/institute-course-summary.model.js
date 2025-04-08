"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteCourseSummaryModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class InstituteCourseSummaryModel extends sequelize_1.Model {
    static associate(models) {
        InstituteCourseSummaryModel.belongsTo(models.Institute, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
        InstituteCourseSummaryModel.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    }
}
exports.InstituteCourseSummaryModel = InstituteCourseSummaryModel;
function default_1(sequelize) {
    InstituteCourseSummaryModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        institute_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'institutes',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        course_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        discount_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        total_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        final_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        last_date_to_apply: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        fees_min: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        fees_max: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        fees_avg: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        total_seats: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        average_package: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        highest_package: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        exam_ids: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        faculty_to_student_ratio: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'institutes_course_summaries',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return InstituteCourseSummaryModel;
}
