/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_adminUuid_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_teacherUuid_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_gradedByUuid_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_studentUuid_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherUuid_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_employeeUuid_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_parentUuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classUuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentUuid_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_studentUuid_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_teacherUuid_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Parent";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "userUuid" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "studentNumber" TEXT,
    "employeeNumber" TEXT,
    "adminNumber" TEXT,
    "parentNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "student" (
    "studentUuid" TEXT NOT NULL,
    "parentUuid" TEXT,
    "classUuid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("studentUuid")
);

-- CreateTable
CREATE TABLE "parent" (
    "parentUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("parentUuid")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacherUuid" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacherUuid")
);

-- CreateTable
CREATE TABLE "admin" (
    "adminUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminUuid")
);

-- CreateTable
CREATE TABLE "employee" (
    "employeeUuid" TEXT NOT NULL,
    "employeeRole" "EmployeeRole" NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_studentNumber_key" ON "users"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeNumber_key" ON "users"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_adminNumber_key" ON "users"("adminNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_parentNumber_key" ON "users"("parentNumber");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_parentUuid_fkey" FOREIGN KEY ("parentUuid") REFERENCES "parent"("parentUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_parentUuid_fkey" FOREIGN KEY ("parentUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_adminUuid_fkey" FOREIGN KEY ("adminUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_employeeUuid_fkey" FOREIGN KEY ("employeeUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_gradedByUuid_fkey" FOREIGN KEY ("gradedByUuid") REFERENCES "teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;
