import pkg from 'express';
const { Router } = pkg;
import * as attendanceController from '../../controllers/employee/attendance.controller.ts';

const router = Router();

// router.post('/mark', attendanceController.markAttendance);
router.get('/class/:classId', attendanceController.getClassAttendance);
router.get('/student/:studentId', attendanceController.getStudentAttendance);

export default router;