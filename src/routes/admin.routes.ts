import express from "express"
import { 
    assignChildParent, updateProfile, deleteUser, getUser, getUsers, updateUser 
} from "../controllers/admin.controllers.ts";
import { createUser } from "../controllers/auth.controller.ts";
import { 
    createClass, deleteClass, getClass, getClasses, updateClass, assignStudentClass 
} from "../controllers/class.contorller.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";


const router= express.Router()

router.use(authenticate, authorize("ADMIN"));

//Create Teacher, Student, Parent, Employee, New Admin
//user oprations
router.post("/create-user", authenticate, authorize("ADMIN"), createUser);
router.get("/users/:role", getUsers);
router.get("/users/:role/:uuid", getUser);
router.put("/users/:role/:uuid", updateUser); // not tested
router.delete("/users/:role/:uuid", deleteUser);

router.put("/update-profile/:userUuid", authenticate, authorize('ADMIN'), updateProfile );
router.post("/:studentUuid/assign-parent", authenticate, authorize('ADMIN'), assignChildParent)


//CLASS MANAGEMENT
router.post("/class/create", authenticate, authorize('ADMIN'), createClass);
router.get("/class/all", authenticate, authorize('ADMIN'), getClasses);
router.get("/class/:classUuid", authenticate, authorize('ADMIN'), getClass);
router.put("/class/:classUuid/update", authenticate, authorize('ADMIN'), updateClass); 
router.delete("/class/:classUuid/delete", authenticate, authorize('ADMIN'), deleteClass);
router.post("/:studentUuid/assign-class", authenticate, authorize('ADMIN'), assignStudentClass);

// router.post("/:studentUuid/assign-teacher", authenticate, authorize('ADMIN'), assignTeacher)
// router.get("/:studentUuid/classes", authenticate, authorize('ADMIN'), getClasses)

// router.get("/:studentUuid/attendance", authenticate, authorize('ADMIN'), getAttendance)
// router.get("/:studentUuid/grades", authenticate, authorize('ADMIN'), getGrades)
// router.get("/:studentUuid/behavior", authenticate, authorize('ADMIN'), getBehavior)

//PARENT MANAGEMENT
// router.post("/create", authenticate, authorize('ADMIN'), createParent)
// router.get("/parent", authenticate, authorize('ADMIN'), getParents)
// router.get("/parent/:parentUuid", authenticate, authorize('ADMIN'), getParent)
// router.put("/parent/:parentUuid/update", authenticate, authorize('ADMIN'), updateParent)
// router.delete("/paremnt/:parentUuid/delete", authenticate, authorize('ADMIN'), deleteParent)

// //Parent–Student linking
// router.post("/add-child", authenticate, authorize('ADMIN'), addChild);
// router.get("/parent/:parentUuid/children", authenticate, authorize('ADMIN'), getChildren);

//TEACHER MANAGEMENT
// router.post("/teacher/create", authenticate, authorize('ADMIN'), createTeacher);
// router.get("/teacher/all", authenticate, authorize('ADMIN'), getTeachers);
// router.get("/teacher/:teacherUuid", authenticate, authorize('ADMIN'), getTeacher);
// router.put("/teacher/:teacherUuid/update", authenticate, authorize('ADMIN'), updateTeacher);
// router.delete("/teacher/:teacherUuid/delete", authenticate, authorize('ADMIN'), deleteTeacher);

// //Teacher assignments:
// router.post("/teacher/:teacherUuid/assign-class", authenticate, authorize('ADMIN'), assignClass);
// router.post("/teacher/:teacherUuid/assign-course", authenticate, authorize('ADMIN'), assignCourse);
// router.get("/teacher/:teacherUuid/timetable", authenticate, authorize('ADMIN'), timeTable);



// router.get("/class/:classUuid/students", authenticate, authorize('ADMIN'), getStudentClass);
// router.get("/class/:classUuid/teachers", authenticate, authorize('ADMIN'), getTeachersClass);
// router.get("/class/:classUuid/timetable", authenticate, authorize('ADMIN'), getClassTimetables);

//COURSE MANAGEMENT
// router.post("/course/create", authenticate, authorize('ADMIN'), createCoruse);
// router.get("/course/all", authenticate, authorize('ADMIN'), getCourses);
// router.get("/course/:courseUuid", authenticate, authorize('ADMIN'), getCourse);
// router.put("/course/:courseUuid/update", authenticate, authorize('ADMIN'), updateCourse);
// router.delete("/course/:courseUuid/delete", authenticate, authorize('ADMIN'), deleteCourse);

