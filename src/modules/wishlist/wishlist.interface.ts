import { Prisma, Wishlist } from "@prisma/client"


export interface IWishlistRepository{
    getWishlist(uniqueInput:Prisma.WishlistWhereUniqueInput):Promise<Wishlist| null>
    addWishlist(data:Prisma.WishlistCreateInput):Promise<Wishlist>;
    updateWishlist(where:Prisma.WishlistWhereUniqueInput, data:Prisma.WishlistUpdateInput):Promise<void>;
    deleteWishlist(where:Prisma.WishlistWhereUniqueInput):Promise<void>;
}

export const Types = {
    IWishlistRepository:Symbol("IWishlistRepository")
}