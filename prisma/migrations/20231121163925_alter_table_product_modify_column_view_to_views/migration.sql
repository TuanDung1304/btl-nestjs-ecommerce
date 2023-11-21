/*
  Warnings:

  - You are about to drop the column `view` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "view",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
