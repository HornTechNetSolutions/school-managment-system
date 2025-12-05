/*
  Warnings:

  - You are about to drop the column `parentNumber` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_parentNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "parentNumber";
