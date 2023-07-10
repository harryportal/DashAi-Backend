-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "giftUrl" TEXT NOT NULL,
    "purchased" BOOLEAN NOT NULL,
    "wishlistId" TEXT NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
