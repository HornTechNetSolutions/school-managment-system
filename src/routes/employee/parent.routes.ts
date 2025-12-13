import { Router } from 'express';

import * as parentController from '../../controllers/employee/parent.controller.ts';

const router = Router();

router.get('/:id', parentController.getParentDetails);
router.get('/:id/students', parentController.getStudentsList);
router.put('/:id/contact-info', parentController.updateParentContact);
export default router;