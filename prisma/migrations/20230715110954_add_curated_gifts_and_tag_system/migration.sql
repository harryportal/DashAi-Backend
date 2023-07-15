/*
  Warnings:

  - You are about to alter the column `description` on the `Gift` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `name` on the `Wishlist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - Added the required column `price` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_wishlistId_fkey";

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "location" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Wishlist" ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);

-- CreateTable
CREATE TABLE "CuratedGift" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "CuratedGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_giftTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_wishlistToGift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_curatedGifts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_giftTags_AB_unique" ON "_giftTags"("A", "B");

-- CreateIndex
CREATE INDEX "_giftTags_B_index" ON "_giftTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_wishlistToGift_AB_unique" ON "_wishlistToGift"("A", "B");

-- CreateIndex
CREATE INDEX "_wishlistToGift_B_index" ON "_wishlistToGift"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_curatedGifts_AB_unique" ON "_curatedGifts"("A", "B");

-- CreateIndex
CREATE INDEX "_curatedGifts_B_index" ON "_curatedGifts"("B");

-- AddForeignKey
ALTER TABLE "_giftTags" ADD CONSTRAINT "_giftTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_giftTags" ADD CONSTRAINT "_giftTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wishlistToGift" ADD CONSTRAINT "_wishlistToGift_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wishlistToGift" ADD CONSTRAINT "_wishlistToGift_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_curatedGifts" ADD CONSTRAINT "_curatedGifts_A_fkey" FOREIGN KEY ("A") REFERENCES "CuratedGift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_curatedGifts" ADD CONSTRAINT "_curatedGifts_B_fkey" FOREIGN KEY ("B") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
