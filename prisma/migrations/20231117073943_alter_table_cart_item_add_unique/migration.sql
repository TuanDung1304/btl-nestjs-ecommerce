/*
  Warnings:

  - A unique constraint covering the columns `[userId,productModelId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_items_userId_productModelId_key" ON "cart_items"("userId", "productModelId");
