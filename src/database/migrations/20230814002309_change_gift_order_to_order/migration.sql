/*
  Warnings:

  - You are about to drop the `GiftOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GiftToGiftOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GiftOrder" DROP CONSTRAINT "GiftOrder_recieverId_fkey";

-- DropForeignKey
ALTER TABLE "GiftOrder" DROP CONSTRAINT "GiftOrder_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToGiftOrder" DROP CONSTRAINT "_GiftToGiftOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToGiftOrder" DROP CONSTRAINT "_GiftToGiftOrder_B_fkey";

-- DropTable
DROP TABLE "GiftOrder";

-- DropTable
DROP TABLE "_GiftToGiftOrder";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recieverId" TEXT,
    "recipientEmail" TEXT NOT NULL,
    "personalisedMessage" TEXT,
    "giftingPurpose" VARCHAR(255) NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_PAID',
    "stripePaymentIntentId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GiftToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "_GiftToOrder_AB_unique" ON "_GiftToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_GiftToOrder_B_index" ON "_GiftToOrder"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToOrder" ADD CONSTRAINT "_GiftToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToOrder" ADD CONSTRAINT "_GiftToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
