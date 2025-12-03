/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assignmentSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - The required column `classUuid` was added to the `Class` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_classId_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "assignmentSubmission" DROP CONSTRAINT "assignmentSubmission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "assignmentSubmission" DROP CONSTRAINT "assignmentSubmission_gradedById_fkey";

-- DropForeignKey
ALTER TABLE "assignmentSubmission" DROP CONSTRAINT "assignmentSubmission_studentId_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "parent" DROP CONSTRAINT "parent_userId_fkey";

-- DropForeignKey
ALTER TABLE "refreshToken" DROP CONSTRAINT "refreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_classId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_userId_fkey";

-- DropForeignKey
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_userId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "id",
DROP COLUMN "teacherId",
ADD COLUMN     "classUuid" TEXT NOT NULL,
ADD COLUMN     "teacherUuid" TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("classUuid");

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "assignment";

-- DropTable
DROP TABLE "assignmentSubmission";

-- DropTable
DROP TABLE "employee";

-- DropTable
DROP TABLE "parent";

-- DropTable
DROP TABLE "refreshToken";

-- DropTable
DROP TABLE "student";

-- DropTable
DROP TABLE "teacher";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "role";

-- DropEnum
DROP TYPE "status";

-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "Student" (
    "studentUuid" TEXT NOT NULL,
    "parentUuid" TEXT,
    "classUuid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentUuid")
);

-- CreateTable
CREATE TABLE "Parent" (
    "parentUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("parentUuid")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacherUuid" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacherUuid")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminUuid")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeUuid" TEXT NOT NULL,
    "employeeRole" "EmployeeRole" NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeUuid")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignmentUuid" TEXT NOT NULL,
    "teacherUuid" TEXT NOT NULL,
    "classUuid" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentNumber_key" ON "User"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeNumber_key" ON "User"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_adminNumber_key" ON "User"("adminNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_parentNumber_key" ON "User"("parentNumber");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "User"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentUuid_fkey" FOREIGN KEY ("parentUuid") REFERENCES "Parent"("parentUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_parentUuid_fkey" FOREIGN KEY ("parentUuid") REFERENCES "User"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "User"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_adminUuid_fkey" FOREIGN KEY ("adminUuid") REFERENCES "User"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employeeUuid_fkey" FOREIGN KEY ("employeeUuid") REFERENCES "User"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "Teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "Teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentUuid_fkey" FOREIGN KEY ("assignmentUuid") REFERENCES "Assignment"("assignmentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "Student"("studentUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_gradedByUuid_fkey" FOREIGN KEY ("gradedByUuid") REFERENCES "Teacher"("teacherUuid") ON DELETE SET NULL ON UPDATE CASCADE;
