
// Student Operations (LIMITED)
// GET   /employee/students
// GET   /employee/student/:id
// PUT   /employee/student/:id/contact-info     (update phone/address)
// GET   /employee/student/:id/attendance
// GET   /employee/student/:id/grades

// Parent Operations (LIMITED)
// GET    /employee/parent/:id
// GET    /employee/parent/:id/children
// PUT    /employee/parent/:id/contact-info

// Teacher Operations (LIMITED)
// GET    /employee/teacher/:id
// GET    /employee/teacher/:id/classes
// GET    /employee/teacher/:id/timetable

// Attendance Operations
// Employees often help take and verify attendance.
// POST   /employee/attendance/mark
// GET    /employee/attendance/class/:classId
// GET    /employee/attendance/student/:studentId

// Fee & Payment Operations
// Employees handle school finance.
// GET    /employee/fees/pending
// POST   /employee/fees/pay
// GET    /employee/fees/student/:id

// Behavior / Discipline
// Employees can assist in reporting:
// POST   /employee/behavior/report
// GET    /employee/behavior/student/:id

// Transport System
// Employees can manage daily bus operations:
// GET    /employee/transport/routes
// GET    /employee/transport/students
// POST   /employee/transport/mark-boarded
// POST   /employee/transport/mark-arrived

// Dashboard
// Employees can view a limited dashboard:
// GET    /employee/stats