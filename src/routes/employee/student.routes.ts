import { Router } from 'express';
import * as studentController from '../../controllers/employee/student.controller.ts';

const router = Router();

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentDetails);
router.put('/:id/contact-info', studentController.updateStudentContact);
router.get('/:id/attendance', studentController.getStudentAttendance);
router.get('/:id/grades', studentController.getStudentGrades);

export default router;