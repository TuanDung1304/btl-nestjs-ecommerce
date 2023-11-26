/*
  Warnings:

  - You are about to drop the column `location` on the `orders` table. All the data in the column will be lost.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentPrice` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "shipmentPrice" DOUBLE PRECISION NOT NULL;
