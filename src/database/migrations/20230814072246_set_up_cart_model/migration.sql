/*
  Warnings:

  - You are about to drop the `_GiftToOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GiftToOrder" DROP CONSTRAINT "_GiftToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToOrder" DROP CONSTRAINT "_GiftToOrder_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cartId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GiftToOrder";

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartGift" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartGift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_cartId_key" ON "Order"("cartId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartGift" ADD CONSTRAINT "CartGift_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartGift" ADD CONSTRAINT "CartGift_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
