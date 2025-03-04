/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,authorEmail]` on the table `followers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "followers_userEmail_authorEmail_key" ON "followers"("userEmail", "authorEmail");
