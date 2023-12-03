/*
  Warnings:

  - You are about to drop the column `discount` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `vouchers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `vouchers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finishedAt` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxUser` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "vouchers_key_key";

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "discount",
DROP COLUMN "key",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "finishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxUser" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");
