import { DB } from '@/database';
import { CourseModel } from '@database/models/course.model';
import { StateModel } from '@database/models/state.model';
import { CityModel } from '@database/models/city.model';
import { Op, QueryTypes } from 'sequelize';
import { FeatureModel } from '@database/models/feature.model';
import { InstituteProgramModel } from '@database/models/institute-program.model';
import { CustomError } from '../../utils/custom-error';
import logger from '@/utils/logger';

interface FilterOptions {
    fees?: {
        min: number;
        max: number;
    };
    roi?: {
        min: number;
        max: number;
    };
    features?: string[];
    program?: string[];
    exams?: string[];
}

interface IncludeCondition {
    model:
        | typeof DB.Feature
        | typeof DB.Exam
        | typeof DB.States
        | typeof DB.City
        | typeof DB.InstituteCourseSummary
        | typeof DB.InstituteRanking;
    as: string;
    attributes?: string[];
    where?: any;
    required?: boolean;
}

interface InstituteProgram {
    id: number;
    program_id: number;
    program: {
        id: number;
        name: string;
    };
}

interface CollegeCardRaw extends CollegeCard {
    institutePrograms?: InstituteProgram[];
    course?: {
        duration: string;
    };
}

interface CollegeCard {
    id: number;
    name: string;
    logo: string | null;
    google_rating: number | null;
    state_id: number;
    state_name: {
        id: number;
        name: string;
    };
    city_id: number;
    city_name: {
        id: number;
        name: string;
    };
    courseSummaries: Array<{
        id: number;
        fees_min: string;
        fees_max: string;
        fees_avg: string;
        average_package: string;
        exam_ids: string;
        roi?: string;
        course?: {
            duration: string;
        };
    }>;
    instituteFeatures?: Array<{
        id: number;
        feature_id: number;
        certified_by: 'admitquest' | 'college' | 'portals';
        value: string;
        feature: {
            id: number;
            name: string;
            type: string;
        };
    }>;
    features?: {
        admitquest: string[];
        college: string[];
        portals: string[];
    };
    rankings?: Array<{
        id: number;
        rank: number;
        out_of: number;
        year: number;
        ranking_body: string;
    }>;
    exams?: Array<{
        id: number;
        name: string;
    }>;
    programs?: {
        count: number;
        list: Array<{
            program_id: number;
            institute_program_id: number;
            name: string;
        }>;
    };
}

