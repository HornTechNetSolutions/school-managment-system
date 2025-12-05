/*
  Warnings:

  - A unique constraint covering the columns `[studentNumber]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentNumber` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "studentNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "teacherNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "student_studentNumber_key" ON "student"("studentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_teacherNumber_key" ON "users"("teacherNumber");
