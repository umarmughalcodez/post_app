-- DropForeignKey
ALTER TABLE "post_views" DROP CONSTRAINT "post_views_postId_fkey";

-- AddForeignKey
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
