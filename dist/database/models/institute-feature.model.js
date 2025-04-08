"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteFeatureModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class InstituteFeatureModel extends sequelize_1.Model {
    static associate(models) {
        InstituteFeatureModel.belongsTo(models.Feature, {
            foreignKey: 'feature_id',
            as: 'feature',
        });
        InstituteFeatureModel.belongsTo(models.Institute, {
            foreignKey: 'institute_id',
            as: 'institute',
        });
    }
}
exports.InstituteFeatureModel = InstituteFeatureModel;
function default_1(sequelize) {
    InstituteFeatureModel.init({
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
        feature_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'features',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        certified_by: {
            type: sequelize_1.DataTypes.ENUM('admitquest', 'college', 'portals'),
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'institute_features',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return InstituteFeatureModel;
}
