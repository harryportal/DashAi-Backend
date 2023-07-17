import { inject, injectable } from "inversify";
import { ICuratedGiftsRepository, ICuratedGiftsService, Types } from "./curated-gifts.interface";
import { CuratedGifts } from "@prisma/client";


@injectable()
export class CuratedGiftsService implements ICuratedGiftsService {
    constructor(@inject(Types.ICuratedGiftsRepository)private readonly repository:ICuratedGiftsRepository){}

    async getCuratedGifts(id: string):Promise<CuratedGifts | null>{
        const curatedGifts = await this.repository.getCuratedGifts({id}, {gifts:{include:{tags:true}}} );
        return curatedGifts;
    }

    async getallCuratedGifts(): Promise<CuratedGifts[]>{
        const curatedGifts = await this.repository.getAllCuratedGifts();
        return curatedGifts;
    }
}