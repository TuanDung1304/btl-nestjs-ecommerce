-- AddForeignKey
ALTER TABLE "user_seen" ADD CONSTRAINT "user_seen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
