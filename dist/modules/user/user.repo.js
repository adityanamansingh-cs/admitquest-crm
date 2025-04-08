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
exports.repo = void 0;
const database_1 = require("../../database");
const student_model_1 = require("../../database/models/student.model");
exports.repo = {
    // User
    getUserProfile: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userId) {
                console.error('User ID is undefined');
                return null;
            }
            return yield database_1.DB.Student.findOne({ where: { id: userId } });
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }),
    // Institute
    isInstituteExist: (instituteId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const institute = yield database_1.DB.Institute.findOne({
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
        }
        catch (error) {
            console.error('Error checking institute existence:', error);
            return false;
        }
    }),
    // Institute Program
    isInstituteProgramExist: (InstituteProgramId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const program = yield database_1.DB.InstituteProgram.findOne({
                where: { id: InstituteProgramId },
            });
            return program !== null;
        }
        catch (error) {
            console.error('Error checking program existence:', error);
            return false;
        }
    }),
    // Course
    isCourseExist: (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const course = yield database_1.DB.Course.findOne({ where: { id: courseId } });
            return course !== null;
        }
        catch (error) {
            console.error('Error checking course existence:', error);
            return false;
        }
    }),
    // Application
    isUserApplicationCourseExist: (studentId, courseId, instituteId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return false;
            }
            const application = yield database_1.DB.Application.findOne({
                where: {
                    student_id: studentId,
                    course_id: courseId,
                    institute_id: instituteId,
                    status: '1',
                },
            });
            return application !== null;
        }
        catch (error) {
            console.error('Error checking application existence:', error);
            return false;
        }
    }),
    getUserApplicationById: (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield database_1.DB.Application.findOne({
            where: { id: applicationId }
        });
    }),
    getUserApplications: (studentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }
            return yield database_1.DB.Application.findAll({
                where: { student_id: studentId },
                include: [
                    { model: database_1.DB.Course, as: 'course' },
                    { model: database_1.DB.Institute, as: 'institute' },
                    { model: database_1.DB.Cart, as: 'cart' },
                    { model: database_1.DB.Program, as: 'program' },
                ],
            });
        }
        catch (error) {
            console.error('Error fetching user applications:', error);
            return null;
        }
    }),
    updateUserApplicationStatus: (applicationId, status) => __awaiter(void 0, void 0, void 0, function* () {
        const application = yield database_1.DB.Application.findOne({ where: { id: applicationId } });
        if (!application)
            return false;
        application.status = status;
        yield application.save();
        return true;
    }),
    createUserApplication: (studentId, courseId, instituteId, institute_program_id, finalAmount, payableAmount, addedBy, status, cartId, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newApplication = yield database_1.DB.Application.create({
                student_id: studentId,
                course_id: courseId,
                institute_id: instituteId,
                institute_program_id: institute_program_id,
                cart_id: cartId, // This removes the error
                final_amount: finalAmount,
                payable_amount: payableAmount,
                added_by: addedBy,
                status: status,
                created_at: createdAt,
                //   updated_at: updatedAt,
                //   deleted_at: deletedAt
            });
            return newApplication;
        }
        catch (error) {
            console.error('Error creating user application:', error);
            return null;
        }
    }),
    // Course Summary
    getInstituteCourseSummaryById: (instituteCourseSummaryId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const record = yield database_1.DB.InstituteCourseSummary.findOne({
                where: {
                    id: instituteCourseSummaryId,
                },
            });
            return record;
        }
        catch (error) {
            console.error('Error checking application fees existence:', error);
            return null;
        }
    }),
    // Carts
    getUserActiveCart: (studentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }
            return yield database_1.DB.Cart.findAll({
                where: { student_id: studentId, status: '1' },
                include: [{ model: database_1.DB.Coupon, as: 'coupon' }],
            });
        }
        catch (error) {
            console.error('Error fetching user carts:', error);
            return null;
        }
    }),
    updateCartAmount: (cartId, additionalTotalAmount, additionalDiscountAmount, additionalFinalAmount) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            console.log(`Updating cart: ${cartId} with amounts:`, {
                additionalTotalAmount,
                additionalDiscountAmount,
                additionalFinalAmount,
            });
            // Fetch the existing cart
            const cart = yield database_1.DB.Cart.findOne({
                where: {
                    id: cartId,
                    status: '1', // Ensure the cart has status '1'
                },
            });
            if (!cart) {
                console.error(`Cart with ID ${cartId} not found`);
                return false;
            }
            // Ensure values are properly converted to numbers
            const totalAmount = Number((_a = cart.total_amount) !== null && _a !== void 0 ? _a : 0) + Number(additionalTotalAmount);
            const discountAmount = Number((_b = cart.discount_amount) !== null && _b !== void 0 ? _b : 0) +
                Number(additionalDiscountAmount);
            const finalAmount = Number((_c = cart.final_amount) !== null && _c !== void 0 ? _c : 0) + Number(additionalFinalAmount);
            // Ensure values are fixed to two decimal places (for MySQL DECIMAL compatibility)
            cart.total_amount = parseFloat(totalAmount.toFixed(2));
            cart.discount_amount = parseFloat(discountAmount.toFixed(2));
            cart.final_amount = parseFloat(finalAmount.toFixed(2));
            // Save changes
            yield cart.save();
            console.log(`Cart ID ${cartId} updated successfully.`);
            return true;
        }
        catch (error) {
            console.error('Error updating cart amounts:', error);
            return false;
        }
    }),
    getUserCarts: (studentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }
            return yield database_1.DB.Cart.findAll({
                where: { student_id: studentId },
                include: [{ model: database_1.DB.Coupon, as: 'coupon' }],
            });
        }
        catch (error) {
            console.error('Error fetching user carts:', error);
            return null;
        }
    }),
    createUserCart: (studentId, totalAmount, discountAmount, finalAmount) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!studentId) {
                console.error('Student ID is undefined');
                return null;
            }
            const newCart = yield database_1.DB.Cart.create({
                student_id: studentId,
                //  coupon_id: couponId !== undefined ? couponId : null,
                total_amount: totalAmount,
                discount_amount: discountAmount,
                final_amount: finalAmount,
                status: true,
            });
            return newCart;
        }
        catch (error) {
            console.error('Error creating user cart:', error);
            return null;
        }
    }),
    // Get coupon by Coupon Code
    findCouponByCode: (code) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!code) {
                console.error('Coupon code is required');
                return null;
            }
            // Find the coupon by code
            const coupon = yield database_1.DB.Coupon.findOne({
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
        }
        catch (error) {
            console.error('Error finding coupon by code:', error);
            return null;
        }
    }),
    updateUser: (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield student_model_1.StudentModel.findByPk(userId);
            if (!user) {
                return null;
            }
            yield user.update(userData);
            return user;
        }
        catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    }),
};
