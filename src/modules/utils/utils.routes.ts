import { Router } from 'express';
import { getUtilsController } from './utils.controller';

const router = Router();

router.get('/courses', getUtilsController);
router.get('/states', getUtilsController);
router.get('/cities', getUtilsController);
router.get('/cities/by-state', getUtilsController);
router.get('/colleges/by-state-and-course', getUtilsController);
router.get('/colleges/by-course', getUtilsController);
router.get('/colleges/card', getUtilsController);

export default router;
