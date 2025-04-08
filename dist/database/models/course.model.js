"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class CourseModel extends sequelize_1.Model {
}
exports.CourseModel = CourseModel;
function default_1(sequelize) {
    CourseModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        degree_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'degrees',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        stream_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'streams',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        display_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        short_name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        mode: {
            type: sequelize_1.DataTypes.ENUM('online', 'offline', 'distance'),
            allowNull: false,
        },
        eligibility_desc: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        sequence: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        elig_marks_12th: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        elig_marks_10th: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        elig_marks_ug: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        further_pg_ids: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'inactive',
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'courses',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
        defaultScope: {
            where: {
                status: 'active',
            },
        },
    });
    return CourseModel;
}
