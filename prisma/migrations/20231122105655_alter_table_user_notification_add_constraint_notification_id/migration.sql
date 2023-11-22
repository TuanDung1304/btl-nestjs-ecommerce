/*
  Warnings:

  - Added the required column `notificationId` to the `user_notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_notification" ADD COLUMN     "notificationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_notification" ADD CONSTRAINT "user_notification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
