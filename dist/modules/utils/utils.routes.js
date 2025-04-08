"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_controller_1 = require("./utils.controller");
const router = (0, express_1.Router)();
router.get('/courses', utils_controller_1.getUtilsController);
router.get('/states', utils_controller_1.getUtilsController);
router.get('/city', utils_controller_1.getUtilsController);
router.get('/citybystate', utils_controller_1.getUtilsController);
router.get('/collegesbystateandcourseid', utils_controller_1.getUtilsController);
router.get('/coursewiseinstitutes', utils_controller_1.getUtilsController);
router.get('/collegecard', utils_controller_1.getUtilsController);
exports.default = router;
