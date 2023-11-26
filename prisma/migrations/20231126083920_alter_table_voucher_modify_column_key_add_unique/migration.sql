/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `vouchers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vouchers_key_key" ON "vouchers"("key");
