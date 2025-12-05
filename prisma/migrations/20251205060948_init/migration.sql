/*
  Warnings:

  - A unique constraint covering the columns `[adminEmail]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminNumber]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeEmail]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeNumber]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentEmail]` on the table `parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentEmail]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherEmail]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherNumber]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminEmail` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminNumber` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeEmail` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeNumber` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentEmail` to the `parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentEmail` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherEmail` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherNumber` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "adminEmail" TEXT NOT NULL,
ADD COLUMN     "adminNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "employeeEmail" TEXT NOT NULL,
ADD COLUMN     "employeeNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parent" ADD COLUMN     "parentEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "studentEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "teacherEmail" TEXT NOT NULL,
ADD COLUMN     "teacherNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_adminEmail_key" ON "admin"("adminEmail");

-- CreateIndex
CREATE UNIQUE INDEX "admin_adminNumber_key" ON "admin"("adminNumber");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeEmail_key" ON "employee"("employeeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeNumber_key" ON "employee"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "parent_parentEmail_key" ON "parent"("parentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "student_studentEmail_key" ON "student"("studentEmail");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_teacherEmail_key" ON "teacher"("teacherEmail");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_teacherNumber_key" ON "teacher"("teacherNumber");
