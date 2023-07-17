import { CuratedGifts, Prisma } from "@prisma/client";

export interface ICuratedGiftsRepository {
    createCuratedGifts(data: Prisma.CuratedGiftsCreateInput):Promise<CuratedGifts>;
    getAllCuratedGifts():Promise<CuratedGifts[]>
    updateCuratedGifts(where:Prisma.CuratedGiftsWhereUniqueInput, data:Prisma.CuratedGiftsUpdateInput):Promise<CuratedGifts>;
    getCuratedGifts(where:Prisma.CuratedGiftsWhereUniqueInput, include?:Prisma.CuratedGiftsInclude):Promise<CuratedGifts | null >;
    deleteCuratedGifts(where:Prisma.CuratedGiftsWhereUniqueInput):Promise<void>;
}

export interface ICuratedGiftsService {
    getCuratedGifts(id:string):Promise<CuratedGifts | null>
    getallCuratedGifts():Promise<CuratedGifts[]>
}

export const Types = {
    ICuratedGiftsRepository:Symbol("ICuratedGiftsRepository"),
    ICuratedGiftsService: Symbol("ICuratedGiftsService")
}