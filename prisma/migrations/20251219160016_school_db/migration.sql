/*
  Warnings:

  - A unique constraint covering the columns `[examUuid,studentUuid]` on the table `ExamResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ExamResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'LOCKED');

-- AlterTable
ALTER TABLE "ExamResult" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExamResult_examUuid_studentUuid_key" ON "ExamResult"("examUuid", "studentUuid");
