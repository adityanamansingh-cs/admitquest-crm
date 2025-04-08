"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
const cart_model_1 = require("../../database/models/cart.model");
const course_model_1 = require("../../database/models/course.model");
const institute_model_1 = require("../../database/models/institute.model");
// import { StudentModel } from '../../database/models/student.model';
const institute_program_model_1 = require("../../database/models/institute-program.model"); // ✅ New import
class ApplicationModel extends sequelize_1.Model {
    static associate(models) {
        ApplicationModel.belongsTo(cart_model_1.CartModel, {
            foreignKey: 'cart_id',
            as: 'cart',
        });
        ApplicationModel.belongsTo(course_model_1.CourseModel, {
            foreignKey: 'course_id',
            as: 'course',
        });
        ApplicationModel.belongsTo(institute_model_1.InstituteModel, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
        // ApplicationModel.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'student' });
        ApplicationModel.belongsTo(institute_program_model_1.InstituteProgramModel, {
            foreignKey: 'institute_program_id',
            as: 'institute_program',
        });
    }
}
exports.ApplicationModel = ApplicationModel;
function default_1(sequelize) {
    ApplicationModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
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
        student_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'students',
                key: 'id',
            },
            onDelete: 'CASCADE',
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
        institute_program_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'institute_programs',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        final_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        payable_amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        added_by: {
            type: sequelize_1.DataTypes.ENUM('admin', 'student'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('0', '1', '2'),
            allowNull: false,
            defaultValue: '0',
            comment: '0: Deleted, 1: Running, 2: Expired',
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'applications',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return ApplicationModel;
}
