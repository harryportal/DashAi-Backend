import { Prisma, PrismaClient, Wishlist } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IWishlistRepository } from "./wishlist.interface";

@injectable()
export class WishlistRepository implements IWishlistRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    async getWishlist(where:Prisma.WishlistWhereUniqueInput, include?:Prisma.WishlistInclude):Promise<Wishlist | null>{
        const wishlist = await this.prisma.wishlist.findUnique({
            where, include
        })
        console.log(wishlist);
        return wishlist;
    }

    async addWishlist(data:Prisma.WishlistCreateInput):Promise<Wishlist>{
        const wishlist = await this.prisma.wishlist.create({
            data
        });
        return wishlist;
    }

    async updateWishlist(where:Prisma.WishlistWhereUniqueInput, data:Prisma.WishlistUpdateInput):Promise<void>{
        await this.prisma.wishlist.update({
            where, data
        })
    }

    async deleteWishlist(where:Prisma.WishlistWhereUniqueInput):Promise<void>{
        await this.prisma.wishlist.delete({
            where
        });
    }





}