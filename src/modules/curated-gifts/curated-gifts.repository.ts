import { CuratedGifts, Prisma, PrismaClient } from "@prisma/client";
import { ICuratedGiftsRepository } from "./curated-gifts.interface";
import { inject, injectable } from "inversify";

@injectable()
export default class CuratedGiftRepository implements ICuratedGiftsRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    async getCuratedGifts(where: Prisma.CuratedGiftsWhereUniqueInput, include?:Prisma.CuratedGiftsInclude):
    Promise<CuratedGifts | null>{
        const curatedGifts = await this.prisma.curatedGifts.findUnique({
            where, include
        });
        return curatedGifts;
    }

    async getAllCuratedGifts():Promise<CuratedGifts[]>{
        const curatedGifts = await this.prisma.curatedGifts.findMany({});
        return curatedGifts;
    }
    
    async createCuratedGifts(data: Prisma.CuratedGiftsCreateInput):Promise<CuratedGifts>{
        const curatedGifts = await this.prisma.curatedGifts.create({ data });
        return curatedGifts; 
    }

    async updateCuratedGifts(where: Prisma.CuratedGiftsWhereUniqueInput, data: Prisma.CuratedGiftsUpdateInput):
    Promise<CuratedGifts>{
        const curatedGifts = await this.prisma.curatedGifts.update({
            where, data
        });
        return curatedGifts;
    }

    async deleteCuratedGifts(where: Prisma.CuratedGiftsWhereUniqueInput): Promise<void> {
        await this.prisma.curatedGifts.delete({
            where
        })
    }
}