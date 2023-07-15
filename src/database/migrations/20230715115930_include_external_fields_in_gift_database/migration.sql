/*
  Warnings:

  - You are about to drop the column `giftUrl` on the `Gift` table. All the data in the column will be lost.
  - You are about to drop the column `purchased` on the `Gift` table. All the data in the column will be lost.
  - Added the required column `giftId` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "giftUrl",
DROP COLUMN "purchased",
ADD COLUMN     "giftId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "name" VARCHAR(30) NOT NULL;
