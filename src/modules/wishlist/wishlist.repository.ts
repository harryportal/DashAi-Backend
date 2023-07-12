import { Prisma, PrismaClient, Wishlist } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IWishlistRepository } from "./wishlist.interface";

@injectable()
export class WishlistRepository implements IWishlistRepository{
    private readonly wishlist;
    constructor(@inject(PrismaClient)prisma:PrismaClient){
        this.wishlist = prisma.wishlist;
    }

    async getWishlist(uniqueInput:Prisma.WishlistWhereUniqueInput):Promise<Wishlist | null>{
        const wishlist = await this.wishlist.findUnique({
            where: uniqueInput
        })
        return wishlist;
    }

    async addWishlist(data:Prisma.WishlistCreateInput):Promise<Wishlist>{
        const wishlist = await this.wishlist.create({
            data
        });
        return wishlist;
    }

    async updateWishlist(where:Prisma.WishlistWhereUniqueInput, data:Prisma.WishlistUpdateInput):Promise<void>{
        await this.wishlist.update({
            where, data
        })
    }

    async deleteWishlist(where:Prisma.WishlistWhereUniqueInput):Promise<void>{
        await this.wishlist.delete({
            where
        });
    }





}