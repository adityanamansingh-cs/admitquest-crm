"use strict";
// user.service.ts
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
exports.updateUserService = exports.removeApplicationService = exports.createApplicationService = exports.getCartService = exports.getApplicationService = exports.getUserProfileService = void 0;
const user_repo_1 = require("./user.repo");
const custom_error_1 = require("../../utils/custom-error");
const user_validator_1 = require("./user.validator");
const user_validator_2 = require("./user.validator");
const getUserProfileService = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = yield (0, user_validator_2.validateAndGetUser)(accessToken);
    return user;
});
exports.getUserProfileService = getUserProfileService;
const getApplicationService = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, user_validator_2.validateAndGetUser)(accessToken);
    const application = yield user_repo_1.repo.getUserApplications(userId);
    if (!application) {
        throw new custom_error_1.CustomError('Application not found', 404);
    }
    return application;
});
exports.getApplicationService = getApplicationService;
const getCartService = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, user_validator_2.validateAndGetUser)(accessToken);
    const cart = yield user_repo_1.repo.getUserCarts(userId);
    if (!cart) {
        throw new custom_error_1.CustomError('Cart not found', 404);
    }
    return cart;
});
exports.getCartService = getCartService;
const createApplicationService = (accessToken, applicationData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { userId } = yield (0, user_validator_2.validateAndGetUser)(accessToken);
    // Fetch Course Summary
    const instituteCourseSummary = yield user_repo_1.repo.getInstituteCourseSummaryById(applicationData.institute_course_summary_id);
    if (!instituteCourseSummary)
        throw new custom_error_1.CustomError('Application Fees not exists for this course and institute', 400);
    // Validate Institute, Program, and Course
    const [isInstituteValid, isProgramValid, isCourseValid] = yield Promise.all([
        user_repo_1.repo.isInstituteExist(instituteCourseSummary.institute_id),
        user_repo_1.repo.isInstituteProgramExist(applicationData.institute_program_id),
        user_repo_1.repo.isCourseExist(instituteCourseSummary.course_id),
    ]);
    if (!isInstituteValid)
        throw new custom_error_1.CustomError('Institute does not exist', 400);
    if (!isProgramValid)
        throw new custom_error_1.CustomError('Institute Program does not exist', 400);
    if (!isCourseValid)
        throw new custom_error_1.CustomError('Course does not exist', 400);
    // Check if Application Already Exists
    const existing = yield user_repo_1.repo.isUserApplicationCourseExist(userId, instituteCourseSummary.course_id, instituteCourseSummary.institute_id);
    if (existing) {
        throw new custom_error_1.CustomError('Application for this course and institute already exists', 400);
    }
    // Handle Cart Creation/Update
    const activeCarts = (_a = (yield user_repo_1.repo.getUserActiveCart(userId))) !== null && _a !== void 0 ? _a : [];
    const activeCart = activeCarts.length ? activeCarts[0] : null;
    let cartId;
    if (activeCart) {
        yield user_repo_1.repo.updateCartAmount(activeCart.id, (_b = instituteCourseSummary.total_amount) !== null && _b !== void 0 ? _b : 0, (_c = instituteCourseSummary.discount_amount) !== null && _c !== void 0 ? _c : 0, (_d = instituteCourseSummary.final_amount) !== null && _d !== void 0 ? _d : 0);
        cartId = activeCart.id;
    }
    else {
        const createdCart = yield user_repo_1.repo.createUserCart(userId, (_e = instituteCourseSummary.total_amount) !== null && _e !== void 0 ? _e : 0, (_f = instituteCourseSummary.discount_amount) !== null && _f !== void 0 ? _f : 0, (_g = instituteCourseSummary.final_amount) !== null && _g !== void 0 ? _g : 0);
        if (!createdCart)
            throw new custom_error_1.CustomError('Failed to Create Cart.', 400);
        cartId = createdCart.id;
    }
    // Create User Application
    const newApplication = yield user_repo_1.repo.createUserApplication(userId, instituteCourseSummary.course_id, instituteCourseSummary.institute_id, applicationData.institute_program_id, (_h = instituteCourseSummary.final_amount) !== null && _h !== void 0 ? _h : 0, (_j = instituteCourseSummary.total_amount) !== null && _j !== void 0 ? _j : 0, 'student', '1', // status
    cartId, new Date().toISOString());
    if (!newApplication)
        throw new custom_error_1.CustomError('Failed to create application', 400);
    return newApplication;
});
exports.createApplicationService = createApplicationService;
const removeApplicationService = (accessToken, applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = yield (0, user_validator_2.validateAndGetUser)(accessToken);
    const application = yield user_repo_1.repo.getUserApplicationById(applicationId);
    if (!application || application.student_id !== userId) {
        throw new custom_error_1.CustomError('Application not found or unauthorized access', 404);
    }
    if (application.status === '0') {
        throw new custom_error_1.CustomError('Application already removed', 400);
    }
    const isUpdated = yield user_repo_1.repo.updateUserApplicationStatus(applicationId, '0');
    if (!isUpdated) {
        throw new custom_error_1.CustomError('Failed to remove application', 500);
    }
    const cartId = application.cart_id;
    const success = yield user_repo_1.repo.updateCartAmount(cartId, -Number((_a = application.payable_amount) !== null && _a !== void 0 ? _a : 0), 0, -Number((_b = application.final_amount) !== null && _b !== void 0 ? _b : 0));
    if (!success) {
        throw new custom_error_1.CustomError('Failed to update cart after application removal', 500);
    }
    return { message: 'Application removed successfully' };
});
exports.removeApplicationService = removeApplicationService;
const updateUserService = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = (0, user_validator_1.validateUpdateUser)(userData);
        if (error) {
            throw new custom_error_1.CustomError(error.details[0].message, 400);
        }
        const updatedUser = yield user_repo_1.repo.updateUser(userId, userData);
        if (!updatedUser) {
            throw new custom_error_1.CustomError('User not found', 404);
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
    }
    catch (error) {
        if (error instanceof custom_error_1.CustomError) {
            throw error;
        }
        throw new custom_error_1.CustomError(`Failed to update user: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, 500);
    }
});
exports.updateUserService = updateUserService;
