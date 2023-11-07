/*
  Warnings:

  - Added the required column `color` to the `product_models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `product_models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_models" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "thumbnail" TEXT NOT NULL;
