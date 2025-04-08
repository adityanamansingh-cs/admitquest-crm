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
exports.coursesService = coursesService;
exports.statesService = statesService;
exports.citiesService = citiesService;
exports.citiesByStateService = citiesByStateService;
exports.collegesByStateService = collegesByStateService;
exports.processPaginationParams = processPaginationParams;
exports.buildFilterArray = buildFilterArray;
exports.processFilters = processFilters;
exports.collegesByStateAndCourseIdService = collegesByStateAndCourseIdService;
exports.getSRFiltersService = getSRFiltersService;
exports.getCollegeCardService = getCollegeCardService;
const utils_repo_1 = __importDefault(require("./utils.repo"));
function coursesService(flag) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let courses;
            switch (flag) {
                case 'main':
                    courses = yield utils_repo_1.default.findMainCourses();
                    break;
                case 'ug':
                case 'pg':
                    courses = yield utils_repo_1.default.findCoursesByDegree(flag);
                    break;
                case 'all':
                    courses = yield utils_repo_1.default.findAllCourses();
                    break;
                default:
                    courses = yield utils_repo_1.default.findAllCourses();
            }
            if (!courses) {
                throw new Error('No courses found');
            }
            return courses;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function statesService() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const states = yield utils_repo_1.default.findAllStates();
            if (!states || states.length === 0) {
                throw new Error('No states found');
            }
            return states;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function citiesService() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cities = yield utils_repo_1.default.findAllCities();
            if (!cities || cities.length === 0) {
                throw new Error('No cities found');
            }
            return cities;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function citiesByStateService(stateId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!stateId) {
                throw new Error('State ID is required');
            }
            const cities = yield utils_repo_1.default.findCitiesByState(stateId);
            if (!cities || cities.length === 0) {
                throw new Error('No cities found for the given state ID');
            }
            return cities;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function collegesByStateService(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!courseId) {
                throw new Error('Course ID is required');
            }
            const colleges = yield utils_repo_1.default.findCollegesByCourse(courseId);
            if (!colleges || colleges.length === 0) {
                throw new Error('No colleges found for the given course ID');
            }
            return colleges;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function processPaginationParams(params) {
    return {
        page: parseInt(params.page || '1'),
        limit: parseInt(params.limit || '10'),
    };
}
function buildFilterArray(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            {
                id: 'fees',
                name: 'Fees Range',
                min: 200000,
                max: 5000000,
                data_type: 'pills',
                data: [
                    {
                        name: 'Below 5 lakhs',
                        min: 0,
                        max: 500000,
                    },
                    {
                        name: '5 lakhs to 10 lakhs',
                        min: 500000,
                        max: 1000000,
                    },
                    {
                        name: 'Between 10 lakhs to 15 lakhs',
                        min: 1000000,
                        max: 1500000,
                    },
                    {
                        name: 'Between 15 lakhs to 30 lakhs',
                        min: 1500000,
                        max: 3000000,
                    },
                    {
                        name: 'Above 30 lakhs',
                        min: 3000000,
                    },
                ],
            },
            {
                id: 'roi',
                name: 'Return on Investment',
                min: 0,
                max: 500,
                data_type: 'text',
                data: [
                    {
                        text: '<div class="text-center">ROI text</div>',
                    },
                ],
            },
            {
                id: 'features',
                name: 'College specific features',
                data_type: 'pills',
                features: (yield getSRFiltersService('features')),
            },
            {
                id: 'exams',
                name: 'Exams Accepted',
                data_type: 'pills',
                exams: (yield getSRFiltersService('exams', courseId)),
            },
        ];
    });
}
function processFilters(filterArray, filter) {
    if (!filter)
        return filterArray;
    const filterQuery = filter;
    filterArray.forEach(filterItem => {
        var _a, _b;
        const filterValue = filterQuery[filterItem.id];
        if (filterValue) {
            if (filterItem.id === 'fees' || filterItem.id === 'roi') {
                const rangeValue = filterValue;
                filterItem.selected = {
                    min: parseInt(((_a = rangeValue.min) === null || _a === void 0 ? void 0 : _a.toString()) || '0'),
                    max: parseInt(((_b = rangeValue.max) === null || _b === void 0 ? void 0 : _b.toString()) || '1000000'),
                };
            }
            else if (['features', 'program', 'exams'].includes(filterItem.id)) {
                if (Array.isArray(filterValue)) {
                    filterItem.selected = filterValue;
                }
                else {
                    filterItem.selected = filterValue;
                }
            }
        }
    });
    return filterArray;
}
function collegesByStateAndCourseIdService(courseId_1, stateIds_1) {
    return __awaiter(this, arguments, void 0, function* (courseId, stateIds, page = 1, limit = 10, filters) {
        try {
            return yield utils_repo_1.default.findCollegesByStateAndCourseId(courseId, stateIds, page, limit, filters);
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function getSRFiltersService() {
    return __awaiter(this, arguments, void 0, function* (filter = 'none', courseId = '') {
        try {
            switch (filter) {
                case 'features':
                    return yield utils_repo_1.default.findFeatures();
                case 'exams':
                    return yield utils_repo_1.default.findExams(courseId);
                default:
                    throw new Error('Invalid filter type');
            }
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
function getCollegeCardService(courseId, instituteId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!courseId || !instituteId) {
                throw new Error('Course ID and Institute ID are required');
            }
            const collegeCard = yield utils_repo_1.default.findCollegeCard(courseId, instituteId);
            if (!collegeCard) {
                throw new Error('College card not found');
            }
            // Ensure features are properly grouped
            if (collegeCard.instituteFeatures &&
                Array.isArray(collegeCard.instituteFeatures)) {
                const featuresByCertifiedBy = {
                    admitquest: [],
                    college: [],
                    portals: [],
                };
                collegeCard.instituteFeatures.forEach((instituteFeature) => {
                    const certifiedBy = instituteFeature.certified_by || 'portals';
                    if (instituteFeature.feature && instituteFeature.feature.name) {
                        featuresByCertifiedBy[certifiedBy].push(instituteFeature.feature.name);
                    }
                });
                collegeCard.features = featuresByCertifiedBy;
                delete collegeCard.instituteFeatures;
            }
            return collegeCard;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    });
}
