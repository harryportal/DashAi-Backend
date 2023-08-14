import { inject, injectable } from "inversify";
import { Types } from "./gift.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { SendGiftsDto } from "./gift.dtos";
import GiftService from "./gift.service";

@injectable()
export default class GiftController {
    constructor(@inject(Types.GiftService)private readonly giftService:GiftService){}

    getCheckoutLink = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const cartId = req.params.id;
        const giftData = req.body as SendGiftsDto;
        const link = await this.giftService.getCheckoutLink(giftData, cartId, userId);
        res.redirect(link);
        //return res.status(200).json({success:true, message:"Your gift has been sent😊"})
    }
}