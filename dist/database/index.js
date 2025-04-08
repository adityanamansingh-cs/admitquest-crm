"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const sequelize_1 = __importDefault(require("sequelize"));
const user_model_1 = __importDefault(require("./models/user.model"));
const config_1 = require("../config");
const student_model_1 = __importDefault(require("./models/student.model"));
const course_model_1 = __importDefault(require("./models/course.model"));
const degree_model_1 = __importDefault(require("./models/degree.model"));
const city_model_1 = __importDefault(require("./models/city.model"));
const state_model_1 = __importDefault(require("./models/state.model"));
const institute_model_1 = __importDefault(require("./models/institute.model"));
const institute_course_summary_model_1 = __importDefault(require("./models/institute-course-summary.model"));
const institute_program_model_1 = __importDefault(require("./models/institute-program.model"));
const application_model_1 = __importDefault(require("./models/application.model"));
const program_model_1 = __importDefault(require("./models/program.model"));
const cart_model_1 = __importDefault(require("./models/cart.model"));
const coupon_model_1 = __importDefault(require("./models/coupon.model"));
const institute_feature_model_1 = __importDefault(require("./models/institute-feature.model"));
const feature_model_1 = __importDefault(require("./models/feature.model"));
const institute_ranking_model_1 = __importDefault(require("./models/institute-ranking.model"));
const exam_model_1 = __importDefault(require("./models/exam.model"));
const sequelize = new sequelize_1.default.Sequelize(config_1.DB_NAME, config_1.DB_USERNAME, config_1.DB_PASSWORD, {
    dialect: 'mysql',
    host: config_1.DB_HOST,
    port: parseInt(config_1.DB_PORT, 10),
    timezone: '+05:30',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    pool: {
        min: 0,
        max: 5,
    },
    logQueryParameters: config_1.NODE_ENV === 'development',
    logging: (query, time) => {
        logger_1.default.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        logger_1.default.info('Database connection established successfully.');
    }
    catch (error) {
        logger_1.default.error('Unable to connect to the database:', error);
    }
}))();
exports.DB = {
    Users: (0, user_model_1.default)(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize: // connection instance (RAW queries)
    sequelize_1.default, // library
    Student: (0, student_model_1.default)(sequelize),
    Course: (0, course_model_1.default)(sequelize),
    Program: (0, program_model_1.default)(sequelize),
    Degree: (0, degree_model_1.default)(sequelize),
    States: (0, state_model_1.default)(sequelize),
    City: (0, city_model_1.default)(sequelize),
    Institute: (0, institute_model_1.default)(sequelize),
    Feature: (0, feature_model_1.default)(sequelize),
    InstituteCourseSummary: (0, institute_course_summary_model_1.default)(sequelize),
    Application: (0, application_model_1.default)(sequelize),
    Cart: (0, cart_model_1.default)(sequelize),
    Coupon: (0, coupon_model_1.default)(sequelize),
    InstituteProgram: (0, institute_program_model_1.default)(sequelize),
    InstituteFeature: (0, institute_feature_model_1.default)(sequelize),
    InstituteRanking: (0, institute_ranking_model_1.default)(sequelize),
    Exam: (0, exam_model_1.default)(sequelize),
};
// Set up associations
Object.values(exports.DB).forEach((model) => {
    if (model === null || model === void 0 ? void 0 : model.associate) {
        model.associate(exports.DB);
    }
});
