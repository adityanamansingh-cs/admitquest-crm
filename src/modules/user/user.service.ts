// user.service.ts

import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { validateUpdateUser } from './user.validator';
import { validateAndGetUser } from './user.validator';

// User
export const getUserProfileService = async (accessToken: string) => {
    const { user } = await validateAndGetUser(accessToken);
    return user;
};


export const updateUserService = async (userId: number, userData: any) => {
    try {
        const { error } = validateUpdateUser(userData);
        if (error) {
            throw new CustomError(error.details[0].message, 400);
        }

        const updatedUser = await repo.updateUser(userId, userData);
        if (!updatedUser) {
            throw new CustomError('User not found', 404);
        }

        return {
            message: 'User updated successfully',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                mobile: updatedUser.mobile,
                email: updatedUser.email,
                course_id: updatedUser.course_id,
                image: updatedUser.image,
                status: updatedUser.status,
                is_mobile_verified: updatedUser.is_mobile_verified,
                is_email_verified: updatedUser.is_email_verified,
            },
        };
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(
            `Failed to update user: ${error?.message || 'Unknown error'}`,
            500,
        );
    }
};


// Cart

export const getCartService = async (accessToken: string) => {
    const { userId } = await validateAndGetUser(accessToken);

    const cart = await repo.getUserCarts(userId);
    if (!cart) {
        throw new CustomError('Cart not found', 404);
    }

    return cart;
};


// Application

export const getApplicationService = async (accessToken: string) => {
    const { userId } = await validateAndGetUser(accessToken);

    const application = await repo.getUserApplications(userId);
    if (!application) {
        throw new CustomError('Application not found', 404);
    }

    return application;
};



export const createApplicationService = async (
    accessToken: string,
    applicationData: any,
) => {
    const { userId } = await validateAndGetUser(accessToken);

    // Fetch Course Summary
    const instituteCourseSummary = await repo.getInstituteCourseSummaryById(
        applicationData.institute_course_summary_id,
    );
    if (!instituteCourseSummary)
        throw new CustomError(
            'Application Fees not exists for this course and institute',
            400,
        );

    // Validate Institute, Program, and Course
    const [isInstituteValid, isProgramValid, isCourseValid] = await Promise.all([
        repo.isInstituteExist(instituteCourseSummary.institute_id),
        repo.isInstituteProgramExist(applicationData.institute_program_id),
        repo.isCourseExist(instituteCourseSummary.course_id),
    ]);

    if (!isInstituteValid)
        throw new CustomError('Institute does not exist', 400);
    if (!isProgramValid)
        throw new CustomError('Institute Program does not exist', 400);
    if (!isCourseValid)
        throw new CustomError('Course does not exist', 400);

    // Check if Application Already Exists
    const existing = await repo.isUserApplicationCourseExist(
        userId,
        instituteCourseSummary.course_id,
        instituteCourseSummary.institute_id,
    );
    if (existing) {
        throw new CustomError(
            'Application for this course and institute already exists',
            400,
        );
    }

    // Handle Cart Creation/Update
    const activeCarts = (await repo.getUserActiveCart(userId)) ?? [];
    const activeCart = activeCarts.length ? activeCarts[0] : null;
    let cartId: number;

    if (activeCart) {
      
        await repo.updateCartAmount(activeCart.id, {
            total: instituteCourseSummary.total_amount ?? 0,
            discount: instituteCourseSummary.discount_amount ?? 0,
            final: instituteCourseSummary.final_amount ?? 0,
        }, 'add');
        cartId = activeCart.id;
    } else {
       
        const createdCart = await repo.createUserCart(
            userId,
            instituteCourseSummary.total_amount ?? 0,
            instituteCourseSummary.discount_amount ?? 0,
            instituteCourseSummary.final_amount ?? 0,
        );

        if (!createdCart)
            throw new CustomError('Failed to Create Cart.', 400);

        cartId = createdCart.id;
    }

   

    // Create User Application
    const newApplication = await repo.createUserApplication(
        userId,
        instituteCourseSummary.course_id,
        instituteCourseSummary.institute_id,
        applicationData.institute_program_id,
        instituteCourseSummary.final_amount ?? 0,
        instituteCourseSummary.total_amount ?? 0,
        'student',
        '1', // status
        cartId,
        new Date().toISOString(),
    );

    if (!newApplication)
        throw new CustomError('Failed to create application', 400);

    return newApplication;
};


export const removeApplicationService = async (
    accessToken: string,
    applicationData: any,
) => {
    const { userId } = await validateAndGetUser(accessToken);

    const application = await repo.getUserApplicationById(applicationData.application_id);
    if (!application || application.student_id !== userId) {
        throw new CustomError('Application not found .', 404);
    }

    if (application.status === '0') {
        throw new CustomError('Application already removed', 400);
    }

    const isUpdated = await repo.updateUserApplicationStatus(applicationData.application_id, '0');
    if (!isUpdated) {
        throw new CustomError('Failed to remove application', 500);
    }

    const cartId = application.cart_id;
    const success = await repo.updateCartAmount(cartId, {
        total: Number(application.payable_amount ?? 0),
        discount: 0,
        final: Number(application.final_amount ?? 0),
    }, 'subtract');


    // check if any active applications remain
    const activeCount = await repo.countActiveApplicationsByCartId(cartId); // status == 1 (Running)
    if (activeCount === 0) {
        const updatedCartStatus = await repo.updateCartStatus(cartId, false); // Set cart status to false 
        if (!updatedCartStatus) {
            throw new CustomError('Failed to update cart status', 500);
        }
    }
    
    if (!success) {
        throw new CustomError('Failed to update cart after application removal', 500);
    }

    return { message: 'Application removed successfully' };
};


