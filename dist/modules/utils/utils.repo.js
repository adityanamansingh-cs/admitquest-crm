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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const sequelize_1 = require("sequelize");
const repo = {
    findAllCourses: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.Course.findAll({
            attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
        });
    }),
    findMainCourses: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.Course.findAll({
            attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
            order: [['sequence', 'ASC']],
        });
    }),
    findCoursesByDegree: (degreeName) => __awaiter(void 0, void 0, void 0, function* () {
        const degree = yield database_1.DB.Degree.findOne({
            where: { name: degreeName.toUpperCase() },
        });
        if (!degree) {
            throw new Error('Degree not found');
        }
        return yield database_1.DB.Course.findAll({
            attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
            where: { degree_id: degree.id },
        });
    }),
    listCourses: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.Course.findAll({
            attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
            order: [['sequence', 'ASC']],
        });
    }),
    findAllStates: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.States.findAll({
            attributes: ['id', 'name'],
        });
    }),
    findAllCities: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.City.findAll({
            attributes: ['id', 'name', 'state_id'],
        });
    }),
    findCitiesByState: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const state = yield database_1.DB.States.findOne({
            where: { id: id },
        });
        if (!state) {
            throw new Error('State not found');
        }
        return yield database_1.DB.City.findAll({
            attributes: ['id', 'name'],
            where: { state_id: state.id },
            order: [['name', 'ASC']],
        });
    }),
    findCollegesByCourse: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield database_1.DB.InstituteCourseSummary.findAll({
            attributes: [
                [database_1.DB.sequelize.col('institute.state_id'), 'state_id'],
                [database_1.DB.sequelize.col('institute.state_name.name'), 'state_name'],
                [
                    database_1.DB.sequelize.fn('COUNT', database_1.DB.sequelize.col('institute.id')),
                    'institute_count',
                ],
            ],
            include: [
                {
                    model: database_1.DB.Institute,
                    as: 'institute',
                    attributes: [],
                    include: [
                        {
                            model: database_1.DB.States,
                            as: 'state_name',
                            attributes: [],
                        },
                    ],
                },
            ],
            where: {
                course_id: courseId,
            },
            group: [
                database_1.DB.sequelize.col('institute.state_id'),
                database_1.DB.sequelize.col('institute.state_name.name'),
            ],
            order: [[database_1.DB.sequelize.col('institute.state_name.name'), 'ASC']],
            raw: true,
        });
        return result.map(item => ({
            state_id: Number(item.state_id),
            state_name: String(item.state_name),
            institute_count: Number(item.institute_count),
        }));
    }),
    findCollegesByStateAndCourseId: (courseId_1, stateIds_1, ...args_1) => __awaiter(void 0, [courseId_1, stateIds_1, ...args_1], void 0, function* (courseId, stateIds, page = 1, limit = 10, filters) {
        var _a, _b;
        // Check if course ID exists
        const course = yield database_1.DB.Course.findOne({
            where: { id: courseId },
        });
        if (!course) {
            throw new Error('Course not found');
        }
        // Calculate offset
        const offset = (page - 1) * limit;
        // Build where conditions
        const whereConditions = {
            state_id: {
                [sequelize_1.Op.in]: stateIds.split(','),
            },
        };
        // Add filter conditions
        if (filters) {
            if (filters.fees) {
                whereConditions['$courseSummaries.fees_min$'] = {
                    [sequelize_1.Op.gte]: filters.fees.min,
                };
                whereConditions['$courseSummaries.fees_max$'] = {
                    [sequelize_1.Op.lte]: filters.fees.max,
                };
            }
            if (filters.roi) {
                whereConditions['$courseSummaries.average_package$'] = {
                    [sequelize_1.Op.gte]: database_1.DB.sequelize.literal(`courseSummaries.fees_avg * ${filters.roi.min} / 100`),
                };
            }
        }
        // Get total count for pagination
        const total = yield database_1.DB.Institute.count({
            include: [
                {
                    model: database_1.DB.InstituteCourseSummary,
                    as: 'courseSummaries',
                    where: { course_id: courseId },
                    required: true,
                },
            ],
            where: whereConditions,
        });
        // Build include conditions
        const includeConditions = [
            {
                model: database_1.DB.States,
                as: 'state_name',
                attributes: ['id', 'name'],
            },
            {
                model: database_1.DB.InstituteCourseSummary,
                as: 'courseSummaries',
                attributes: [
                    'id',
                    'fees_min',
                    'fees_max',
                    'fees_avg',
                    'average_package',
                ],
                where: { course_id: courseId },
                required: true,
            },
        ];
        // Add feature filters if present
        if ((_a = filters === null || filters === void 0 ? void 0 : filters.features) === null || _a === void 0 ? void 0 : _a.length) {
            includeConditions.push({
                model: database_1.DB.Feature,
                as: 'features',
                attributes: ['id', 'name', 'type'],
                where: {
                    id: {
                        [sequelize_1.Op.in]: filters.features,
                    },
                },
            });
        }
        // Add exam filters if present
        if ((_b = filters === null || filters === void 0 ? void 0 : filters.exams) === null || _b === void 0 ? void 0 : _b.length) {
            includeConditions.push({
                model: database_1.DB.Exam,
                as: 'exams',
                attributes: ['id', 'name'],
                where: {
                    id: {
                        [sequelize_1.Op.in]: filters.exams,
                    },
                },
            });
        }
        const institutes = yield database_1.DB.Institute.findAll({
            attributes: ['id', 'name', 'logo', 'google_rating', 'state_id'],
            include: includeConditions,
            where: whereConditions,
            limit,
            offset,
            raw: true,
            nest: true,
        });
        const grouped = institutes.reduce((acc, institute) => {
            var _a;
            const stateId = institute.state_id;
            if (!acc[stateId]) {
                acc[stateId] = {
                    state_id: stateId,
                    state_name: institute.state_name.name,
                    institutes: [],
                };
            }
            acc[stateId].institutes.push({
                id: institute.id,
                name: institute.name,
                logo: institute.logo,
                google_rating: institute.google_rating,
                institute_rank: institute.rankings || null,
                last_date_to_apply: ((_a = institute.courseSummaries) === null || _a === void 0 ? void 0 : _a.last_date_to_apply) || null,
            });
            return acc;
        }, {});
        return {
            data: Object.values(grouped),
            total,
            totalPages: Math.ceil(total / limit),
        };
    }),
    findFeatures: () => __awaiter(void 0, void 0, void 0, function* () {
        // Get all features from the features table
        const features = yield database_1.DB.Feature.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        });
        const instituteFeatures = (yield database_1.DB.InstituteFeature.findAll({
            attributes: ['feature_id', 'certified_by'],
            group: ['feature_id', 'certified_by'],
            raw: true,
        }));
        const groupedFeatures = {
            admitquest: [],
            college: [],
            portals: [],
        };
        features.forEach(feature => {
            if (feature.name) {
                // Add null check for feature.name
                const category = feature.type === 'admitquest'
                    ? 'admitquest'
                    : feature.type === 'college'
                        ? 'college'
                        : 'portals';
                groupedFeatures[category].push({
                    id: feature.id,
                    name: feature.name,
                });
            }
        });
        return groupedFeatures;
    }),
    findExams: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const exams = yield database_1.DB.InstituteCourseSummary.findAll({
            attributes: ['exam_ids'],
            where: { course_id: courseId },
            group: ['exam_ids'],
        });
        if (!exams.length) {
            return [];
        }
        const examIds = exams
            .map(exam => { var _a; return ((_a = exam.exam_ids) === null || _a === void 0 ? void 0 : _a.split(',').map(Number)) || []; })
            .flat();
        const distinctExamIds = [...new Set(examIds)];
        const examNames = yield database_1.DB.Exam.findAll({
            attributes: ['id', 'name'],
            where: {
                id: {
                    [sequelize_1.Op.in]: distinctExamIds,
                },
            },
        });
        return examNames.map(exam => ({
            id: exam.id,
            name: exam.name,
        }));
    }),
    findCollegeCard: (courseId, instituteId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const collegeCard = yield database_1.DB.Institute.findOne({
            attributes: [
                'id',
                'name',
                'logo',
                'google_rating',
                'state_id',
                'city_id',
            ],
            include: [
                {
                    model: database_1.DB.States,
                    as: 'state_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: database_1.DB.City,
                    as: 'city_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: database_1.DB.InstituteCourseSummary,
                    as: 'courseSummaries',
                    attributes: [
                        'id',
                        'course_id',
                        'fees_min',
                        'fees_max',
                        'fees_avg',
                        'average_package',
                        'highest_package',
                        'last_date_to_apply',
                        'discount_amount',
                        'total_amount',
                        'final_amount',
                        'faculty_to_student_ratio',
                        'exam_ids',
                    ],
                    where: { course_id: courseId },
                    required: true,
                    include: [
                        {
                            model: database_1.DB.Course,
                            as: 'course',
                            attributes: ['duration'],
                        },
                    ],
                },
                {
                    model: database_1.DB.InstituteFeature,
                    as: 'instituteFeatures',
                    attributes: ['id', 'feature_id', 'certified_by', 'value'],
                    include: [
                        {
                            model: database_1.DB.Feature,
                            as: 'feature',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
                {
                    model: database_1.DB.InstituteRanking,
                    as: 'rankings',
                    attributes: [
                        'id',
                        'rank',
                        'out_of',
                        'year',
                        'ranking_body',
                    ],
                    where: { course_id: courseId },
                    required: false,
                },
                {
                    model: database_1.DB.InstituteProgram,
                    as: 'institutePrograms',
                    attributes: ['id', 'program_id'],
                    where: { course_id: courseId },
                    required: false,
                    include: [
                        {
                            model: database_1.DB.Program,
                            as: 'program',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
            where: { id: instituteId },
        });
        if (!collegeCard) {
            return null;
        }
        // Convert to plain object for manipulation
        const plainCollegeCard = collegeCard.get({
            plain: true,
        });
        // Calculate ROI
        if ((_c = (_b = (_a = plainCollegeCard.courseSummaries) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.course) === null || _c === void 0 ? void 0 : _c.duration) {
            const courseSummary = plainCollegeCard.courseSummaries[0];
            const courseDurationInMonths = parseInt(courseSummary.course.duration);
            const courseDurationInYears = courseDurationInMonths / 12;
            const averagePackage = parseFloat(courseSummary.average_package || '0');
            const feesAvg = parseFloat(courseSummary.fees_avg || '0');
            if (feesAvg > 0 && courseDurationInYears > 0) {
                const roi = ((averagePackage * 100000 -
                    feesAvg / courseDurationInYears) /
                    feesAvg) *
                    100;
                courseSummary.roi = roi.toFixed(2);
            }
            else {
                courseSummary.roi = '0.00';
            }
        }
        // Get exams if exam_ids exist
        if ((_e = (_d = plainCollegeCard.courseSummaries) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.exam_ids) {
            const examIds = plainCollegeCard.courseSummaries[0].exam_ids
                .split(',')
                .map(Number);
            const exams = yield database_1.DB.Exam.findAll({
                attributes: ['id', 'name'],
                where: {
                    id: {
                        [sequelize_1.Op.in]: examIds,
                    },
                },
            });
            plainCollegeCard.exams = exams.map(exam => ({
                id: exam.id,
                name: exam.name || '',
            }));
        }
        // Group features by certification type
        if (plainCollegeCard.instituteFeatures) {
            plainCollegeCard.features = {
                admitquest: [],
                college: [],
                portals: [],
            };
            plainCollegeCard.instituteFeatures.forEach((feature) => {
                if (feature.feature && feature.certified_by) {
                    plainCollegeCard.features[feature.certified_by].push(feature.feature.name);
                }
            });
        }
        // Process programs
        if (plainCollegeCard.institutePrograms &&
            Array.isArray(plainCollegeCard.institutePrograms)) {
            plainCollegeCard.programs = {
                count: plainCollegeCard.institutePrograms.length,
                list: plainCollegeCard.institutePrograms.map(ip => ({
                    program_id: ip.program.id,
                    institute_program_id: ip.id,
                    name: ip.program.name,
                })),
            };
            delete plainCollegeCard.institutePrograms;
        }
        return plainCollegeCard;
    }),
};
exports.default = repo;
