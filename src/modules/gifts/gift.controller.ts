import { inject, injectable } from "inversify";
import { IGiftService, Types } from "./gift.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { SendGiftsDto } from "./gift.dtos";

@injectable()
export default class GiftController {
    constructor(@inject(Types.IGiftService)private readonly giftService:IGiftService){}

    sendGift = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const giftData = req.body as SendGiftsDto;
        await this.giftService.sendGift(giftData, userId);
        return res.status(200).json({success:true, message:"Your gift has been sent😊"})
    }
}