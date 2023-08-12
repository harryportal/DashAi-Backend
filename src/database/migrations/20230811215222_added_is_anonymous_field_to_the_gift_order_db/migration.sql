-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'NOT_PAID');

-- CreateTable
CREATE TABLE "GiftOrder" (
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

    CONSTRAINT "GiftOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GiftToGiftOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftOrder_stripePaymentIntentId_key" ON "GiftOrder"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "_GiftToGiftOrder_AB_unique" ON "_GiftToGiftOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_GiftToGiftOrder_B_index" ON "_GiftToGiftOrder"("B");

-- AddForeignKey
ALTER TABLE "GiftOrder" ADD CONSTRAINT "GiftOrder_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftOrder" ADD CONSTRAINT "GiftOrder_recieverId_fkey" FOREIGN KEY ("recieverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToGiftOrder" ADD CONSTRAINT "_GiftToGiftOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToGiftOrder" ADD CONSTRAINT "_GiftToGiftOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "GiftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
