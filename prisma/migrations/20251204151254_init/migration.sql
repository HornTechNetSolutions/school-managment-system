/*
  Warnings:

  - You are about to drop the column `teacherUuid` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classUuid,subjectUuid]` on the table `ClassSubject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherUuid,subjectUuid]` on the table `TeacherSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherUuid_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacherUuid";

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "subject";

-- CreateTable
CREATE TABLE "_ClassToteacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToteacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClassToteacher_B_index" ON "_ClassToteacher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSubject_classUuid_subjectUuid_key" ON "ClassSubject"("classUuid", "subjectUuid");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_teacherUuid_subjectUuid_key" ON "TeacherSubject"("teacherUuid", "subjectUuid");

-- AddForeignKey
ALTER TABLE "_ClassToteacher" ADD CONSTRAINT "_ClassToteacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("classUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToteacher" ADD CONSTRAINT "_ClassToteacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teacher"("teacherUuid") ON DELETE CASCADE ON UPDATE CASCADE;
