"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class InstituteModel extends sequelize_1.Model {
    static associate(models) {
        InstituteModel.hasMany(models.InstituteCourseSummary, {
            foreignKey: 'institute_id',
            as: 'courseSummaries',
        });
        InstituteModel.belongsTo(models.States, {
            foreignKey: 'state_id',
            as: 'state_name',
        });
        InstituteModel.belongsTo(models.City, {
            foreignKey: 'city_id',
            as: 'city_name',
        });
        InstituteModel.hasMany(models.InstituteFeature, {
            foreignKey: 'institute_id',
            as: 'instituteFeatures',
        });
        InstituteModel.belongsToMany(models.Feature, {
            through: models.InstituteFeature,
            foreignKey: 'institute_id',
            as: 'features',
            otherKey: 'feature_id',
        });
        InstituteModel.hasMany(models.InstituteRanking, {
            foreignKey: 'institute_id',
            as: 'rankings',
        });
        InstituteModel.hasMany(models.InstituteProgram, {
            foreignKey: 'institute_id',
            as: 'institutePrograms',
        });
    }
}
exports.InstituteModel = InstituteModel;
function default_1(sequelize) {
    InstituteModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        display_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        city_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'cities',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        state_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'states',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        is_paid: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        google_rating: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'institutes',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return InstituteModel;
}
