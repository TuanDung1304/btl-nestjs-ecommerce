/*
  Warnings:

  - You are about to drop the column `startAt` on the `vouchers` table. All the data in the column will be lost.
  - Added the required column `startedAt` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "startAt",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
