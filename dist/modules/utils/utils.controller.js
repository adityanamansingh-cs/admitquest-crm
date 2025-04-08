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
exports.getUtilsController = void 0;
const utils_service_1 = require("./utils.service");
const getUtilsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = req.url.split('?')[0];
        switch (path) {
            case '/courses': {
                const flag = req.query.flag;
                const courses = yield (0, utils_service_1.coursesService)(flag);
                res.status(200).json({
                    message: 'Successfully fetched courses.',
                    data: courses,
                });
                break;
            }
            case '/states': {
                const states = yield (0, utils_service_1.statesService)();
                res.status(200).json({
                    message: 'Successfully fetched states.',
                    data: states,
                });
                break;
            }
            case '/city': {
                const cities = yield (0, utils_service_1.citiesService)();
                res.status(200).json({
                    message: 'Successfully fetched cities.',
                    data: cities,
                });
                break;
            }
            case '/citybystate': {
                const stateId = req.query.state_id;
                if (!stateId) {
                    res.status(400).json({
                        message: 'State id is required',
                    });
                    return;
                }
                const citiesByState = yield (0, utils_service_1.citiesByStateService)(stateId);
                res.status(200).json({
                    message: `Successfully fetched cities for state: ${stateId}`,
                    data: citiesByState,
                });
                break;
            }
            case '/collegesbystateandcourseid': {
                const { course_id, state_ids, page = '1', limit = '10', filter, } = req.query;
                if (!course_id || !state_ids) {
                    res.status(400).json({
                        message: 'Course id and state id/ids are required',
                    });
                    return;
                }
                // Process pagination parameters
                const pagination = (0, utils_service_1.processPaginationParams)({
                    page: page,
                    limit: limit,
                });
                // Build filter array
                const filterArray = yield (0, utils_service_1.buildFilterArray)(course_id);
                // Process filters if provided
                const processedFilters = (0, utils_service_1.processFilters)(filterArray, filter);
                // Get colleges data
                const collegesByStateList = yield (0, utils_service_1.collegesByStateAndCourseIdService)(course_id, state_ids, pagination.page, pagination.limit);
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
            case '/coursewiseinstitutes': {
                const courseIdForInstitutes = req.query.course_id;
                if (!courseIdForInstitutes) {
                    res.status(400).json({
                        message: 'Course id is required',
                    });
                    return;
                }
                const collegesByState = yield (0, utils_service_1.collegesByStateService)(courseIdForInstitutes);
                res.status(200).json({
                    message: `Successfully fetched colleges for course: ${courseIdForInstitutes}`,
                    data: collegesByState,
                });
                break;
            }
            case '/collegecard': {
                const { course_id, institute_id } = req.query;
                if (!course_id || !institute_id) {
                    res.status(400).json({
                        message: 'Course ID and Institute ID are required',
                    });
                    return;
                }
                const collegeCard = yield (0, utils_service_1.getCollegeCardService)(course_id, institute_id);
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
    }
    catch (error) {
        console.error('Controller error:', error);
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            }
            else {
                next(error);
            }
        }
        else {
            next(error);
        }
    }
});
exports.getUtilsController = getUtilsController;
