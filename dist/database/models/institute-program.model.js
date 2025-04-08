"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteProgramModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class InstituteProgramModel extends sequelize_1.Model {
    static associate(models) {
        InstituteProgramModel.belongsTo(models.Program, {
            foreignKey: 'program_id',
            as: 'program',
        });
    }
}
exports.InstituteProgramModel = InstituteProgramModel;
function default_1(sequelize) {
    InstituteProgramModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
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
        program_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'programs',
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
        institute_course_name: {
            type: sequelize_1.DataTypes.STRING,
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
        tableName: 'institute_programs',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return InstituteProgramModel;
}
