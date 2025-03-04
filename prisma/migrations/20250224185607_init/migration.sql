/*
  Warnings:

  - Added the required column `authorEmail` to the `followers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_userEmail_fkey";

-- AlterTable
ALTER TABLE "followers" ADD COLUMN     "authorEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_authorEmail_fkey" FOREIGN KEY ("authorEmail") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
