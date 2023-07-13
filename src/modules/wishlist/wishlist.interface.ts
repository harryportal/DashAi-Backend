import { Prisma, Wishlist } from "@prisma/client"
import { AddWishlistDto } from "./wishlist.dtos";


export interface IWishlistRepository{
    getWishlist(uniqueInput:Prisma.WishlistWhereUniqueInput, include?:Prisma.WishlistInclude):Promise<Wishlist| null>
    addWishlist(data:Prisma.WishlistCreateInput):Promise<Wishlist>;
    updateWishlist(where:Prisma.WishlistWhereUniqueInput, data:Prisma.WishlistUpdateInput):Promise<void>;
    deleteWishlist(where:Prisma.WishlistWhereUniqueInput):Promise<void>;
}

export interface IWishlistService{
    addWishlist(data:AddWishlistDto, userId:string):Promise<void>;
    getWishlist(id:string, includeUser?:boolean ):Promise<Wishlist | null>;
    
}


export const Types = {
    IWishlistRepository:Symbol("IWishlistRepository"),
    IWishlistService:Symbol("IWishlistService")
}