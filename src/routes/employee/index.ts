import { Router } from 'express';
import * as employeeController from '../../controllers/employee/student.controller.ts'; // Assuming stats is here

import studentRoutes from './student.routes.ts';

const router = Router();

router.use('/students', studentRoutes);

export default router;