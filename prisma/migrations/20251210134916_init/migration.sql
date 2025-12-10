/*
  Warnings:

  - A unique constraint covering the columns `[grade]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('QUIZ', 'MIDTERM', 'FINAL', 'TEST', 'PROJECT');

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "grade" TEXT;

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "subject" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "Subject_grade_key" ON "Subject"("grade");

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
