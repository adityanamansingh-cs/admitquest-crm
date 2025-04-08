"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteRankingModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class InstituteRankingModel extends sequelize_1.Model {
}
exports.InstituteRankingModel = InstituteRankingModel;
function default_1(sequelize) {
    InstituteRankingModel.init({
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
        rank: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        out_of: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        year: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        ranking_body: {
            type: sequelize_1.DataTypes.ENUM('nirf', 'outlook', 'times', 'times_b', 'qs', 'itoday', 'cs'),
            allowNull: false,
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
        tableName: 'institute_rankings',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return InstituteRankingModel;
}
