/*
  Warnings:

  - Added the required column `subjectUuid` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "subjectUuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Subject" (
    "subjectUuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectUuid")
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

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_classUuid_fkey" FOREIGN KEY ("classUuid") REFERENCES "Class"("classUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherUuid_fkey" FOREIGN KEY ("teacherUuid") REFERENCES "teacher"("teacherUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subjectUuid_fkey" FOREIGN KEY ("subjectUuid") REFERENCES "Subject"("subjectUuid") ON DELETE RESTRICT ON UPDATE CASCADE;
