import { SendGiftsDto } from "./gift.dtos";

export interface IGiftCheckout {
    name:string;
    amount:number;
    imageUrl:string;
    quantity:number;
}

export const Types = {
    GiftRepository: Symbol("GiftRepository"),
    GiftService: Symbol("GiftService")    
}