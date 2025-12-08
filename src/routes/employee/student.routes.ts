import { Router } from 'express';
import * as studentController from '../../controllers/employee/student.controller.ts';

const router = Router();

router.get('/', studentController.getAllStudents);


export default router;