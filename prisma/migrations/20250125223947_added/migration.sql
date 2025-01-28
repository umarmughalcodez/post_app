/*
  Warnings:

  - You are about to drop the column `public_id` on the `posts` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "public_id",
ADD COLUMN     "image_url" TEXT NOT NULL;
