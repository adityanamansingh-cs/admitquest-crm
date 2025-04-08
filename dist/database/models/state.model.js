"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateModel = void 0;
exports.default = default_1;
const sequelize_1 = require("sequelize");
class StateModel extends sequelize_1.Model {
}
exports.StateModel = StateModel;
function default_1(sequelize) {
    StateModel.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        country_id: {
            type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'countries',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        created_at: sequelize_1.DataTypes.DATE,
        updated_at: sequelize_1.DataTypes.DATE,
        deleted_at: sequelize_1.DataTypes.DATE,
    }, {
        tableName: 'states',
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        timestamps: true,
    });
    return StateModel;
}
