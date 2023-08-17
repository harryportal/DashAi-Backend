/*
  Warnings:

  - You are about to drop the `Favourites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_giftId_fkey";

-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_userId_fkey";

-- DropTable
DROP TABLE "Favourites";

-- CreateTable
CREATE TABLE "_GiftToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GiftToUser_AB_unique" ON "_GiftToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GiftToUser_B_index" ON "_GiftToUser"("B");

-- AddForeignKey
ALTER TABLE "_GiftToUser" ADD CONSTRAINT "_GiftToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GiftToUser" ADD CONSTRAINT "_GiftToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
