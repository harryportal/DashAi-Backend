/*
  Warnings:

  - You are about to drop the `CuratedGift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CuratedGiftToGift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CuratedGiftToGift" DROP CONSTRAINT "_CuratedGiftToGift_A_fkey";

-- DropForeignKey
ALTER TABLE "_CuratedGiftToGift" DROP CONSTRAINT "_CuratedGiftToGift_B_fkey";

-- DropTable
DROP TABLE "CuratedGift";

-- DropTable
DROP TABLE "_CuratedGiftToGift";

-- CreateTable
CREATE TABLE "CuratedGifts" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "CuratedGifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CuratedGiftsToGift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CuratedGiftsToGift_AB_unique" ON "_CuratedGiftsToGift"("A", "B");

-- CreateIndex
CREATE INDEX "_CuratedGiftsToGift_B_index" ON "_CuratedGiftsToGift"("B");

-- AddForeignKey
ALTER TABLE "_CuratedGiftsToGift" ADD CONSTRAINT "_CuratedGiftsToGift_A_fkey" FOREIGN KEY ("A") REFERENCES "CuratedGifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuratedGiftsToGift" ADD CONSTRAINT "_CuratedGiftsToGift_B_fkey" FOREIGN KEY ("B") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
