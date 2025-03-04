/*
  Warnings:

  - You are about to drop the column `userId` on the `like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail,postId]` on the table `like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "like" DROP CONSTRAINT "like_userId_fkey";

-- DropIndex
DROP INDEX "like_userId_postId_key";

-- AlterTable
ALTER TABLE "like" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "like_userEmail_postId_key" ON "like"("userEmail", "postId");

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
