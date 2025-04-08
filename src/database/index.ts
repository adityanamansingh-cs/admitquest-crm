import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import userModel from './models/user.model';
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
import studentModel from '@database/models/student.model';
import courseModel from './models/course.model';
import degreeModel from './models/degree.model';
import cityModel from './models/city.model';
import stateModel from './models/state.model';
import instituteModel from './models/institute.model';
import instituteCourseSummaryModel from '@database/models/institute-course-summary.model';
import instituteProgramModel from '@database/models/institute-program.model';
import applicationModel from './models/application.model';
import programModel from './models/program.model';
import cartModel from './models/cart.model';
import couponModel from './models/coupon.model';
import instituteFeatureModel from '@database/models/institute-feature.model';
import featureModel from './models/feature.model';
import instituteRankingModel from '@database/models/institute-ranking.model';
import examModel from './models/exam.model';
import streamModel from './models/stream.model';
import specializationModel from './models/specialization.model';

const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: 'mysql',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
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
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

(async () => {
    try {
        await sequelize.authenticate();
        logger.info('Database connection established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
})();

export const DB = {
    User: userModel(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
    Student: studentModel(sequelize),
    Course: courseModel(sequelize),
    Degree: degreeModel(sequelize),
    City: cityModel(sequelize),
    State: stateModel(sequelize),
    Institute: instituteModel(sequelize),
    Feature: featureModel(sequelize),
    InstituteCourseSummary: instituteCourseSummaryModel(sequelize),
    Application: applicationModel(sequelize),
    Program: programModel(sequelize),
    Cart: cartModel(sequelize),
    Coupon: couponModel(sequelize),
    InstituteProgram: instituteProgramModel(sequelize),
    InstituteFeature: instituteFeatureModel(sequelize),
    InstituteRanking: instituteRankingModel(sequelize),
    Exam: examModel(sequelize),
    Stream: streamModel(sequelize),
    Specialization: specializationModel(sequelize),
};

// Set up associations
Object.values(DB).forEach((model: any) => {
    if (model?.associate) {
        model.associate(DB);
    }
});