// router.post("/course/:courseUuid/assign-teacher", authenticate, authorize('ADMIN'), courseAssignTeacher);
// router.post("/course/:courseUuid/assign-students", authenticate, authorize('ADMIN'), courseAssignStudents);
// router.get("/course/:courseUuid/enrolled-students", authenticate, authorize('ADMIN'), getEnrolledStudents);

// //TIMETABLE / SCHEDULE
// router.post("/timetable/create", authenticate, authorize('ADMIN'), createTimetable);
// router.get("/timetable/:classUuid", authenticate, authorize('ADMIN'), getClassTimetable);
// router.put("/timetable/:classUuid/update", authenticate, authorize('ADMIN'), updateClassTimetable);

//Student attendance:
// router.post("/attendance/mark", authenticate, authorize('ADMIN'), markAttendance);
// router.get("/attendance/:classUuid/today", authenticate, authorize('ADMIN'), getClassAttendance);
// router.get("/timetable/:studentUuid/history", authenticate, authorize('ADMIN'), getAttendanceHistory);

//Teacher attendance
// router.post("/attendance/teacher/mark", authenticate, authorize('ADMIN'), markTeacherAttendance);
// router.get("/attendance/teacher/today", authenticate, authorize('ADMIN'), getTeacherAttendance);

//GRADES / EXAMS
// router.post("/exam/create", authenticate, authorize('ADMIN'), createExam);
// router.post("/grade/add", authenticate, authorize('ADMIN'), addGrade);
// router.put("/grade/update", authenticate, authorize('ADMIN'), updateGrade);
// router.get("/grade/:studentUuid", authenticate, authorize('ADMIN'), getStudentGrade);
// router.get("/class/:classUuid/exams", authenticate, authorize('ADMIN'), getStudentExams);

//FEES & PAYMENTS
// router.post("/fees/create", authenticate, authorize('ADMIN'), createFees);
// router.post("/fees/all", authenticate, authorize('ADMIN'), getFeeses);
// router.get("/fees/student/:studentUuid", authenticate, authorize('ADMIN'), getFees);
// router.post("/fees/pay", authenticate, authorize('ADMIN'), payFees);
// router.get("/class/reports/fees", authenticate, authorize('ADMIN'), getFeesReports);

//BEHAVIOR & DISCIPLINE
// router.post("/behavior/report", authenticate, authorize('ADMIN'), reportBehavior);
// router.get("/behavior/:classUuid", authenticate, authorize('ADMIN'), getClassBehavior);
// router.get("/behavior/:studentUuid", authenticate, authorize('ADMIN'), getStudentBehavior);
// router.delete("/behavior/:reportUuid/delete", authenticate, authorize('ADMIN'), deleteBehavior);

// TRANSPORT
// router.post("/transport/route/create", authenticate, authorize('ADMIN'), createTransport);
// router.get("/transport/routes", authenticate, authorize('ADMIN'), getTransport);
// router.post("/transport/assign-student", authenticate, authorize('ADMIN'), assignStudentTransport);
// router.get("/transport/student/:studentUuid", authenticate, authorize('ADMIN'), getStudentTransport);

// ANNOUNCEMENTS / NOTIFICATIONS
// router.post("/announcement/create", authenticate, authorize('ADMIN'), createAnnouncement);
// router.post("/announcement/all", authenticate, authorize('ADMIN'), getAnnouncements);
// router.delete("/announcement/:announcementUuid", authenticate, authorize('ADMIN'), deleteAnnouncement);

//DASHBOARD ANALYTICS
// router.get("/dashboard/totalStudents", authenticate, authorize('ADMIN'), getTotalStudents)
// router.get("/dashboard/totalParents", authenticate, authorize('ADMIN'), getTotalParents)
// router.get("/dashboard/totalTeachers", authenticate, authorize('ADMIN'), getTotalTeachers)
// router.get("/dashboard/attendanceToday", authenticate, authorize('ADMIN'), getAttendanceToday)
// router.get("/dashboard/feesCollected", authenticate, authorize('ADMIN'), getFeesCollectedThisMonth)
// router.get("/dashboard/upcomingExams", authenticate, authorize('ADMIN'), getUpcomingExams)
export default router;

//ADMIN – AUTH / ACCOUNT
// POST   /admin/login
// POST   /admin/logout
// GET    /admin/me
// PUT    /admin/update-profile
// PUT    /admin/change-password