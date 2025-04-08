import { DB } from '@/database';
import { ApplicationModel } from '@/database/models/application.model';
import { CartModel } from '@/database/models/cart.model';
import { CouponModel } from '@/database/models/coupon.model';
import { InstituteCourseSummaryModel } from '@/database/models/institute-course-summary.model';
import { StudentModel } from '@/database/models/student.model';
import { CustomError } from '@/utils/custom-error';
import { Op } from 'sequelize';

export const repo = {
    // User

    getUserProfile: async (
        userId: number | undefined,
    ): Promise<StudentModel | null> => {
        try {
            if (!userId) {
                throw new CustomError('User ID is required', 400);
            }
            const user = await DB.Student.findOne({ where: { id: userId } });
            if (!user) {
                throw new CustomError('User not found', 404);
            }
            return user;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to fetch user profile', 500);
        }
    },

    // Institute

    isInstituteExist: async (instituteId: number): Promise<boolean> => {
        try {
            const institute = await DB.Institute.findOne({
                where: { id: instituteId },
                attributes: [
                    'id',
                    'name',
                    'display_name',
                    'logo',
                    'city_id',
                    'state_id',
                    'is_paid',
                    'google_rating',
                ],
            });
            return institute !== null;
        } catch (error) {
            throw new CustomError('Failed to check institute existence', 500);
        }
    },

    // Institute Program

    isInstituteProgramExist: async (
        InstituteProgramId: number,
    ): Promise<boolean> => {
        try {
            const program = await DB.InstituteProgram.findOne({
                where: { id: InstituteProgramId },
            });
            return program !== null;
        } catch (error) {
            throw new CustomError('Failed to check program existence', 500);
        }
    },

    // Course

    isCourseExist: async (courseId: number): Promise<boolean> => {
        try {
            const course = await DB.Course.findOne({ where: { id: courseId } });
            return course !== null;
        } catch (error) {
            throw new CustomError('Failed to check course existence', 500);
        }
    },

    // Application

    countActiveApplicationsByCartId: async (
        cartId: number
    ): Promise<number> => {
        try {
            const count = await DB.Application.count({
                where: {
                    cart_id: cartId,
                    status: '1',
                },
            });
    
            return count;
        } catch (error) {
            throw new CustomError('Failed to count active applications', 500);
        }
    },

    isUserApplicationCourseExist: async (
        studentId: number | undefined,
        courseId: number,
        instituteId: number,
    ): Promise<boolean> => {
        try {
            if (!studentId) {
                throw new CustomError('Student ID is required', 400);
            }

            const application = await DB.Application.findOne({
                where: {
                    student_id: studentId,
                    course_id: courseId,
                    institute_id: instituteId,
                    status: '1',
                },
            });

            return application !== null;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to check application existence', 500);
        }
    },
    
    getUserApplicationById: async (applicationId: number) => {
        try {
            const application = await DB.Application.findOne({
                where: { id: applicationId }
            });
            if (!application) {
                throw new CustomError('Application not found', 404);
            }
            return application;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to fetch application', 500);
        }
    },

    getUserApplications: async (
        studentId: number | undefined,
    ): Promise<ApplicationModel[] | null> => {
        try {
            if (!studentId) {
                throw new CustomError('Student ID is required', 400);
            }
            const applications = await DB.Application.findAll({
                where: { student_id: studentId, status: '1' },
                include: [
                    { model: DB.Course, as: 'course' },
                    { model: DB.Institute, as: 'institute' },
                    { model: DB.Cart, as: 'cart' },
                    { model: DB.InstituteProgram, as: 'institute_program' },
                ],
            });
            return applications;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to fetch user applications', 500);
        }
    },
    
    updateUserApplicationStatus: async (applicationId: number, status: '0' | '1' | '2') => {
        try {
            const application = await DB.Application.findOne({ where: { id: applicationId } });
            if (!application) {
                throw new CustomError('Application not found', 404);
            }
            application.status = status;
            await application.save();
            return true;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to update application status', 500);
        }
    },

    createUserApplication: async (
        studentId: number,
        courseId: number,
        instituteId: number,
        institute_program_id: number,
        finalAmount: number,
        payableAmount: number,
        addedBy: 'admin' | 'student',
        status: '0' | '1' | '2',
        cartId: number,
        createdAt?: string,
    ): Promise<ApplicationModel> => {
        try {
            const newApplication = await DB.Application.create({
                student_id: studentId,
                course_id: courseId,
                institute_id: instituteId,
                institute_program_id: institute_program_id,
                cart_id: cartId,
                final_amount: finalAmount,
                payable_amount: payableAmount,
                added_by: addedBy,
                status: status,
                created_at: createdAt,
            });

            return newApplication;
        } catch (error) {
            throw new CustomError('Failed to create user application', 500);
        }
    },

    // Course Summary

    getInstituteCourseSummaryById: async (
        instituteCourseSummaryId: number,
    ): Promise<InstituteCourseSummaryModel> => {
        try {
            const record = await DB.InstituteCourseSummary.findOne({
                where: {
                    id: instituteCourseSummaryId,
                },
            });

            if (!record) {
                throw new CustomError('Course summary not found', 404);
            }

            return record;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to fetch course summary', 500);
        }
    },

    // Carts

    getUserActiveCart: async (
        studentId: number | undefined,
    ): Promise<CartModel[]> => {
        try {
            if (!studentId) {
                throw new CustomError('Student ID is required', 400);
            }
            const carts = await DB.Cart.findAll({
                where: { student_id: studentId, status: '1' },
                include: [{ model: DB.Coupon, as: 'coupon' }],
            });
            return carts;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to fetch user carts', 500);
        }
    },

    updateCartAmount: async (
        cartId: number,
        amount: {
            total: number;
            discount: number;
            final: number;
        },
        mode: 'add' | 'subtract' = 'add'
    ): Promise<boolean> => {
        try {
            const cart = await DB.Cart.findOne({
                where: {
                    id: cartId,
                    status: '1',
                },
            });
    
            if (!cart) {
                throw new CustomError('Cart not found or inactive', 404);
            }
    
            const toNumber = (val: any) => Number(val ?? 0);
    
            // Convert all current cart fields to number
            const current = {
                total: toNumber(cart.total_amount),
                discount: toNumber(cart.discount_amount),
                final: toNumber(cart.final_amount),
            };
    
            // Calculate new amounts based on mode
            const newAmounts = {
                total: mode === 'add' ? current.total + amount.total : current.total - amount.total,
                discount: mode === 'add' ? current.discount + amount.discount : current.discount - amount.discount,
                final: mode === 'add' ? current.final + amount.final : current.final - amount.final,
            };
    
            // Update cart with new amounts
            await cart.update({
                total_amount: newAmounts.total,
                discount_amount: newAmounts.discount,
                final_amount: newAmounts.final,
            });
    
            return true;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Failed to update cart amount', 500);
        }
    },

    updateCartStatus: async (
        cartId: number,
        status: true | false , // depending on your DB schema
    ): Promise<boolean> => {
        try {
            const [updatedCount] = await DB.Cart.update(
                { status },
                { where: { id: cartId } }
            );
    
            return updatedCount > 0;
        } catch (error) {
            console.error('Error updating cart status:', error);
            throw new CustomError('Failed to update cart status', 500);
        }
    },

    getUserCarts: async (
        studentId: number | undefined,
    ): Promise<CartModel[] | null> => {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }
            return await DB.Cart.findAll({
                where: { student_id: studentId , status : true },
                include: [{ model: DB.Coupon, as: 'coupon' }],
            });
        } catch (error) {
            console.error('Error fetching user carts:', error);
            return null;
        }
    },
    
    createUserCart: async (
        studentId: number,
        totalAmount: number,
        discountAmount: number,
        finalAmount: number,
        // couponId?: number
    ): Promise<CartModel | null> => {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }

            const newCart = await DB.Cart.create({
                student_id: studentId,
                //  coupon_id: couponId !== undefined ? couponId : null,
                total_amount: totalAmount,
                discount_amount: discountAmount,
                final_amount: finalAmount,
                status: true,
            });

            return newCart;
        } catch (error) {
            console.error('Error creating user cart:', error);
            return null;
        }
    },

    // Get coupon by Coupon Code

    findCouponByCode: async (code: string): Promise<CouponModel | null> => {
        try {
            if (!code) {
                console.error('Coupon code is required');
                return null;
            }

            // Find the coupon by code
            const coupon = await DB.Coupon.findOne({
                where: { code: code },
            });

            // Check if the coupon exists and is not expired
            if (!coupon) {
                console.error('Coupon not found or inactive');
                return null;
            }

            if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
                console.error('Coupon has expired');
                return null;
            }

            return coupon;
        } catch (error) {
            console.error('Error finding coupon by code:', error);
            return null;
        }
    },

    updateUser: async (userId: number, userData: any) => {
        try {
            const user = await StudentModel.findByPk(userId);
            if (!user) {
                return null;
            }

            await user.update(userData);
            return user;
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    },
};
