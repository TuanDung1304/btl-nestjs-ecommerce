/*
  Warnings:

  - Added the required column `quantity` to the `product_models` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_models" ADD COLUMN     "quantity" INTEGER NOT NULL;
