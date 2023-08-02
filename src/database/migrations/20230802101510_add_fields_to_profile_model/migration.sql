/*
  Warnings:

  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "gender",
DROP COLUMN "username",
ADD COLUMN     "birthday" TEXT NOT NULL,
ADD COLUMN     "giftingOccasions" TEXT[],
ADD COLUMN     "purpose" TEXT NOT NULL;
