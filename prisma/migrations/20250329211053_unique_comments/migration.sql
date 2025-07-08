/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,postId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comments_userEmail_postId_key" ON "comments"("userEmail", "postId");
