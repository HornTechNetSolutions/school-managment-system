/*
  Warnings:

  - You are about to drop the column `adminNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `employeeNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `studentNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `teacherNumber` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "student_studentEmail_key";

-- DropIndex
DROP INDEX "users_adminNumber_key";

-- DropIndex
DROP INDEX "users_employeeNumber_key";

-- DropIndex
DROP INDEX "users_studentNumber_key";

-- DropIndex
DROP INDEX "users_teacherNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "adminNumber",
DROP COLUMN "employeeNumber",
DROP COLUMN "studentNumber",
DROP COLUMN "teacherNumber";
