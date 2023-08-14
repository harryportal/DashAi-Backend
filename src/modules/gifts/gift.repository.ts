import { Gift, Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class GiftRepository{
    constructor(@inject(PrismaClient)private readonly prisma: PrismaClient){}

    async addGift(data:Prisma.GiftCreateInput):Promise<Gift>{
        const gift = await this.prisma.gift.create({
            data
        });
        return gift;
    }

    async getGift(where:Prisma.GiftWhereUniqueInput):Promise<Gift | null>{
        const gift = await this.prisma.gift.findUnique({
            where
        });
        return gift;
    }

    async updateGift(where:Prisma.GiftWhereUniqueInput, data:Prisma.GiftUpdateInput):Promise<Gift>{
        const gift = await this.prisma.gift.update({
            where, data
        });
        return gift;
    }

    async getGifts(where:Prisma.GiftWhereInput):Promise<Gift[]>{
        // add pagination later
        const gifts = await this.prisma.gift.findMany({
            where
        });
        return gifts
    }

    async deleteGift(where:Prisma.GiftWhereUniqueInput):Promise<void>{
        await this.prisma.gift.delete({
            where
        })
    }

}