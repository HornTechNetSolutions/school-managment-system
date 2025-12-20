-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('QUIZ', 'MIDTERM', 'FINAL', 'TEST', 'PROJECT');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('PRINCIPAL', 'VICE_PRINCIPAL', 'ACCOUNTANT', 'LIBRARIAN', 'DRIVER', 'NURSE', 'SECURITY', 'CLEANER', 'IT_SUPPORT', 'OFFICE_STAFF', 'REGISTRAR');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_STUDENTS', 'MANAGE_ATTENDANCE', 'MANAGE_FEES', 'VIEW_REPORTS', 'MANAGE_EXAMS');

-- CreateTable
CREATE TABLE "users" (
    "userUuid" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "student" (
    "studentUuid" TEXT NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT,
    "userUuid" TEXT,
    "parentUuid" TEXT,
    "registeredByUuid" TEXT NOT NULL,
    "classUuid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("studentUuid")
);

-- CreateTable
CREATE TABLE "parent" (
    "parentUuid" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("parentUuid")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacherUuid" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "teacherEmail" TEXT NOT NULL,
    "teacherNumber" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacherUuid")
);

-- CreateTable
CREATE TABLE "admin" (
    "adminUuid" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "adminNumber" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminUuid")
);

-- CreateTable
CREATE TABLE "employee" (
    "employeeUuid" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "employeeRole" "EmployeeRole" NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeUuid")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subjectUuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "grade" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectUuid")
);

-- CreateTable
CREATE TABLE "Class" (
    "classUuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classUuid")
);

-- CreateTable
CREATE TABLE "Exam" (
    "examUuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "examType" "ExamType" NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "classUuid" TEXT NOT NULL,
    "subjectUuid" TEXT NOT NULL,
    "teacherUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("examUuid")
);

-- CreateTable
CREATE TABLE "ExamResult" (
    "resultUuid" TEXT NOT NULL,
    "examUuid" TEXT NOT NULL,
    "studentUuid" TEXT NOT NULL,
    "marksObtained" INTEGER,
    "gradedByUuid" TEXT,
    "gradedAt" TIMESTAMP(3),
    "comment" TEXT,

    CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("resultUuid")
);

-- CreateTable
CREATE TABLE "ClassSubject" (
    "id" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
    "subjectUuid" TEXT NOT NULL,

    CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "id" TEXT NOT NULL,
    "teacherUuid" TEXT NOT NULL,
    "subjectUuid" TEXT NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignmentUuid" TEXT NOT NULL,
    "teacherUuid" TEXT NOT NULL,
    "subjectUuid" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignmentUuid")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "submissionUuid" TEXT NOT NULL,
    "assignmentUuid" TEXT NOT NULL,
    "studentUuid" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "score" INTEGER,
    "gradedByUuid" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("submissionUuid")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "attendanceUuid" TEXT NOT NULL,
    "studentUuid" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedByUuid" TEXT,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("attendanceUuid")
);

-- CreateTable
CREATE TABLE "Fee" (
    "feeUuid" TEXT NOT NULL,
    "studentUuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("feeUuid")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentUuid" TEXT NOT NULL,
    "feeUuid" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentUuid")
);

-- CreateTable
CREATE TABLE "_ClassToteacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToteacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_studentNumber_key" ON "student"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "student_userUuid_key" ON "student"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "parent_parentEmail_key" ON "parent"("parentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "parent_userUuid_key" ON "parent"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_teacherEmail_key" ON "teacher"("teacherEmail");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_teacherNumber_key" ON "teacher"("teacherNumber");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_userUuid_key" ON "teacher"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "admin_adminEmail_key" ON "admin"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "admin_adminNumber_key" ON "admin"("adminNumber");

-- CreateIndex
CREATE UNIQUE INDEX "admin_userUuid_key" ON "admin"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeEmail_key" ON "employee"("employeeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeNumber_key" ON "employee"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userUuid_key" ON "employee"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_grade_key" ON "Subject"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSubject_classUuid_subjectUuid_key" ON "ClassSubject"("classUuid", "subjectUuid");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_teacherUuid_subjectUuid_key" ON "TeacherSubject"("teacherUuid", "subjectUuid");

-- CreateIndex
CREATE INDEX "Attendance_classUuid_date_idx" ON "Attendance"("classUuid", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentUuid_date_key" ON "Attendance"("studentUuid", "date");

-- CreateIndex
CREATE INDEX "_ClassToteacher_B_index" ON "_ClassToteacher"("B");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_parentUuid_fkey" FOREIGN KEY ("parentUuid") REFERENCES "parent"("parentUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_registeredByUuid_fkey" FOREIGN KEY ("registeredByUuid") REFERENCES "employee"("employeeUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_examUuid_fkey" FOREIGN KEY ("examUuid") REFERENCES "Exam"("examUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResult" ADD CONSTRAINT "ExamResult_gradedByUuid_fkey" FOREIGN KEY ("gradedByUuid") REFERENCES "teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentUuid_fkey" FOREIGN KEY ("assignmentUuid") REFERENCES "Assignment"("assignmentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_gradedByUuid_fkey" FOREIGN KEY ("gradedByUuid") REFERENCES "teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feeUuid_fkey" FOREIGN KEY ("feeUuid") REFERENCES "Fee"("feeUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToteacher" ADD CONSTRAINT "_ClassToteacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("classUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToteacher" ADD CONSTRAINT "_ClassToteacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teacher"("teacherUuid") ON DELETE CASCADE ON UPDATE CASCADE;
