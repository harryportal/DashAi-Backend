import { Prisma, Wishlist } from "@prisma/client"
import { AddWishlistDto } from "./wishlist.dtos";


export interface IWishlistRepository{
    getWishlist(uniqueInput:Prisma.WishlistWhereUniqueInput):Promise<Wishlist| null>
    addWishlist(data:Prisma.WishlistCreateInput):Promise<Wishlist>;
    updateWishlist(where:Prisma.WishlistWhereUniqueInput, data:Prisma.WishlistUpdateInput):Promise<void>;
    deleteWishlist(where:Prisma.WishlistWhereUniqueInput):Promise<void>;
}

export interface IWishlistService{
    addWishlist(data:AddWishlistDto, userId:string):Promise<void>;
    getWishlist(id:string | undefined, shortId:string | undefined):Promise<Wishlist | null>;
    
}


export const Types = {
    IWishlistRepository:Symbol("IWishlistRepository"),
    IWishlistService:Symbol("IWishlistService")
}