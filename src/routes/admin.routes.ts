import express from "express"
import { addChild } from "../controllers/admin.controllers.ts";
import { authenticate, authorize } from "../middlewares/auth.middleware.ts";
// import { signup } from "../controllers/auth.controller.ts"
// import { authenticate, authorize } from "../middlewares/auth.middleware.ts"


const router= express.Router()


// // //Create Teacher, Student, Parent, Employee, New Admin
// router.post("/create-user", authenticate, authorize("ADMIN"), signup);

router.post("/add-child", authenticate, authorize('ADMIN'), addChild)
// router.put("/update-profile", authenticate, authorize('ADMIN'), updateProfile )


export default router;

//ADMIN – AUTH / ACCOUNT
// POST   /admin/login
// POST   /admin/logout
// GET    /admin/me
// PUT    /admin/update-profile
// PUT    /admin/change-password

//STUDENT MANAGEMENT
// POST   /admin/student/create
// GET    /admin/student/all
// GET    /admin/student/:studentUuid
// PUT    /admin/student/:studentUuid/update
// DELETE /admin/student/:studentUuid/delete

//Student features:
// POST   /admin/student/:studentUuid/assign-parent
// POST   /admin/student/:studentUuid/assign-class
// POST   /admin/student/:studentUuid/assign-teacher   (homeroom)
// GET    /admin/student/:studentUuid/classes

//Optional advanced:
// GET    /admin/student/:studentUuid/attendance
// GET    /admin/student/:studentUuid/grades
// GET    /admin/student/:studentUuid/behavior

//PARENT MANAGEMENT
// POST   /admin/parent/create
// GET    /admin/parent/all
// GET    /admin/parent/:parentUuid
// PUT    /admin/parent/:parentUuid/update
// DELETE /admin/parent/:parentUuid/delete

//Parent–Student linking:
// POST   /admin/add-child
// GET    /admin/parent/:parentUuid/children

//TEACHER MANAGEMENT
// POST   /admin/teacher/create
// GET    /admin/teacher/all
// GET    /admin/teacher/:teacherUuid
// PUT    /admin/teacher/:teacherUuid/update
// DELETE /admin/teacher/:teacherUuid/delete

//Teacher assignments:
// POST   /admin/teacher/:teacherUuid/assign-class
// POST   /admin/teacher/:teacherUuid/assign-course
// GET    /admin/teacher/:teacherUuid/timetable

//CLASS MANAGEMENT
// POST   /admin/class/create
// GET    /admin/class/all
// GET    /admin/class/:classUuid
// PUT    /admin/class/:classUuid/update
// DELETE /admin/class/:classUuid/delete

//Class features:
// GET    /admin/class/:classUuid/students
// GET    /admin/class/:classUuid/teachers
// GET    /admin/class/:classUuid/timetable

//COURSE MANAGEMENT
// POST   /admin/course/create
// GET    /admin/course/all
// GET    /admin/course/:courseUuid
// PUT    /admin/course/:courseUuid/update
// DELETE /admin/course/:courseUuid/delete

//Course features:
// POST   /admin/course/:courseUuid/assign-teacher
// POST   /admin/course/:courseUuid/assign-students
// GET    /admin/course/:courseUuid/enrolled-students

//TIMETABLE / SCHEDULE
// Admin controls:
// POST   /admin/timetable/create
// GET    /admin/timetable/:classUuid
// PUT    /admin/timetable/:classUuid/update

//Student attendance:
// POST   /admin/attendance/mark
// GET    /admin/attendance/:classUuid/today
// GET    /admin/attendance/:studentUuid/history

//Teacher attendance (optional):
// POST   /admin/attendance/teacher/mark
// GET    /admin/attendance/teacher/today

// GRADES / EXAMS
// POST   /admin/exam/create
// POST   /admin/grade/add
// PUT    /admin/grade/update
// GET    /admin/grade/:studentUuid
// GET    /admin/class/:classUuid/exams

// FEES & PAYMENTS
// POST   /admin/fees/create
// GET    /admin/fees/all
// GET    /admin/fees/student/:studentUuid
// POST   /admin/fees/pay
// GET    /admin/reports/fees

// BEHAVIOR & DISCIPLINE
// POST   /admin/behavior/report
// GET    /admin/behavior/:classUuid
// GET    /admin/behavior/:studentUuid
// DELETE /admin/behavior/:reportId/delete

// TRANSPORT (Optional modern system feature)
// POST   /admin/transport/route/create
// GET    /admin/transport/routes
// POST   /admin/transport/assign-student
// GET    /admin/transport/student/:studentUuid

// ANNOUNCEMENTS / NOTIFICATIONS
// POST   /admin/announcement/create
// GET    /admin/announcement/all
// DELETE /admin/announcement/:id

// DASHBOARD ANALYTICS

// Typical dashboard stats for admins:

// GET /admin/stats
// # returns:
// {
//   totalStudents,
//   totalParents,
//   totalTeachers,
//   totalClasses,
//   attendanceToday,
//   feesCollectedThisMonth,
//   upcomingExams
// }
