/*
  Warnings:

  - You are about to drop the column `calendarStatus` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shortId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "calendarStatus";

-- CreateTable
CREATE TABLE "Favourites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_shortId_key" ON "Order"("shortId");

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
