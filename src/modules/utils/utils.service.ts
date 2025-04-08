import repo from './utils.repo';
import { CustomError } from '../../utils/custom-error';

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

interface FilterRange {
    min: number;
    max: number;
}

interface FilterItem {
    id?: string;
    name: string;
    selected?: FilterRange | string[];
    min?: number;
    max?: number;
    features?: Array<{ id: number; name: string }>;
    program?: Array<{ id: number; name: string }>;
    exams?: Array<{ id: number; name: string }>;
    data?: any[];
    data_type?: string;
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

export async function coursesService(flag: string) {
    try {
        let courses;
        switch (flag) {
            case 'main':
                courses = await repo.findMainCourses();
                break;
            case 'ug':
            case 'pg':
                courses = await repo.findCoursesByDegree(flag);
                break;
            case 'all':
                courses = await repo.findAllCourses();
                break;
            default:
                throw  new CustomError('Invalid flag provided', 400);
        }

        if (!courses) {
            throw new CustomError('No courses found', 404);
        }
        return courses;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch courses', 500);
    }
}

export async function statesService() {
    try {
        const states = await repo.findAllStates();

        if (!states || states.length === 0) {
            throw new CustomError('No states found', 404);
        }
        return states;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch states', 500);
    }
}

export async function citiesService() {
    try {
        const cities = await repo.findAllCities();
        if (!cities || cities.length === 0) {
            throw new CustomError('No cities found', 404);
        }
        return cities;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch cities', 500);
    }
}

export async function citiesByStateService(stateId: string) {
    try {
        if (!stateId) {
            throw new CustomError('State ID is required', 400);
        }
        const cities = await repo.findCitiesByState(stateId);
        if (!cities || cities.length === 0) {
            throw new CustomError('No cities found for the given state ID', 404);
        }
        return cities;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch cities by state', 500);
    }
}

export async function collegesByStateService(courseId: string) {
    try {
        if (!courseId) {
            throw new CustomError('Course ID is required', 400);
        }
        const colleges = await repo.findCollegesByCourse(courseId);
        if (!colleges || colleges.length === 0) {
            throw new CustomError('No colleges found for the given course ID', 404);
        }
        return colleges;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch colleges by state', 500);
    }
}

export function processPaginationParams(params: {
    page?: string;
    limit?: string;
}): PaginationParams {
    return {
        page: parseInt(params.page || '1'),
        limit: parseInt(params.limit || '10'),
    };
}

export async function buildFilterArray(
    courseId: string,
): Promise<FilterItem[]> {
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
            features: (await getSRFiltersService('features')) as Array<{
                id: number;
                name: string;
            }>,
        },
        {
            id: 'exams',
            name: 'Exams Accepted',
            data_type: 'pills',
            exams: (await getSRFiltersService('exams', courseId)) as Array<{
                id: number;
                name: string;
            }>,
        },
    ];
}

export function processFilters(
    filterArray: FilterItem[],
    filter: any,
): FilterItem[] {
    if (!filter) return filterArray;

    const filterQuery = filter as FilterQuery;
    filterArray.forEach(filterItem => {
        const filterValue = filterQuery[filterItem.id as keyof FilterQuery];
        if (filterValue) {
            if (filterItem.id === 'fees' || filterItem.id === 'roi') {
                const rangeValue = filterValue as FilterRange;
                filterItem.selected = {
                    min: parseInt(rangeValue.min?.toString() || '0'),
                    max: parseInt(rangeValue.max?.toString() || '1000000'),
                } as FilterRange;
            } else if (
                ['features', 'program', 'exams'].includes(<string>filterItem.id)
            ) {
                if (Array.isArray(filterValue)) {
                    filterItem.selected = filterValue;
                } else {
                    filterItem.selected = filterValue;
                }
            }
        }
    });

    return filterArray;
}

export async function collegesByStateAndCourseIdService(
    courseId: string,
    stateIds: string,
    page = 1,
    limit = 10,
    filters?: FilterOptions,
) {
    try {
        return await repo.findCollegesByStateAndCourseId(
            courseId,
            stateIds,
            page,
            limit,
            filters,
        );
    } catch (error) {
        console.error('Repository error:', error);
        throw error;
    }
}

export async function getSRFiltersService(filter = 'none', courseId = '') {
    try {
        switch (filter) {
            case 'features':
                return await repo.findFeatures();
            case 'exams':
                return await repo.findExams(courseId);
            default:
                throw new Error('Invalid filter type');
        }
    } catch (error) {
        console.error('Repository error:', error);
        throw error;
    }
}

export async function getCollegeCardService(
    courseId: string,
    instituteId: string,
) {
    try {
        if (!courseId || !instituteId) {
            throw new CustomError('Course ID and Institute ID are required', 400);
        }

        const collegeCard = await repo.findCollegeCard(courseId, instituteId);
        if (!collegeCard) {
            throw new CustomError('College card not found', 404);
        }

        return collegeCard;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.error('Repository error:', error);
        throw new CustomError('Failed to fetch college card', 500);
    }
}
