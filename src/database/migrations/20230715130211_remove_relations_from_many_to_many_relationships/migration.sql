/*
  Warnings:

  - You are about to drop the column `wishlistId` on the `Gift` table. All the data in the column will be lost.
  - You are about to drop the `_curatedGifts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_giftTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_wishlistToGift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_curatedGifts" DROP CONSTRAINT "_curatedGifts_A_fkey";

-- DropForeignKey
ALTER TABLE "_curatedGifts" DROP CONSTRAINT "_curatedGifts_B_fkey";

-- DropForeignKey
ALTER TABLE "_giftTags" DROP CONSTRAINT "_giftTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_giftTags" DROP CONSTRAINT "_giftTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_wishlistToGift" DROP CONSTRAINT "_wishlistToGift_A_fkey";

-- DropForeignKey
ALTER TABLE "_wishlistToGift" DROP CONSTRAINT "_wishlistToGift_B_fkey";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "wishlistId";

-- DropTable
DROP TABLE "_curatedGifts";

-- DropTable
DROP TABLE "_giftTags";

-- DropTable
DROP TABLE "_wishlistToGift";

-- CreateTable
CREATE TABLE "_GiftToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GiftToWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CuratedGiftToGift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GiftToTag_AB_unique" ON "_GiftToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_GiftToTag_B_index" ON "_GiftToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GiftToWishlist_AB_unique" ON "_GiftToWishlist"("A", "B");

-- CreateIndex
CREATE INDEX "_GiftToWishlist_B_index" ON "_GiftToWishlist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CuratedGiftToGift_AB_unique" ON "_CuratedGiftToGift"("A", "B");

-- CreateIndex
CREATE INDEX "_CuratedGiftToGift_B_index" ON "_CuratedGiftToGift"("B");

-- AddForeignKey
ALTER TABLE "_GiftToTag" ADD CONSTRAINT "_GiftToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToTag" ADD CONSTRAINT "_GiftToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToWishlist" ADD CONSTRAINT "_GiftToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToWishlist" ADD CONSTRAINT "_GiftToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuratedGiftToGift" ADD CONSTRAINT "_CuratedGiftToGift_A_fkey" FOREIGN KEY ("A") REFERENCES "CuratedGift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuratedGiftToGift" ADD CONSTRAINT "_CuratedGiftToGift_B_fkey" FOREIGN KEY ("B") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
