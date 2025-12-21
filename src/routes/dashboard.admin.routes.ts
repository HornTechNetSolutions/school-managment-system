import express from "express"
import { 
    getAttendanceToday, 
    getDashboardOverview, 
    getFeesCollectedThisMonth, 
    getMonthlyAttendanceStats, 
    getMonthlyFeesStats, 
    getTotalParents, 
    getTotalStudents, 
    getTotalTeachers, 
    getUpcomingExams 
} from "../controllers/dashboarrd.controller.ts";

const router= express.Router()

router.get("/overview", getDashboardOverview);

router.get("/totalStudents", getTotalStudents);
router.get("/totalParents", getTotalParents);
router.get("/totalTeachers", getTotalTeachers);

router.get("/attendanceToday", getAttendanceToday);
router.get("/feesCollected", getFeesCollectedThisMonth);
router.get("/upcomingExams", getUpcomingExams);

router.get("/charts/attendance", getMonthlyAttendanceStats);
router.get("/charts/fees", getMonthlyFeesStats);

export default router
