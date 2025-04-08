import { NextFunction, Request, Response } from 'express';
import {
    coursesService,
    statesService,
    citiesService,
    citiesByStateService,
    collegesByStateService,
    collegesByStateAndCourseIdService,
    getSRFiltersService,
    processPaginationParams,
    buildFilterArray,
    processFilters,
    getCollegeCardService,
} from './utils.service';
import { Op } from 'sequelize';

interface FilterRange {
    min: number;
    max: number;
}

interface FilterItem {
    name: string;
    selected?: FilterRange | string[];
    min?: number;
    max?: number;
    features?: any[];
    program?: any[];
    exams?: any[];
    data?: any[];
}

interface PaginationParams {
    page: number;
    limit: number;
}

interface FilterQuery {
    fees?: FilterRange;
    roi?: FilterRange;
    features?: string[];
    program?: string[];
    exams?: string[];
}

export const getUtilsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const path = req.url.split('?')[0];

        switch (path) {
            case '/courses': {
                const flag = req.query.flag as string;
                const courses = await coursesService(flag);
                res.status(200).json({
                    message: 'Successfully fetched courses.',
                    data: courses,
                });
                break;
            }

            case '/states': {
                const states = await statesService();
                res.status(200).json({
                    message: 'Successfully fetched states.',
                    data: states,
                });
                break;
            }

            case '/cities': {
                const cities = await citiesService();
                res.status(200).json({
                    message: 'Successfully fetched cities.',
                    data: cities,
                });
                break;
            }

            case '/cities/by-state': {
                const stateId = req.query.state_id as string;
                if (!stateId) {
                    res.status(400).json({
                        message: 'State id is required',
                    });
                    return;
                }
                const citiesByState = await citiesByStateService(stateId);
                res.status(200).json({
                    message: `Successfully fetched cities for state: ${stateId}`,
                    data: citiesByState,
                });
                break;
            }

            case '/colleges/by-state-and-course': {
                const {
                    course_id,
                    state_ids,
                    page = '1',
                    limit = '10',
                    filter,
                } = req.query;

                if (!course_id || !state_ids) {
                    res.status(400).json({
                        message: 'Course id and state id/ids are required',
                    });
                    return;
                }

                // Process pagination parameters
                const pagination = processPaginationParams({
                    page: page as string,
                    limit: limit as string,
                });

                // Build filter array
                const filterArray = await buildFilterArray(course_id as string);

                // Process filters if provided
                const processedFilters = processFilters(filterArray, filter);

                // Get colleges data
                const collegesByStateList =
                    await collegesByStateAndCourseIdService(
                        course_id as string,
                        state_ids as string,
                        pagination.page,
                        pagination.limit,
                    );

                res.status(200).json({
                    message: 'Successfully fetched colleges',
                    filter: processedFilters,
                    data: collegesByStateList.data,
                    pagination: {
                        total: collegesByStateList.total,
                        totalPages: collegesByStateList.totalPages,
                        currentPage: pagination.page,
                        limit: pagination.limit,
                    },
                });
                break;
            }

            case '/colleges/by-course': {
                const courseIdForInstitutes = req.query.course_id as string;
                if (!courseIdForInstitutes) {
                    res.status(400).json({
                        message: 'Course id is required',
                    });
                    return;
                }

                const collegesByState = await collegesByStateService(
                    courseIdForInstitutes,
                );
                res.status(200).json({
                    message: `Successfully fetched colleges for course: ${courseIdForInstitutes}`,
                    data: collegesByState,
                });
                break;
            }

            case '/colleges/card': {
                const { course_id, institute_id } = req.query;

                if (!course_id || !institute_id) {
                    res.status(400).json({
                        message: 'Course ID and Institute ID are required',
                    });
                    return;
                }

                const collegeCard = await getCollegeCardService(
                    course_id as string,
                    institute_id as string,
                );

                res.status(200).json({
                    message: 'Successfully fetched college card',
                    data: collegeCard,
                });
                break;
            }

            default:
                res.status(404).json({
                    message: 'Route not found',
                });
                break;
        }
    } catch (error) {
        next(error);
    }
};
