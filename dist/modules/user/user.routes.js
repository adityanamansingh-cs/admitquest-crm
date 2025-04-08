"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const userRouter = express_1.default.Router();
userRouter.get('/profile', auth_middleware_1.authMiddleware, user_controller_1.getUserProfileController);
userRouter.patch('/profile', auth_middleware_1.authMiddleware, user_controller_1.updateUserController);
userRouter.get('/applications', auth_middleware_1.authMiddleware, user_controller_1.getApplicationController);
userRouter.get('/createApplication', auth_middleware_1.authMiddleware, user_controller_1.createApplicationController);
userRouter.get('/carts', auth_middleware_1.authMiddleware, user_controller_1.getCartController);
exports.default = userRouter;
