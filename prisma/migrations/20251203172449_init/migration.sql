/*
  Warnings:

  - A unique constraint covering the columns `[userUuid]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUuid]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUuid]` on the table `parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUuid]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUuid]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `className` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherName` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminName` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeName` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherName` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_adminUuid_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_employeeUuid_fkey";

-- DropForeignKey
ALTER TABLE "parent" DROP CONSTRAINT "parent_parentUuid_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_studentUuid_fkey";

-- DropForeignKey
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_teacherUuid_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "className" TEXT NOT NULL,
ADD COLUMN     "teacherName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "adminName" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "employeeName" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parent" ADD COLUMN     "parentName" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "studentName" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "teacherName" TEXT NOT NULL,
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_userUuid_key" ON "admin"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userUuid_key" ON "employee"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "parent_userUuid_key" ON "parent"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "student_userUuid_key" ON "student"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_userUuid_key" ON "teacher"("userUuid");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("userUuid") ON DELETE RESTRICT ON UPDATE CASCADE;
