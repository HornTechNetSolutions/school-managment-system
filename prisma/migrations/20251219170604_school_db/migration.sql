-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_registeredByUuid_fkey";

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "registeredByUuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_registeredByUuid_fkey" FOREIGN KEY ("registeredByUuid") REFERENCES "employee"("employeeUuid") ON DELETE SET NULL ON UPDATE CASCADE;
