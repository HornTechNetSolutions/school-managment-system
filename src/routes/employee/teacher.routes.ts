import { Router } from 'express';

import * as teacherController from '../../controllers/employee/teacher.controller.ts';

const router = Router();

router.get('/:id', teacherController.getTeacherDetails);
router.get('/:id/classes', teacherController.getTeacherClasses);

export default router;