const repo = {
    findAllCourses: async (): Promise<CourseModel[]> => {
        try {
            return await DB.Course.findAll({
                attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
            });
        } catch (error) {
            logger.error('Error in findAllCourses:', { error });
            throw new CustomError('Failed to fetch courses', 500);
        }
    },

    findMainCourses: async (): Promise<CourseModel[]> => {
        try {
            return await DB.Course.findAll({
                attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
                order: [['sequence', 'ASC']],
            });
        } catch (error) {
            logger.error('Error in findMainCourses:', { error });
            throw new CustomError('Failed to fetch main courses', 500);
        }
    },

    findCoursesByDegree: async (degreeName: string): Promise<CourseModel[]> => {
        try {
            const degree = await DB.Degree.findOne({
                where: { name: degreeName.toUpperCase() },
            });

            if (!degree) {
                logger.warn('Degree not found:', { degreeName });
                throw new CustomError('Degree not found', 404);
            }

            return await DB.Course.findAll({
                attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
                where: { degree_id: degree.id },
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            logger.error('Error in findCoursesByDegree:', { error, degreeName });
            throw new CustomError('Failed to fetch courses by degree', 500);
        }
    },

    listCourses: async (): Promise<CourseModel[]> => {
        try {
            return await DB.Course.findAll({
                attributes: ['id', 'name', 'display_name', 'short_name', 'slug'],
                order: [['sequence', 'ASC']],
            });
        } catch (error) {
            logger.error('Error in listCourses:', { error });
            throw new CustomError('Failed to list courses', 500);
        }
    },

    findAllStates: async (): Promise<StateModel[]> => {
        try {
            return await DB.States.findAll({
                attributes: ['id', 'name'],
            });
        } catch (error) {
            logger.error('Error in findAllStates:', { error });
            throw new CustomError('Failed to fetch states', 500);
        }
    },

    findAllCities: async (): Promise<CityModel[]> => {
        try {
            return await DB.City.findAll({
                attributes: ['id', 'name', 'state_id'],
            });
        } catch (error) {
            logger.error('Error in findAllCities:', { error });
            throw new CustomError('Failed to fetch cities', 500);
        }
    },

    findCitiesByState: async (id: string): Promise<CityModel[]> => {
        try {
            const state = await DB.States.findOne({
                where: { id: id },
            });

            if (!state) {
                logger.warn('State not found:', { stateId: id });
                throw new CustomError('State not found', 404);
            }

            return await DB.City.findAll({
                attributes: ['id', 'name'],
                where: { state_id: state.id },
                order: [['name', 'ASC']],
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            logger.error('Error in findCitiesByState:', { error, stateId: id });
            throw new CustomError('Failed to fetch cities by state', 500);
        }
    },

    findCollegesByCourse: async (
        courseId: string,
    ): Promise<
        { state_id: number; state_name: string; institute_count: number }[]
    > => {
        try {
            const result = await DB.InstituteCourseSummary.findAll({
                attributes: [
                    [DB.sequelize.col('institute.state_id'), 'state_id'],
                    [DB.sequelize.col('institute.state_name.name'), 'state_name'],
                    [
                        DB.sequelize.fn('COUNT', DB.sequelize.col('institute.id')),
                        'institute_count',
                    ],
                ],
                include: [
                    {
                        model: DB.Institute,
                        as: 'institute',
                        attributes: [],
                        include: [
                            {
                                model: DB.States,
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
                    DB.sequelize.col('institute.state_id'),
                    DB.sequelize.col('institute.state_name.name'),
                ],
                order: [[DB.sequelize.col('institute.state_name.name'), 'ASC']],
                raw: true,
            });

            return (result as any[]).map(item => ({
                state_id: Number(item.state_id),
                state_name: String(item.state_name),
                institute_count: Number(item.institute_count),
            }));
        } catch (error) {
            logger.error('Error in findCollegesByCourse:', { error, courseId });
            throw new CustomError('Failed to fetch colleges by course', 500);
        }
    },

    findCollegesByStateAndCourseId: async (
        courseId: string,
        stateIds: string,
        page = 1,
        limit = 10,
        filters?: FilterOptions,
    ): Promise<{ data: any[]; total: number; totalPages: number }> => {
        try {
            const course = await DB.Course.findOne({
                where: { id: courseId },
            });

            if (!course) {
                logger.warn('Course not found:', { courseId });
                throw new CustomError('Course not found', 404);
            }

            // Calculate offset
            const offset = (page - 1) * limit;

            // Build where conditions
            const whereConditions: any = {
                state_id: {
                    [Op.in]: stateIds.split(','),
                },
            };

            // Add filter conditions
            if (filters) {
                if (filters.fees) {
                    whereConditions['$courseSummaries.fees_min$'] = {
                        [Op.gte]: filters.fees.min,
                    };
                    whereConditions['$courseSummaries.fees_max$'] = {
                        [Op.lte]: filters.fees.max,
                    };
                }

                if (filters.roi) {
                    whereConditions['$courseSummaries.average_package$'] = {
                        [Op.gte]: DB.sequelize.literal(
                            `courseSummaries.fees_avg * ${filters.roi.min} / 100`,
                        ),
                    };
                }
            }

            // Get total count for pagination
            const total = await DB.Institute.count({
                include: [
                    {
                        model: DB.InstituteCourseSummary,
                        as: 'courseSummaries',
                        where: { course_id: courseId },
                        required: true,
                    },
                ],
                where: whereConditions,
            });

            // Build include conditions
            const includeConditions: IncludeCondition[] = [
                {
                    model: DB.States,
                    as: 'state_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.City,
                    as: 'city_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.InstituteCourseSummary,
                    as: 'courseSummaries',
                    attributes: [
                        'id',
                        'fees_min',
                        'fees_max',
                        'fees_avg',
                        'average_package',
                        'last_date_to_apply'
                    ],
                    where: { course_id: courseId },
                    required: true,
                },
                {
                    model: DB.InstituteRanking,
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
            ];

            // Add feature filters if present
            if (filters?.features?.length) {
                includeConditions.push({
                    model: DB.Feature,
                    as: 'features',
                    attributes: ['id', 'name', 'type'],
                    where: {
                        id: {
                            [Op.in]: filters.features,
                        },
                    },
                });
            }

            // Add exam filters if present
            if (filters?.exams?.length) {
                includeConditions.push({
                    model: DB.Exam,
                    as: 'exams',
                    attributes: ['id', 'name'],
                    where: {
                        id: {
                            [Op.in]: filters.exams,
                        },
                    },
                });
            }

            const institutes = await DB.Institute.findAll({
                attributes: [
                    'id', 
                    'name', 
                    'logo', 
                    'google_rating', 
                    'state_id',
                    'city_id'
                ],
                include: includeConditions,
                where: whereConditions,
                limit,
                offset,
                raw: false,
                nest: true,
            });

            // Transform the Sequelize models to plain objects
            const plainInstitutes = institutes.map(institute => institute.get({ plain: true }));

            const grouped = plainInstitutes.reduce<
                Record<
                    number,
                    { state_id: number; state_name: string; institutes: any[] }
                >
            >((acc, institute: any) => {
                const stateId = institute.state_id;
                if (!acc[stateId]) {
                    acc[stateId] = {
                        state_id: stateId,
                        state_name: institute.state_name.name,
                        institutes: [],
                    };
                }

                // Check if institute already exists in the array to avoid duplicates
                const instituteExists = acc[stateId].institutes.some(
                    existingInstitute => existingInstitute.id === institute.id
                );

                if (!instituteExists) {
                    acc[stateId].institutes.push({
                        id: institute.id,
                        name: institute.name,
                        logo: institute.logo,
                        google_rating: institute.google_rating,
                        city_id: institute.city_id,
                        city_name: institute.city_name ? institute.city_name.name : null,
                        state_id: institute.state_id,
                        state_name: institute.state_name ? institute.state_name.name : null,
                        institute_rank: institute.rankings && institute.rankings.length > 0 ? institute.rankings : null,
                        last_date_to_apply:
                            institute.courseSummaries && institute.courseSummaries.length > 0
                                ? institute.courseSummaries[0].last_date_to_apply 
                                : null,
                    });
                }

                return acc;
            }, {});

            return {
                data: Object.values(grouped),
                total,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            logger.error('Error in findCollegesByStateAndCourseId:', { 
                error, 
                courseId, 
                stateIds, 
                page, 
                limit, 
                filters 
            });
            throw new CustomError('Failed to fetch colleges by state and course', 500);
        }
    },

    findFeatures: async (): Promise<{
        [key: string]: { id: number; name: string }[];
    }> => {
        // Get all features from the features table
        const features = await DB.Feature.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        });

        const instituteFeatures = (await DB.InstituteFeature.findAll({
            attributes: ['feature_id', 'certified_by'],
            group: ['feature_id', 'certified_by'],
            raw: true,
        })) as Array<{
            feature_id: number;
            certified_by: 'admitquest' | 'college' | 'portals';
        }>;

        const groupedFeatures: Record<
            'admitquest' | 'college' | 'portals',
            { id: number; name: string }[]
        > = {
            admitquest: [],
            college: [],
            portals: [],
        };

        features.forEach(feature => {
            if (feature.name) {
                // Add null check for feature.name
                const category =
                    feature.type === 'admitquest'
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
    },

    findExams: async (
        courseId: string,
    ): Promise<{ id: number; name: string | undefined }[]> => {
        const exams = await DB.InstituteCourseSummary.findAll({
            attributes: ['exam_ids'],
            where: { course_id: courseId },
            group: ['exam_ids'],
        });

        if (!exams.length) {
            return [];
        }
        const examIds = exams
            .map(exam => exam.exam_ids?.split(',').map(Number) || [])
            .flat();
        const distinctExamIds = [...new Set(examIds)];
        const examNames = await DB.Exam.findAll({
            attributes: ['id', 'name'],
            where: {
                id: {
                    [Op.in]: distinctExamIds,
                },
            },
        });

        return examNames.map(exam => ({
            id: exam.id,
            name: exam.name,
        }));
    },

    findCollegeCard: async (
        courseId: string,
        instituteId: string,
    ): Promise<CollegeCard | null> => {
        const collegeCard = await DB.Institute.findOne({
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
                    model: DB.States,
                    as: 'state_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.City,
                    as: 'city_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.InstituteCourseSummary,
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
                            model: DB.Course,
                            as: 'course',
                            attributes: ['duration'],
                        },
                    ],
                },
                {
                    model: DB.InstituteFeature,
                    as: 'instituteFeatures',
                    attributes: ['id', 'feature_id', 'certified_by', 'value'],
                    include: [
                        {
                            model: DB.Feature,
                            as: 'feature',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
                {
                    model: DB.InstituteRanking,
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
                    model: DB.InstituteProgram,
                    as: 'institutePrograms',
                    attributes: ['id', 'program_id'],
                    where: { course_id: courseId },
                    required: false,
                    include: [
                        {
                            model: DB.Program,
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
        }) as unknown as CollegeCardRaw;

        // Calculate ROI
        if (plainCollegeCard.courseSummaries?.[0]?.course?.duration) {
            const courseSummary = plainCollegeCard.courseSummaries[0];
            const courseDurationInMonths = parseInt(
                courseSummary.course!.duration,
            );
            const courseDurationInYears = courseDurationInMonths / 12;
            const averagePackage = parseFloat(
                courseSummary.average_package || '0',
            );
            const feesAvg = parseFloat(courseSummary.fees_avg || '0');

            if (feesAvg > 0 && courseDurationInYears > 0) {
                const roi =
                    ((averagePackage * 100000 -
                        feesAvg / courseDurationInYears) /
                        feesAvg) *
                    100;
                courseSummary.roi = roi.toFixed(2);
            } else {
                courseSummary.roi = '0.00';
            }
        }

        // Get exams if exam_ids exist
        if (plainCollegeCard.courseSummaries?.[0]?.exam_ids) {
            const examIds = plainCollegeCard.courseSummaries[0].exam_ids
                .split(',')
                .map(Number);
            const exams = await DB.Exam.findAll({
                attributes: ['id', 'name'],
                where: {
                    id: {
                        [Op.in]: examIds,
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
            plainCollegeCard.instituteFeatures.forEach(
                (feature: {
                    feature?: { name: string };
                    certified_by?: 'admitquest' | 'college' | 'portals';
                }) => {
                    if (feature.feature && feature.certified_by) {
                        plainCollegeCard.features![feature.certified_by].push(
                            feature.feature.name,
                        );
                    }
                },
            );
        }

        // Process programs
        if (
            plainCollegeCard.institutePrograms &&
            Array.isArray(plainCollegeCard.institutePrograms)
        ) {
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
    },

    findCollegeCards: async (): Promise<CollegeCard[]> => {
        const collegeCards = await DB.Institute.findAll({
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
                    model: DB.States,
                    as: 'state_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.City,
                    as: 'city_name',
                    attributes: ['id', 'name'],
                },
                {
                    model: DB.InstituteCourseSummary,
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
                    required: true,
                    include: [
                        {
                            model: DB.Course,
                            as: 'course',
                            attributes: ['duration'],
                        },
                    ],
                },
                {
                    model: DB.InstituteFeature,
                    as: 'instituteFeatures',
                    attributes: ['id', 'feature_id', 'certified_by', 'value'],
                    include: [
                        {
                            model: DB.Feature,
                            as: 'feature',
                            attributes: ['id', 'name', 'type'],
                        },
                    ],
                },
                {
                    model: DB.InstituteRanking,
                    as: 'rankings',
                    attributes: [
                        'id',
                        'rank',
                        'out_of',
                        'year',
                        'ranking_body',
                    ],
                    required: false,
                },
                {
                    model: DB.InstituteProgram,
                    as: 'institutePrograms',
                    attributes: ['id', 'program_id'],
                    required: false,
                    include: [
                        {
                            model: DB.Program,
                            as: 'program',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
        });

        if (!collegeCards || collegeCards.length === 0) {
            return [];
        }

        // Process each college card
        const processedCollegeCards = await Promise.all(
            collegeCards.map(async (collegeCard) => {
                // Convert to plain object for manipulation
                const plainCollegeCard = collegeCard.get({
                    plain: true,
                }) as unknown as CollegeCardRaw;

                // Calculate ROI for each course summary
                if (plainCollegeCard.courseSummaries) {
                    plainCollegeCard.courseSummaries = await Promise.all(
                        plainCollegeCard.courseSummaries.map(async (summary) => {
                            if (summary.course?.duration) {
                                const courseDurationInMonths = parseInt(
                                    summary.course.duration,
                                );
                                const courseDurationInYears = courseDurationInMonths / 12;
                                const averagePackage = parseFloat(
                                    summary.average_package || '0',
                                );
                                const feesAvg = parseFloat(summary.fees_avg || '0');

                                if (feesAvg > 0 && courseDurationInYears > 0) {
                                    const roi =
                                        ((averagePackage * 100000 -
                                            feesAvg / courseDurationInYears) /
                                            feesAvg) *
                                        100;
                                    summary.roi = roi.toFixed(2);
                                } else {
                                    summary.roi = '0.00';
                                }
                            }

                            // Get exams if exam_ids exist
                            if (summary.exam_ids) {
                                const examIds = summary.exam_ids
                                    .split(',')
                                    .map(Number);
                                const exams = await DB.Exam.findAll({
                                    attributes: ['id', 'name'],
                                    where: {
                                        id: {
                                            [Op.in]: examIds,
                                        },
                                    },
                                });
                                plainCollegeCard.exams = exams.map(exam => ({
                                    id: exam.id,
                                    name: exam.name || '',
                                }));
                            }

                            return summary;
                        }),
                    );
                }

                // Group features by certification type
                if (plainCollegeCard.instituteFeatures) {
                    plainCollegeCard.features = {
                        admitquest: [],
                        college: [],
                        portals: [],
                    };
                    plainCollegeCard.instituteFeatures.forEach(
                        (feature: {
                            feature?: { name: string };
                            certified_by?: 'admitquest' | 'college' | 'portals';
                        }) => {
                            if (feature.feature && feature.certified_by) {
                                plainCollegeCard.features![feature.certified_by].push(
                                    feature.feature.name,
                                );
                            }
                        },
                    );
                }

                // Process programs
                if (
                    plainCollegeCard.institutePrograms &&
                    Array.isArray(plainCollegeCard.institutePrograms)
                ) {
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
        );

        return processedCollegeCards;
    },
};

export default repo;
