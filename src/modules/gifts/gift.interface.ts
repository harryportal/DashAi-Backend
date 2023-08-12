import { Gift, Prisma } from "@prisma/client";
import { SendGiftsDto } from "./gift.dtos";

export interface IGiftRepository{
    deleteGift(where:Prisma.GiftWhereUniqueInput):Promise<void>;
    getGifts(where:Prisma.GiftWhereInput):Promise<Gift[]>;
    updateGift(where:Prisma.GiftWhereUniqueInput, data:Prisma.GiftUpdateInput):Promise<Gift>;
    getGift(where:Prisma.GiftWhereUniqueInput):Promise<Gift | null>
}

export interface IGiftCheckout {
    name:string;
    amount:number;
    imageUrl:string;
    quantity:number;
}
export interface IGiftService {
    sendGift(giftId:string, data:SendGiftsDto, userId:string):Promise<void>;
}
export const Types = {
    IGiftRepository: Symbol("IGiftRepository"),
    IGiftService: Symbol("IGiftService")    
}